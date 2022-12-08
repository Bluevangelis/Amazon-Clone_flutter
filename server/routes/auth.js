const e = require('express');
const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/api/signup', async(req,res) => {
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        //itu if dibawah mengecek apakah itu xistin guser ada isinya atau tidak
        if(existingUser){
            return res.status(400).json({msg:"user sudah ada"});
        }

        const hashedPassword = await bcryptjs.hash(password,8);

        let user = new User({
            email,
            password : hashedPassword,
            name
        })
        user = await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({error : e.message});
    }
});

authRouter.post('/api/signin', async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({msg:'User with this email does now Exist'});
        }

        const isMatch = bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Incorrect Password'});
        }

        const token = jwt.sign({id:user._id}, "passwordKey");
        //(kode unik, String kriptik)
        res.json({token,...user._doc});
        //itu titik tiga kali berfungsi untuk de-strukturisasi objek
        //itu _doc berfungsi karena hanya baigan itu yang diperlukan

    } catch (error) {
        res.status(500).json({error : e.message});
    }
});

authRouter.post('/tokenIsvalid', async(req,res) => {
    try {
        const token = req.header('x-auth-token');

        if(!token) return res.json(false);

        const isVerified = jwt.verify(token,"passwordKey");
        if(isVerified) return res.json(false);

        const user = await User.findById(isVerified.id);
        if(!user) return res.json(false);
        res.json(true);
    } catch (error) {
        res.status(500).json({error : e.message});
    }
});

authRouter.get('/', auth, async (req,res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc,token : req.token});
}), 

module.exports = authRouter;