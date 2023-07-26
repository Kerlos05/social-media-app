const User = require('../model/User');
const Chat = require('../model/Chat');
const Feed = require('../model/FeedDetails');

const handleChangeCredentials = async (req, res) => {
    const {newAvatar, user, oldUsername, oldAvatar} =  req.body; 

    if (!user && !newAvatar) {
        return res.status(400).json({ 'message': 'Username or image are required' });
    }

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.status(409).json({ 'message': 'Username already exists' });
    }

    try{

        const userToBeUpdated = await User.findOneAndUpdate(
            { username: oldUsername },{
              $set: {
                username: user ? user : oldUsername,
                image: newAvatar ? newAvatar.toString() : oldAvatar.toString()
              }
            },
            { new: true } 
        );

        const updateChatUser= await Chat.findOne(
            { 'username': oldUsername },
        );
        updateChatUser.username = user ? user : oldUsername; 
                
        updateChatUser.save(); 
        userToBeUpdated.save();

        await Chat.updateMany(
            { "message": { $elemMatch: { 0: oldUsername } } },
            { $set: { "message.$[outer].0": user ? user : oldUsername } },
            { arrayFilters: [{ "outer.0": oldUsername }] }
        );
        await User.updateMany(
            { friendsTo: oldUsername },
            { $set: { "friendsTo.$": user ? user : oldUsername }}
        );

        await Feed.updateMany(
            { username: oldUsername },{
              $set: {
                avatar: newAvatar ? newAvatar.toString() : oldAvatar.toString(),
                username: user ? user : oldUsername
              }
            }
        );

        await Promise.all([
            userToBeUpdated, 
            updateChatUser, 
        ]); 

        return res.status(200).json({ 'message':'success' }).end();
    }   catch(err){
        console.log('logged');
        return res.status(500).json({ 'message': err.message });
    }

}

module.exports =  handleChangeCredentials ;