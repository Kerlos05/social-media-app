
const User = require('../model/User'); 
const Chat = require('../model/Chat');

const handleNewFriend = async(req, res) => {
   const {username, friendToAdd} = req.body; 

    // Check if the requested name is in the DB
    const foundFriend = await User.findOne({ username: friendToAdd });
    const foundUser = await User.findOne({ username: username}); 

    if(!foundFriend || !foundUser){
      return res.status(404).json({'Message' : `${friendToAdd || username} not found`});
    } else{
      const userFriendsTo = foundUser.friendsTo;
      const friendFriendsTo = foundFriend.friendsTo;

      if (userFriendsTo.includes(friendToAdd) || friendFriendsTo.includes(username)) {
        return res.status(400).json({ 'Message': `Duplicate friend request` });
      }

      foundFriend.friendsTo.push(username);
      foundUser.friendsTo.push(friendToAdd);

      try {
        await Promise.all([foundUser.save(), foundFriend.save()]);
      } catch (err) {
        console.error(err);
      }
      return res.status(201).json({'Message' : `${ friendToAdd } added`});
    }
}

const handleDeleteFriend = async(req, res) => {
  const friend = req.body.friendToDelete;
  const username = req.body.username;

  try{
    const foundUser = await User.findOneAndUpdate(
      { username: username },
      { $pull: { friendsTo: friend } },
      { new: true }
    )
  
    const foundFriend = await User.findOneAndUpdate(
      { username: friend },
      { $pull: { friendsTo: username } },
      { new: true }
    );
  
    await Chat.updateMany(
      { username: username },
      { $pull: { message: { $elemMatch: { $eq: friend } } } }
    ).exec();
  
    await Chat.updateMany(
      { username: friend },
      { $pull: { message: { $elemMatch: { $eq: username } } } }
    ).exec();  

    res.status(200).json({foundUser}).end();

  } catch(err){
    console.log(err);
  }
}

const handleGetFriend = async (req, res) => {
  const { username } = req.params;
  const foundUser = await User.findOne({ username }); 

  if (!foundUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const friends = foundUser.friendsTo || []; 

  res.json({ friends });
};


module.exports = {handleNewFriend, handleGetFriend, handleDeleteFriend};