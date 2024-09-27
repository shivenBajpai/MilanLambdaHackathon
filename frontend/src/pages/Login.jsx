
export default function Login() {
    return (
        <>
           <div className="dark:bg-stone-800 flex min-h-full flex-col justify-center px-6 py-12 mt-16">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex justify-center items-center">
                    <img className="h-20 w-auto" src="logo.png" alt="Logo"/>
                    <h1 className="font-bold text-5xl dark:text-zinc-50">ANOMY</h1>
                    </div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-zinc-50">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-zinc-50">Email address</label>
                        <div className="mt-2">
                        <input id="email" name="email" type="email" autoComplete="email" requiindigo className="h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                        <label for="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-zinc-50">Password</label>
                        <div className="text-sm">
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div>
                        </div>
                        <div className="mt-2">
                        <input id="password" name="password" type="password" autoComplete="current-password" requiindigo className="h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500  dark:text-zinc-100">
                    Dont have an account? <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</a>
                    </p>
                </div>
            </div>
        </>
    )
}
