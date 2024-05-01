'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../NavbarFS';
import styles from '../CoursesPage.module.css'; // Assuming you reuse the same styles
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const topicsFS = () => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/alltopic`);
        if (response.status === 200) {
          setDatas(response.data.map((item) => item.Name));
        } else {
          alert('Failed to fetch topics');
        }
      } catch (error) {
        handleError(error);
      }
      setLoading(false);
    };
    fetchTopics();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGridItemClick = (item) => {
    if (item === 'Vulnhub') {
      window.location.href = '/QuestionofVulnhub';
    } else {
      window.location.href = '/topicsFS/topicname?topic=' + item;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredDatas = datas.filter(data => {
    return data.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.navbarContainer}></div>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className={styles.gridContainer}>
          {filteredDatas.map((item) => (
            <div
              className={styles.gridItem}
              onClick={() => handleGridItemClick(item)} // Pass the 'item' parameter
            >
              <div>
                <p>{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
  );
};


export default topicsFS;
