export default function createMessageComponenets(messages, thisUser, other_user, other_user_pfp) {
    let messageElements = []
    const DtFormat = Intl.DateTimeFormat(undefined, {
        hour12: true,
        timeStyle: "short"
    })

    function toggleDropdown(id) {
        var dropdown = document.getElementById('dropdownDots-' + id);
        dropdown.classList.toggle('hidden');
    }

    function crudButton (id) {
        return (
        <>
            <div onClick={() => toggleDropdown(id)} id={"dropdownMenuIconButton-" + id} data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-transparent rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-600">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </div>
            <div id={"dropdownDots-" + id} class="z-10 hidden bg-transparent divide-y divide-gray-100 rounded-lg shadow w-40 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                    </li>
                </ul>
            </div>
        </>
        )
    }
    for (let i = 0; i<messages.length; i++) {
        let spacing = " mt-2"
        if (i != 0 && (messages[i-1].from_id == messages[i].from_id)) {
            spacing = " mt-0.5"
        }
        let timeNext = DtFormat.format(messages[i].timestamp)
        let timeThis = (i != messages.length - 1) ? DtFormat.format(messages[i+1].timestamp) : timeNext = DtFormat.format(messages[i].timestamp)
        if (messages[i].from_id == thisUser) {
            messageElements.push(
                <div className={"col-start-6 col-end-13 rounded-lg" + spacing}>
                    <div className="flex items-center justify-start flex-row-reverse">
                        <div
                            className="dark:text-white dark:bg-indigo-600 relative mr-3 text-md bg-indigo-400 py-2 px-4 shadow rounded-xl"
                        >
                            <div>{messages[i].message}
                                {((timeNext != timeThis) || messages[i+1]?.from_id != thisUser) && (
                                    <span><p className="text-end text-xs font-bold">{timeThis}</p></span>
                                )}
                            </div>
                        </div>
                        {crudButton(i)}
                    </div>
                </div>
            )

        } else {
            let margin = " ml-10"
            if (i != (messages.length-1) &&  i != 0 && ((messages[i].from_id == messages[i+1].from_id) && messages[i].from_id != messages[i-1].from_id) || ( i != 0 && messages[i-1].from_id == thisUser)) {
                margin = ""
            }
            const topUser = (i != (messages.length-1) && ((messages[i].from_id == messages[i+1].from_id) &&  i != 0 && messages[i].from_id != messages[i-1].from_id) || ( i != 0 && messages[i-1].from_id == thisUser))
            messageElements.push(
                <div className={"col-start-1 col-end-8 rounded-lg" + spacing + margin}>
                    <div className="flex flex-col">
                        {topUser && <div className="font-bold ml-14 dark:text-indigo-400 text-indigo-500">{other_user + ":"}</div>}
                        <div className="flex flex-row items-center">
                        {topUser && <img crossOrigin="anonymous" className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0" src={other_user_pfp}></img>}
                        <div
                            className="dark:bg-stone-700 dark:text-white relative ml-3 text-md bg-white py-2 px-4 shadow rounded-xl"
                        >
                            <div>{messages[i].message}
                                {((timeNext != timeThis) || messages[i+1]?.from_id == thisUser) && (
                                    <span><p className="text-start text-xs font-bold">{timeThis}</p></span>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            )
        }
    }
    return messageElements
}
