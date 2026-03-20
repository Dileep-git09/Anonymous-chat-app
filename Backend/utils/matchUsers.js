let waitingQueue = []

const addUserToQueue = (socket) => {

    // Find a partner who is a different user (prevent self-matching with two tabs)
    const partnerIndex = waitingQueue.findIndex(
        (user) => user.userId !== socket.userId
    )

    if (partnerIndex === -1) {
        waitingQueue.push(socket)
        return null
    } else {
        const partner = waitingQueue.splice(partnerIndex, 1)[0]
        return partner
    }

}

const removeUserFromQueue = (socketId) => {

    waitingQueue = waitingQueue.filter(
        (user) => user.id !== socketId
    )

}

module.exports = {
    addUserToQueue,
    removeUserFromQueue
}