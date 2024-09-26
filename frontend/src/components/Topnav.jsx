import { Link } from "react-router-dom"

export default function TopNav() {
    return(
        <div id="TopNav" className="flex bg-transparent border-b-black border-b-2 justify-between">
            <div className="m-2 p-2 px-8"><Link to="/"><h1 className="font-black text-2xl">IPHAC</h1></Link></div>
            <div className="flex justify-center">
                <Link to="/login">
                    <button className="mt-2 mb-2 mr-6 py-3 px-4 border-2 rounded-lg transition ease-in-out delay-15 hover:text-red-700 hover:bg-white border-red-700 bg-red-700 text-white font-bold">Sign In</button>
                </Link>
                <Link to="/messages">
                    <button className="mt-2 mb-2 mr-6 py-3 px-4 border-2 rounded-lg transition ease-in-out delay-15 hover:text-red-700 hover:bg-white border-red-700 bg-red-700 text-white font-bold">Messages</button>
                </Link>
            </div>
        </div>
    )
}
