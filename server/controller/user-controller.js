import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';
import User from '../model/user.js';

dotenv.config();

// -------- SIGNUP --------
export const signupUser = async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const user = { 
            username: request.body.username, 
            name: request.body.name, 
            password: hashedPassword 
        };

        const newUser = new User(user);
        await newUser.save();

        // Generate tokens after saving user
        const accessToken = jwt.sign(newUser.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign(newUser.toJSON(), process.env.REFRESH_SECRET_KEY);
        const newToken = new Token({ token: refreshToken });
        await newToken.save();

        // Set cookie for mobile-friendly login
        response.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            maxAge: 15 * 60 * 1000
        });

        // Send response
        return response.status(200).json({
            isSuccess: true,
            accessToken,
            refreshToken,
            name: newUser.name,
            username: newUser.username
        });

    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}

// -------- LOGIN --------
export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            const newToken = new Token({ token: refreshToken });
            await newToken.save();

            // Set cookie for mobile-friendly login
            response.cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "None",
                maxAge: 15 * 60 * 1000
            });

            // Send response once
            return response.status(200).json({
                accessToken,
                refreshToken,
                name: user.name,
                username: user.username
            });

        } else {
            return response.status(400).json({ msg: 'Password does not match' });
        }
    } catch (error) {
        return response.status(500).json({ msg: 'Error while login the user' });
    }
}

// -------- LOGOUT --------
export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token });
    return response.status(204).json({ msg: 'Logout successful' });
}
