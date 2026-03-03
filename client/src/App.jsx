import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";
import UploadBook from "./pages/UploadBook";

import MainLayout from "./layouts/MainLayout";
import GlitchLoader from "./components/GlitchLoader";
import ProtectedRoute from "./components/ProtectedRoute";

import BookDetails from "./pages/BookDetails";
import ReadBook from "./pages/ReadBook";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <GlitchLoader>
      <MainLayout>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/read/:id" element={<ReadBook />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* USER PROTECTED ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN PROTECTED ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute role="admin">
                <UploadBook />
              </ProtectedRoute>
            }
          />

        </Routes>
      </MainLayout>
    </GlitchLoader>
  );
}

export default App;