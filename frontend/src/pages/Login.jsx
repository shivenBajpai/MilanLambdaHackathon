
export default function Login() {
    return (
        <>
           <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-16">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-20 w-auto" src="logo.png" alt="Logo"/>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2">
                        <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                        <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="text-sm">
                            <a href="#" className="font-semibold text-red-600 hover:text-red-500">Forgot password?</a>
                        </div>
                        </div>
                        <div className="mt-2">
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Sign in</button>
                    </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                    Dont have an account? <a href="#" className="font-semibold leading-6 text-red-600 hover:text-red-500">Sign up</a>
                    </p>
                </div>
            </div>
        </>
    )
}
