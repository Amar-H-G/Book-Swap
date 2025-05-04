import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { BookProvider } from "./context/BookContext.jsx";
import { ProfileProvider } from "./context/profileContext.jsx"; // Assuming you have this context for profile
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
