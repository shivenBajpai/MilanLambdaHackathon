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
            text: "Great! What about you?"
        }
    ];

    const messageGroups = [[]]
    let last_message = messages[0].author
    
    for (const [idx, message] in messages.entries()) {
        if (message.author == last_message) messageGroups[-1].push(idx);
        else {
            messageGroups.push([idx]);
            last_message = message.author
        }
    }

    const messageElements = messages.map((message) => {
        if (message.author == User) return <div className="m-2 flex justify-end"><p className="p-2 rounded-lg inline-block bg-blue-400 text-right">{message.author}: {message.text}</p></div>;
        else return <div className="m-2 flex justify-begin"><p className="p-2 rounded-lg inline-block bg-gray-400 text-right">{message.author}: {message.text}</p></div>
    })

    return <>
        <TopNav></TopNav>
        <div className="bg-slate-700 h-screen w-screen flex flex-nowrap flex-row">
            <div id="contacts_list" className="basis-1/4 border-r-black border-r-2"></div>
            <div id="message_area" className="grow h-screen flex flex-col">
                {messageElements}
            </div>
        </div>
    </>
}