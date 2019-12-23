const Models = require('./models')
const User = Models.User
const Joi = require('joi')
const auth = require('../../middleware/auth')

module.exports = {
    login: async (req, res) => {
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(30).required()
        })
        try{
            await schema.validate({ username: req.body.username, password: req.body.password })
            const asset = await User.findOne({ where: { username: req.body.username, registered: 1 } })
            if (asset == null) 
                res.json({ msg: 'Invalid username', err: 'username' })
            else
                if (await asset.validatePassword(req.body.password)){
                    await User.update({ logged_at: Date.now() }, { where: { username: req.body.username } })
                    res.json({ token: asset.generateJWT()})
                }
                else
                    res.json({ msg: "Invalid password", err: 'password'})
        }
        catch(e){
            res.json({ msg: e.details[0].message, err: e.details[0].path[0] });
        }
    },
    signup: async (req, res) => {
        //SEND EMAIL WITH VKEY
        User.signup(req.body.email)
        .then((vkey) => res.json( { vkey: vkey }))
        .catch((e) => res.json( { msg: 'Invalid email' } ))
    },
    register: async (req, res) => {
        const schema = Joi.object({
            vkey: Joi.string().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(30).required()
        })
        try{
            const asset = await User.findOne({ where: { vkey: req.body.vkey, registered: 0 } })
            if(asset == null){
                res.json({ msg: 'Invalid link', err: 'vkey' })
            }
            else{
                await schema.validate({ username: req.body.username, password: req.body.password, vkey: req.body.vkey })
                const reg = await asset.register(req.body.username, req.body.password, req.body.vkey)
                if(reg.msg != null){
                    res.json({})
                }
                else{
                    res.status(400).json({ msg: reg.msg, err: reg.err })
                }
            }
        }
        catch(e){
            res.json({ msg: e.details[0].message, err: e.details[0].path[0] });
        }
    },
    verify: async (req,res) => {
        if(req.body.token == null)
            res.status(400).json({msg: 'Nothing to verify'})
        else{
            const tok = await auth.extract(req.body.token)
            if(tok){
                res.json( {user_id: tok.user_id, username: tok.username, email: tok.email, user_role: tok.user_role})
            }else{
                res.status(400).json({msg: 'Unable to verify'})
            }
        }
    }
}