import { Link } from "react-router-dom"
import { MessageCircle, Users, School, Shield } from "lucide-react"

export default function Home() {
    return <div className="flex min-h-full flex-col justify-center text-center">
        <div className="mt-10 flex flex-row justify-center content-center">
            <img className="w-20" src="logo.png" alt="" />
            <h1 className="text-6xl my-auto">IPHAC</h1>
        </div>

        <div className="flex flex-col justify-center pb-14 pt-14">
            <h1 className="font-bold text-6xl mb-8" >Connect with Your College Peers</h1>
            <h1 className="text-red-500 text-2xl" >Connect with new people</h1>
            <p className="mt-4 text-gray-700" >IPHAC pairs you with random students from your college who are online.<br></br>Identities are kept anonymous until both sides agree to reveal.<br></br>Chat, make friends, and expand your network!</p>
            <div className="mt-8">
                <Link className="p-2 rounded-md bg-red-700 text-white" to="/messages">
                    <button> Enter Chat Room </button>
                </Link>
            </div>
        </div>

        <div className="mx-10 flex flex-col justify-center bg-red-400 py-32 rounded-md text-white">
            <h1 className="font-black text-4xl" >Features</h1>
            <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="flex flex-col content-center">
                    <MessageCircle className="mx-auto my-2 h-16 w-16 text-primary" />
                    <h3 className="font-bold text-xl">Instant Messaging</h3>
                    <p className="">Chat in real-time with your peers</p>
                </div>
                <div className="flex flex-col content-center">
                    <Users className="mx-auto my-2 h-16 w-16 text-primary" />
                    <h3 className="font-bold text-xl">Random Pairing</h3>
                    <p>Get to meet someone new every time</p>
                </div>
                <div className="flex flex-col content-center">
                    <img className="mx-auto my-2 h-16 w-16" src="IITH_Logo.png" alt="" />
                    <h3 className="font-bold text-xl">IITH - Only</h3>
                    <p>Made by students of IITH, for students of IITH</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center text-center py-32">
            <h1 className="font-black text-4xl" >How it Works</h1>
            <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="flex flex-col content-center">
                    <span className="flex my-2 h-12 w-12 mx-auto items-center justify-center rounded-full bg-black text-white text-xl font-bold">1</span>
                    <h3 className="font-bold text-xl">Sign In</h3>
                    <p className="">Using your official college email</p>
                </div>
                <div className="flex flex-col content-center">
                    <span className="flex my-2 h-12 w-12 mx-auto items-center justify-center rounded-full bg-black text-white text-xl font-bold">2</span>
                    <h3 className="font-bold text-xl">Random Pairing</h3>
                    <p>Click the button to get paired anonymously with a random person</p>
                </div>
                <div className="flex flex-col content-center">
                    <span className="flex my-2 h-12 w-12 mx-auto items-center justify-center rounded-full bg-black text-white text-xl font-bold">3</span>
                    <h3 className="font-bold text-xl">Start Chatting</h3>
                    <p>Chat away!</p>
                </div>
            </div>
        </div>


        <div className="mx-10 rounded-sm flex flex-col justify-center py-32 bg-red-400 text-center text-white">
            <h1 className="font-black text-4xl" >About IPHAC</h1>
            <p className="my-3">
                IPHAC is designed to allow you to meet a random mix of people you wouldn't normally meet in your day-to-day campus life.<br></br>
                Our platform aims provides a safe, user-friendly and engaging way to meet new people.<br></br>
            </p>
            <div className="my-3">
                <Shield className="h-8 w-8 mx-2 text-primary inline" />
                <p className="inline">
                    We are focused on your safety and security. No spoofing is possible since official emails are the only login option, Identities are kept anonymous until you agree to reveal it
                </p>
            </div>
        </div>

        <div className="mx-10 flex flex-row py-4 text-left justify-between">
            <p className="px-3 font-bold">
                Copyright Notice
            </p>
            <p className="px-3 font-bold">
                Terms of Service Link
            </p>
        </div>

    </div>
}
