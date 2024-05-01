import React from 'react';
import Navbar from './Navbar';
import styles from './Submission.module.css';

const Submission = () => {
  return (
    <div className={styles.pageContainer}>
    <div className={styles.container}>
      <Navbar />
      <div className={styles.submissionContent}>
        {/* Content of Submission goes here */}
      </div>
      <div className={styles.flagSubmissionBox}>
        {/* Content of Flag Submission Box */}
      </div>
    </div>
    </div>
  );
};

export default Submission;
