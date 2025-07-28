import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VerifyAccountPage from "./pages/Auth/VerifyAccountPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import Dashboard from "./pages/Dashboard/Dashboard";

// Components
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireAuth={false}>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/auth/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/register"
          element={
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/verify"
          element={
            <ProtectedRoute requireAuth={false}>
              <VerifyAccountPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/forgot-password"
          element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/reset-password"
          element={
            <ProtectedRoute requireAuth={false}>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to landing page */}
        <Route
          path="*"
          element={
            <ProtectedRoute requireAuth={false}>
              <LandingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Provider>
  );
}

export default App;
