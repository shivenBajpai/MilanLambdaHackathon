import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"
import { apiRoot } from "../pages/Messages"

export default function AnonymousChat(props) {
    // As soon as meet a stranger button is clicked we send a post request to server
    // and add the thisUser's id to the meeting list, if it's already not there

    // Using the same layout for both disconnected and finding person modal, just change fucntion
    // parameters ("dc" for disconnected modal and leave if empty for normal one)
    
    const [otherUser, setOtherUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [dcStatus, setDcStatus] = useState(false)

    let revealed = false;
    
    // Fetching messages
    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await fetch(apiRoot + '/message/get?'  + new URLSearchParams({
                from_id: props.thisUser,
                to_id: otherUser,
                anon: true,
                //timestamp: messages.length>0?null:messages[messages.length-1].timestamp //TODO: Optimize to use after condition, adjust to have from_id and to_id
              }).toString());
            const data = await response.json();
            if (response.status == 200) setMessages(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchMessages();
        const interval = setInterval(fetchMessages, 1000);
    
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let matched = false
        const matchMake = async () => {
            try {

                const response = await fetch(apiRoot + '/matchmake');
                const id = await response.json().userid;
                if (response.status == 200) {
                    let response = await fetch(`${apiRoot}/user/${id}`)
                    const otherUser = await response.json()
                }
                else throw err(`Code: ${response.status}`)
            } catch (error) {

                console.error('Error trying to match make:', error);
            }
        }
        
        matchMake();
        if (!matched) return () => clearInterval(setInterval(matchMake, 1000));
    }, []);

    async function sendMessage() {
        let input = document.getElementById("input_field")
        let input_val = input.value
        input.value = ""
        if (input_val != "") fetch(apiRoot + '/message/create', {
            method:"POST",
            body: JSON.stringify({
            from_id: thisUser, // TODO: Need logged in users info
            to_id: otherUser,
            message: input_val,
            timestamp: Date.now(),
            anon: true
        })
    })}

    async function proposeReveal() {
        
    }

    async function disconnect() {
        setDcStatus(false);
    }

    function handleKeyDown(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }};

    function anonModal(state) {
        return <div className="mb-4 text-center font-bold text-indigo-700 flex flex-col">
            {state == "dc" ? <h1 className="text-indigo-400">The other person disconnected, you may close the window.</h1> : <div><h1>Finding someone for you to talk to</h1><p className="font-normal text-black mb-4">Please be patient ^_^</p></div>}
            <div className="flex justify-center"role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-100 animate-spin dark:text-gray-200 fill-indigo-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    }

    const thisUser = props.thisUser
    const messageElements = createMessageComponenets(messages, thisUser, revealed?otherUser:"Anonymous", '/profile.png')

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* For making background blur */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            {/* Buttons */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="w-3/5 relative transform rounded-lg bg-white text-left shadow-xl transition-all">
                        <div className="dark:bg-stone-800 dark:text-white flex flex-col bg-gray-50 px-4 py-3 sm:flex sm:flex-col sm:px-6">
                            <div className="flex justify-between">
                                <div className="mr-16"></div>
                                <div className="font-bold">{revealed?otherUser:"Anonymous"}</div>
                                <div>
                                    <button onClick={proposeReveal} type="button" className="dark:bg-stone-800 dark:text-white mr-1 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Reveal</button>
                                    <button onClick={async () => {props.close();await disconnect()}} type="button" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto">X</button>
                                </div>
                            </div>
                            {otherUser ? (
                                <div>
                                    <div className="px-6 pb-4">
                                        <div className="flex flex-col-reverse space-y-1 mt-4 -mx-2 h-96 overflow-y-auto scrollbar-indigo">
                                            {messageElements.reverse()}
                                        </div>
                                    </div>
                                    <div
                                        className="dark:bg-stone-800 dark:text-white flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                                    >
                                        <div className="flex-grow ml-4">
                                        <div className="relative w-full">
                                            <input
                                            id="input_field"
                                            type="text"
                                            onKeyDown={handleKeyDown}
                                            className="dark:bg-stone-800 dark:text-white flex w-full border border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                            />
                                            {/* THIS WAS THE EMOJI ICON <button
                                            className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                                            >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            </button> */}
                                        </div>
                                        </div>
                                        <div className="ml-4">
                                        <button
                                            onClick={sendMessage}
                                            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
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
                            ) : (anonModal(dcStatus))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
