from marshmallow import validates, ValidationError, fields, post_load
from marshmallow_sqlalchemy import auto_field
from config import db, bcrypt, ma

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    def set_password(self, password):
        if len(password) < 8:
            raise ValueError('Password must be at least 8 characters long')
        password_hash = bcrypt.generate_password_hash(password)
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def __repr__(self):
        return f"<User {self.username}>"
    
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = False
        exclude = ('_password_hash',)

    username = auto_field(required=True)
    email = auto_field(required=True)
    password = fields.String(load_only=True, required=True)

    @validates('username')
    def validate_username(self, username, **kargs):
        if len(username) < 2:
            raise ValidationError("Username must be at least 2 characters long")
        if not all(c.isalnum() or c.isspace() for c in username):
            raise ValidationError("Username only contains numbers, letters and spaces")
        
    @validates('email')
    def validate_email(self, email, **kargs):
        if '@' not in email or '.' not in email:
            raise ValidationError('Invalid email format')
        if len(email) < 8:
            raise ValidationError('Email must be at least 8 characters long')
        
    @post_load
    def make_user(self, data, **kargs):
        print('DEBUG make_user called with:', data)
        if isinstance(data, dict):
            password = data.pop('password', None)
            print('DEBUG password extracted:', password)
            if not password:
                raise ValidationError('Password is required for registration')
            user = User(**data)
            user.set_password(password)
            print('DEBUG user created:', user)
            return user
        return data
        