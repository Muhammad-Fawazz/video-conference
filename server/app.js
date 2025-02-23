const express = require('express');
const socketIo = require('socket.io')


const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '40kb' }));

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('server is running on http://localhost:3000')
});

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // or "*" to allow all origins
        methods: ["GET", "POST"]
    }
});

const rooms = {};
const socketToRoom = {};

io.on("connection", (socket) => {
    socket.on("join", (data) => {
        // let a new user join to the room
        const roomId = data.room;
        socket.join(roomId);
        socketToRoom[socket.id] = roomId;

        // persist the new user in the room
        if (rooms[roomId]) {
            rooms[roomId].push({ id: socket.id, name: data.name });
        } else {
            rooms[roomId] = [{ id: socket.id, name: data.name }];
        }

        // sends a list of joined users to the new user
        const users = rooms[roomId].filter((user) => user.id !== socket.id);
        io.sockets.to(socket.id).emit("joined_users", users);

        console.log("[joined] room:" + roomId + " name: " + data.name);
    });

    // Handle SDP messages
    socket.on("offer", sdp => {
        const roomId = socketToRoom[socket.id];
        console.log("offer from: " + socket.id);
        socket.broadcast.emit("getOffer", sdp);

    });

    socket.on("answer", sdp => {
        const roomId = socketToRoom[socket.id];
        console.log("answer from: " + socket.id);
        socket.broadcast.emit("getAnswer", sdp);

    });

    socket.on("candidate", candidate => {
        const roomId = socketToRoom[socket.id];
        console.log("candidate from: " + socket.id);
        socket.broadcast.emit("getCandidate", candidate);

    });

    socket.on("disconnect", () => {
        const roomId = socketToRoom[socket.id];
        if (roomId) {
            let room = rooms[roomId];
            if (room) {
                room = room.filter((user) => user.id !== socket.id);
                rooms[roomId] = room;
            }
            socket.broadcast.to(roomId).emit("disconnected_user", { id: socket.id });
            console.log(`[${roomId}]: ${socket.id} exit`);
        }
    });
});
