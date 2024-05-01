// topics.js (full code)
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import styles from '../CoursesPage.module.css'; // Assuming you reuse the same styles
import axios from 'axios';
import { handleError } from '../../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const topics = () => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStudentTrackerPopupVisible, setStudentTrackerPopupVisible] = useState(false);
  const [allstudent, setAllstudent] = useState([]);
  const [displayproblem, setDisplayproblem] = useState([]);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/alltopic`);
        setDatas(response.data.map((item) => item.Name));
        const resallstudent = await axios.get(`${process.env.API_URL}/api/allstudent`);
        setAllstudent(resallstudent.data);
        const resallproblem = await axios.get(`${process.env.API_URL}/api/getallproblem`);
        setDisplayproblem(resallproblem.data.problemname);
      } catch (error) {
        handleError(error);
      }
      setLoading(false);
    };
    fetchTopics();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  //const [filteredData, setFilteredData] = useState(mockData);
  const [isAddCourseInputVisible, setAddCourseInputVisible] = useState(false);
  const [newTopicName, setnewTopicName] = useState('');


  const [isEditDeleteModalVisible, setEditDeleteModalVisible] = useState(false);
  //const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [editTopics, seteditTopics] = useState(Array(datas.length).fill(''));
  const handleEditTopicChange = (e, index) => {
    const neweditTopics = [...editTopics]; // Copy the array
    neweditTopics[index] = e.target.value; // Update the value at the specified index
    seteditTopics(neweditTopics); // Update the state
  };
  const handleCloseandEdit = () => {
    setEditDeleteModalVisible(false);
  };

  const handleEditDeleteCoursesClick = () => {
    setEditDeleteModalVisible(true);
  };

  const handleAddNewTopicClick = () => {
    setAddCourseInputVisible(true);
  };

  const handleCreateTopic = async () => {
    if (newTopicName.trim() !== '') {
      try {
        const res = await axios.post(`${process.env.API_URL}/api/teacher/createtopic`, {
          Name: newTopicName
        });
        // console.log(res);
        if (res.status === 200) {
          alert('Topic created successfully');
          window.location.reload(); // Refresh the page
        }
      } catch (error) {
        if ((error.response.status === 400)) {
          alert('Topic already exists');
          // console.log('An error occurred:', error.response.data);
        } else {
          alert('Topic already exists');
        }
      }
    }
  };

  const handleCancelAddTopic = () => {
    setnewTopicName('');
    setAddCourseInputVisible(false);
  };

  const handleAddTopicInputChange = (event) => {
    const { value } = event.target;
    setnewTopicName(value);
  };

  const handleGridItemClick = (item) => {
    if (item === 'Vulnhub') {
      window.location.href = '/QuestionofVulnhub';
    } else {
      window.location.href = '/topics/topicname?topic=' + item;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredDatas = datas.filter(data => {
    return data.toLowerCase().includes(searchTerm.toLowerCase());
  });


  const handleCheckboxChange = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleDeleteSelected = () => {
    const selectedTopics = datas.filter((item, index) => selectedIndexes.includes(index));

    // Send delete request for each selected topic
    selectedTopics.forEach((topic) => {
      axios.delete(`${process.env.API_URL}/api/teacher/deletetopic/${topic}`)
        .then((response) => {
          // Handle success response
          // console.log(`topic ${topic} deleted successfully`);
        })
        .catch((error) => {
          // Handle error
          console.log(`Error deleting topic ${topic}:`, error);
        });
      alert(`topic ${topic} deleted successfully`);
    });

    // Clear selected indexes after deletion
    setSelectedIndexes([]);
    window.location.reload(); // Refresh the page
  };

  const handleUpdate = () => {
    updateTopics();
    //window.location.reload(); // Refresh the page
  };
  const updateTopics = () => {
      datas.forEach((item, index) => {
        const updatedTopic = editTopics[index] || item; // Use edited value if available, else use original
        if (updatedTopic === item) {
          return;
        }
        if (updatedTopic === '') {
          alert('Topic name cannot be empty');
          return;
        }
        axios.post(`${process.env.API_URL}/api/teacher/updatetopic/${updatedTopic}`, {
          current: datas[index]
        })
          .then(response => {
            alert('Topic updated successfully');
          })
          .catch(error => {
            alert('An error occurred while updating topic information. Please try again later.');
          });
      });
    //window.location.reload(); // Refresh the page
  };
  const toggleStudentTrackerPopup = () => {
    setStudentTrackerPopupVisible(prev => !prev);

  };
  const renderStudentRows = (student) => {
    return displayproblem.map((problem, index) => {
      return (
        <td key={index}>
          <input
            type="checkbox"
            checked={student.Question.includes(problem)}
            onChange={() => handleCheckboxChange(problem)}
          />
        </td>
      );
    });
  };
  const countdonequestion = (student) => {
    let count = 0;
    displayproblem.forEach((problem) => {
      if (student.Question.includes(problem)) {
        count++;
      }
    });
    return count;
  };


  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageStyle}>
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

          {isAddCourseInputVisible ? (
            <div className={styles.createNewCourse}>
              <input
                type="text"
                placeholder="Enter new course name..."
                value={newTopicName}
                onChange={handleAddTopicInputChange}
              />
              <button onClick={handleCreateTopic}>Create</button>
              <button onClick={handleCancelAddTopic}>Cancel</button>
            </div>
          ) : (
            <div className={styles.createNewCourse} onClick={handleAddNewTopicClick}>
              <p>Add new topic</p>
            </div>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={toggleStudentTrackerPopup}>Student Tracker</button>
          <button onClick={handleEditDeleteCoursesClick}>Edit & Delete Topics</button>
        </div>

        {/* Edit/Delete Modal */}
        {isEditDeleteModalVisible && (
          <div className={styles.modalOverlay}>
            <div className={styles.editDeleteModal}>
              <h2>Edit & Delete Topics</h2>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>Topic Name</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((item, index) => (
                    <div key={index}> {/* Make sure to provide a unique key */}
                      <tr>
                        <td>
                          <input
                            type="text"
                            placeholder={item}
                            value={editTopics[index] || ''}
                            onChange={(e) => handleEditTopicChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIndexes.includes(index)}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </td>
                      </tr>
                    </div>
                  ))}
                </tbody>
              </table>
              <div className={styles.modalButtons}>
                <button onClick={handleDeleteSelected}>Delete Selected</button>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleCloseandEdit}>Close</button>
              </div>
            </div>
          </div>
        )}
        {isStudentTrackerPopupVisible && (
          <div className={styles.createQuestionPopup}>
            <div className={styles.StudentTrackerText}>
              <p>Student Tracker</p>
            </div>
            <div className={styles.tableContainer}>
              <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      {displayproblem.map((item, index) => (
                        <th key={index}>{item}</th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allstudent.map((student, index) => (
                      <tr key={index}>
                        <td>{student.username}</td>
                        {renderStudentRows(student)}
                        <td>{countdonequestion(student)}/{displayproblem.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button onClick={toggleStudentTrackerPopup}>Close</button>
          </div>
        )}
      </div>
      </div>
  );
};

export default topics;
