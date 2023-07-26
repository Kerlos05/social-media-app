const Chat = require('../model/Chat'); 
const Feed = require('../model/FeedDetails'); 
const User = require('../model/User'); 


const removeUser = async(req, res) => {
    const {username} = req.body;

    try {
      const usersToUpdate = await User.find({ friendsTo: username }).exec();
      const chatDeletionCurrentUser = Chat.deleteMany({ username });
      
      const updateChatPromises = usersToUpdate.map(async (user) => {
          const friend = user.username;
          await Chat.updateMany(
          { username: friend },
          { $pull: { message: { $elemMatch: { $eq: username } } } }
          ).exec();
      });

      
      const userUpdates = usersToUpdate.map((user) => {
        user.friendsTo = user.friendsTo.filter((friend) => friend !== username);
        return user.save();
      });
        
      const userDeletion = User.deleteOne({ username });
      const feedDeletion = Feed.deleteMany({ username });
      
      await Promise.all([
        ...userUpdates,
        userDeletion,
        feedDeletion,
        chatDeletionCurrentUser,
        updateChatPromises,
      ]);
  
      return res.status(200).end(); 
    } catch (err) {
        return res.status(500).end(); 
  }

}



module.exports = {removeUser}; 