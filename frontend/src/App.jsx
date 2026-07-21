import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "../pages/Index";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Trips from "../pages/Trips";
import TripDetails from "../pages/TripDetails";

import ProtectedRoute from "../src/components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/trips"
                    element={
                        <ProtectedRoute>
                            <Trips />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/trips/:id"
                    element={
                        <ProtectedRoute>
                            <TripDetails />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
