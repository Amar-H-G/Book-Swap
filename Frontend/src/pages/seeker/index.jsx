import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function SeekerDashboard() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/11/06/12/41/p-1027211_640.jpg"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://book-swap-backend-946c.onrender.com/api/profile/${user.id}`
        );
        const data = await res.json();
        if (data.success && data.user.profileImage) {
          setProfileImage(
            `https://book-swap-backend-946c.onrender.com/${data.user.profileImage}`
          );
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (user?.id) {
      fetchProfile();
      fetchBooks();
    }
  }, [user?.id]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://book-swap-backend-946c.onrender.com/api/books"
      );

      const booksArray = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.books)
        ? response.data.books
        : [];

      setBooks(booksArray);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = Array.isArray(books)
    ? books.filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation =
          locationFilter === "" ||
          book.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesSearch && matchesLocation && book.status === "available";
      })
    : [];

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading user...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Find Books | BookSwap</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Find Books</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-400"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Title/Author
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search books..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Location
                </label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter location..."
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">
                No books found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300"
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex mb-4">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                        <p className="text-gray-500 text-xs mb-2">
                          {book.location}
                        </p>
                        {book.genre && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {book.genre}
                          </span>
                        )}
                      </div>
                      <div className="flex-shrink-0 w-28 h-36">
                        {book.image && (
                          <img
                            src={`https://book-swap-backend-946c.onrender.com/${book.image}`}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 text-sm text-gray-700">
                      <h4 className="font-medium mb-1">Owner Details</h4>
                      <p>{book.ownerName}</p>
                      <p>{book.ownerEmail}</p>
                      {book.ownerMobile && <p>{book.ownerMobile}</p>}
                    </div>

                    <div className="mt-4">
                      <a
                        href={`mailto:${book.ownerEmail}`}
                        className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Contact Owner
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
