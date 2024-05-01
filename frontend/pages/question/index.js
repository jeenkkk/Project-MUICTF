// QuestionSubmission.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../NavbarFS';
import styles from './QuestionSubmission.module.css';
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
    'Authorization': 'Bearer ' + token
};
const QuestionSubmission = () => {
    const [userAnswer, setUserAnswer] = useState(''); // State for user input
    const [feedback, setFeedback] = useState('');
    const [solvedCount, setSolvedCount] = useState(''); // Mocked solved count
    const [likeCount, setLikeCount] = useState(0); // Mocked like count
    const [dislikeCount, setDislikeCount] = useState(0); // Mocked dislike count
    const [userVote, setUserVote] = useState(null); // Track user's vote (like or dislike)
    const [userinfo, setUserInfo] = useState([]); // State for user info
    const [Datas, setDatas] = useState([]); // State for user input
    useEffect(() => {
        axios.defaults.withCredentials = true;
        const urlParams = new URLSearchParams(window.location.search);
        const problemName = urlParams.get('question');
        const getdata = async () => {
            try {
                const res = await axios.get(`${process.env.API_URL}/api/getfile/` + problemName);
                setDatas(res.data);
                const res2 = await axios.get(`${process.env.API_URL}/api/getinfo`);
                setUserInfo(res2.data);
                setSolvedCount(res.data.solved);
                if (res.data.likedby.includes(res2.data.username)) {
                    setUserVote('like');
                } else if (res.data.dislikedby.includes(res2.data.username)) {
                    setUserVote('dislike');
                }
            } catch (error) {
                handleError(error);
            }
        };
        getdata();
    }, []);
    const _id = Datas._id;
    const name = Datas.problemname;
    const topic = Datas.topic;
    const description = Datas.description;
    const path = `${process.env.API_URL}/api/downloadfile/` + Datas._id;

    const size = Datas.size + " KB";
    const totalVotes = Datas.like + Datas.dislike;
    const likePercentage = totalVotes === 0 ? 0 : (Datas.like / totalVotes) * 100;
    const dislikePercentage = totalVotes === 0 ? 0 : (Datas.dislike / totalVotes) * 100;
    const handleDownload = async () => {
        try {
            await axios.get(`${process.env.API_URL}/api/downloadfile/` + _id);
        } catch (error) {
            alert("Failed to download the file");
        }
    };
    const handleAnswerSubmission = async () => {
        try {
            axios.post(`${process.env.API_URL}/api/checkanswer`, {
                problemname: name,
                answer: userAnswer
            }).then((response) => {
                const message = response.data.message;
                alert(message);
                window.location.reload();
            });

        } catch (error) {
            alert("Failed to submit answer");
        }

    };

    const handleFeedbackSubmission = () => {
        const specialCharactersRegex = /[%&<>"'/]/;
        axios.defaults.withCredentials = true;
        const urlParams = new URLSearchParams(window.location.search);
        const problemName = urlParams.get('question');
        if(feedback.length<=0 || feedback.length>1000 || specialCharactersRegex.test(feedback)){
            alert("Feedback must be between 1 and 1000 characters long and should not contain special characters like %, &, <, >, \", ', /");
            return;
        }
        const res = axios.post(`${process.env.API_URL}/api/sendfeedback`, {
            problemname: problemName,
            feedback: feedback
        });
        setFeedback('');
    };

    const handleLike = async () => {
        const response = await axios.post(`${process.env.API_URL}/api/likeordislike`, {
            problemname: name,
            likeordislike: 'like'
        });
        // Update like count based on server response
        if (response.status === 200) {
            setLikeCount(likeCount + (userVote === 'like' ? -1 : 1));
            setDislikeCount(dislikeCount + (userVote === 'dislike' ? -1 : 0));
            setUserVote('like');
            const res = await axios.get(`${process.env.API_URL}/api/getfile/` + problemName);
            setDatas(res.data);
            const res2 = await axios.get(`${process.env.API_URL}/api/getinfo`);
            setUserInfo(res2.data);
        }

    };

    const handleDislike = async () => {
        const response = await axios.post(`${process.env.API_URL}/api/likeordislike`, {
            problemname: name,
            likeordislike: 'dislike'
        });
        // Update dislike count based on server response
        if (response.status === 200) {
            setDislikeCount(dislikeCount + (userVote === 'dislike' ? -1 : 1));
            setLikeCount(likeCount + (userVote === 'like' ? -1 : 0));
            setUserVote('dislike');
            const res = await axios.get(`${process.env.API_URL}/api/getfile/` + problemName);
            setDatas(res.data);
            const res2 = await axios.get(`${process.env.API_URL}/api/getinfo`);
            setUserInfo(res2.data);
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
                        <div className={styles.value}>{description}</div>
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

                    <div className={styles.container}> {/* Updated class name */}
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

                    <div className={styles.container}> {/* Updated class name */}
                        <div className={styles.label}>Users Solved</div>
                        <div className={styles.value}>{solvedCount}</div>
                        <div className={styles.actionGrid}>
                            <button
                                className={styles.likeButton}
                                onClick={handleLike}
                                disabled={userVote === 'like'}
                            >
                                Like
                            </button>
                            <button
                                className={styles.dislikeButton}
                                onClick={handleDislike}
                                disabled={userVote === 'dislike'}
                            >
                                Dislike
                            </button>
                        </div>
                        {/* Display like and dislike percentages */}
                        <div>
                            <p>Like: {likePercentage.toFixed(2)}%</p>
                            <p>Dislike: {dislikePercentage.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionSubmission;