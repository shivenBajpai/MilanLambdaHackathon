import { Link } from "react-router-dom";

/**
 * NoPage component renders a 404 error message when a user navigates to a non-existent route.
 *
 * @returns {JSX.Element} The rendered NoPage component.
 */
export default function NoPage() {
    return (
        <div className="flex flex-col justify-center w-screen h-screen max-h-screen text-center pb-14 pt-14 my-auto">
            <h1 className="font-bold text-6xl mb-8 text-red-500">Looks like there's nothing here... :(</h1>
            <p className="mt-4 text-gray-700 text-2xl">Are you lost?</p>
            <div className="mt-8">
                <Link className="p-2 rounded-md bg-red-700 text-white" to="/">
                    <button>Go Back to Homepage</button>
                </Link>
            </div>
        </div>
    );
}
