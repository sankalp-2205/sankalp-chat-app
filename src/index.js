const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {generateMessage, generatelocationMessage , generatestaticMessage} = require('./utils/message.js');
const {adduser,removeusers,getuser,getuserinroom} = require('./utils/trackingusers.js');
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
let count = 0;
app.use(express.static(publicDirectoryPath))
io.on('connection',(socket)=>{
    console.log('New Connection');
    socket.on('join',({username,room},callback)=>{
        const {error,user} = adduser({id:socket.id, username, room})
        if(error)
        {
            return callback(error);
        }
        socket.join(room);
        socket.emit('othermessages',generatestaticMessage('Welcome'));
        socket.broadcast.to(user.room).emit('othermessages',generatestaticMessage(`${user.username} has joined`))
        io.to(user.room).emit('userdata',{
            room: user.room,
            userlist : getuserinroom(user.room)
        })
        callback()
    })
    socket.on('sendmessage',(message,callbacks)=>{
        const user = getuser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callbacks();
    }
    )
    socket.on('sendlocation',(coords,callbacks)=>{
        const user = getuser(socket.id)
        io.to(user.room).emit('locationmessage',generatelocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callbacks();
    })
    socket.on('disconnect',()=>{
        const user = removeusers(socket.id)
        if(user)
        {
            io.to(user.room).emit('othermessages',generatestaticMessage(`${user.username} has left`))
            io.to(user.room).emit('userdata',{
                room: user.room,
                userlist : getuserinroom(user.room)
            })
        }
    })
})

server.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`)
})