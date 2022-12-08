const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).json({msg:"No Auth token, access denied"});

        const isVerified = jwt.verify(token,"passwordKey");
        if(isVerified) return res.status(401).json({msg: 'Token verification failed, authorization denied'});

        //ingat ini middleware, jadi sebelum seluruh data terikirim kau bisa tambahkan atau manipulasi data terlebih dahulu
        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = auth;