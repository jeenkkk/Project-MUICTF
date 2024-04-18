// StudentProgression.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './NavbarFS';
import styles from './StudentProgression.module.css';
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const ITEMS_PER_PAGE = 3;
const StudentProgressionFS = () => {
  const [Topics, setTopics] = useState([]);
  const [Courses, setCourses] = useState([]);
  const [VulnhubData, setVulnhubData] = useState([]);
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const data = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/progression`);
        setTopics(response.data.topics);
        setCourses(response.data.courses);
        setVulnhubData(response.data.challenges);
      } catch (error) {
        alert('An error occurred while fetching student progression data');
      }
    };
    data();
  }, []);
  const handlePreviousClick = () => {
    window.location.href = '/ProfilePageFS';
  };
  //console.log(VulnhubData);
  // Topic pagination state
  const [topicPage, setTopicPage] = useState(1);
  const totalTopicPages = Math.ceil(Topics.length / ITEMS_PER_PAGE);

  // Course pagination state
  const [coursePage, setCoursePage] = useState(1);
  const totalCoursePages = Math.ceil(Courses.length / ITEMS_PER_PAGE);

  // Functions to handle pagination button clicks
  const handleTopicPageChange = (page) => {
    setTopicPage(page);
  };

  const handleCoursePageChange = (page) => {
    setCoursePage(page);
  };

  // Get the current slice of data for topics and courses based on the current page
  const topicSlice = Topics.slice(
    (topicPage - 1) * ITEMS_PER_PAGE,
    topicPage * ITEMS_PER_PAGE
  );

  const courseSlice = Courses.slice(
    (coursePage - 1) * ITEMS_PER_PAGE,
    coursePage * ITEMS_PER_PAGE
  );
  const ProgressBar = ({ completed, total }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
      const data = async () => {
        try {
          axios.defaults.withCredentials = true;

        } catch (error) {
          alert('An error occurred while fetching student progression data');
        }
      };
      const calculatedPercentage = Math.ceil((completed / total) * 100);
      // Change the speed of the animation by modifying the value below
      const speed = 40;
      const increasePercentage = () => {
        for (let i = 0; i <= calculatedPercentage; i++) {
          setTimeout(() => {
            setPercentage(i);
          }, speed * i);
        }
      };
      data();
      increasePercentage();
    }, [completed, total]);

    return (
      <div className={styles.chart}>
        <div className={styles.bar} style={{ width: `${percentage}%` }}></div>
        <span>{percentage}%</span>
      </div>
    );
  };
  const TopicCard = ({ name, completed, total }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>{name}</strong>
        <span>{`${completed}/${total}`}</span>
      </div>
      <ProgressBar completed={completed} total={total} />
    </div>
  );

  const CourseCard = ({ name, completed, total }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>{name}</strong>
        <span>{`${completed}/${total}`}</span>
      </div>
      <ProgressBar completed={completed} total={total} />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.previousButtonContainer}>
          <button
            className={styles.previousButton}
            onClick={handlePreviousClick}
          >
            Previous
          </button>
        </div>
        <div className={styles.gridContainer}>
          {/* Topic Progression */}
          <div className={styles.titleBold}>Topic Progression</div>
          {topicSlice.map((topic, index) => (
            <TopicCard key={index} {...topic} />
          ))}
          {/* Topic Pagination Buttons */}
          {totalTopicPages > 1 && (
            <div className={styles.paginationButtons}>
              {Array.from({ length: totalTopicPages }).map((_, index) => (
                <button
                  key={index}
                  className={
                    topicPage === index + 1
                      ? styles.paginationButtonActive
                      : styles.paginationButton
                  }
                  onClick={() => handleTopicPageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* Course Progression */}
          <div className={styles.titleBold}>Course Progression</div>
          {courseSlice.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
          {/* Course Pagination Buttons */}
          {totalCoursePages > 1 && (
            <div className={styles.paginationButtons}>
              {Array.from({ length: totalCoursePages }).map((_, index) => (
                <button
                  key={index}
                  className={
                    coursePage === index + 1
                      ? styles.paginationButtonActive
                      : styles.paginationButton
                  }
                  onClick={() => handleCoursePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentProgressionFS;