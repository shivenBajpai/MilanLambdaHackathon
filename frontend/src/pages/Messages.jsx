import AnonymousChat from "../components/AnonymousChat"
import React from "react"
import craeteMessageComponents from "../util/util"
import createMessageComponenets from "../util/util"

export default function Messages() {

    const User = "Me"
    let activeDMS = 1

    // Should be given as json ordered according to timestamp
    const contacts = [
        {   id: 2,
            username: "Shivaram"
        },
        {   id: 3,
            username: "Aric"
        },
        {   id: 2,
            username: "Shivaram"
        },
        {   id: 3,
            username: "Aric"
        },
        {   id: 2,
            username: "Shivaram"
        },
        {   id: 3,
            username: "Aric"
        },
    ]

    const messages = [
        {
            id: 2,
            author: "Me",
            timestamp: 1727180920,
            text: "Hey how are you?",

        },
        {
            id: 1,
            author: "user1",
            timestamp: 1727180924,
            text: "Great amazing",
        },
        {
            id: 0,
            author: "user1",
            timestamp: 1727180924,
            text: "Boohoo",
        },
        {
            id: 3,
            author: "Me",
            timestamp: 1727180925,
            text: "who r u? oh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 4,
            author: "Me",
            timestamp: 1827190928,
            text: "Tommy",
        },
        {
            id: 4,
            author: "user2",
            timestamp: 1827190929,
            text: "lollllll",
        },
        {
            id: 3,
            author: "Me",
            timestamp: 1827190930,
            text: "lollllll",
        },
        {
            id: 3,
            author: "Me",
            timestamp: 1827190931,
            text: "lollllll",
        },
        {
            id: 7,
            author: "user7",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "user7",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "user7",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "Me",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "Me",
            timestamp: 1827190932,
            text: "lollll",
        },
        {
            id: 7,
            author: "Me",
            timestamp: 1827190932,
            text: "lollll",
        },
        {
            id: 7,
            author: "user8",
            timestamp: 1827190932,
            text: "lollll",
        },
        {
            id: 7,
            author: "Me",
            timestamp: 1827190932,
            text: "lollll",
        }
    ];

    // let messageGroups = [[]] // List of lists of indices in messages that should all be in one group
    // let last_message = messages[0].author

    // for (const [idx, message] of messages.entries()) {
    //     if (message.author == last_message) {
    //         messageGroups[messageGroups.length-1].push(idx);
    //     }
    //     else {
    //         messageGroups.push([idx]);
    //         last_message = message.author
    //     }
    // }

    // const messageElements = messageGroups.map((messageGroup) => {
    //     if (messages[messageGroup[0]].author == User) {
    //         return (
    //             <div className="m-2 flex justify-end flex-col ml-auto">
    //                 {
    //                     messageGroup.map((index) =>
    //                         <p className="mr-5 mb-1 p-2 rounded-md text-left content-end font-normal text-md max-w-96 break-words bg-red-300">{messages[index].author!=User && <div><span className="text-red-600 font-bold">{messages[index].author+":"}</span><br></br></div>}{messages[index].text}</p>
    //                     )
    //                 }
    //                 <p className="ml-auto mr-5">{DtFormat.format(messages[messageGroup[messageGroup.length-1]].timestamp)}</p>
    //             </div>
    //         )
    //     }
    //     else {
    //         return (
    //             <div className="m-2 flex justify-begin">
    //                 <img className="w-10 h-10 mr-2" src="/profile.png"></img>
    //                 <div className="m-2 flex justify-begin flex-col">
    //                     {
    //                         messageGroup.map((index, i) =>
    //                             <p className="mr-5 mb-1 p-2 rounded-md text-left font-normal text-md max-w-96 break-words bg-gray-300">{i==0 && <><span className="text-red-600 font-bold">{messages[index].author+":"}</span><br></br></>}{messages[index].text}</p>
    //                         )
    //                     }
    //                     <p>{DtFormat.format(messages[messageGroup[messageGroup.length-1]].timestamp)}</p>
    //                 </div>
    //             </div>
    //         )
    //     }
    // })

    const newMessageElements = createMessageComponenets(messages)

    const contactElements = contacts.map((contact) => {
        return (
            <button
                class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
                <img className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500 flex-shrink-0" src="/profile.png"></img>
                <div class="ml-2 text-sm font-semibold">{contact.username}</div>
                {/* Unread messages */}
                {/* <div
                class="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                >
                2
                </div> */}
            </button>
        )
    })

    function newRandomChat() {
        toggleAnonymousChatOpen(true)
    }

    const [AnonymousChatOpen, toggleAnonymousChatOpen] = React.useState(false)

    return (
        <div class="flex h-screen antialiased text-gray-900">
            {AnonymousChatOpen && <AnonymousChat close={toggleAnonymousChatOpen}></AnonymousChat>}
            <div class="flex flex-row h-full w-full overflow-x-hidden">
              <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                <div class="flex flex-row items-center justify-center h-12 w-full">
                  <div
                    class="flex items-center justify-center rounded-2xl text-red-700 bg-transparent h-10 w-10"
                  >
                    <img src="/logo.png"></img>
                  </div>
                  <div class="ml-2 font-bold text-2xl">IPHAC</div>
                </div>
                <div
                  class="flex flex-col items-center bg-gray-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
                >
                  <div class="h-20 w-20 rounded-full border overflow-hidden">
                    <img
                      src="/profile.png"
                      alt="Avatar"
                      class="h-full w-full"
                    />
                  </div>
                  <div class="text-sm font-semibold mt-2">Username</div>
                  <div class="text-xs text-gray-500">Email</div>
                </div>
                <div class="flex flex-col mt-8">
                  <div class="flex flex-row items-center justify-between text-xs">
                    <span class="font-bold">Active DM's</span>
                    {/* Number of active dms of the user */}
                    <span
                      class="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
                      >{contacts.length}</span
                    >
                  </div>
                  {/* User profiles */}
                  <div class="flex flex-col space-y-1 mt-4 -mx-2 h-64 overflow-y-auto scrollbar-red">
                    {contactElements}
                  </div>
                  {/* Button to chat with random person */}
                  <button onClick={() => newRandomChat()} class="flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-4 font-bold flex-shrink-0 mt-4">
                        <span>Meet a stranger</span>
                    </button>
                </div>
              </div>
              <div class="flex flex-col flex-auto h-full p-6">
                <div
                  class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                >
                {/* Message box */}
                  <div class="flex flex-col h-full overflow-x-auto mb-4">
                    <div class="flex flex-col-reverse overflow-y-auto h-full scrollbar-red">
                      <div class="grid grid-cols-12">
                        {newMessageElements}
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                  >
                    <div class="flex-grow ml-4">
                      <div class="relative w-full">
                        <input
                          type="text"
                          class="flex w-full border rounded-xl focus:outline-none focus:border-red-300 pl-4 h-10"
                        />
                        <button
                          class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="ml-4">
                      <button
                        class="flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                      >
                        <span>Send</span>
                        <span class="ml-2">
                          <svg
                            class="w-4 h-4 transform rotate-45 -mt-px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
