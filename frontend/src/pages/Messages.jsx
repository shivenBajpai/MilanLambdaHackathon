import AnonymousChat from "../components/AnonymousChat"
import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"
import { Navigate } from "react-router-dom"

export const apiRoot = "/api"

export default async function MessageWrapper() {
    const User_id = document.cookie.split('; ').filter(row => row.startsWith('userid=')).map(c=>c.split('=')[1])[0]
    
    if (User_id == undefined) return <Navigate to="/login" />
    
    const messageElement = await Messages({User_id}).catch((err) => console.log(err));
    return <div>{messageElement}</div>
}

async function Messages(props) {

    const [currentChat, changeCurrentChat] = React.useState(null)
    const [AnonymousChatOpen, toggleAnonymousChatOpen] = React.useState(false)
    // Should be given as json ordeindigo according to timestamp
    const [messages, setMessages] = useState([])
    const [contacts, setContacts] = useState([])

    let other_user = null
    let other_user_pfp = null

    let User = {
      contacts: []
    };
    // let User = {
    //   username: "Tom",
    //   email: "Jery"
    // }

    function newRandomChat() {
      toggleAnonymousChatOpen(true)
    }

    async function sendMessage() {
      let input = document.getElementById("input_field")
      let input_val = input.value
      input.value = ""
      if (input_val != "") fetch(apiRoot + '/message/create', {
        method:"POST",
        body: JSON.stringify({
          from_id: props.User_id, // TODO: Need logged in users info
          to_id: currentChat,
          message: input_val,
          timestamp: Date.now(),
          anon: false
        })
      })
    }

    function handleKeyDown(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    // Fetching Contacts
    useEffect(() => {
      const fetchContacts = async () => {
        try {
          let response = await fetch(`${apiRoot}/user/${props.User_id}`)
          if (response.status == 200) {
            let new_contacts = (await response.json()).contacts;
            if (User.contacts.length != new_contacts.length) setContacts(new_contacts);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          
        }
      };

      fetchContacts();
      const interval = setInterval(fetchContacts, 5000);

      return () => clearInterval(interval);
    }, []);

    // Fetching messages
    useEffect(() => {
      const fetchMessages = async () => {
        if (currentChat == null) return;
        try {
          const response = await fetch(apiRoot + '/message/get?' + new URLSearchParams({
            from_id: props.User_id,
            to_id: currentChat,
            anon: false,
            //timestamp: messages.length>0?null:messages[messages.length-1].timestamp //TODO: Optimize to use after condition, adjust to have from_id and to_id
          }).toString());
          const data = await response.json();
          if (response.status == 200) {
            setMessages(data.messages);
            // TODO: Anon conversations list
          } else throw Error(`Code ${response.status}`)
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 1000);

      return () => clearInterval(interval);
    }, []);

    let User_response = await fetch(`${apiRoot}/user/${props.User_id}`)
    User = await User_response.json()

    const newMessageElements = createMessageComponenets(messages, props.User_id, other_user, other_user_pfp)

    const contactElements = contacts.map((contact) => {
        return (
            <button
                className="flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2" onClick={() => {changeCurrentChat(contact.id); setMessages([])}}
            >
                <img className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0" src={contact.pfp}></img>
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

    // TODO: Pass other users ID as a prop
    return <div className="flex h-screen antialiased text-gray-900">
            {AnonymousChatOpen && <AnonymousChat thisUser={props.User_id} close={toggleAnonymousChatOpen} otherUser={""}></AnonymousChat>}
            <div className="flex flex-row h-full w-full overflow-x-hidden">
              <div className="dark:bg-stone-800 dark:text-zinc-50 flex flex-col py-8 pl-6 pr-2 w-64 bg-transparent flex-shrink-0">
                <div className="flex flex-row items-center justify-center h-12 w-full">
                  <div
                    className="flex items-center justify-center rounded-2xl text-indigo-700 bg-transparent h-10 w-10"
                  >
                    <img src="/logo.png"></img>
                  </div>
                  <div className="ml-2 font-bold text-2xl">IPHAC</div>
                </div>
                <div
                  className="flex flex-col items-center bg-transparent mt-4 w-full py-6 px-4 rounded-lg"
                >
                  <div className="h-20 w-20 rounded-full border overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Avatar"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="text-sm font-semibold mt-2">{User.username}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{User.email}</div>
                </div>
                <div className="flex flex-grow flex-col mt-8">
                  <div className="flex flex-row items-center justify-between text-xs">
                    <span className="font-bold">Active DM's</span>
                    {/* Number of active dms of the user */}
                    <span
                      className="flex items-center justify-center dark:bg-stone-800 bg-gray-300 h-4 w-4 rounded-full"
                      >{contacts.length}</span
                    >
                  </div>
                  {/* User profiles */}
                  <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-64 overflow-y-auto scrollbar-indigo">
                    {contactElements}
                  </div>
                  {/* Button to chat with random person */}
                  <button onClick={() => newRandomChat()} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-4 font-bold flex-shrink-0 mt-4">
                        <span>Meet a stranger</span>
                    </button>
                </div>
              </div>
              <div className="flex flex-col flex-auto h-full p-6">
                <div
                  className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-200 dark:bg-stone-800 h-full p-4"
                >
                {/* Message box */}
                  <div className="flex flex-col h-full overflow-x-auto mb-4">
                    <div className="flex flex-col-reverse overflow-y-auto h-full scrollbar-indigo">
                      <div className="grid grid-cols-12">
                        {currentChat!=null && newMessageElements}
                      </div>
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
                          className="dark:bg-stone-800 dark:text-white flex w-full border dark:border-gray-600 rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                          onKeyDown={handleKeyDown}
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
                        className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0" onClick={sendMessage}
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
}