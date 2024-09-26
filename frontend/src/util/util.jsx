export default function createMessageComponenets(messages, thisUser) {
    let messageElements = []
    const DtFormat = Intl.DateTimeFormat(undefined, {
        hour12: true,
        timeStyle: "short"
    })

    // const DtFormat = {
    //     format(string) {return ""}
    // }

    for (let i = 0; i<messages.length; i++) {
        let spacing = " mt-2"
        if (i != 0 && (messages[i-1].author == messages[i].author)) {
            spacing = " mt-0.5"
        }
        let timeNext = DtFormat.format(messages[i].timestamp)
        let timeThis = (i != messages.length - 1) ? DtFormat.format(messages[i+1].timestamp) : timeNext = DtFormat.format(messages[i].timestamp)
        if (messages[i].author == thisUser) {
            messageElements.push(
                <div className={"col-start-6 col-end-13 rounded-lg" + spacing}>
                    <div className="flex items-center justify-start flex-row-reverse">
                        <div
                            className="relative mr-3 text-md bg-red-300 py-2 px-4 shadow rounded-xl"
                        >
                            <div>{messages[i].text}
                                {((timeNext != timeThis) || messages[i+1]?.author != thisUser) && (
                                    <span><p className="text-end text-xs font-bold">{timeThis}</p></span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )

        } else {
            let margin = " ml-10"
            if (i != (messages.length-1) &&  i != 0 && ((messages[i].author == messages[i+1].author) && messages[i].author != messages[i-1].author) || ( i != 0 && messages[i-1].author == thisUser)) {
                margin = ""
            }
            const topUser = (i != (messages.length-1) && ((messages[i].author == messages[i+1].author) &&  i != 0 && messages[i].author != messages[i-1].author) || ( i != 0 && messages[i-1].author == thisUser))
            messageElements.push(
                <div className={"col-start-1 col-end-8 rounded-lg" + spacing + margin}>
                    <div className="flex flex-col">
                        {topUser && <div className="font-bold ml-14 text-red-500">{messages[i].author + ":"}</div>}
                        <div className="flex flex-row items-center">
                        {topUser && <img className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500 flex-shrink-0" src="/profile.png"></img>}
                        <div
                            className="relative ml-3 text-md bg-white py-2 px-4 shadow rounded-xl"
                        >
                            <div>{messages[i].text}
                                {((timeNext != timeThis) || messages[i+1]?.author == thisUser) && (
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
