import { apiRoot } from "../pages/Messages"; // Importing the API root for message-related endpoints

/**
 * createMessageComponents generates message elements for the chat interface.
 *
 * @param {Array} messages - The array of messages to display.
 * @param {string} thisUser - The ID of the current user.
 * @param {Object} other_user - The object containing other user's details.
 * @param {string} other_user_pfp - The profile picture of the other user.
 * @returns {Array} An array of message elements to be rendered.
 */
export default function createMessageComponents(messages, thisUser, other_user, other_user_pfp) {
    let messageElements = []; // Array to hold the generated message elements
    const DtFormat = Intl.DateTimeFormat(undefined, {
        hour12: true,
        timeStyle: "short" // DateTime format settings
    });

    /**
     * Deletes a message with the specified ID.
     *
     * @param {string} messageID - The ID of the message to delete.
     */
    async function deleteMessage(messageID) {
        fetch(apiRoot + '/message/' + messageID, {
            method: "DELETE",
            headers: new Headers({ 'content-type': 'application/json' })
        });
    }

    /**
     * Toggles the visibility of the dropdown menu for a specific message.
     *
     * @param {string} id - The ID of the message.
     */
    function toggleDropdown(id) {
        var dropdown = document.getElementById('dropdownDots-' + id);
        dropdown.classList.toggle('hidden'); // Toggle 'hidden' class to show/hide dropdown
    }

    /**
     * Renders the CRUD button for managing messages (e.g., delete).
     *
     * @param {string} id - The ID of the message.
     * @returns {JSX.Element} The rendered button and dropdown menu.
     */
    function crudButton(id) {
        return (
            <>
                <div onClick={() => toggleDropdown(id)} id={"dropdownMenuIconButton-" + id} data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-transparent rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-600">
                    <svg className="cursor-pointer w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                </div>
                <div id={"dropdownDots-" + id} className="cursor-pointer z-10 hidden bg-transparent divide-y divide-gray-100 rounded-lg shadow w-40 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                        <li>
                            <a onClick={() => deleteMessage(id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                        </li>
                    </ul>
                </div>
            </>
        );
    }

    // Loop through the messages array to create message elements
    for (let i = 0; i < messages.length; i++) {
        let spacing = " mt-2"; // Default spacing
        if (i !== 0 && (messages[i - 1].from_id === messages[i].from_id)) {
            spacing = " mt-0.5"; // Adjust spacing if the previous message is from the same sender
        }

        let timeNext = DtFormat.format(messages[i].timestamp); // Format timestamp for current message
        let timeThis = (i !== messages.length - 1) ? DtFormat.format(messages[i + 1].timestamp) : timeNext; // Format timestamp for next message or use current

        // Check if the message is from the current user
        if (messages[i].from_id === thisUser) {
            messageElements.push(
                <div className={"col-start-6 col-end-13 rounded-lg" + spacing} key={messages[i]._id}>
                    <div className="flex items-center justify-start flex-row-reverse">
                        <div
                            className="max-w-xl dark:text-white dark:bg-indigo-600 relative mr-3 text-md bg-indigo-400 py-2 px-4 shadow rounded-xl"
                        >
                            <div className="text-wrap break-words">{messages[i].message}
                                {((timeNext !== timeThis) || messages[i + 1]?.from_id !== thisUser) && (
                                    <span><p className="text-end text-xs font-bold">{timeThis}</p></span>
                                )}
                            </div>
                        </div>
                        {crudButton(messages[i]._id)} {/* Render CRUD button */}
                    </div>
                </div>
            );
        } else {
            let margin = " ml-10"; // Default margin for other user messages
            if (i !== (messages.length - 1) && i !== 0 &&
                ((messages[i].from_id === messages[i + 1].from_id && messages[i].from_id !== messages[i - 1].from_id) ||
                (i !== 0 && messages[i - 1].from_id === thisUser))) {
                margin = ""; // Adjust margin based on message continuity
            }

            const topUser = (i !== (messages.length - 1) &&
                ((messages[i].from_id === messages[i + 1].from_id && i !== 0 && messages[i].from_id !== messages[i - 1].from_id) ||
                (i !== 0 && messages[i - 1].from_id === thisUser)));

            messageElements.push(
                <div className={"col-start-1 col-end-8 rounded-lg" + spacing + margin} key={messages[i]._id}>
                    <div className="flex flex-col">
                        {topUser && <div className="font-bold ml-14 dark:text-indigo-400 text-indigo-500">{other_user + ":"}</div>}
                        <div className="flex flex-row items-center">
                            {topUser && <img crossOrigin="anonymous" className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0" src={other_user_pfp} alt={`${other_user.username}'s profile`} />}
                            <div
                                className="max-w-xl dark:bg-stone-700 dark:text-white relative ml-3 text-md bg-white py-2 px-4 shadow rounded-xl"
                            >
                                <div className="text-wrap break-words">{messages[i].message}
                                    {((timeNext !== timeThis) || messages[i + 1]?.from_id === thisUser) && (
                                        <span><p className="text-start text-xs font-bold">{timeThis}</p></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    return messageElements; // Return the array of message elements
}
