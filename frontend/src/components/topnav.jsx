export default function TopNav() {
    return(
        <div id="TopNav" className="flex bg-transparent border-b-black border-b-2 justify-between">
            <div className="m-2 p-2 px-8"><h1 className="font-black text-2xl">IPHAC</h1></div>
            <div className="flex justify-center">
                <button className="mt-2 mb-2 mr-6 p-3 rounded-lg transition ease-in-out delay-15 bg-slate-400 hover:bg-slate-800 hover:text-slate-100">Chat Roulette</button>
            </div>
        </div>
    )
}
