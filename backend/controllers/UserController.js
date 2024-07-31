const User = require('../models/User');

module.exports = class UserController{
    static async register(req, res){
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if(!name){
            return res.status(400).json({message: 'O nome é obrigatório'});
        }

        if(!email){
            return res.status(400).json({message: 'O email é obrigatório'});
        }

        if(!phone){
            return res.status(400).json({message: 'O telefone é obrigatório'});
        }

        if(!password){
            return res.status(400).json({message: 'A senha é obrigatória'});
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: 'As senhas não conferem'});
        }

        const userExists = await User.findOne({email: email});

        if(userExists){
            return res.status(400).json({message: 'Email já cadastrado'});
        }
    }
}