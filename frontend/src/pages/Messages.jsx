
export default function Messages() {

    const User = "Me";

    const DtFormat = Intl.DateTimeFormat(undefined, {
        hour12: true,
        timeStyle: "short"
    })

    // Should be given as json ordered according to timestamp
    let messages = [
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
        }
    ];

    let messageGroups = [[]] // List of lists of indices in messages that should all be in one group
    let last_message = messages[0].author

    for (const [idx, message] of messages.entries()) {
        if (message.author == last_message) {
            messageGroups[messageGroups.length-1].push(idx);
        }
        else {
            messageGroups.push([idx]);
            last_message = message.author
        }
    }

    const messageElements = messageGroups.map((messageGroup) => {
        if (messages[messageGroup[0]].author == User) {
            return <div className="m-2 flex justify-end flex-col ml-auto">
                {
                    messageGroup.map((index) => 
                        <p className="mr-5 mb-1 p-2 rounded-md text-left content-end font-normal text-md max-w-96 break-words bg-red-300">{messages[index].author!=User && <div><span className="text-red-600 font-bold">{messages[index].author+":"}</span><br></br></div>}{messages[index].text}</p>
                    )
                }
                <p className="ml-auto mr-5">{DtFormat.format(messages[messageGroup[messageGroup.length-1]].timestamp)}</p>
            </div>;
        }
        else {
            return <div className="m-2 flex justify-begin">
                <img className="w-10 h-10 mr-2" src="/profile.png"></img>
                <div className="m-2 flex justify-begin flex-col">
                    {
                        messageGroup.map((index, i) => 
                            <p className="mr-5 mb-1 p-2 rounded-md text-left font-normal text-md max-w-96 break-words bg-gray-300">{i==0 && <><span className="text-red-600 font-bold">{messages[index].author+":"}</span><br></br></>}{messages[index].text}</p>
                        )
                    }
                    <p>{DtFormat.format(messages[messageGroup[messageGroup.length-1]].timestamp)}</p>
                </div>
            </div>;
        } 
    })

    const old_messageElements = messages.map((message) => {
        return (
            <div className={"m-2 flex" + (message.author == User ? " justify-end" : " justify-begin")}>
                {message.author != User && <img className="w-10 h-10 mr-2" src="/profile.png"></img>}
                <p className={"mr-5 mt-1 mb-1 p-2 rounded-md text-left font-normal text-md max-w-96 break-words" + (message.author == User ? " bg-red-300" : " bg-gray-300")}>{message.author!=User && <div><span className="text-red-600 font-bold">{message.author+":"}</span><br></br></div>}{message.text}</p>
            </div>
        )
    })

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-nowrap flex-grow justify-center h-fit">
                <div id="contacts_list" className="basis-1/4 bg-gray-200 border-black border-r-2"></div>
                <div id="message_area" className="flex-grow flex flex-col mt-auto">
                    <div className="flex-grow flex flex-col">
                        {messageElements}
                    </div>
                    <div className="flex mt-2 mb-2">
                        <input placeholder="Message" type="text" required className="p-1 mr-6 ml-6 block h-14 w-full rounded-md border-2 py-1.5 text-black-900 shadow-lg ring-1 ring-inset ring-black-900 placeholder:text-black-400 focus:ring-2 focus:ring-inset focus:ring-red-300 sm:text-xl sm:leading-6"></input>
                        <button className="rounded-full bg-transparent hover:text-red-700 hover:scale-125 text-red-300 ml-0 w-10 h-10 mr-10 text-5xl">➤</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
