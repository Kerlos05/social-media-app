require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json({ limit: '10mb' }));
app.use(cors()); 
const connectDB = require('./config/dbConn');
const mongoose  = require('mongoose');
const User = require('./model/User');

connectDB(); 

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/handleFriend', require('./routes/handleFriends'));
app.use('/handle-post', require('./routes/handlePost'));
app.use('/handleMessage', require('./routes/handleMessage')); 
app.use('/delete-user', require('./routes/deleteUser')); 
app.use('/edit-profile', require('./routes/editProfile')); 

app.post('/get-image', async(req, res) => {
  const username = req.body.username; 
  try{
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      console.log('not found ');
      return res.status(404).json({ Status: 'error', message: 'User not found' });
    }
    res.send({Status: 'ok', data: user.image}).end(); 
  } catch(err){
    res.send({Status: 'error', data: err}); 
    console.log(err);
  }
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

    
  const io = require('socket.io')(4500, {
    cors: {
      origin: ['http://localhost:3000']
    },
  });


  io.on('connection', (socket) => {
    socket.on('updateMessageUI', (username) => {
      socket.broadcast.emit('updateMessage', username);
    });
    
    socket.on('updateFriendUI', (userToUpdate) => {
      socket.broadcast.emit('updateFriend', userToUpdate);
    });
    
    socket.on('updatePostUI', () => {
      socket.broadcast.emit('updatePost');
    });

  })

});