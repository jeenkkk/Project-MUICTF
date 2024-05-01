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
      alert('Please enter your username, password, and email');
    } else {
      if (password !== confirmPassword) {
        alert('Password and Confirm Password must be the same');
        return;
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
              const hasUpperCase = /[A-Z]/.test(password);
              const hasLowerCase = /[a-z]/.test(password);
              const hasNumber = /[0-9]/.test(password);
              const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
              const hasConsecutiveDuplicates = /(.)\1\1\1/.test(password); // Checks for 4 consecutive repeated characters
              if (password.length < 12 || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || hasConsecutiveDuplicates) {
                alert('Password must be at least 12 characters long\ncontain at least one uppercase letter\none lowercase letter\none number, and one special character, and should not contain more than 3 consecutive duplicate characters');
              }
              if (username.length < 5) {
                alert('Username must be at least 5 characters long');
              }
              if (!email.includes('@')) {
                alert('Email must contain an @ symbol || Email is not valid');
              }
              if(username==password){
                alert('Username and Password should not be same')
              }
            }
          })
          .catch(error => {
            alert('An error occurred while signing in. Please try again later.');
          });
      }
    }
  };
  const handleSigninClick = () => {
    window.location.href = '/Login';
  };
  return (
    <div className={styles.pageContainer}>
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
    </div>
  );
};
export default SignupPage;