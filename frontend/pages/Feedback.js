'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import styles from './Feedback.module.css'; // Assuming you have styles defined for Feedback
import axios from 'axios';
import { handleError } from '../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const Feedback = () => {
  // State to store feedback data
  const [feedbackData, setFeedbackData] = useState({ feedbacks: [] });
  const [feedbackvulnData, setFeedbackvulnData] = useState({ feedbacks: [] });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    // Fetch feedback data from the backend
    axios.get(`${process.env.API_URL}/api/getfeedback`).then((response) => {
      setFeedbackData({ feedbacks: response.data });
    }).catch((error) => {
      handleError(error);
    });
    axios.get(`${process.env.API_URL}/api/getfeedbackvuln`).then((response) => {
      setFeedbackvulnData({ feedbacks: response.data });
    }).catch((error) => {
      handleError(error);
    });
  }, []);
  console.log(feedbackData);
  // Function to handle click on grid item
  const handleItemClick = (name) => {
    // Navigate dynamically to the feedback name
    if (name.includes('vulnhub')) {
      name = name.replace('vulnhub', '');
      window.location.replace('/vulnhub?vulnhub=' + name);
    }
    else {
      window.location.replace('/question?question=' + name);
    }
  };

  // Function to handle deleting a feedback
  const handleDeleteFeedback = async (e, name, description, user) => {
    e.stopPropagation();
    try {
      // Send a request to the backend to delete the feedback
      await axios.delete(`${process.env.API_URL}/api/deletefeedback`, {
        data: {
          name, name,
          user: user,
          description: description
        }
      });
      // Optionally, you can add logic here to handle successful deletion
    } catch (error) {
      // Optionally, you can add logic here to handle errors
      handleError(error);
    }
    window.location.reload();
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageStyle}>
        <h1>Feedback</h1>
        <div className={styles.gridContainer}>
          {feedbackData.feedbacks.map((feedback, index) => (
            <div
              className={styles.gridItem}
              key={index}
              onClick={() => handleItemClick(feedback.name)}
            >
              <div className={styles.feedbackName}>Question: {feedback.name}   Topic: {feedback.topic}</div>
              <div className={styles.feedbackDescription}>Feedback: {feedback.description}</div>
              <div className={styles.feedbackUser}>User: {feedback.user}</div>
              <button onClick={(e) => handleDeleteFeedback(e, feedback.name, feedback.description, feedback.user)}>Done</button>
            </div>
          ))}
        </div>
        <div className={styles.gridContainer}>
          {feedbackvulnData.feedbacks.map((feedback, index) => (
            <div
              className={styles.gridItem}
              key={index}
              onClick={() => handleItemClick(feedback.name)}
            >
              <div className={styles.feedbackName}>Question: {feedback.name}   Topic: {feedback.topic}</div>
              <div className={styles.feedbackDescription}>Feedback: {feedback.description}</div>
              <div className={styles.feedbackUser}>User: {feedback.user}</div>
              <button onClick={(e) => handleDeleteFeedback(e, feedback.name, feedback.description, feedback.user)}>Done</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
