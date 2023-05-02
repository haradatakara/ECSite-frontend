import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import UnAuthRoute from "./routes/UnAuthRoute";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/detail/:id" element={<ItemDetail />} /> */}
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/signIn"
            element={
              <UnAuthRoute>
                <SignIn />
              </UnAuthRoute>
            }
          />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
