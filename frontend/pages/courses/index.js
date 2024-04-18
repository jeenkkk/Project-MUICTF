'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import styles from '../CoursesPage.module.css';
import axios from 'axios';
import { handleError } from '../../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const courses = () => {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCourseInputVisible, setAddCourseInputVisible] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [editCourses, setEditCourses] = useState(Array(datas.length).fill(''));
  const [isEditDeleteModalVisible, setEditDeleteModalVisible] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStudentTrackerPopupVisible, setStudentTrackerPopupVisible] = useState(false);
  const [allstudent, setAllstudent] = useState([]);
  const [displayproblem, setDisplayproblem] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/teacher/allcourse`);
        setDatas(response.data.map((item) => item.Name));
        const resallstudent = await axios.get(`${process.env.API_URL}/api/allstudent`);
        setAllstudent(resallstudent.data);
        const resallproblem = await axios.get(`${process.env.API_URL}/api/getallproblem`);
        setDisplayproblem(resallproblem.data.problemname);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchData();
  }, []);
  const handleEditCourseChange = (e, index) => {
    const newEditCourses = [...editCourses]; // Copy the array
    newEditCourses[index] = e.target.value; // Update the value at the specified index
    setEditCourses(newEditCourses); // Update the state
  };
  const handleEditDeleteCoursesClick = () => {
    setEditDeleteModalVisible(true);
  };
  const updateCourses = () => {
    datas.forEach((item, index) => {
      const updatedCourse = editCourses[index] || item; // Use edited value if available, else use original
      axios.put(`${process.env.API_URL}/api/teacher/updatecourse/${updatedCourse}`, {
        current: datas[index]
      })
        .then(response => {
          alert('Course updated successfully');
        })
        .catch(error => {
          handleError(error);
        });
    });
    window.location.reload(); // Refresh the page
  };
  const handleCloseandEdit = () => {
    setEditDeleteModalVisible(false);
  };
  const handleAddNewCourseClick = () => {
    setAddCourseInputVisible(true);

  };
  const handleCreateCourse = async () => {
    if (newCourseName.trim() !== '') {
      try {
        const res = await axios.post(`${process.env.API_URL}/api/teacher/createcourse`, {
          Name: newCourseName
        });
        if (res.status === 200) {
          alert('Course created successfully');
          window.location.reload(); // Refresh the page
        }
      } catch (error) {
        if ((error.response.status === 400)) {
          alert('Course already exists');
        } else {
          alert('Course already exists');
          handleError(error);
        }
      }
    }
    window.location.reload(); // Refresh the page
  };
  const handleCancelAddCourse = () => {
    setNewCourseName('');
    setAddCourseInputVisible(false);
  };
  const handleAddCourseInputChange = (event) => {
    const { value } = event.target;
    setNewCourseName(value);
  };
  const handleGridItemClick = (item) => {
    if (item === 'Vulnhub') {
      window.location.href = '/courses/Vulnhub';
    } else {
      window.location.href = '/courses/coursename?course=' + item;
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
    // Filter out the selected courses
    const selectedCourses = datas.filter((item, index) => selectedIndexes.includes(index));
    // Send delete request for each selected course
    selectedCourses.forEach((course) => {
      axios.delete(`${process.env.API_URL}/api/teacher/deletecourse/${course}`)
        .then((response) => {
          // Handle success response
        })
        .catch((error) => {
          handleError(error);
        });
      alert(`Course ${course} deleted successfully`);
    });
    // Clear selected indexes after deletion
    setSelectedIndexes([]);
    window.location.reload(); // Refresh the page
  };
  const handleUpdate = () => {
    updateCourses();
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
    <div>
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
          {isAddCourseInputVisible ? (
            <div className={styles.createNewCourse}>
              <input
                type="text"
                placeholder="Enter new course name..."
                value={newCourseName}
                onChange={handleAddCourseInputChange}
              />
              <button onClick={handleCreateCourse}>Create</button>
              <button onClick={handleCancelAddCourse}>Cancel</button>
            </div>
          ) : (
            <div className={styles.createNewCourse} onClick={handleAddNewCourseClick}>
              <p>Add new course</p>
            </div>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={toggleStudentTrackerPopup}>Student Tracker</button>
          <button onClick={handleEditDeleteCoursesClick}>Edit & Delete Courses</button>
        </div>
        {isEditDeleteModalVisible && (
          <div className={styles.modalOverlay}>
            <div className={styles.editDeleteModal}>
              <h2>Edit & Delete Courses</h2>
              <table className={styles.userTable}>
                <tr>
                  <th>Course Name</th>
                </tr>
                <tbody>
                  {datas.map((item, index) => (
                    <div key={index}> {/* Make sure to provide a unique key */}
                      <tr>
                        <td>
                          <input
                            type="text"
                            placeholder={item}
                            value={editCourses[index] || ''}
                            onChange={(e) => handleEditCourseChange(e, index)}
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
      <div></div>
    </div>
  );
};

export default courses;