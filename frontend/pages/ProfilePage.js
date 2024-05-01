'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Import your Navbar component
import styles from './ProfilePage.module.css'; // Import your CSS styles
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const ProfilePage = () => {
  useEffect(async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(`${process.env.API_URL}/api/getinfo`);
    if (response.status === 200) {
      setUsername(response.data.username);
      setEmail(response.data.email);
    } else {
      alert('An error occurred while fetching user information');
    }
  }, []);
  const handlePreviousClick = () => {
    window.location.href = '/Dashboard';
  };
  // Use state to manage user information
  const [username, setUsername] = useState(''); // Replace with the actual username from login
  const [password, setPassword] = useState(''); // Replace with the actual password from login
  const [newPassword, setnewPassword] = useState('');
  const [email, setEmail] = useState(''); // Replace with the actual email from login
  const [newEmail, setNewEmail] = useState('');
  // Function to handle updating user information
  const handleUpdate = async () => {
    if ((newPassword === '' && newEmail === '') || password === '') {
      alert('Please enter password before update new password or new email');
    } else {
      try {
        const response = await axios.put(`${process.env.API_URL}/api/updateinfo`, {
          username,
          password,
          newPassword,
          newEmail
        });
        if (response.status === 200) {
          alert('User information updated successfully');
        } else {
          //console.log(response);
          alert('An error occurred while updating user information');
        }
      } catch (error) {
        alert('An error occurred while updating user information. Please try again later.');
      }
    }
  };
  // Function to handle deleting the account
  const handleDeleteAccount = () => {
    if (password === '') {
      alert('Please enter your password to delete your account');
    } else {
      if (window.confirm('Are you sure you want to delete your account?')) {
        axios.delete(`${process.env.API_URL}/api/deleteuser`, {
          data: {
            username,
            password
          }
        });
        alert('Account deleted successfully');
        window.location.href = '/'; // Redirect to the login page
      }
      alert('Account deleted successfully');
    }
  };
  const handleProgressionClick = () => {
    window.location.href = '/StudentProgression'; // Adjust the path as needed
  };
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.container}>
          {/* Left Box */}
          <div className={styles.leftBox}>
            <button className={styles.previousButton} onClick={handlePreviousClick}>
              Previous
            </button>
          </div>
          {/* Middle Box */}
          <div className={styles.middleBox}>
            <div className={styles.profileContainer}>
              <div className={styles.logoContainer}>
                <img src="muictf_wlogo.png" alt="MUICTF Logo" className={styles.logoImage} />
              </div>
              <h2>Profile</h2>
              <div className={styles.profileField}>
                <label>Username:</label>
                <input type="text" value={username} readOnly />
              </div>
              <div className={styles.profileField}>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className={styles.profileField}>
                <label>Change Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setnewPassword(e.target.value)} />
              </div>
              <div className={styles.profileField}>
                <label>Email:</label>
                <input type="text" value={email} readOnly />
              </div>
              <div className={styles.profileField}>
                <label>Change Email:</label>
                <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </div>
              <div className={styles.gridButtons}>
                <button className={styles.updateButton} onClick={handleUpdate}>
                  Update
                </button>
                <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          {/* Right Box */}
          <div className={styles.rightBox}>
            <div className={styles.progressionContainer}>
              <img
                src="/progression.png"
                alt="Progression"
                className={styles.progressionImage}
                onClick={handleProgressionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;