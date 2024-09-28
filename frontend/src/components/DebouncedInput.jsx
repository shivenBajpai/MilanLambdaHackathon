import React, { useState, useEffect } from 'react';

const DebouncedInput = (props) => {
  const [inputValue, setInputValue] = useState('');  // Current input value
  const [isTyping, setIsTyping] = useState(false);   // Tracks if user is typing

  useEffect(() => {
    if (inputValue === '') return;

    setIsTyping(true);  // User is typing

    // Set a timeout for 500ms after the last keystroke
    const typingTimeout = setTimeout(() => {
      setIsTyping(false); // User has stopped typing
      console.log("User stopped typing, input:", inputValue);
      props.searchUser(inputValue)
    }, 500); // 500ms debounce time

    // Clear the timeout on cleanup (before running the next effect or unmounting)
    return () => clearTimeout(typingTimeout);

  }, [inputValue]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="ml-4 mb-2 dark:bg-transparent text:black dark:text-white border border-white"
      />
    </div>
  );
};

export default DebouncedInput;
