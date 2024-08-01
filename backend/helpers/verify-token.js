const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

const checkToken = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).json({message: 'Token não fornecido'});
    }

    const token = getToken(req);

    if(!token){
        return res.status(401).json({message: 'Token inválido'});
    }

    try{
        jwt.verify(token, 'nossosecret');
        req.user = verified;
        next();
    }catch(err){
        return res.status(401).json({message: 'Token inválido'});
    }
}

module.exports = checkToken;