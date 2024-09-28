import React, { useEffect, useState } from "react"
import createMessageComponenets from "../util/util"
import { apiRoot } from "../pages/Messages";

export default function MessageArea(props) {

    const [messages, setMessages] = useState([])
    const [lastChat, setLastChat] = useState(0)

    if (lastChat !== props.currentChat) {
        setMessages([]);
        setLastChat(props.currentChat);
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
              // TODO: Anon conversatio   ns list
            } else throw Error(`Code ${response.status}`)
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
  
        fetchMessages();
        const interval = setInterval(fetchMessages, 500);
  
        return () => clearInterval(interval);
      }, [props.currentChat]);

    const newMessageElements = createMessageComponenets(messages, props.User_id, props.other_user.username, props.other_user.pfp)

    return <div className="flex flex-col flex-auto h-full p-6 relative">
    <div
      className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-200 dark:bg-stone-800 h-full p-4"
    >
    {/* Message box */}
      <div className="flex flex-col h-full overflow-x-auto mb-4">
        <div className="flex flex-col-reverse overflow-y-auto h-full scrollbar-indigo">
          <div className="grid grid-cols-12">
            {props.currentChat!=null && newMessageElements}
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
              onKeyDown={props.handleKeyDown}
              disabled={props.currentChat == null?true:false}
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
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl disabled:bg-gray-600 text-white px-4 py-1 flex-shrink-0" 
            onClick={props.sendMessage}
            disabled={props.currentChat == null?true:false}
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
}