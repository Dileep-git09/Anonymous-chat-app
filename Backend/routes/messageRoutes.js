const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const Message = require("../models/Message")

// GET /api/messages/:roomId  — fetch history for a chat room
router.get("/:roomId", protect, async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId })
            .sort({ createdAt: 1 })
            .populate("sender", "username")

        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
})

module.exports = router