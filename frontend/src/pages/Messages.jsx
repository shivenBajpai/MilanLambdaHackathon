import AnonymousChat from "../components/AnonymousChat"
import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"
import { Navigate } from "react-router-dom"
import MessageArea from "../components/MessageArea"

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
    const [contacts, setContacts] = useState([])

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
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          from_id: props.User_id, // TODO: Need logged in users info
          to_id: currentChat,
          message: input_val,
          timestamp: Date.now(),
          // anon: false
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
            let new_contacts_ids = (await response.json()).contacts;
            let new_contacts = [];
            
            for (const id of new_contacts_ids) {
              new_contacts.push(await (await fetch(`${apiRoot}/user/${id}`)).json())
            }
            
            setContacts(new_contacts);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          
        }
      };

      fetchContacts();

      return () => clearInterval(interval);
    }, []);

    let User_response = await fetch(`${apiRoot}/user/${props.User_id}`)
    User = await User_response.json()

    let other_user = {
      username: null,
      pfp: null
    };

    for (const contact of contacts) {
      if (contact._id == currentChat) {
        other_user = contact;
        // console.log(contact);
      }
    }

    const contactElements = contacts.map((contact) => {
      console.log(currentChat, contact._id)
      const style = currentChat==contact._id ? " dark:bg-zinc-700 bg-gray-100" : ""
        return (
            <button
                className={"flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2" + style} onClick={() => {changeCurrentChat(contact._id)}}
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

    // TODO: Pass other users ID as a prop
    return <div className="flex h-screen antialiased text-gray-900">
            {AnonymousChatOpen && <AnonymousChat thisUser={props.User_id} close={toggleAnonymousChatOpen}></AnonymousChat>}
            <div className="md:flex flex-row h-full w-full overflow-x-hidden">
              <div className="dark:bg-stone-800 dark:text-zinc-50 flex flex-col py-8 pl-6 pr-2 w-full md:w-64 h-full flex-shrink-0 -md:absolute left-0 top-0 z-10">
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
                      crossOrigin="anonymous"
                      src={User.pfp}
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
              <MessageArea sendMessage={sendMessage} handleKeyDown={handleKeyDown} User_id={props.User_id} other_user={other_user} currentChat={currentChat}/>
            </div>
          </div>
}