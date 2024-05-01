'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import styles from '../CoursesPage.module.css';
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const coursesFS = () => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/teacher/allcourse`);
        if (response.status === 200) {
          setDatas(response.data.map((item) => item.Name));
        } else {
          // console.log(response);
          alert('An error occurred while fetching courses');
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const handleGridItemClick = (item) => {
    //alert(item)
    if (item === 'Vulnhub') {
      window.location.href = '/courses/Vulnhub';
    } else {
      window.location.href = '/coursesFS/coursename?course=' + item;
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
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className={styles.gridContainer}>
          {filteredDatas.map((item) => ( // Use this item are all courses
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
      <div></div>
    </div>
  );
};

export default coursesFS;
