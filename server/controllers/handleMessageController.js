const Chat = require('../model/Chat');


const sendMessage = async(req, res) => {
  const content = req.body.content;
  const currentUser = req.body.username;
  const selectedFriend = req.body.selectedFriend;

  try {
      let foundUser = await Chat.findOne({ username: currentUser }).exec();
      if (!foundUser) {
        foundUser = new Chat({ username: currentUser, message: [[selectedFriend, content]] });
      } else {
        foundUser.message.push([selectedFriend, content]);
      }
  
      let foundFriend = await Chat.findOne({ username: selectedFriend }).exec();
      if (!foundFriend) {
        foundFriend = new Chat({ username: selectedFriend, message: [[currentUser, content]] });
      } else {
        foundFriend.message.push([currentUser, content]);
      }
  
      await foundUser.save();
      await foundFriend.save();
      res.status(200).end();
    } catch (err) {
      console.log(err.message);
      res.status(500).end();
  }
}


const getAllMessages = async (req, res) => {
  try {
    const { selectedFriend, username } = req.body;
    
    const user = await Chat.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    let messages = [];
      if (user.message.length > 0) {
        messages = user.message.filter((arr) => arr[0] === selectedFriend);
      }   

    return res.json( messages ).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};
  


const deleteMessage = async(req, res) => {
  const { username, messageToRemove: content, friend: selectedFriend, index } = req.body;

  try {
    const foundUser = await Chat.findOne({ username: username });

    if (index !== -1) {
      foundUser.message.splice(index, 1);
    }
  
    await foundUser.save();
  
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }

}



module.exports = {getAllMessages, sendMessage, deleteMessage}; 