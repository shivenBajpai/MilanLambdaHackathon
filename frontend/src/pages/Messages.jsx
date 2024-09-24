import TopNav from "../components/topnav"

export default function Messages() {

    const User = "Me";

    const messages = [
        {
            id: 1,
            author: "user1",
            timestamp: 1727180920,
            text: "Hey how are you?"
        },
        {
            id: 2,
            author: "Me",
            timestamp: 1727180924,
            text: "Great! What about you? aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        },
        {
            id: 3,
            author: "Me",
            timestamp: 1727180925,
            text: "Im eating Idlis?"
        }
    ];

    let messageGroups = [[]]
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
            return <div className="m-2 flex justify-end flex-col">
                {
                    messageGroup.map((index) => <p className="m-1 ml-auto p-2 rounded-lg inline-block bg-blue-400 text-right max-w-96 break-words">{messages[index].author}: {messages[index].text}</p>)
                }
            </div>;
        }
        else {
            return <div className="m-2 flex justify-begin flex-col">
                {
                    messageGroup.map((index) => <p className="p-2 mr-auto rounded-lg inline bg-gray-400 text-left max-w-lg break-words">{messages[index].author}: {messages[index].text}</p>)
                }
            </div>;
        } 
    })

    return <>
        <TopNav></TopNav>
        <div className="bg-slate-700 h-screen w-screen flex flex-nowrap flex-row">
            <div id="contacts_list" className="basis-1/4 border-r-black border-r-2 flex-shrink-0"></div>
            <div id="message_area" className="flex-grow h-screen flex flex-col">
                {messageElements}
            </div>
        </div>
    </>
}