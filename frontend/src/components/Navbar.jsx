import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

function Navbar({ publicMode = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-indigo-400 font-semibold"
            : "text-slate-300 hover:text-white transition";

    return (
        <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-md">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-2xl font-bold text-white"
                    >
                        <span className="text-2xl">🌍</span>
                        Horizon Travel
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">

                        {user && !publicMode ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={navLinkClass}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/dashboard/trips"
                                    className={navLinkClass}
                                >
                                    Trips
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/"
                                    className={navLinkClass}
                                >
                                    Home
                                </NavLink>

                                <NavLink
                                    to="/about"
                                    className={navLinkClass}
                                >
                                    About
                                </NavLink>

                                <NavLink
                                    to="/contact"
                                    className={navLinkClass}
                                >
                                    Contact
                                </NavLink>
                            </>
                        )}

                    </div>

                    {/* Right Side: Login or User Info */}
                    <div className="hidden md:flex items-center gap-4">

                        {publicMode || !user ? (
                            <Link
                                to="/login"
                                className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition"
                            >
                                Login
                            </Link>
                        ) : (
                            <>
                                <span className="text-slate-300">
                                    Welcome,
                                    <span className="ml-1 font-semibold text-white">
                                        {user?.name}
                                    </span>
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white md:hidden"
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-slate-700 py-4">

                        <div className="flex flex-col gap-4">

                            {user && !publicMode ? (
                                <>
                                    <NavLink
                                        to="/dashboard"
                                        className={navLinkClass}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </NavLink>

                                    <NavLink
                                        to="/dashboard/trips"
                                        className={navLinkClass}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Trips
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/"
                                        className={navLinkClass}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </NavLink>

                                    <NavLink
                                        to="/about"
                                        className={navLinkClass}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        About
                                    </NavLink>

                                    <NavLink
                                        to="/contact"
                                        className={navLinkClass}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Contact
                                    </NavLink>
                                </>
                            )}

                            <div className="border-t border-slate-700 pt-4">

                                {publicMode || !user ? (
                                    <Link
                                        to="/login"
                                        className="block w-full text-center rounded-lg bg-indigo-500 py-2 text-white hover:bg-indigo-400 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                ) : (
                                    <>
                                        <p className="mb-3 text-slate-300">
                                            Welcome,
                                            <span className="ml-1 font-semibold text-white">
                                                {user?.name}
                                            </span>
                                        </p>

                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600 transition"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
