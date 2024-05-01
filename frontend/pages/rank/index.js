// QuestionSubmission.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../NavbarFS';
import styles from './QuestionSubmission.module.css';
import axios from 'axios';
import { handleError } from '../../errorHandle';
import io from 'socket.io-client';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
    'Authorization': 'Bearer ' + token
};
const QuestionSubmission = () => {
    const [userAnswer, setUserAnswer] = useState(''); // State for user input
    const [Datas, setDatas] = useState([]); // State for user input
    const [id, setId] = useState('');
    const [available, setAvailable] = useState(''); // State for user input
    useEffect(() => {
        axios.defaults.withCredentials = true;
        const urlParams = new URLSearchParams(window.location.search);
        const problemName = urlParams.get('question');
        const getdata = async () => {
            try {
                const res = await axios.get(`${process.env.API_URL}/api/getfile/` + problemName);
                setDatas(res.data);
                const resid = await axios.get(`${process.env.API_URL}/api/getinfo`);
                setId(resid.data._id);
                setAvailable(resid.data.Availability);
                if (!available.includes(id)) {
                    alert("You are not available for match");
                    window.location.href = '/Leaderboard';
                }
            } catch (error) {
                handleError(error);
            }
        };

        getdata();

        const socket = io(`${process.env.API_URL}`);
        socket.on('done', (data) => {
            if (data.message.includes(id)) {
                alert("The match is over. You can now view the leaderboard.")
                window.location.href = '/Leaderboard';
            }
        });
        socket.on('matchCanceled', (data) => {
            if (data.message.includes(id)) {
                alert("The match is canceled. You can now view the leaderboard.")
                window.location.href = '/Leaderboard';
            }
        });

    }, []);
    const name = Datas.problemname;
    const topic = Datas.topic;
    const description = Datas.description;
    const path = `${process.env.API_URL}/api/downloadfile/` + Datas._id;
    const size = Datas.size + " KB";
    const handleDownload = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/downloadfile/` + Datas._id);
        } catch (error) {
            alert("Failed to download the file");
        }
    };
    const handleAnswerSubmission = async () => {
        try {
            axios.post(`${process.env.API_URL}/api/checkanswerrank`, {
                problemname: name,
                answer: userAnswer
            }).then((response) => {
                const message = response.data.message;
                alert(message);
            });

        } catch (error) {
            handleError(error);
        }

    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <div className={styles.pageStyle}>
                <div className={styles.gridContainer}>
                    <div className={styles.container}>
                        <div className={styles.label}>Problem Name</div>
                        <input
                            type="text"
                            className={styles.lockedInput}
                            value={name}
                            disabled={true}
                            readOnly
                        />
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>Topic</div>
                        <input
                            type="text"
                            className={styles.lockedInput}
                            value={topic}
                            disabled={true}
                            readOnly
                        />
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>Description</div>
                        <input
                            type="text"
                            className={styles.lockedInput}
                            value={description}
                            disabled={true}
                            readOnly
                        />
                    </div>


                    <div className={styles.container}> {/* Updated class name */}
                        <div className={styles.label}>Download</div>
                        {
                            size == "No file KB" || size == "undefined" ?
                                <div className={styles.value}>No file</div> :
                                //<button onClick={handleDownload} className={styles.value}>Download</button>
                                <a href={path} className={styles.value}>Link</a>
                        }
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>Size</div>
                        <input
                            type="text"
                            className={styles.lockedInput}
                            value={size}
                            disabled={true}
                            readOnly
                        />
                    </div>

                    <div className={styles.container}> {/* Updated class name */}
                        <div className={styles.label}>Answer</div>
                        <input
                            type="text"
                            placeholder="Enter Answer here..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                        <div className={styles.actionGrid}>
                            <button
                                className={styles.submitButton}
                                onClick={handleAnswerSubmission}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default QuestionSubmission;
