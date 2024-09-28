import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { apiRoot } from '../pages/Messages'; // Importing API root for user search

/**
 * DebouncedInput component allows users to search for other users
 * with a debounce effect, providing a smoother user experience.
 *
 * @param {Object} props - The component props.
 * @param {string} props.User_id - The ID of the current user.
 * @param {function} props.changeCurrentChat - Function to change the current chat.
 */
const DebouncedInput = (props) => {
  // State to hold the current input value
  const [inputValue, setInputValue] = useState('');
  // State to track if the user is typing
  const [isTyping, setIsTyping] = useState(false);
  // State to hold the search results
  const [searchResults, setSearchResults] = useState([]);

  // Effect to handle the typing debouncing
  useEffect(() => {
    // If input is empty, exit early
    if (inputValue === '') return;

    // User is typing
    setIsTyping(true);

    // Set a timeout for 500ms after the last keystroke
    const typingTimeout = setTimeout(() => {
      // User has stopped typing
      setIsTyping(false);
      console.log("User stopped typing, input:", inputValue);
      // Trigger user search
      searchUser(inputValue);
    }, 500); // 500ms debounce time

    // Clear the timeout on cleanup (before running the next effect or unmounting)
    return () => clearTimeout(typingTimeout);

  }, [inputValue]); // Dependency array includes inputValue

  /**
   * Function to search for users based on the input value.
   *
   * @param {string} input - The input value for searching users.
   */
  async function searchUser(input) {
    try {
      // Fetch search results from the API
      const response = await fetch(apiRoot + '/user/search/' + props.User_id + "?" + new URLSearchParams({
        input_field: input
      }).toString());

      // Parse response data
      const data = await response.json();
      // Check if the response is successful
      if (response.status === 200) {
        setSearchResults(data); // Update search results state
        console.log(data);
      } else {
        throw Error(`Code ${response.status}`); // Handle unsuccessful response
      }
    } catch (error) {
      console.error('Error fetching users:', error); // Log error to console
    }
  };

  // Map through search results to create search elements
  const searchElements = searchResults.map((contact) => {
    return (
        <button
            className={"flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2"}
            onClick={() => {
                setSearchResults([]); // Clear search results
                props.changeCurrentChat(contact._id); // Change the current chat to the selected contact
            }}
            key={contact._id} // Added key for each contact button
        >
            <img className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0" crossOrigin="anonymous" src={contact.pfp} alt={`${contact.username}'s profile`} />
            <div className="ml-2 text-sm font-semibold">{contact.username}</div>
            {/* Unread messages */}
            {/* <div
            className="flex items-center justify-center ml-auto text-xs text-white bg-indigo-500 h-4 w-4 rounded leading-none"
            >
            2
            </div> */}
        </button>
    )
  });

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search users"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value on change
          className="ml-4 mb-4 p-2 rounded-full dark:bg-transparent text:black dark:text-white border border-gray-400"
        />
      </div>
      {searchElements.length !== 0 && (
      <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-20 overflow-y-auto scrollbar-indigo">
        {searchElements} {/* Render search elements */}
      </div>
      )}
    </>
  );
};

export default DebouncedInput;
