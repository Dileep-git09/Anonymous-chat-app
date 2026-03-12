const Message = require("../models/Message")
const {
    addUserToQueue,
    removeUserFromQueue
} = require("../utils/matchUsers")

const socketHandler = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id)

        // RANDOM MATCHING

        socket.on("findMatch", () => {

            const partner = addUserToQueue(socket)

            if (!partner) {

                socket.emit("waitingForMatch")

            } else {

                const roomId = `${socket.id}-${partner.id}`

                socket.join(roomId)
                partner.join(roomId)

                io.to(roomId).emit("matchFound", {
                    roomId
                })

            }

        })


        // SEND MESSAGE

        socket.on("sendMessage", async (data) => {

            const { roomId, sender, receiver, message } = data

            try {

                const newMessage = await Message.create({
                    sender,
                    receiver,
                    roomId,
                    message
                })

                io.to(roomId).emit("receiveMessage", newMessage)

            } catch (error) {

                console.error("Message save error:", error)

            }

        })


        // USER DISCONNECT

        socket.on("disconnect", () => {

            console.log("User disconnected:", socket.id)

            removeUserFromQueue(socket.id)

        })

    })

}

module.exports = socketHandler



// this is the old version of sockethandler without db integration and user matching logic.

// let waitingUsers = []

// const socketHandler = (io) => {

//   io.on("connection", (socket) => {

//     console.log("User connected:", socket.id)

//     socket.on("findMatch", () => {

//       if (waitingUsers.length === 0) {

//         waitingUsers.push(socket)

//       } else {

//         const partner = waitingUsers.shift()

//         const roomId = `${socket.id}-${partner.id}`

//         socket.join(roomId)
//         partner.join(roomId)

//         io.to(roomId).emit("matchFound", roomId)

//       }

//     })


//     socket.on("sendMessage", ({ roomId, message }) => {

//       io.to(roomId).emit("receiveMessage", message)

//     })


//     socket.on("disconnect", () => {

//       waitingUsers = waitingUsers.filter(user => user.id !== socket.id)

//       console.log("User disconnected")

//     })

//   })

// }

// module.exports = socketHandler
