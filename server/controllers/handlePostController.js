// We should be able to delete the post later 
const Feed = require('../model/FeedDetails'); 
const User = require('../model/User'); 

const handleNewPost = async(req, res) => {
    const {username, post, title, avatar} = req.body; 

    if (username === '') {
        return res.status(400);
    }   else if( title === '' && post.length <= 0){
        return res.status(400);
    }
    try{
        await Feed.create({
            'post': post, 
            "username": username,
            "title": title,
            "avatar": avatar
        });
        
        return res.status(200).end(); 
    }   catch (e) {
        return res.status(400).json({message: `${e}`}).end(); 
    }
   
}

const handleAddComment = async(req, res) => {
    const {comment, index, fromComment, lookingForUser} = req.body;

    if(!fromComment){
        const findComments = await Feed.find();

        const findComment = findComments[index];
        findComment.comments.push(comment); 
    
        try {
            await findComment.save(); 
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }   else{
        const findComments = await Feed.find({username: lookingForUser});
        const findComment = findComments[index];
        findComment.comments.push(comment); 
    
        try {
            await findComment.save(); 
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' }).end();
        }
    }

}


const handleDeletePost = async(req, res) => {
   try{
    const {username, index} = req.body
    const findComments = await Feed.find({username: username});
    const findComment = findComments[index];

    if (!findComment){
        return res.status(404).json({ message: "Post not found" }).end();
    }   
    
    const feedRes = await Feed.deleteOne({ username: findComment.username, _id: findComment._id }).exec();


    return res.status(200).end();
    }   catch(e) {
        return res.status(500).json({ message: "Internal server error" }).end();
    }

}


const handleGetPosts = async(req, res) => {
    const all =  await Feed.find(); 
    if(all.length >= 0){
        return res.status(200).json({all}).end(); 
    }
}



module.exports = {handleNewPost, handleGetPosts, handleAddComment, handleDeletePost}