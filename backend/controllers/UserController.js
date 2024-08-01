const User = require('../models/User');
const bcrypt = require("bcrypt");
const createUserToken = require('../helpers/create-user-token');

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

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        });

        try {
            const newUser = await user.save();
            
            await createUserToken(newUser, req, res);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

    static async login(req, res){
        const email = req.body.email;
        const password = req.body.password;

        if(!email){
            return res.status(400).json({message: 'O email é obrigatório'});
        }

        if(!password){
            return res.status(400).json({message: 'A senha é obrigatória'});
        }

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(400).json({message: 'Email não cadastrado'});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(400).json({message: 'Senha inválida'});
        }

        await createUserToken(user, req, res);
    }

    static async checkUser(req, res){
        let currentUser;

        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            currentUser = await User.findById(decoded.id);
        }else{
            currentUser = null;
        }

        res.status(200).json({user: currentUser});

    }
}