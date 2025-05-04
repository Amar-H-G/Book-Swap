import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BookContext = createContext();

export const useBooks = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://book-swap-backend-946c.onrender.com/api/books");
      const data = response.data;
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData, isFormData = false) => {
    try {
      const response = await axios.post(
        "https://book-swap-backend-946c.onrender.com/api/books",
        bookData,
        isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
      );
      setBooks((prev) => [...prev, response.data.book]);
      return { success: true };
    } catch (err) {
      console.error("Error adding book:", err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateBookStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        `https://book-swap-backend-946c.onrender.com/api/books/${id}/status`,
        { status }
      );
      setBooks((prev) =>
        prev.map((book) => (book._id === id ? response.data.book : book))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating status:", err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateBook = async (id, updatedData, isFormData = false) => {
    try {
      const response = await axios.put(
        `https://book-swap-backend-946c.onrender.com/api/books/${id}`,
        updatedData,
        isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
      );
      setBooks((prev) =>
        prev.map((book) => (book._id === id ? response.data.book : book))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating book:", err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const deleteBook = async (id, ownerId) => {
    try {
      await axios.delete(`https://book-swap-backend-946c.onrender.com/api/books/${id}`, {
        data: { ownerId },
      });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting book:", err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        fetchBooks,
        addBook,
        updateBookStatus,
        deleteBook,
        updateBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
