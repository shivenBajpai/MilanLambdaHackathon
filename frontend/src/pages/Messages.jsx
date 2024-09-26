import AnonymousChat from "../components/AnonymousChat"
import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"

const apiRoot = "https://66f59c6c436827ced974918d.mockapi.io/api"

export default function Messages() {
    const User = "Me"
    const [currentChat, changeCurrentChat] = React.useState(null)
    const [AnonymousChatOpen, toggleAnonymousChatOpen] = React.useState(false)

    function newRandomChat() {
      toggleAnonymousChatOpen(true)
    }

    function changeChat (user) {
      return
    }

    // Should be given as json ordered according to timestamp
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
      const fetchContacts = async () => {
        try {
          const response = await fetch(apiRoot + '/contacts');
          const data = await response.json();
          setContacts(data); // assuming the API returns an array of strings
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Fetch initially and then every 5 seconds (5000 ms)
      fetchContacts();
      const interval = setInterval(fetchContacts, 5000);
  
      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch(apiRoot + '/message');
          const data = await response.json();
          setMessages(data); // assuming the API returns an array of strings
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Fetch initially and then every 5 seconds (5000 ms)
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
  
      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }, []);

    const newMessageElements = createMessageComponenets(messages, User)

    const contactElements = contacts.map((contact) => {
        return (
            <button
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2" onClick={() => changeCurrentChat(contact.username)}
            >
                <img className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500 flex-shrink-0" src={contact.pfp}></img>
                <div className="ml-2 text-sm font-semibold">{contact.username}</div>
                {/* Unread messages */}
                {/* <div
                className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                >
                2
                </div> */}
            </button>
        )
    })

    return (
        <div className="flex h-screen antialiased text-gray-900">
            {AnonymousChatOpen && <AnonymousChat thisUser={User} close={toggleAnonymousChatOpen}></AnonymousChat>}
            <div className="flex flex-row h-full w-full overflow-x-hidden">
              <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                <div className="flex flex-row items-center justify-center h-12 w-full">
                  <div
                    className="flex items-center justify-center rounded-2xl text-red-700 bg-transparent h-10 w-10"
                  >
                    <img src="/logo.png"></img>
                  </div>
                  <div className="ml-2 font-bold text-2xl">IPHAC</div>
                </div>
                <div
                  className="flex flex-col items-center bg-gray-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
                >
                  <div className="h-20 w-20 rounded-full border overflow-hidden">
                    <img
                      src="/profile.png"
                      alt="Avatar"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="text-sm font-semibold mt-2">Username</div>
                  <div className="text-xs text-gray-500">Email</div>
                </div>
                <div className="flex flex-grow flex-col mt-8">
                  <div className="flex flex-row items-center justify-between text-xs">
                    <span className="font-bold">Active DM's</span>
                    {/* Number of active dms of the user */}
                    <span
                      className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
                      >{contacts.length}</span
                    >
                  </div>
                  {/* User profiles */}
                  <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-64 overflow-y-auto scrollbar-red">
                    {contactElements}
                  </div>
                  {/* Button to chat with random person */}
                  <button onClick={() => newRandomChat()} className="flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-4 font-bold flex-shrink-0 mt-4">
                        <span>Meet a stranger</span>
                    </button>
                </div>
              </div>
              <div className="flex flex-col flex-auto h-full p-6">
                <div
                  className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                >
                {/* Message box */}
                  <div className="flex flex-col h-full overflow-x-auto mb-4">
                    <div className="flex flex-col-reverse overflow-y-auto h-full scrollbar-red">
                      <div className="grid grid-cols-12">
                        {currentChat!=null && newMessageElements}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                  >
                    <div className="flex-grow ml-4">
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="flex w-full border rounded-xl focus:outline-none focus:border-red-300 pl-4 h-10"
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
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
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
            </div>

          </div>
    )

}
