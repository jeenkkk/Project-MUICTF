// QuestionofTC.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import styles from './QuestionofTC.module.css';
import axios from 'axios';
import { handleError } from '../../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const QuestionofTC = () => {
    const [score, setScore] = useState(1);
    const [problemName, setProblemName] = useState('');
    // State for Topics
    const [Topics, setTopics] = useState([]); // Initial Topics
    // State for the description (manual formatting)
    const [description, setDescription] = useState('');
    const [answer, setAnswer] = useState('');
    const [Topic, setTopic] = useState(''); // Initial Topic
    const [file, setFile] = useState("");
    const [topicinfo, setTopicinfo] = useState([]);
    const [isStudentTrackerPopupVisible, setStudentTrackerPopupVisible] = useState(false);
    const [allstudent, setAllstudent] = useState([]);
    const [tracktopic, setTracktopic] = useState('');
    const [Finishquestion, setFinishquestion] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState([]);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get('topic');
        const Topicdata = async () => {
            axios.defaults.withCredentials = true;
            try {
                const res = await axios.get(`${process.env.API_URL}/api/getinfo`);
                setFinishquestion(res.data.question);
                const restopic = await axios.get(`${process.env.API_URL}/api/allTopic`);
                setTopics(restopic.data.map((item) => item.Name));
                const restopicinfo = await axios.get(`${process.env.API_URL}/api/gettopic/${topic}`);
                setTracktopic(topic);
                setTopicinfo(restopicinfo.data.Question.map((item) => item));
                const resallstudent = await axios.get(`${process.env.API_URL}/api/allstudent`);
                setAllstudent(resallstudent.data);
            } catch (error) {
                handleError(error);
            }
        };
        Topicdata();

    }, []);

    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Function to filter topicinfo based on search query and selected Topic
    const filteredQuestions = topicinfo.filter(data => {
        return data.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // State for the create question popup
    const [isCreateQuestionPopupVisible, setCreateQuestionPopupVisible] = useState(false);

    // State for the edit question popup
    const [isEditQuestionPopupVisible, setEditQuestionPopupVisible] = useState(false);

    // Function to handle "Edit" button click
    const handleUpdate = async () => {
        const data = new FormData();
        if (file !== "") {
            data.append('file', file);
        }
        data.append('score', score);
        data.append('problemName', problemName);
        data.append('Topic', Topic);
        data.append('description', description);
        data.append('answer', answer);
        if (file === "") {
            try {
                const response = await axios.put(`${process.env.API_URL}/api/updateproblem`, {
                    score: score,
                    problemName: problemName,
                    Topic: Topic,
                    description: description,
                    answer: answer
                });
                window.location.reload();
            } catch (error) {
                alert("Failed! Name, Topic, Answer are required, File already exists!, or Invalid Name!");
            }
        }
        else {
            try {

                const response = await axios.put(`${process.env.API_URL}/api/updatefile`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                window.location.reload();
            } catch (error) {
                alert("Failed! Name, Topic, Answer are required, File already exists!, or Invalid Name!");
            }
        }
        // Clear form inputs
        setProblemName('');
        setTopic('');
        setDescription('');
        setAnswer('');
        // Close the popup
        toggleEditQuestionPopup();
        window.location.reload();
    };
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.API_URL}/api/deleteproblem/` + problemName);
            alert(problemName + " Deleted!");
            window.location.reload();
        } catch (error) {
            alert("Failed to delete " + problemName);
        }
    }

    // Function to toggle the visibility of the create question popup
    const toggleCreateQuestionPopup = () => {
        setProblemName('');
        setTopic('');
        setDescription('');
        setAnswer('');
        setCreateQuestionPopupVisible((prev) => !prev);
    };

    // Function to toggle the visibility of the edit question popup
    const toggleEditQuestionPopup = () => {
        setEditQuestionPopupVisible((prev) => !prev);
    };
    // Function to handle grid item click
    const handleGridItemClick = (item) => {
        window.location.replace('/question?question=' + item);
    };
    // Function to handle "Edit" button click
    const handleEditQuestion = async (event, question) => {
        event.stopPropagation(); // Prevent the grid item click event from firing
        //console.log(question);
        axios.defaults.withCredentials = true;
        try {
            const res = await axios.get(`${process.env.API_URL}/api/getfile/${question}`);
            //console.log(res);
            setProblemName(res.data.problemname);
            setTopic(res.data.topic);
            setDescription(res.data.description);
            setAnswer(res.data.answer);
            //console.log(res.data);

        } catch (error) {
            alert("Failed to get data");
        }
        toggleEditQuestionPopup();
    };

    // Function to render grid items
    const renderGridItems = () => {
        const currentItems = filteredQuestions;

        return currentItems.map((item, index) => {
            // Check if the item exists in Finishquestion
            const isFinished = Finishquestion.includes(item);

            return (
                <div key={index} className={`${styles.gridItem} ${isFinished ? styles.finished : ''}`} onClick={() => handleGridItemClick(item)}>
                    <div>{filteredQuestions[index]}</div>
                    <button onClick={(e) => handleEditQuestion(e, item)}>Edit or Delete Question</button>
                </div>
            );
        });
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const uploadfile = async () => {
        const data = new FormData();
        if (file !== "") {
            data.append('file', file);
        }
        data.append('score', score);
        data.append('problemName', problemName);
        data.append('Topic', Topic);
        data.append('description', description);
        data.append('answer', answer);

        //console.log(data);
        if (file === "") {
            try {
                const response = await axios.post(`${process.env.API_URL}/api/teacher/uploadproblem`, {
                    score: score,
                    problemName: problemName,
                    Topic: Topic,
                    description: description,
                    answer: answer
                });
                //console.log(response);
                window.location.reload();
            } catch (error) {
                alert("Failed! Name, Topic, Answer are required, File already exists!, or Invalid Name!");
            }
        }
        else {
            try {
                const response = await axios.post(`${process.env.API_URL}/api/teacher/uploadfile`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                window.location.reload();
            } catch (error) {
                alert("Failed! Name, Topic, Answer are required, File already exists!, or Invalid Name!");
            }
        }
    };

    const toggleStudentTrackerPopup = () => {
        setStudentTrackerPopupVisible(prev => !prev);

    };

    const renderStudentRows = (student) => {
        return topicinfo.map((problem, index) => {
            return (
                <td key={index}>
                    <input
                        type="checkbox"
                        checked={student.Question.includes(problem)}
                    />
                </td>
            );
        });
    };
    const countdonequestion = (student) => {
        let count = 0;
        topicinfo.forEach((problem) => {
            if (student.Question.includes(problem)) {
                count++;
            }
        });
        return count;
    };
    return (
        <div className={styles.pageContainer}>
            {/* Navbar */}
            <Navbar />

            {/* Page Style */}
            <div className={styles.pageStyle}>
                {/* Container for Search Bar, Topic Filter, and Create Question */}
                <div className={styles.searchAndFilterContainer}>
                    {/* Search Bar */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Create Question Button */}
                        <div className={styles.createQuestionButton}>
                            <button onClick={toggleCreateQuestionPopup}>Create Question</button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className={styles.gridContainer}>{renderGridItems()}</div>
                {/* Create Question Popup */}
                {isCreateQuestionPopupVisible && (
                    <div className={styles.createQuestionPopup}>
                        <div className={styles.createQuestionForm}>
                            <h2>Create a New Question</h2>
                            {/* Problem Name */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="problemName">Problem Name:</label>
                                <input
                                    type="text"
                                    id="problemName"
                                    placeholder="Enter problem name"
                                    value={problemName}
                                    onChange={(e) => setProblemName(e.target.value)}
                                />
                            </div>

                            {/* Topic */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="Topic">Topic:</label>
                                <select id="Topic" value={Topic} onChange={(e) => setTopic(e.target.value)}>
                                    <option value="">Choose Topic</option>
                                    {Topics.map((Topic) => (
                                        <option key={Topic} value={Topic}>
                                            Topic {Topic}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Score */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="score">Score:</label>
                                <input
                                    type='number'
                                    id='score'
                                    defaultValue="1"
                                    onChange={(e) => setScore(e.target.value)}></input>
                            </div>

                            {/* Answer */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="answer">Answer:</label>
                                <textarea
                                    id="answer"
                                    placeholder="Enter answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="answer">File</label>
                                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                            </div>

                            {/* Create and Cancel Buttons */}
                            <div className={styles.buttonsContainer}>
                                <button onClick={uploadfile}>Create</button>
                                <button onClick={toggleCreateQuestionPopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.pagination}>
                    <button onClick={toggleStudentTrackerPopup}>Student Tracker</button>
                </div>
                {/* Edit Question Popup */}
                {isEditQuestionPopupVisible && (
                    <div className={styles.createQuestionPopup}>
                        <div className={styles.createQuestionForm}>
                            <h2>Edit or Delete Question</h2>

                            {/* Problem Name */}
                            <div className={styles.inputGroup}>
                                <h3>Problem Name: {problemName}</h3>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="Topic">Topic:</label>
                                <select id="Topic" value={Topic} onChange={(e) => setTopic(e.target.value)}>
                                    <option value="" placeholder="Choose Topic">Choose Topic</option>
                                    {Topics.map((Topic) => (
                                        <option key={Topic} value={Topic}>
                                            Topic {Topic}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            {/* Score */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="score">Score:</label>
                                <input
                                    type='number'
                                    id='score'
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}></input>
                            </div>

                            {/* Answer */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="answer">Answer:</label>
                                <textarea
                                    id="answer"
                                    placeholder="Enter answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="answer">File</label>
                                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                            </div>

                            {/* Update and Cancel Buttons */}
                            <div className={styles.buttonsContainer}>
                                <button onClick={handleDelete}>Delete</button>
                                <button onClick={handleUpdate}>Update</button>
                                <button onClick={toggleEditQuestionPopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {isStudentTrackerPopupVisible && (
                    <div className={styles.createQuestionPopup}>
                        <div className={styles.StudentTrackerText}>
                            <p>Student Tracker Topic {tracktopic}</p>
                        </div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.userTable}>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            {topicinfo.map((item, index) => (
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
                                                <td>{countdonequestion(student)}/{topicinfo.length}</td>
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

export default QuestionofTC;
