// VulnhubSubmission.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../NavbarFS';
import styles from './VulnhubSubmission.module.css';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const VulnhubSubmission = () => {
  const [Datas, setDatas] = useState([]); // State for user input
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      const urlParams = new URLSearchParams(window.location.search);
      const encodechallengeName = urlParams.get('vulnhub');
      const challengeName = decodeURIComponent(encodechallengeName);
      const getdata = async () => {
        const res = await axios.get(`${process.env.API_URL}/api/challenge/` + challengeName);
        setDatas(res.data);
      };
      getdata();
    } catch (error) {
      handleError(error);
    }
  }, []);

  const Name = Datas.Name;
  const Difficulty = Datas.Difficulty;
  const Description = Datas.Description;
  const Creator = Datas.Author;
  const Size = Datas.Size;
  const Downloadlink = Datas.Download_Link;

  // State for user-submitted flag
  const [userFlag, setUserFlag] = useState('');

  // Function to handle flag submission
  const handleFlagSubmission = () => {
    axios.defaults.withCredentials = true;
    const urlParams = new URLSearchParams(window.location.search);
    const encodechallengeName = urlParams.get('vulnhub');
    try {
      const challengeName = decodeURIComponent(encodechallengeName);
      axios.post(`${process.env.API_URL}/api/challenge/answer/${challengeName}`, {
        Answer: userFlag,
      })
        .then((res) => {
          if (res.status === 200) {
            alert(res.data.message);
            window.location.reload();
          }
        })
        .catch((err) => {
          alert('Flag submission failed!');
        });
    } catch (error) {
      alert('Flag submission failed!');
    }

  };
  const handleFeedbackSubmission = () => {
    try {
      axios.defaults.withCredentials = true;
      const urlParams = new URLSearchParams(window.location.search);
      const problemName = urlParams.get('question');
      const res = axios.post(`${process.env.API_URL}/api/sendfeedback`, {
        problemname: problemName + "vulnhub",
        feedback: feedback
      });
    } catch (error) {
      alert('Feedback submission failed!');
    }

    setFeedback('');
  };


  return (
    <div>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.VulnhubPicContainer}>
          <img src="../vulnhub.png" alt="Vulnhub" className={styles.logoImage} />
        </div>
        <div className={styles.WholeNameContainer}>
          <div className={styles.nameContainerOnTop}>
            <div className={styles.label}>Vulnhub Name</div>
          </div>
          <div className={styles.nameContainer}>
            <div className={styles.value}>{Name}</div>
          </div>
        </div>
        <div className={styles.DifficultyContainer}>
          <div className={styles.label}>Difficulty</div>
          <div className={styles.value}>{Difficulty}</div>
        </div>
        <div className={styles.DifficultyContainer}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>{Description}</div>
        </div>
        <div className={styles.CreatorContainer}>
          <div className={styles.label}>Creator</div>
          <div className={styles.value}>{Creator}</div>
        </div>
        <div className={styles.SizeContainer}>
          <div className={styles.label}>File</div>
          <a href={Downloadlink} className={styles.value}>Link</a>
        </div>

        <div className={styles.SizeContainer}>
          <div className={styles.label}>Size</div>
          <div className={styles.value}>{Size}</div>
        </div>

        <div className={styles.FlagContainer}>
          <div className={styles.label}>Flag Submission</div>
          <input
            type="text"
            placeholder="Enter flag here..."
            value={userFlag}
            onChange={(e) => setUserFlag(e.target.value)}
          />
          <div className={styles.actionGrid}>
            <button className={styles.submitButton} onClick={handleFlagSubmission}>
              Flag Submission
            </button>
          </div>
        </div>

        <div className={styles.FlagContainer}>
          <div className={styles.label}>Feedback</div>
          <input
            type="text"
            placeholder="Enter Feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className={styles.actionGrid}>
            <button
              className={styles.submitButton}
              onClick={handleFeedbackSubmission}
            >
              Submit Feedback
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default VulnhubSubmission;
