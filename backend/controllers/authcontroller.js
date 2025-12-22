import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../middlewares/authmiddleware.js';

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, confirmPassword, gender } = req.body;

        // Validation
        if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (password !== confirmPassword ){
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "UserName already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate profile pic using reliable avatar services
        // Using UI Avatars - always available and fast
        const boyProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff&size=200&bold=true`;
        const girlProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=F472B6&color=fff&size=200&bold=true`;
        
        // Alternative: DiceBear Avatars (uncomment if preferred)
        // const boyProfilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        // const girlProfilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&style=female`;

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
        });
        
        generateTokenAndSetCookie(newUser._id, res);    
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            gender: newUser.gender,
            profilePic: newUser.profilePic,
            message: "User created successfully"
        });
    } catch (err) {
        console.log("Error in Signup controller:", err);
        
        // Handle duplicate key error (username already exists)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            gender: user.gender,
            profilePic: user.profilePic,
            message: "User logged in successfully"
        });
    } catch (err) {
        console.log("Error in Login controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

export const logout = (req, res) => {
    try{
        res.clearCookie("jwt", '', {maxAge: 0});
        res.status(200).json({ message: "User logged out successfully" });
    }catch (err) {
        console.log("Error in Logout controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}; 