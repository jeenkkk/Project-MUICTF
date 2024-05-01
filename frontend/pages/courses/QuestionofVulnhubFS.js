import React, { useState } from 'react';
import Navbar from '../NavbarFS';
import styles from './QuestionofVulnhub.module.css';

const Vulnhub = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const itemsPerPage = 16;
  const maxVisiblePages = 2;
  const maxButtons = maxVisiblePages * 2 + 1;

  const generateMockData = () => {
    const mockData = [];
    const difficultyLevels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Unknown'];

    for (let i = 1; i <= 20; i++) {
      const randomNumber = (Math.random() * difficultyLevels.length);
      const difficulty = difficultyLevels[randomNumber];

      const item = {
        Name: `Data ${i}`,
        Author: `Author ${i % 2 + 1}`,
        Series: `Series ${i % 2 + 1}`,
        Size: `${i} MB`,
        Difficulty: difficulty,
        Download_Link: `https://example.com/data${i}`,
      };

      item.searchable = `${item.Name} ${item.Author} ${item.Series} ${item.Size} ${item.Difficulty}`;

      mockData.push(item);
    }

    return mockData;
  };

  const data = generateMockData();

  const filteredData = selectedDifficulty === 'All' ? data : data.filter(item => item.Difficulty === selectedDifficulty);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    const addButtonsInRange = (start, end) => {
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            className={currentPage === i ? `${styles.activePage} paginationButton` : 'paginationButton'}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    };

    if (totalPages <= maxButtons) {
      addButtonsInRange(1, totalPages);
    } else {
      if (currentPage - maxVisiblePages > 1) {
        addButtonsInRange(1, 1);
        buttons.push(<span key="leftEllipsis">...</span>);
        addButtonsInRange(currentPage - maxVisiblePages, currentPage - 1);
      } else {
        addButtonsInRange(1, currentPage - 1);
      }

      buttons.push(
        <button key={currentPage} className={`${styles.activePage} paginationButton`} disabled>
          {currentPage}
        </button>
      );

      if (currentPage + maxVisiblePages < totalPages) {
        addButtonsInRange(currentPage + 1, currentPage + maxVisiblePages);
        buttons.push(<span key="rightEllipsis">...</span>);
        addButtonsInRange(totalPages, totalPages);
      } else {
        addButtonsInRange(currentPage + 1, totalPages);
      }
    }

    return buttons;
  };

  const renderGridItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const filteredItems = currentItems.filter((item) =>
      item.searchable.toLowerCase().includes(searchInput.toLowerCase())
    );

    return filteredItems.map((item, index) => (
      <div key={index} className={styles.gridItem}>
        <div>Name: {item.Name}</div>
        <div>Author: {item.Author}</div>
        <div>Series: {item.Series}</div>
        <div>Size: {item.Size}</div>
        <div>Difficulty: {item.Difficulty}</div>
        <div>
          <a href={item.Download_Link} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </div>
      </div>
    ));
  };

  const handleGridContainerClick = () => {
    // Redirect to VulnHub submission page when the grid container is clicked
    window.location.href = '/VulnhubSubmissionFS';
  };


  const difficultyOptions = ['All', 'Beginner', 'Easy', 'Medium', 'Hard', 'Unknown'];

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageStyle}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className={styles.difficultyFilter}>
            <span>Difficulty:</span>
            <select onChange={(e) => handleDifficultyChange(e.target.value)} value={selectedDifficulty}>
              {difficultyOptions.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className={styles.gridContainer} onClick={handleGridContainerClick}>
          {renderGridItems()}
        </div>
  
        <div className={styles.pagination}>
          <button className="paginationButton" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          {renderPaginationButtons()}
          <button className="paginationButton" onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );  
};

export default Vulnhub;
