
import React, { useState } from 'react';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]); 

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    setSuggestions(generateSuggestions(value));
  };

  const generateSuggestions = (value) => {
   
    const suggestions = [
      
    ];

    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="SearchInput" style={{ marginTop: '20px' }}>
      <div className="container">
        <div className="InputContainer">
          <input
            type="text"
            placeholder="Search Vulnhub..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul className="Suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
