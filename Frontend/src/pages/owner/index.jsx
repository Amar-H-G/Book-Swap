import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useBooks } from "../../context/BookContext";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const { books, loading, addBook, updateBook, updateBookStatus, deleteBook } =
    useBooks();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/11/06/12/41/p-1027211_640.jpg"
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    image: null,
  });
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://book-swap-backend-946c.onrender.com/api/profile/${user.id}`);
        const data = await res.json();
        if (data.success && data.user.profileImage) {
          setProfileImage(`https://book-swap-backend-946c.onrender.com/${data.user.profileImage}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewBook((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("genre", newBook.genre);
    formData.append("location", newBook.location);
    formData.append("ownerId", user.id);
    if (newBook.image) {
      formData.append("image", newBook.image);
    }

    let result;
    if (editBookId) {
      result = await updateBook(editBookId, formData, true);
    } else {
      result = await addBook(formData, true);
    }

    if (result.success) {
      toast.success(editBookId ? "Book updated" : "Book added");
      setNewBook({
        title: "",
        author: "",
        genre: "",
        location: "",
        image: null,
      });
      setEditBookId(null);
      setShowAddForm(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleEditClick = (book) => {
    setEditBookId(book._id);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      location: book.location,
      image: null,
    });
    setShowAddForm(true);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "available" ? "unavailable" : "available";
    const result = await updateBookStatus(id, newStatus);
    result.success
      ? toast.success("Status updated")
      : toast.error(result.error || "Failed to update status");
  };

  const handleDeleteBook = async (id) => {
    const result = await deleteBook(id, user.id);
    result.success
      ? toast.success("Book deleted")
      : toast.error(result.error || "Failed to delete book");
  };

  const ownerBooks = books.filter((book) => book.ownerId === user.id);

  return (
    <>
      <Helmet>
        <title>Owner Dashboard | BookSwap</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
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

        {/* Rest of the component remains the same */}
        <main className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Books</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setNewBook({
                  title: "",
                  author: "",
                  genre: "",
                  location: "",
                  image: null,
                });
                setEditBookId(null);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              {showAddForm ? "Cancel" : "Add New Book"}
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddOrUpdate}
              className="bg-white p-6 rounded-lg shadow space-y-4 mb-6"
              encType="multipart/form-data"
            >
              {["title", "author", "genre", "location"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={newBook[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required={field !== "genre"}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium">Book Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                {editBookId ? "Update Book" : "Add Book"}
              </button>
            </form>
          )}

          {loading ? (
            <p>Loading books...</p>
          ) : ownerBooks.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">You haven't added any books yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:scale-105 transform duration-300"
                >
                  <div className="flex p-4">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-gray-800">
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

                    <div className="flex-shrink-0 w-32 h-40">
                      {book.image && (
                        <img
                          src={`https://book-swap-backend-946c.onrender.com/${book.image}`}
                          alt={book.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border-t">
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() =>
                          handleStatusChange(book._id, book.status)
                        }
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleEditClick(book)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full mt-2 ${
                        book.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {book.status}
                    </span>
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
