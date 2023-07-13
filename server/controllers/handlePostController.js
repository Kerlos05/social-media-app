// We should be able to delete the post later 
const Feed = require('../model/FeedDetails'); 
const User = require('../model/User'); 



const handleNewPost = async(req, res) => {
    const {username, image, title, avatar} = req.body; 

    if(username === '' || title === ''){
        return res.status(400); 
    }

    const result = await Feed.create({
        'image': image, 
        "username": username,
        "title": title,
        "avatar": avatar
    });
    
    // console.log(result);
    
    return res.status(200).end(); 
}


const handleGetPosts = async(req, res) => {
    const all =  await Feed.find(); 

    if(all.length > 0){
        return res.status(200).json({all}).end(); 
    }
}



module.exports = {handleNewPost, handleGetPosts}