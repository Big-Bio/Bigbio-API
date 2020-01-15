const User = require('./models')
const Joi = require('joi')
const auth = require('../../middleware/auth')
const md5 = require('md5')
module.exports = {
    login: async (req, res) => {
        const username = req.body.username
        const password = req.body.password
        
        return Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(30).required()
        })
        //checks if valid username, password
        .validate({username: username, password: password})
        .then(() => User.findOne({where: {username: username }}))
        //if username doesn't exist or password doesn't match, throw err
        .then( async (user_account) => {
            if(!(await user_account.validatePassword(password))){ throw 'err' }
            else{ return user_account }
        })
        //create and return user's token
        .then((user_account) => user_account.generateJWT())
        .then((token) => { res.status(200).json({token: token })})
        .catch(() => res.json({msg: 'Invalid Username/Password'}))
    },
    signup: async (req, res) => {
        //ADD `SEND EMAIL WITH VKEY`

        //check if valid email
        const email = req.body.email
        const valid = await Joi.object({ email: Joi.string().required().email() })
        .validate({ email: email})
        .then(() => {return true})
        .catch((e) => { res.json({ msg: 'Invalid email'}); return false })
        if(!valid){ return }

        //check if email is already in use
        if(await User.exists({email: email})){
            res.json({msg: 'Email is taken'});
            return 
        }
        //create new User with email, vkey
        let user_account = User.build()
        user_account.email = email
        user_account.vkey = md5(email + Date.now())
        user_account.save()
        //CHANGE VKEY TO EMAIL LINK
        .then(() => { res.status(200).json({ vkey: user_account.vkey }) })
        .catch((e) => { res.status(400) })
    },
    register: (req, res) => {
        const username = req.body.username
        const password = req.body.password
        const vkey = req.body.vkey
        //schema to validate request data
        const schema = Joi.object({
            vkey: Joi.string().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(30).required()
        })
        //checks if valid username, password, vkey
        .validate({ username: username, password: password, vkey: vkey })
        .catch((e) => { throw {msg: e.details[0].message, field: e.details[0].path}})
        //if user cannot be found with vkey, throw vkey err 
        .then(() => User.findOne({ where: { vkey: vkey, registered: 0 } }))
        .then((user_account) => { if(user_account){return user_account} throw {msg: 'Invalid vkey', field: 'vkey'} })
        //register user
        .then((user_account) => user_account.register(username, password))
        .then(() => { res.status(200).send() })
        .catch((e) => { res.json(e) })
    },
    //unpacks user's token and sends result
    verify: (req,res) => {
         res.status(200).json(req.token)
    },
    //checks if vkey is valid (vkey exists in database and is not used)
    checkKey: (req,res) => {
        return User.findOne({ where: { vkey: req.query.vkey, registered: 0 } })
        .then((result) => {
            if(result) {return res.status(200).json()}
            else {return res.status(200).json({msg: 'Invalid verification key'})}
        })
    }
}