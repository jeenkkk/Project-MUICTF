// SelectDifficulty.js
import React from 'react';
import style from './SelectDifficulty.module.css';

const SelectDifficulty = ({ selectedDifficulty, handleCheckboxChange }) => {
  const handleCheckboxChangeInternal = (difficulty) => {
    if (selectedDifficulty === difficulty) {
      // If the same checkbox is clicked again, uncheck it
      handleCheckboxChange(null);
    } else {
      // Otherwise, check the clicked checkbox
      handleCheckboxChange(difficulty);
    }
  };

  return (
    <div className={style.selectDifficulty}>
      <label>Select Difficulty:</label>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="Beginner"
          checked={selectedDifficulty === 'Beginner'}
          onChange={() => handleCheckboxChangeInternal('Beginner')}
        />
        Beginner
      </label>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="Easy"
          checked={selectedDifficulty === 'Easy'}
          onChange={() => handleCheckboxChangeInternal('Easy')}
        />
        Easy
      </label>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="Medium"
          checked={selectedDifficulty === 'Medium'}
          onChange={() => handleCheckboxChangeInternal('Medium')}
        />
        Medium
      </label>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="Hard"
          checked={selectedDifficulty === 'Hard'}
          onChange={() => handleCheckboxChangeInternal('Hard')}
        />
        Hard
      </label>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="Unknown"
          checked={selectedDifficulty === 'Unknown'}
          onChange={() => handleCheckboxChangeInternal('Unknown')}
        />
        Unknown
      </label>
    </div>
  );
};

export default SelectDifficulty;
