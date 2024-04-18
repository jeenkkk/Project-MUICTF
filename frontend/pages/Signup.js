import React, { useState } from 'react';
import styles from './Signup.module.css';
const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleSignupClick = () => {
    if (username === '' || password === '' || email === '') {
      alert('Please enter your username and password');
    } else {
      fetch(`${process.env.API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '/Login';
          } else {
            alert('Invalid username or password\nusername and password must be at least 5 characters long!\nusername and password must be different!\nusername cannot contain special characters!');
          }
        })
        .catch(error => {
          alert('An error occurred while signing in. Please try again later.');
        });
    }
  };
  const handleSigninClick = () => {
    window.location.href = '/Login';
  };
  return (
    <div className={styles.spage}>
      <div className={styles.sbox1}>
        <div className={styles.signUpText}>Create Account</div>
        <input
          type="text"
          placeholder="Username"
          className={styles.usernameInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          className={styles.emailInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.lpasswordbox}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.showHidePasswordButton}>
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.sconfirmpasswordbox}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className={styles.signupbutton} onClick={handleSignupClick}>
          Sign Up
        </button>
      </div>
      <div className={styles.sbox2}>
        <img
          src="muictf_wlogo.png"
          alt="Logo"
          className={styles.llogoinbox}
        />
        <div className={styles.lwelcomeText}>
          <p>Welcome, Everyone!</p>
          <p>Register with your personal details to use all of the site features</p>
        </div>
        <div className={styles.lsignupbox} onClick={handleSigninClick}>
          Sign In
        </div>
      </div>
    </div>
  );
};
export default SignupPage;