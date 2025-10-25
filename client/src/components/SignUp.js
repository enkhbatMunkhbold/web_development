import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../styling/Signup.css";

const SignUp = ({ setUser }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters long"),
      email: Yup.string()
        .email('Invalid email format')
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
      passwordConfirmation: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: (values) => {
      // Remove passwordConfirmation before sending to server
      const { passwordConfirmation, ...serverData } = values;
      
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(serverData),
      }).then(async res => {
        if (res.ok) {
          return res.json()
        } else {
          const errorData = await res.json()
          console.error('Server error response', errorData)
          throw new Error(errorData.error || `Registration failed with status ${res.status}`)
        }
      }).then(user => {
        setUser(user)
        navigate('/profile')
      })
      .catch(err => {
        console.error("Error details:", {
          message: err.message,
          stack: err.stack
        })
        alert(`Registration failed: ${err.message}`)
      })
    },
  });
  return (
    <div className="signup-container">
      <form onSubmit={formik.handleSubmit} className="signup-form">
        <h2>SignUp</h2>
        <div className="form-group">
          <input 
            type='text'
            name='username'
            placeholder="Username"
            autoComplete="off"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className='error-message' style={{ color: 'red' }}>{formik.errors.username}</p>
          ) : null}
        </div>
        <div className="form-group">
          <input 
            type='text'
            name='email'
            placeholder="Email"
            autoComplete="off"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className='error-message' style={{ color: 'red' }}>{formik.errors.email}</p>
          ) : null}
        </div>
        <div className="form-group">
          <input 
            type='password'
            name='password'
            placeholder="Password"
            autoComplete="off"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className='error-message' style={{ color: 'red' }}>{formik.errors.password}</p>
          ) : null}
        </div>
        <div className="form-group">
          <input 
            type='password'
            name='passwordConfirmation'
            placeholder="Password Confirmation"
            autoComplete="off"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
          />
          {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
            <p className='error-message' style={{ color: 'red' }}>{formik.errors.passwordConfirmation}</p>
          ) : null}
        </div>
        <button type="submit">Sign Up</button>
        <div className="signup-link">
          Have an account? <Link to="/login">Login</Link>
        </div>
      </form>      
    </div>
  );
};

export default SignUp;
