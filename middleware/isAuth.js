const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

module.exports=async(req,res,next)=>{

    try{
        const token=req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
          }
        
          jwt.verify(token, "secretKey", (err, decoded) => {
            if (err) {
                
              return res.status(403).json({ message: 'Invalid token' });
            }
            req.userId = decoded.user._id;
            // console.log( req.userId);
             // Add decoded data to the request object
            next();
          })
        }
    
    catch(error){
        // console.log(err2);
        console.log(error);
        return res.status(401).send({error:"not authorized"});
    }
}