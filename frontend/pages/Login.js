'use client';
import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSignupClick = () => {
    window.location.href = '/Signup';
  };
  const handleDashboardClick = async () => {
    axios.defaults.withCredentials = true;
    if (username === '' || password === '') {
      alert('Please enter your username and password');
    } else {
      try {
        const response = await axios.post(`${process.env.API_URL}/api/auth/signin`, {
          username,
          password
        });
        if (response.status === 200) {
          if (response.data.roles === "Admin") {
            window.location.href = '/UserManagement';
          }
          else if (response.data.roles === "Teacher") {
            window.location.href = '/Dashboard';
          }
          else if (response.data.roles === "Student") {
            window.location.href = '/DashboardFS';
          }
          document.cookie = `token=${response.data.token}`;
        } else {
          alert(response);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };
  return (
    <div className={styles.pageContainer}>
      <div className={styles.lpage}>
        <div className={styles.lbox2}>
          <img
            src="muictf_wlogo.png"
            alt="Logo"
            className={styles.llogoinbox}
          />
          <div className={styles.lwelcomeText}>
            <p>Welcome, Everyone!</p>
            <p>Register with your personal details to use all of the site features</p>
          </div>
          <div className={styles.lsignupbox} onClick={handleSignupClick}>
            Sign Up
          </div>
        </div>
        <div className={styles.lbox1}>
          <div className={styles.signInText}>Sign In</div>
          <div className={styles.usernameInputBox}>
            <input
              type="text"
              placeholder="Username"
              className={styles.usernameInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <div className={styles.loginbutton} onClick={handleDashboardClick}>
            Sign In
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;