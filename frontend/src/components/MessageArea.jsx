import React, { useEffect, useState } from "react"; // Importing React and hooks
import createMessageComponents from "../util/util"; // Importing function to create message components
import { apiRoot } from "../pages/Messages"; // Importing API root for message-related endpoints

/**
 * MessageArea component displays the chat interface,
 * including messages and input for sending new messages.
 *
 * @param {Object} props - The component props.
 * @param {string} props.User_id - The ID of the current user.
 * @param {string} props.currentChat - The ID of the current chat.
 * @param {Object} props.other_user - Object containing the other user's details.
 * @param {function} props.handleKeyDown - Function to handle keydown events for input.
 * @param {function} props.sendMessage - Function to send a new message.
 */
export default function MessageArea(props) {
    // State to hold messages for the current chat
    const [messages, setMessages] = useState([]);
    // State to track the last chat ID
    const [lastChat, setLastChat] = useState(0);

    // Reset messages when the current chat changes
    if (lastChat !== props.currentChat) {
        setMessages([]); // Clear messages for new chat
        setLastChat(props.currentChat); // Update lastChat state
    }

    // Fetching messages
    useEffect(() => {
        const fetchMessages = async () => {
          if (props.currentChat == null) return;
          try {
            const response = await fetch(apiRoot + '/message/get?' + new URLSearchParams({
              from_id: props.User_id,
              to_id: props.currentChat,
              // anon: false,
              //timestamp: messages.length>0?null:messages[messages.length-1].timestamp //TODO: Optimize to use after condition, adjust to have from_id and to_id
            }).toString());
            const data = await response.json();
            if (response.status == 200) {
              setMessages(data.message_list);
            } else throw Error(`Code ${response.status}`)
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
            // Exit if there is no current chat
            if (props.currentChat == null) return;
            try {
                // Fetch messages from the API
                const response = await fetch(apiRoot + '/message/get?' + new URLSearchParams({
                    from_id: props.User_id,
                    to_id: props.currentChat,
                    // anon: false,
                    // timestamp: messages.length > 0 ? null : messages[messages.length - 1].timestamp // TODO: Optimize to use after condition
                }).toString());

                const data = await response.json();

                // Check if the response is successful
                if (response.status === 200) {
                    setMessages(data.message_list); // Update state with fetched messages
                } else {
                    throw Error(`Code ${response.status}`); // Handle unsuccessful response
                }
            } catch (error) {
                console.error('Error fetching messages:', error); // Log error to console
            }
        };

        fetchMessages(); // Initial fetch
        // Set up an interval to fetch messages periodically
        const interval = setInterval(fetchMessages, 500); // Fetch every 500ms

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [props.currentChat]); // Dependency on currentChat

    // Create message elements from the messages array
    const newMessageElements = createMessageComponents(messages, props.User_id, props.other_user.username, props.other_user.pfp);

    return (
        <div className="flex flex-col flex-auto h-full p-6 relative">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-200 dark:bg-stone-800 h-full p-4">
                {/* Message box */}
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                    <div className="flex flex-col-reverse overflow-y-auto h-full scrollbar-indigo">
                        <div className="grid grid-cols-12">
                            {props.currentChat != null && newMessageElements} {/* Render message elements */}
                        </div>
                    </div>
                </div>
                <div className="dark:bg-stone-800 dark:text-white flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                    <div className="flex-grow ml-4">
                        <div className="relative w-full">
                            <input
                                id="input_field"
                                type="text"
                                className="dark:bg-stone-800 dark:text-white flex w-full border dark:border-gray-600 rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                onKeyDown={props.handleKeyDown} // Handle key down event
                                disabled={props.currentChat == null} // Disable input if no chat is selected
                            />
                        </div>
                    </div>
                    <div className="ml-4">
                        <button
                            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl disabled:bg-gray-600 text-white px-4 py-1 flex-shrink-0"
                            onClick={props.sendMessage} // Call sendMessage function on click
                            disabled={props.currentChat == null} // Disable button if no chat is selected
                        >
                            <span>Send</span>
                            <span className="ml-2">
                                <svg
                                    className="w-4 h-4 transform rotate-45 -mt-px"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    ></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
