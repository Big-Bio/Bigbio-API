const Models = require('./models')
const User = Models.User
const Email = Models.Email
const Joi = require('joi')

module.exports = {
    login: async (req, res) => {
        try{
            const asset = await User.findOne({ where: { username: req.body.username } })
            if (asset == null) 
                res.json({ status: false, msg: 'Invalid username' })
            else
                if (await asset.validatePassword(req.body.password))
                    res.json({status: true, token: asset.generateJWT()})    
                else
                    res.json({status: false, msg: "Invalid password"})
        }
        catch{
            res.status(400)
        }
    },
    signup: async (req, res) => {
        User.signup(req.body.email)
        .then((vkey) => res.json( { status: true, vkey: vkey }))
        .catch((e) => res.json( { status: false, msg: 'Invalid email' } ))
    },
    register: async (req, res) => {
        const schema = Joi.object({
            vkey: Joi.string().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(30).required()
        })
        try{
            await schema.validate({username: req.body.username, password: req.body.password, vkey: req.body.vkey})
            const asset = await User.findOne({ where: { vkey: req.body.vkey, registered: 0 } })
            if(asset == null){
                res.json({status: false, err: 'vkey', msg: 'Invalid vkey'})
            }
            else{
                if(await asset.register(req.body.username, req.body.password, req.body.vkey)){
                    res.json({ status: true, msg: 'Account registered' })
                }
                else{
                    res.json({ status: false, err: 'vkey', msg: 'Invalid vkey' })
                }
            }
        }
        catch(e){
            res.json({ status: false, err: e.details[0].path[0], msg: e.details[0].message});
        }
    }
}