import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"
import { apiRoot } from "../pages/Messages"

// Main component for handling anonymous chat functionality
export default function AnonymousChat(props) {
    // State to hold the details of the other user matched
    const [otherUser, setOtherUser] = useState(null)
    // State to store the anonymous chat ID
    const [anonId, setAnonId] = useState(null);
    // State to manage messages in the chat
    const [messages, setMessages] = useState([])
    // Variable to track if identities are revealed
    let revealed = false;

    // State to manage the reveal status of identities
    const [revealStatus, setRevealStatus] = useState(0)

    // Effect to fetch messages when the other user or anonId changes
    useEffect(() => {
        const fetchMessages = async () => {
            // Check if there's a matched user before fetching messages
            if (otherUser != null) {
                try {
                    // Fetch messages from the server
                    const response = await fetch(apiRoot + '/message/get?' + new URLSearchParams({
                        from_id: props.thisUser,
                        to_id: otherUser._id,
                        anon: anonId,
                    }).toString());
                    const data = await response.json();

                    // Update messages state if the fetch is successful
                    if (response.status == 200) {
                        setMessages(data.message_list);
                        // Check and update reveal status
                        if (revealStatus != data.reveal) {
                            setRevealStatus(data.reveal)
                            // If identities are revealed, call the callback and close the chat
                            if (data.reveal == 1) {
                                props.chatChangeCallback(otherUser._id)
                                props.close()
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchMessages();
        // Set an interval to fetch messages every second
        const interval = setInterval(fetchMessages, 1000);

        return () => clearInterval(interval);
    }, [otherUser, anonId, revealStatus]);

    // Effect to handle matchmaking with another user
    useEffect(() => {
        let matched = false
        const matchMake = async () => {
            try {
                // Make a POST request to matchmake with the server
                const response = await fetch(apiRoot + '/matchmake', {method: "POST"});
                // If matched successfully
                if (response.status == 200) {
                    let response_json = await response.json()
                    let other_user_id = response_json.to_id == props.thisUser ? response_json.from_id : response_json.to_id
                    matched = true

                    // Fetch the other user's data
                    const OtherUserData = await (await fetch(`${apiRoot}/user/${other_user_id}`)).json()
                    setOtherUser(OtherUserData) // Set the other user in state
                    setAnonId(response_json._id) // Set the anonymous ID
                } else if (response.status != 420) throw Error(`Code: ${response.status}`)
            } catch (error) {
                console.error('Error trying to match make:', error);
            }

            // If not matched, retry matchmaking after a second
            if (!matched) {
                setTimeout(matchMake, 1000)
            }
        }

        matchMake();
        return () => matched = true // Cleanup function
    }, []);

    // Function to send a message
    async function sendMessage() {
        let input = document.getElementById("input_field")
        let input_val = input.value // Get the input value
        input.value = "" // Clear the input field
        // If the input is not empty, send the message
        if (input_val != "") {
            fetch(apiRoot + '/message/create', {
                method: "POST",
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({
                    from_id: props.thisUser,
                    to_id: otherUser._id,
                    message: input_val,
                    timestamp: Date.now(),
                    anon: anonId
                })
            });
        }
    }

    // Function to propose revealing identities
    async function proposeReveal() {
        await fetch(`${apiRoot}/reveal/${anonId}`, { method: "POST" })
    }

    // Handle key down event for sending message on 'Enter'
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Function to render the anonymous modal
    function anonModal(state) {
        return (
            <div className="bg-stone-800 mb-4 text-center font-bold text-indigo-700 flex flex-col">
                {state == "dc" ?
                    <h1 className="text-indigo-400">The other person disconnected, you may close the window.</h1> :
                    <div>
                        <h1>Finding someone for you to talk to</h1>
                        <p className="font-normal text-black dark:text-white mb-4">Please be patient ^_^</p>
                    </div>
                }
                <div className="flex justify-center" role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-100 animate-spin dark:text-gray-200 fill-indigo-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    const thisUser = props.thisUser
    // Create message components using the utility function
    const messageElements = createMessageComponenets(messages, thisUser, "Anonymous", '/profile.png')

    // Determine what to display above the messages based on reveal status
    let topTextElement = <div className="mt-2 font-bold dark:text-white">Anonymous</div>
    if (otherUser != null) {
        if (revealStatus == otherUser._id) {
            topTextElement = <div className="font-bold dark:text-red-400 text-red-700">The other person has requested a reveal identities</div>
        } else if (revealStatus == props.thisUser) {
            topTextElement = <div className="font-bold dark:text-green-400 text-green-700">You have proposed a reveal of identities</div>
        }
    }

    return (
        <div className="relative z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background overlay for modal */}
            <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true"></div>
            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg dark:bg-stone-800">
                    {/* Header section of the modal */}
                    <div className="flex justify-between">
                        <div className="flex">
                            {/* Button to propose revealing identities */}
                            <button onClick={proposeReveal} className="font-bold px-3 py-2 mr-4 text-white bg-red-700 hover:bg-red-800 rounded-md">
                                Propose Reveal
                            </button>
                            {/* Display the top text based on current state */}
                            {topTextElement}
                        </div>
                        {/* Close button for the modal */}
                        <button onClick={props.close} className="text-black dark:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    {/* Messages section */}
                    <div className="flex flex-col h-96 overflow-y-auto px-2 py-4">
                        {otherUser ? messageElements : anonModal("waiting")}
                    </div>
                    {/* Input section for sending messages */}
                    <div className="flex mt-4">
                        <input
                            onKeyDown={handleKeyDown}
                            id="input_field"
                            type="text"
                            className="flex-1 px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage} className="px-4 py-2 ml-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md">Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
