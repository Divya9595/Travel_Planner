import User from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const {name, email, password, phoneNumber, country} = req.body;

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) 
            return res.status(400).json({message: "User already exists!" });

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await User.create({
            name,
            email:normalizedEmail,
            password:hashedPassword,
            phoneNumber,
            country
        });

        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                country: user.country
            }
        });
    } catch(error) {
        res.status(500).json({ message: error.message });

    }
  
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcryptjs.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // Generate JWT
        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                country: user.country,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};