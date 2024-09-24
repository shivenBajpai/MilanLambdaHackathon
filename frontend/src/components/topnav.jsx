export default function TopNav() {
    return <div id="TopNav" className="flex flex-nowrap w-screen bg-slate-200">
        <div className="m-2 p-2 px-8 border-r-black border-r-2"><h1 className="font-black text-2xl">IPHAC</h1></div>
        <div className="flex justify-center flex-grow ">
            <button className="m-2 p-3 rounded-full transition ease-in-out delay-150 bg-slate-400 hover:bg-slate-800 hover:text-slate-100"> Start a New Conversation</button>
        </div>
    </div>
}