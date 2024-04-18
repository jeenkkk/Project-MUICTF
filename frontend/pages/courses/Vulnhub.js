'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../NavbarFS';
import axios from 'axios';
import styles from './QuestionofVulnhub.module.css';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const Vulnhub = () => {
  const [vulnhubData, setVulnhubData] = useState([]);
  const [vulnQuestion, setvulnQuestion] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/api/challenge/all`);
        setVulnhubData(res.data);
        const res1 = await axios.get(`${process.env.API_URL}/api/getinfo`);
        setvulnQuestion(res1.data.vulnQuestion);

      } catch (error) {
        handleError(error);
      }
    }
    fetchData();


  }, []);
  //console.log(vulnhubData);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  // filteredData in if else


  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  const handleGridContainerClick = (item) => {
    // Redirect to VulnHub submission page when the grid container is clicked
    window.location.href = '/vulnhub?vulnhub=' + item;
  };

  const renderGridItems = () => {
    const filteredItems = vulnhubData.filter((item) => {
      const searchWords = searchInput.split(' ');
      const difficultyMatch =
        selectedDifficulty === 'All' || item.Difficulty === selectedDifficulty;
      return (
        searchWords.every((word) => {
          return Object.values(item).some((value) => {
            if (value === null || value === undefined) {
              return false; // Skip null or undefined values
            }
            return value.toString().toLowerCase().includes(word.toLowerCase());
          });
        }) && difficultyMatch
      );
    });

    return filteredItems.map((item, index) => {
      const difficultyClass = item.Difficulty.toLowerCase();
      const isQuestion = vulnQuestion.includes(item.Name); // Check if item.Name exists in vulnQuestion array

      return (
        <div
          key={index}
          className={`${styles.gridItem} ${styles[difficultyClass]} ${isQuestion && styles.question // Apply 'question' class if true
            }`}
          onClick={() => handleGridContainerClick(item.Name)}
        >
          <h3 style={{ margin: 4 }}>{item.Name}</h3>
          <div>Author: {item.Author}</div>
          <div>Series: {item.Series}</div>
          <div>Size: {item.Size}</div>
          <div>Difficulty: {item.Difficulty}</div>
        </div>
      );
    });
  };

  const difficultyOptions = ['All', 'Beginner', 'Easy', 'Medium', 'Hard', 'Unknown'];

  return (
    <div>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className={styles.difficultyFilter}>
            <span>Difficulty:</span>
            <select onChange={(e) => handleDifficultyChange(e.target.value)} value={selectedDifficulty}>
              {difficultyOptions.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {renderGridItems()}
        </div>
      </div>
    </div>
  );
};

export default Vulnhub;
