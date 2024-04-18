'use client';
import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import axios from 'axios';
import { handleError } from '../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const Navbar = () => {
  const [AssignmentScore, setAssignmentScore] = useState('');
  const [VulnhubScore, setVulnhubScore] = useState('');
  useEffect(() => {
    const getdata = async () => {
      axios.defaults.withCredentials = true;
      try {
        const res = await axios.get(`${process.env.API_URL}/api/getinfo`);
        setAssignmentScore(res.data.AssignmentScore);
        setVulnhubScore(res.data.VulnhubScore);
      } catch (error) {
        handleError(error);
      }
    };
    getdata();
  }, []);
  const handleMuictfClick = () => {
    window.location.href = '/Dashboard';
  };
  const handleLogoutClick = () => {
    axios.defaults.withCredentials = true;
    axios.get(`${process.env.API_URL}/api/auth/signout`)
      .then(() => {
        localStorage.removeItem('token');
        window.location.href = '/Login';
      })
      .catch((error) => {
        alert(error.response.data.message);
        handleError(error);
      });
  };
  return (
    <div className={styles.navbarStyle}>
      <div className={styles.logoContainerStyle}>
        <img
          src="../muictf_plogo.png"
          alt="Pure Logo"
          className={styles.logoStyle}
          onClick={handleMuictfClick}
        />
        <img
          src="../muict_tlogo.png"
          alt="Text Logo"
          className={styles.logoStyle}
          onClick={handleMuictfClick}
        />
      </div>
      <div className={styles.gridItem}>
        <div className={styles.scoreBox}>
          <div className={styles.assignmentScore}>Assignment Score: {AssignmentScore}</div>
          <div className={styles.vulnhubScore}>Vulnhub Score: {VulnhubScore}</div>
        </div>
      </div>
      <img
        src="../logout.png"
        alt="Logout"
        className={styles.logoutStyle}
        onClick={handleLogoutClick}
      />
    </div>
  );
};
export default Navbar;