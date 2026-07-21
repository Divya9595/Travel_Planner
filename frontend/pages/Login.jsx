import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../src/store/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Horizon Travel"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Access your itineraries and travel plans
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 2. Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Not a member yet?{" "}
            <a
              href="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
