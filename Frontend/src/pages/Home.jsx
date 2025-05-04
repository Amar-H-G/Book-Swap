import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Book Exchange Portal</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Welcome to BookSwap</h1>
          <p className="text-gray-600 mb-8">Exchange or rent books with your community</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full border border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg font-medium hover:bg-indigo-50 transition duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
