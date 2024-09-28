import AnonymousChat from "../components/AnonymousChat"; // Importing the AnonymousChat component for random chatting
import React, { useEffect, useState } from "react"; // Importing React and necessary hooks
import { Navigate } from "react-router-dom"; // Importing Navigate for route redirection
import MessageArea from "../components/MessageArea"; // Importing the MessageArea component for chat functionality
import DebouncedInput from "../components/DebouncedInput"; // Importing DebouncedInput for chat search functionality

export const apiRoot = "/api"; // Defining the root API endpoint

/**
 * MessageWrapper component serves as a container for the messaging functionality.
 * It checks for user authentication and fetches contacts for messaging.
 *
 * @returns {JSX.Element} The rendered MessageWrapper component.
 */
export default async function MessageWrapper() {
    // Extracting User ID from cookies
    const User_id = document.cookie.split('; ').filter(row => row.startsWith('userid=')).map(c => c.split('=')[1])[0];

    // If User ID is not found, redirect to the login page
    if (User_id == undefined) return <Navigate to="/login" />;

    // Fetching messages and handling any errors
    const messageElement = await Messages({ User_id }).catch((err) => console.log(err));
    return <div>{messageElement}</div>;
}

/**
 * Messages component handles the messaging interface, including fetching contacts,
 * sending messages, and managing chat states.
 *
 * @param {Object} props - The properties passed from the parent component.
 * @returns {JSX.Element} The rendered Messages component.
 */
async function Messages(props) {
    const [currentChat, changeCurrentChat] = React.useState(null); // State for the currently selected chat
    const [AnonymousChatOpen, toggleAnonymousChatOpen] = React.useState(false); // State for controlling anonymous chat visibility
    const [contacts, setContacts] = useState([]); // State to hold user contacts

    let User = { contacts: [] }; // Placeholder for user information

    /**
     * Opens a new anonymous chat when invoked.
     */
    function newRandomChat() {
        toggleAnonymousChatOpen(true); // Set the state to open the anonymous chat
    }

    /**
     * Sends a message to the current chat when called.
     */
    async function sendMessage() {
        let input = document.getElementById("input_field"); // Get the input field by ID
        let input_val = input.value; // Extract the value from the input field
        input.value = ""; // Clear the input field

        // If input is not empty, send the message via a POST request
        if (input_val != "") {
            fetch(apiRoot + '/message/create', {
                method: "POST",
                headers: new Headers({ 'content-type': 'application/json' }),
                body: JSON.stringify({
                    from_id: props.User_id,
                    to_id: currentChat,
                    message: input_val,
                    timestamp: Date.now(),
                })
            });
        }
    }

    /**
     * Handles the Enter key press to send messages.
     *
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            sendMessage(); // Send the message when Enter is pressed
        }
    };

    // Fetching Contacts using useEffect hook
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                let response = await fetch(`${apiRoot}/user/${props.User_id}`); // Fetch user data
                if (response.status == 200) {
                    let new_contacts_ids = (await response.json()).contacts; // Extract contacts

                    // Manually Insert contact to make UI seem more responsive when moving from an anonymous chat to a DM.
                    if (currentChat != null && !(new_contacts_ids.includes(currentChat))) {
                      new_contacts_ids.push(currentChat)
                    }

                    let new_contacts = [];

                    // Fetch each contact's information
                    for (const id of new_contacts_ids) {
                        new_contacts.push(await (await fetch(`${apiRoot}/user/${id}`)).json());
                    }

                    setContacts(new_contacts); // Update state with the fetched contacts
                }
            } catch (error) {
                console.error('Error fetching data:', error); // Log any errors
            }
        };

        fetchContacts(); // Invoke fetchContacts

        // Cleanup function (not implemented in the original code)
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run only on mount

    let User_response = await fetch(`${apiRoot}/user/${props.User_id}`); // Fetch the user's data
    User = await User_response.json(); // Convert response to JSON

    // Find the contact object for the currently selected chat
    let other_user = { username: null, pfp: null };
    for (const contact of contacts) {
        if (contact._id == currentChat) {
            other_user = contact; // Set other_user to the current chat's contact
        }
    }

    function chatChangeCallback(user_id) {
      changeCurrentChat(user_id)
    }

    const contactElements = contacts.map((contact) => {
        const style = currentChat == contact._id ? " dark:bg-zinc-700 bg-gray-100" : ""; // Highlight current chat

        return (
            <button
                className={"flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2" + style}
                onClick={() => { changeCurrentChat(contact._id) }} // Change current chat on click
            >
                <img className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0" crossOrigin="anonymous" src={contact.pfp} 
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/profile.png";
                    }}/>
                <div className="ml-2 text-sm font-semibold">{contact.username}</div>
                {/* Unread messages (commented out) */}
                {/* <div
                className="flex items-center justify-center ml-auto text-xs text-white bg-indigo-500 h-4 w-4 rounded leading-none"
                >
                2
                </div> */}
            </button>
        );
    });

    return <div className="flex h-screen antialiased text-gray-900">
            {AnonymousChatOpen && <AnonymousChat thisUser={props.User_id} close={() => toggleAnonymousChatOpen(false)} chatChangeCallback={chatChangeCallback}></AnonymousChat>}
            <div className="md:flex flex-row h-full w-full overflow-x-hidden">
                {/* Sidebar for contacts */}
                <div className="dark:bg-stone-800 dark:text-zinc-50 flex flex-col py-8 pl-6 pr-2 w-full md:w-64 h-full flex-shrink-0 -md:absolute left-0 top-0 z-10">
                    <div className="flex flex-row items-center justify-center h-12 w-full">
                        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-transparent h-10 w-10">
                            <img src="/logo.svg" alt="Anonymia Logo" />
                        </div>
                        <div className="ml-2 font-bold text-2xl">Anonymia</div>
                    </div>

                    {/* User Profile Section */}
                    <div className="flex flex-col items-center bg-transparent mt-4 w-full py-6 px-4 rounded-lg">
                        <div className="h-20 w-20 rounded-full border overflow-hidden">
                            <img crossOrigin="anonymous" src={User.pfp} className="h-full w-full" 
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src="/profile.png";
                            }}/>
                        </div>
                        <div className="text-sm font-semibold mt-2">{User.username}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{User.email}</div>
                    </div>

                    <div className="flex flex-grow flex-col mt-8">
                        <DebouncedInput changeCurrentChat={changeCurrentChat} User_id={props.User_id} /> {/* Input for searching chats */}
                        <div className="flex flex-row items-center justify-between text-xs">
                            <span className="font-bold">Active DM's</span>
                            {/* Display the number of active direct messages */}
                            <span className="flex items-center justify-center dark:bg-stone-800 bg-gray-300 h-4 w-4 rounded-full">
                                {contacts.length}
                            </span>
                        </div>

                        {/* List of contacts */}
                        <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-32 overflow-y-auto scrollbar-indigo">
                            {contactElements} {/* Render contact buttons */}
                        </div>

                        {/* Button to start a random chat */}
                        <button onClick={() => newRandomChat()} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-4 font-bold flex-shrink-0 mt-4">
                            <span>Meet a stranger</span>
                        </button>
                    </div>
                </div>

                {/* Message area for the current chat */}
                <MessageArea sendMessage={sendMessage} handleKeyDown={handleKeyDown} User_id={props.User_id} other_user={other_user} currentChat={currentChat} />
            </div>
        </div>
}
