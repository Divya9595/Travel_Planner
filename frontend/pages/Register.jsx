import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../src/store/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector(
      (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    country: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          await dispatch(registerUser(formData)).unwrap();

          // Redirect to login page after successful registration
          navigate("/login");

          // OR if you want auto-login instead:
          // navigate("/");
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Horizon Travel"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Join us to plan your next journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
		{error && (
			<div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
				{error}
			</div>
			)}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 2. Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
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

            {/* 3. Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-200">
                Phone Number
              </label>
              <div className="mt-1.5">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 4. Country Field */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-200">
                Country
              </label>
              <div className="mt-1.5">
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 5. Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
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
            <div className="pt-2">
              	<button
					type="submit"
					disabled={loading}
					className="flex w-full justify-center rounded-xl bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
				>
					{loading ? "Creating account..." : "Create Account"}
				</button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
           	<Link
				to="/login"
				className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
			>
				Sign in instead
			</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;