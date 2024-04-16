const jwt = require('jsonwebtoken');
const verifyToken = async(req,res,next) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err, user)=>{
            if(err) throw err;
            res.json(user);
        })
        
    }
    else{
        res.json(null);
    }
    next();
}
module.exports = verifyToken;