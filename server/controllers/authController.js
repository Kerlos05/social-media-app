const User = require('../model/User');
const argon2 = require('argon2');

const isLoggedIn = {}; // Object to store logged-in status

const handleLogin = async (req, res) => {
    const user = req.body.username;
    const pwd = req.body.password;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.status(401).json({ 'message': 'Password or username are incorrect.' });
    }

    const match = await argon2.verify(foundUser.password, pwd); 

    if (isLoggedIn[user]) {
        return res.status(401).json({ message: 'User is already logged in.' });
    }

    if (match) {
        isLoggedIn[user] = true;
        return res.sendStatus(200);
    } else {
        return res.status(401).json({'message': 'Password or username are incorrect.'});
    }
}

module.exports =  handleLogin ;