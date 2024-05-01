// UserManagement.js
'use client';
import React, { useState, useEffect } from 'react';
import styles from './UserManagement.module.css';
import Navbar from './Navbar';
import axios from 'axios';
import { handleError } from '../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const UserManagement = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchuser = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/admin/alluser`);
        if (response.status === 200) {
          setUserData(response.data.map((item) => item));
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchuser();

  }, []);
  const [filteredUserData, setFilteredUserData] = useState(userData);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [editpassword, seteditpassword] = useState(Array(userData.length).fill(''));
  const [editRoles, seteditRoles] = useState(Array(userData.length).fill(''));
  const [editEmail, seteditEmail] = useState(Array(userData.length).fill(''));

  // Function to handle role, email, and password change
  const handleFieldroleChange = (e, index) => {
    const rolevalues = [...editRoles];
    rolevalues[index] = e.target.value;
    seteditRoles(rolevalues);
  };
  const handleFieldpasswordChange = (e, index) => {
    const passvalues = [...editpassword];
    passvalues[index] = e.target.value;
    seteditpassword(passvalues);
  };
  const handleFieldemailChange = (e, index) => {
    const emailvalues = [...editEmail];
    emailvalues[index] = e.target.value;
    seteditEmail(emailvalues);
  };

  // Function to handle the update
  const handleUpdate = () => {
    try {
      userData.forEach((item, index) => {
        const updateuser = item.username;
        const updaterole = editRoles[index] || ""; // Use edited value if available, else use original
        const updatedpassword = editpassword[index] || "";
        const updatedEmail = editEmail[index] || "";
        if (updaterole !== "" || updatedpassword !== "" || updatedEmail !== "") {
          axios.put(`${process.env.API_URL}/api/admin/updateuser/${updateuser}`, {
            roles: updaterole,
            password: updatedpassword,
            email: updatedEmail
          })
            .then(response => {
              alert('User updated successfully');
            })
            .catch(error => {
              alert('An error occurred while updating user information. Please try again later.');
            });
        }

      });
      //window.location.reload(); // Refresh the page
    } catch (error) {
      alert('An error occurred while updating user information. Please try again later.');
    }
  };

  useEffect(() => {
    const filteredUsers = userData.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUserData(filteredUsers);
  }, [searchTerm, userData]);

  useEffect(() => {
    const filteredUsers = userData.filter(
      (user) => selectedRole === '' || user.roles === selectedRole
    );
    setFilteredUserData(filteredUsers);
  }, [selectedRole, userData]);

  const handleCheckboxChange = (userId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(userId)
        ? prevSelectedRows.filter((id) => id !== userId)
        : [...prevSelectedRows, userId]
    );
  };

  const handleDelete = () => {
    if(selectedRows.length === 0) {
      alert('Please select at least one user to delete');
      return;
    }else{
      setShowConfirmation(true);
    }
  };

  const confirmDelete = () => {
    const selectedUsers = userData.filter((user) => selectedRows.includes(user));
    selectedUsers.forEach((user) => {
      axios.delete(`${process.env.API_URL}/api/admin/deleteuser/${user.username}`)
        .then((response) => {
          alert(`User ${user.username} deleted successfully`);
        })
        .catch((error) => {
          alert(`An error occurred while deleting user ${user.username}`);
        });
    });
    setShowConfirmation(false);
    //window.location.reload(); // Refresh the page
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };
  return (
    <div className={styles.pageContainer}>
    <div className={styles.pageStyle}>
      <Navbar />
      <div className={styles.managerUsersText}>
        <p>Manager Users</p>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className={styles.labelStyle} htmlFor="roleDropdown">
        </label>
        <select
          id="roleDropdown"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>
        <button className={styles.updateButton} onClick={handleUpdate}>
          Update
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Username</th>
              <th>Roles</th>
              <th>Password</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserData.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                </td>
                <td>{item.username}</td>
                <td>
                  <select
                    value={editRoles[index] || item.roles} // Use edited value if available, else use original
                    onChange={(e) =>
                      handleFieldroleChange(e, index)
                    }
                  >
                    <option value=""></option>
                    <option value="Admin">Admin</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={editpassword[index] || ''}
                    placeholder={item.password}
                    onChange={(e) =>
                      handleFieldpasswordChange(e, index)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editEmail[index] || ''}
                    placeholder={item.email}
                    onChange={(e) =>
                      handleFieldemailChange(e, index)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete selected users?</p>
            <button onClick={confirmDelete}>Delete</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserManagement;
