'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import styles from './DashboardPage.module.css';
import axios from 'axios';
import { handleError } from '../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const DashboardPage = () => {
  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/api/allstudent`);
      } catch (error) {
        handleError(error);
      }
    }; getdata();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVulnhubClick = () => {
    window.location.href = '/courses';
  };

  const handleAssignmentClick = () => {
    window.location.href = '/topics';
  };

  const handleProfileHover = () => {
    setIsDropdownOpen(true);
  };

  const handleProfileLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    window.location.href = '/ProfilePage';
  };


  const handleFeedbackClick = () => {
    window.location.href = '/Feedback';
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageStyle}>
        <Navbar />
        <div
          className={styles.dropdownContainer}
          onMouseEnter={handleProfileHover}
          onMouseLeave={handleProfileLeave}
        >

          <div className={styles.dropdownTrigger}>
            💼 Personal Options
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <div onClick={handleEditProfileClick}>
                ✍🏼 Edit Profile
              </div>
              <div onClick={handleFeedbackClick}>
                💬 Feedback
              </div>
            </div>
          )}
        </div>
        <div className={styles.boxStyle}>
          <div className={styles.VulnhubBox} onClick={handleVulnhubClick}>
            <img src="courses.png" alt="Courses Logo" className={styles.logoImage} />
            <h2>Courses</h2>
          </div>
          <div className={styles.AssignmentBox} onClick={handleAssignmentClick}>
            <img src="topics.png" alt="Topic" className={styles.logoImage} />
            <h2>Topic</h2>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;