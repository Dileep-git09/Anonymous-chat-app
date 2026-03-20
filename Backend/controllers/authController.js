const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER USER
exports.registerUser = async (req, res) => {

    try {

        const { email, username, password } = req.body

        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" })
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            email,
            username,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        })

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        })

    }
}



// LOGIN USER
exports.loginUser = async (req, res) => {

    try {

        const { username, password } = req.body

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        // Token is also returned in the body so the frontend can
        // pass it to Socket.IO handshake (httpOnly cookies are not
        // accessible to JavaScript, so socket.io can't read it)
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username
            }
        })

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        })

    }
}



// LOGOUT
exports.logoutUser = (req, res) => {

    res.clearCookie("token")

    res.status(200).json({
        message: "Logged out successfully"
    })

}