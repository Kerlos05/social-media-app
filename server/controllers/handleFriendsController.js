
const User = require('../model/User'); 

const handleNewFriend = async(req, res) => {
   const {username, friendToAdd} = req.body; 

    // Check if the requested name is in the DB
    const foundFriend = await User.findOne({ username: friendToAdd });
    const foundUser = await User.findOne({ username: username}); 

    if(!foundFriend || !foundUser){
      return res.status(404).json({'Message' : `${friendToAdd || username} not found`});
    } else{

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
  const friend = req.body.friendToAdd;
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
  
    // When two users are chating with each other we have to delete that chat
    // await User.updateMany(
    //   { username: username },
    //   { $pull: { message: { $elemMatch: { $eq: friend } } } }
    // ).exec();
  
    // await User.updateMany(
    //   { username: friend },
    //   { $pull: { message: { $elemMatch: { $eq: username } } } }
    // ).exec();  


    res.status(200).json({foundUser}).end();

  } catch(err){
    console.log(err);
  }
}


const handleGetFriend = async (req, res) => {
  const { username } = req.params;
  const foundUser = await User.findOne({ username });
  const friends = foundUser.friendsTo

  res.json({ friends })
};


module.exports = {handleNewFriend, handleGetFriend, handleDeleteFriend};