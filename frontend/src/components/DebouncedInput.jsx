import React, { useState, useEffect } from 'react';
import { apiRoot } from '../pages/Messages';

const DebouncedInput = (props) => {
  const [inputValue, setInputValue] = useState('');  // Current input value
  const [isTyping, setIsTyping] = useState(false);   // Tracks if user is typing
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (inputValue === '') return;

    setIsTyping(true);  // User is typing

    // Set a timeout for 500ms after the last keystroke
    const typingTimeout = setTimeout(() => {
      setIsTyping(false); // User has stopped typing
      console.log("User stopped typing, input:", inputValue);
      searchUser(inputValue)
    }, 500); // 500ms debounce time

    // Clear the timeout on cleanup (before running the next effect or unmounting)
    return () => clearTimeout(typingTimeout);

  }, [inputValue]);

  async function searchUser (input) {
    try {
      const response = await fetch(apiRoot + '/user/search/' + props.User_id + "?" + new URLSearchParams({
        input_field: input
      }).toString())
      const data = await response.json();
      if (response.status == 200) {
        setSearchResults(data)
        console.log(data)
      } else throw Error(`Code ${response.status}`)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const searchElements = searchResults.map((contact) => {
    return (
        <button
            className={"flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2" } onClick={() => {setSearchResults([]); props.changeCurrentChat(contact._id)}}
        >
            <img className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0" crossOrigin="anonymous" src={contact.pfp}></img>
            <div className="ml-2 text-sm font-semibold">{contact.username}</div>
            {/* Unread messages */}
            {/* <div
            className="flex items-center justify-center ml-auto text-xs text-white bg-indigo-500 h-4 w-4 rounded leading-none"
            >
            2
            </div> */}
        </button>
    )
  })

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search users"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="ml-4 mb-4 p-2 rounded-full dark:bg-transparent text:black dark:text-white border border-gray-400"
        />
      </div>
      {searchElements.length != 0 && (
      <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-20 overflow-y-auto scrollbar-indigo">
        {searchElements}
      </div>
      )}
    </>
  );
};

export default DebouncedInput;
