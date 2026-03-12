let waitingQueue = []

const addUserToQueue = (socket) => {

    if (waitingQueue.length === 0) {

        waitingQueue.push(socket)
        return null

    } else {

        const partner = waitingQueue.shift()
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