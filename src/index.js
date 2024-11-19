const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const Filter=require('bad-words');
const { generateMessage,generateLocationMessage }=require('./utils/messages.js');
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users.js');

const app=express();
const server=http.createServer(app); //new server created
const io=socketio(server);

const port=process.env.PORT || 3000;
const publicPathDirectory=path.join(__dirname,'../public');

app.use(express.static(publicPathDirectory));

io.on('connection',(socket)=>{ 
    //socket will hold all data of connection event
    console.log('New Websocket connection');
    
    socket.on('join',({ username, room },callback)=>{
        const {error,user}=addUser({id:socket.id,username,room});

        if(error){
            return callback(error);
        }

        socket.join(user.room); //join the room to chat
        //to()==> send msg to specified room

        socket.emit('message',generateMessage('Admin','Welcome!!!'));
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!!!`));

        //get chatroom users list
        io.to(user.room).emit('usersInRoom',getUsersInRoom(user.room))
        callback();
    })

    // socket.broadcast.emit('message',generateMessage('A new user has joined!!!'));

    socket.on('sendMessages',(message,callback)=>{
        const user=getUser(socket.id);
        const filter=new Filter();
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!!!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback(); //acknowleding event from client
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id);
        if(user){ //will display msg to user who are part of the chat room
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`));            
        }
    })

})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`);
})
