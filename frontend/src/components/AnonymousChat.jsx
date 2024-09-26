import createMessageComponenets from "../util/util"

export default function AnonymousChat(props) {
    const thisUser = props.thisUser
    const messages = [
        {
            id: 2,
            author: "Me",
            timestamp: 1727180920,
            text: "Hey how are you?",

        },
        {
            id: 1,
            author: "Anonymous",
            timestamp: 1727180924,
            text: "Great amazing",
        },
        {
            id: 0,
            author: "Anonymous",
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
            author: "Anonymous",
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
            author: "Anonymous",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "Anonymous",
            timestamp: 1827190932,
            text: "lollllllaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
            id: 7,
            author: "Anonymous",
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
            author: "Anonymous",
            timestamp: 1827190932,
            text: "lollll",
        },
        {
            id: 7,
            author: "Me",
            timestamp: 1827190932,
            text: "lollll",
        }
    ]

    let otherUser = "Anonymous"

    const messageElements = createMessageComponenets(messages, thisUser)

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* For making background blur */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            {/* Buttons */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="w-3/5 relative transform rounded-lg bg-white text-left shadow-xl transition-all">
                        <div className="flex flex-col bg-gray-50 px-4 py-3 sm:flex sm:flex-col sm:px-6">
                            <div className="flex justify-between">
                                <div className="mr-16"></div>
                                <div className="font-bold">{otherUser}</div>
                                <div>
                                    <button type="button" className="mr-1 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Reveal</button>
                                    <button onClick={() => props.close()} type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">X</button>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <div className="flex flex-col-reverse space-y-1 mt-4 -mx-2 h-96 overflow-y-auto scrollbar-red">
                                    {messageElements.reverse()}
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
        </div>
    )
}
