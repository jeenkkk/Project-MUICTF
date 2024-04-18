// QuestionofTC.js
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../NavbarFS';
import styles from './QuestionofTC.module.css';
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { handleError } from '../../errorHandle';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
    'Authorization': 'Bearer ' + token
};
const QuestionofTC = () => {
    const [topicinfo, setTopicinfo] = useState([]);
    const [Finishquestion, setFinishquestion] = useState([]);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get('topic');
        const Topicdata = async () => {
            axios.defaults.withCredentials = true;
            try {
                const res = await axios.get(`${process.env.API_URL}/api/getinfo`);
                setFinishquestion(res.data.question);
                const restopicinfo = await axios.get(`${process.env.API_URL}/api/gettopic/${topic}`);
                setTopicinfo(restopicinfo.data.Question.map((item) => item));
            } catch (error) {
                handleError(error);
            }
        };
        Topicdata();

    }, []);

    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    // Function to filter displayproblem based on search query and selected Topic
    const filteredQuestions = topicinfo.filter(data => {
        return data.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Function to handle grid item click
    const handleGridItemClick = (item) => {
        window.location.replace('/question?question=' + item);
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
                </div>
            );
        });
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <>
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

                    </div>
                </div>

                {/* Grid */}
                <div className={styles.gridContainer}>{renderGridItems()}</div>
            </div>
        </>
    );
};

export default QuestionofTC;
