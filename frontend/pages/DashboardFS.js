'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './NavbarFS';
import styles from './DashboardPage.module.css';
import axios from 'axios';
import { handleError } from '../errorHandle';
const DashboardPageFS = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVulnhubClick = () => {
    window.location.href = '/coursesFS'; ;
  };

  const handleAssignmentClick = () => {
    window.location.href = '/topicsFS';
  };

  const handleProfileHover = () => {
    setIsDropdownOpen(true);
  };

  const handleProfileLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    window.location.href = '/ProfilePageFS';
  };

  const handleMatchmakingClick = () => {
    window.location.href = '/Leaderboard'; 
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
        <div className={styles.matchmakingGrid}>
          <button className={styles.matchmakingButton} onClick={handleMatchmakingClick}>
            Matchmaking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageFS;
