import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-40 text-center">
      <h1 className="!text-4xl">404</h1>
      <p className="text-gray-600">This page could not be found.</p>
      <Link to="/" className="text-purple-600 font-medium hover:text-purple-800">
        Go back home
      </Link>
    </div>
  );
}