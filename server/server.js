require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors()); 
const connectDB = require('./config/dbConn');
const mongoose  = require('mongoose');
const User = require('./model/User');

connectDB(); 

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/handleFriend', require('./routes/handleFriends'));
app.use('/handle-post', require('./routes/handlePost'));


app.post('/get-image', async(req, res) => {
  const username = req.body.username; 
  try{
    const user = await User.findOne({ username });
    res.send({Status: 'ok', data: user.image});
  } catch(err){
      res.send({Status: 'error', data: err}); 
      console.log(err);
  }
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});