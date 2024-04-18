'use client';
import React, { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';
import Navbar from './NavbarFS';
import io from 'socket.io-client';
import axios from 'axios';
import { handleError } from '../errorHandle';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
const token = getCookie('token');
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};
const Leaderboard = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // State to manage which option is selected
  const [selectedOptions, setSelectedOptions] = useState([]);
  // State to manage the visibility of the topic pop-up
  const [showTopicPopup, setShowTopicPopup] = useState(false);
  // State to keep track of selected topics
  const [selectedTopics, setSelectedTopics] = useState([]);
  // State for queuing popup
  const [queuingPopup, setQueuingPopup] = useState(null);
  // State for countdown timer
  const [countdown, setCountdown] = useState(0); // Changed initial countdown value to 0
  // State for accept popup
  const [showAcceptPopup, setShowAcceptPopup] = useState(false); // Add state for accept popup
  // State for accept popup countdown timer
  const [acceptCountdown, setAcceptCountdown] = useState(10); // Initialize countdown for accept popup
  // State for cooldown popup
  const [showCooldownPopup, setShowCooldownPopup] = useState(false); // Add state for cooldown popup
  // State for cooldown time remaining
  const [cooldownRemaining, setCooldownRemaining] = useState(15); // Initialize cooldown time remaining
  // State for waiting for accept popup
  const [showWaitingforAccept, setshowWaitingforAccept] = useState(false); // Add state for waiting for accept popup
  // State for opponent not accept popup
  const [showOpponentNotAcceptPopup, setShowOpponentNotAcceptPopup] = useState(false); // Add state for opponent not accept popup
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for challenge accepted
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  // Effect to handle accept popup countdown
  useEffect(() => {
    let timer;
    let matchCanceledEventHandled = false; // Flag to track if matchCanceled event has been handled

    if (showAcceptPopup && acceptCountdown > 0) {
      timer = setInterval(() => {
        setAcceptCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (showAcceptPopup && acceptCountdown === 0 && !matchCanceledEventHandled) {
      const socket = io(`${process.env.API_URL}`);
      axios.defaults.withCredentials = true;

      // Handle 'matchCanceled' event only once
      socket.once('matchCanceled', (data) => {
        axios.get(`${process.env.API_URL}/api/cancelmatch`)

      });
      setShowAcceptPopup(false); // Close accept popup when countdown reaches 0
      setAcceptCountdown(10); // Reset countdown for accept popup
      setShowCooldownPopup(true); // Show cooldown popup

      setTimeout(() => {
        setShowCooldownPopup(false); // Hide cooldown popup after 15 seconds
      }, 15000);
      setCooldownRemaining(15); // Reset cooldown time remaining
    }
    return () => clearInterval(timer);
  }, [acceptCountdown, showAcceptPopup]);


  // Effect to handle cooldown time remaining
  useEffect(() => {
    let cooldownTimer;
    if (showCooldownPopup) {
      axios.defaults.withCredentials = true;
      axios.get(`${process.env.API_URL}/api/cancelmatch`)
      cooldownTimer = setInterval(() => {
        setCooldownRemaining(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [showCooldownPopup]);
  // Effect to handle waiting for opponent to accept

  useEffect(() => {
    let cooldownTimer;
    //console.log(showWaitingforAccept);
    if (showWaitingforAccept) {
      cooldownTimer = setInterval(() => {
        setAcceptCountdown(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [showWaitingforAccept]);
  // Effect to handle opponent not accept
  useEffect(() => {
    if (showCooldownPopup === false &&acceptCountdown == 0 && showWaitingforAccept == true) {
      axios.defaults.withCredentials = true;
      axios.get(`${process.env.API_URL}/api/cancelmatch`)
      setShowOpponentNotAcceptPopup(true);
      setshowWaitingforAccept(false);
    }
  }, [acceptCountdown]);
  // Effect to handle random question

  useEffect(() => {
    // Check if at least one client has accepted the challenge before making the API call
    if (challengeAccepted) {
      const socket = io(`${process.env.API_URL}`);

      if (selectedOptions.includes('All challenges')) {
        axios.defaults.withCredentials = true;
        axios.get(`${process.env.API_URL}/api/randomquestion`);
      } else {
        axios.defaults.withCredentials = true;
        axios.get(`${process.env.API_URL}/api/randomquestionfromtopic/${selectedTopics.join(',')}`);
      }

      socket.on('randomQuestion', (data) => {
        window.location.href = `/rank?question=${data.message}`; // Redirect to QuestionSubmission page
      });
    }
  }, [challengeAccepted, selectedOptions, selectedTopics]);
  // reset queuing popup
  useEffect(() => {
    if (acceptCountdown < 0 && showOpponentNotAcceptPopup == false) {
      window.location.reload();
    }
  }, [acceptCountdown]);
  // get data
  useEffect(() => {
    const fetchdata = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.API_URL}/api/alltopic`);
        //console.log(response.data);
        setTopic(response.data.map((item) => item.Name));
        const resuser = await axios.get(`${process.env.API_URL}/api/leaderboard`);
        //console.log(resuser.data);
        setleaderboardData(resuser.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchdata();
  }, []);
  const [leaderboardData, setleaderboardData] = useState([]);
  // Filtered leaderboard based on search query
  const filteredLeaderboard = leaderboardData.filter(entry =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    entry.points > 0 // Adjust the condition based on your requirements
  );

  // topic
  const [topic, setTopic] = useState('');
  // Handler for selecting an option
  const handleOptionSelect = (option) => {
    if (option === 'All challenges') {
      setSelectedOptions(['All challenges']);
      setShowTopicPopup(false);
      setSelectedTopics([]);
      setQueuingPopup(null);
    } else {
      setSelectedOptions(prevSelected => {
        if (prevSelected.includes('All challenges')) {
          return [option];
        } else if (prevSelected.includes(option)) {
          return prevSelected.filter(item => item !== option);
        } else {
          return [...prevSelected, option];
        }
      });
      if (option === 'Topic') {
        setShowTopicPopup(true);
      }
    }
  };

  // Handler for toggling the visibility of the topic pop-up
  const toggleTopicPopup = () => {
    setShowTopicPopup(!showTopicPopup);
  };

  // Handler for selecting a topic
  const handleTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Handler for closing the topic pop-up
  const closeTopicPopup = () => {
    setShowTopicPopup(false);
    if (selectedTopics.length === 0) {
      setSelectedOptions([]);
    }
  };

  // Determine if the Start button should be enabled based on selectedOptions
  const isStartButtonEnabled = () => {
    if (selectedOptions.includes('All challenges')) {
      return true;
    } else if (selectedTopics.length > 0) {
      return true;
    }
    return false;
  };

  // Handler for Start button click
  const handleStartButtonClick = () => {
    let timer;

    //console.log(selectedTopics); // Log selected topics (if any
    const socket = io(`${process.env.API_URL}`);
    setQueuingPopup({ mode: selectedOptions[0], countdown: 0 });
    axios.defaults.withCredentials = true;
    axios.get(`${process.env.API_URL}/api/findmatches`);

    // Define timer state

    socket.on('match', (data) => {
      setShowAcceptPopup(true); // Show accept popup after queuing popup
      setQueuingPopup(null);
      setCountdown(0); // Reset countdown for queuing popup
      clearInterval(timer);// Reset timer when match found
    });

    // Start the timer
    timer = setInterval(() => {
      setCountdown(countdown => countdown + 1);
    }, 1000);
  };


  // Cancel button handler
  const handleCancel = () => {
    window.location.reload(); // Reload the page when canceling
    setQueuingPopup(null);
    setShowAcceptPopup(false);
    setShowCooldownPopup(false); // Hide cooldown popup when canceling
    setCountdown(0); // Reset countdown for queuing popup
  };

  // Handler for accepting the challenge
  const handleAccept = () => {
    setShowAcceptPopup(false);
    setShowCooldownPopup(false); // Hide cooldown popup when accepting
    setshowWaitingforAccept(true);
    setAcceptCountdown(10); // Reset countdown for accept popup
    setChallengeAccepted(true); // Set the challenge acceptance status
  };

  const handleOpponentNotAccept = () => {
    setShowOpponentNotAcceptPopup(false);
    window.location.reload();
  };



  // Function to get emoji for the Rank column
  const getMedalEmoji = (index) => {
    switch (index) {
      case 0:
        return '🥇'; // Gold medal emoji
      case 1:
        return '🥈'; // Silver medal emoji
      case 2:
        return '🥉'; // Bronze medal emoji
      default:
        return index + 1; // Number for ranks after 3rd
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Determine the current users to display based on pagination and search query
  const sortedLeaderboard = filteredLeaderboard.sort((a, b) => b.points - a.points);

  // Determine the current users to display based on pagination and search query
  const currentUsers = sortedLeaderboard.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


  // Update pagination buttons to use filtered data length
  {
    Array.from({ length: Math.ceil(filteredLeaderboard.length / usersPerPage) }, (_, i) => (
      <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? styles.active : ''}>
        {i + 1}
      </button>
    ))
  }
  return (
    <div className={styles.pageStyle}>
      <Navbar />
      <div className={styles.invisibleBox}>
        <div
          className={selectedOptions.includes('All challenges') ? styles.gridItemSelected : styles.gridItem}
          onClick={() => handleOptionSelect('All challenges')}
        >
          All Challenges
        </div>

        <div
          className={selectedOptions.includes('Topic') ? styles.gridItemSelected : styles.gridItem}
          onClick={() => handleOptionSelect('Topic')}
        >
          Topic
        </div>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.container}>
        <h1>Leaderboard</h1>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Points</th>
              <th>Matches</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((entry, index) => (
              <tr key={index}>
                <td>{getMedalEmoji(indexOfFirstUser + index)}</td>
                <td>{entry.username}</td>
                <td>{entry.points}</td>
                <td>{entry.matches}</td>
                <td>{entry.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className={styles.pagination}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: Math.ceil(leaderboardData.length / usersPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? styles.active : ''}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(leaderboardData.length / usersPerPage)}>
          Next
        </button>
      </div>
      {/* Topic pop-up */}
      {showTopicPopup && (
        <div className={styles.topicPopup}>
          <h2>Select Topics</h2>
          <div className={styles.topicOptions}>
            {topic.map((topic, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicSelect(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
          <button onClick={closeTopicPopup}>Close</button>
        </div>
      )}
      {/* Queuing popup */}
      {queuingPopup && (
        <div className={styles.queuingPopup}>
          <p>Queuing for {queuingPopup.mode} {selectedTopics.join(', ')}</p>
          <p>Time: {countdown}</p> {/* Display current countdown */}
          <button onClick={handleCancel}>Cancel</button> {/* Cancel button */}
        </div>
      )}
      {/* Accept popup */}
      {showAcceptPopup && (
        <div className={styles.acceptPopup}>
          <p>Accept the challenge? Time: {acceptCountdown}</p> {/* Display accept popup countdown */}
          <button onClick={handleAccept}>Accept</button>
        </div>
      )}
      {/* Cooldown popup */}
      {showCooldownPopup && (
        <div className={styles.cooldownPopup}>
          <p>You can't join the queue for the next {cooldownRemaining} seconds.</p>
          <p>Wait for the cooldown to finish.</p>
          <p>Time remaining: {cooldownRemaining} seconds</p>
        </div>
      )}
      {/* showWaitingforAccept popup */}
      {showWaitingforAccept && (
        <div className={styles.cooldownPopup}>
          <p>Waiting for opponent to accept {acceptCountdown} seconds.</p>
        </div>
      )}
      {/* OpponentNotAcceptPopup popup */}
      {showOpponentNotAcceptPopup && (
        <div className={styles.cooldownPopup}>
          <p>Matching Failed!!!</p>
          <button onClick={handleOpponentNotAccept}>Close</button>
        </div>
      )}
      {/* Start button */}
      <div className={styles.startButtonContainer}>
        <button
          className={styles.startButton}
          onClick={handleStartButtonClick} // Start button click handler
          disabled={!isStartButtonEnabled() || showCooldownPopup} // Disable the button based on rules
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
