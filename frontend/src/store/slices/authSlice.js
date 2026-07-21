import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const API_URL = "http://localhost:5000/api/auth";

// Get data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
    user: storedUser || null,
    token: storedToken || null,
    loading: false,
    error: null,
};

// Register User
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            const response = await api.post(
                "/auth/register",
                userData
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Registration failed"
            );
        }
    }
);

// Login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const response = await api.post(
                "/auth/login",
                userData
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Login failed"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },

    extraReducers: (builder) => {
        builder

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {

                state.loading = false;

                state.user = action.payload.user;
                state.token = action.payload.token;

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );

                localStorage.setItem(
                    "token",
                    action.payload.token
                );
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.token = action.payload.token;

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );

                localStorage.setItem(
                    "token",
                    action.payload.token
                );
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;