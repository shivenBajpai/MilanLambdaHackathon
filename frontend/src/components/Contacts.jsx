import { useState, useEffect } from "react";
import { apiRoot } from "../pages/Messages";

export default function Contacts(props) {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`${apiRoot}/user/${props.User_id}`);
                if (response.status === 200) {
                    const newContactsIds = (await response.json()).contacts;
                    const newContacts = await Promise.all(
                        newContactsIds.map(id => fetch(`${apiRoot}/user/${id}`).then(res => res.json()))
                    );

                    setContacts(newContacts);
                    props.getOtherUser(newContacts); // Update other user after fetching contacts
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchContacts();
    }, [props.User_id]); // Dependency array to run effect only when User_id changes

    const contactElements = contacts.map((contact) => {
        const style = props.currentChat === contact._id ? " dark:bg-zinc-700 bg-gray-100" : "";
        return (
            <button
                key={contact._id} // Added key prop for list items
                className={"flex flex-row items-center dark:hover:bg-zinc-700 hover:bg-gray-100 rounded-xl p-2" + style}
                onClick={() => props.changeCurrentChat(contact._id)}
            >
                <img className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0" crossOrigin="anonymous" src={contact.pfp} alt={`${contact.username}'s profile`}
                     onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/profile.png";
                    }}/>
                <div className="ml-2 text-sm font-semibold">{contact.username}</div>
                {/* Unread messages */}
                {/* <div
                className="flex items-center justify-center ml-auto text-xs text-white bg-indigo-500 h-4 w-4 rounded leading-none"
                >
                2
                </div> */}
            </button>
        );
    });

    return (
        <>
            <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active DM's</span>
                <span className="flex items-center justify-center dark:bg-stone-800 bg-gray-300 h-4 w-4 rounded-full">
                    {contacts.length}
                </span>
            </div>
            <div className="flex flex-grow flex-col space-y-1 mt-4 -mx-2 h-64 overflow-y-auto scrollbar-indigo">
                {contactElements}
            </div>
        </>
    );
}
