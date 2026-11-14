// socket is a client
// joining a client in a room by join() method

// when user log in or open the application
// every socket has a socket id and it will change if user disconnects and refresh or revisit the app

let onlineUsers = []

const SocketServer = (socket, io) =>{
    // OLD ---------------------
    // socket.on('join', (userId)=>{
    //     socket.join(userId)
    //     let onlineUserExist = onlineUsers.some((u)=>u.userId === userId )
    //     if(!onlineUserExist){
    //         // console.log(`USER-ID =>   ${userId}   lOGGED IN!!!!!`);
    //         onlineUsers.push({
    //             userId,
    //             socketId:socket.id
    //         })
    //     }
    //     io.emit('online-users', onlineUsers)
    //     // send socket id 
    //     io.emit('setup socket', socket.id)
    // })

    // FIXED --------------------
        socket.on('join', (userId) => {
        onlineUsers = onlineUsers.filter(
            (user) => user.userId.toString() !== userId.toString()
        );
        socket.join(userId);
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        io.emit('online-users', onlineUsers);
        io.emit('setup socket', socket.id);
    });

    // when user log out or close the application
    // every time user disconnect and reconnects the socket id will also change
    socket.on('disconnect', ()=>{
        // console.log('USER DISCONNECTED');
        onlineUsers = onlineUsers.filter((user)=>user.socketId !== socket.id)
        io.emit('online-users', onlineUsers)
    })

    // when user join a active conversation
    socket.on('join conversation', (conversationId)=>{
        // console.log(`CONVERSATION-ID =>   ${conversationId}   JOINED A CONVERSATION!!!!!`);
        socket.join(conversationId)
    })

    // typing
    socket.on('typing', (conversationId)=>{
        // console.log(`CONVERSATION-ID =>   ${conversationId}   TYPINGGGGG.....!!!!!`);
        socket.in(conversationId).emit('typing', conversationId)
    })

    // stpo typing
    socket.on('not typing', (conversationId)=>{
        // console.log(`CONVERSATION-ID =>   ${conversationId} NOTTTT / TYPINGGGGG.....!!!!!`);
        socket.in(conversationId).emit('not typing')
    })

    // send and receive messages
    // send message to user that is not me 
    // everybody will get my message realtime
    // either its one to one convo or group convo

    socket.on('send message', (message)=>{
        // console.log("message ------>", message);
        let conversation = message.conversation
        if(!conversation.members) return;
        conversation.members.map((member)=>{
            // console.log("member ------>", member)
            if(member === message.sender._id) {
                return;
            }
            else{
                socket.in(member).emit('receive message', message)
            }
        }) 
        // console.log(conversation.members)
    })

    // CALL USER
    socket.on('call user', (data) => {
        const recipient = onlineUsers.find(
            (user) => user.userId.toString() === data.userToCall.toString()
        );

        if (!recipient) {
            socket.emit('user offline', data.userToCall);
            return;
        }

        io.to(recipient.socketId).emit('call user', {
            signal: data.signal,
            from: socket.id,
            name: data.name,
            picture: data.picture
        });
    });

    // ANSWER CALL
    socket.on('answer call', (data) => {
        io.to(data.to).emit('call accepted', data.signal);
    });

    // END CALL
    socket.on('call ended', (socketId) => {
        io.to(socketId).emit('call ended');
    });

}

module.exports = SocketServer





