from flask import request, session
from flask_restful import Resource
from marshmallow.exceptions import ValidationError

from config import api, db, app
from models import User, UserSchema

user_schema = UserSchema()
users_schema = UserSchema(many=True)

app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Signup(Resource):
    def post(self):
        try:
            data = request.json()
            if not data or not all(k in data for k in ['username', 'email', 'password']):
                return {'error': 'Missing required fields: username, email and password are required'}, 400
            
            if User.query.filter_by(username=data['username']).first():
                return {'error': 'Username already exists'}, 400

if __name__ == '__main__':
    app.run(port=5555, debug=True)

