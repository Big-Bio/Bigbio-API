const Models = require('./models')
const User = Models.User
const Email = Models.Email
const Joi = require('joi')

module.exports = {
    login: async (req, res) => {
        try{
            const asset = await User.findOne({ where: { username: req.body.username } })
            if (asset == null) 
                res.json({ message: 'Invalid username' })
            else
                if (await asset.validatePassword(req.body.password))
                    res.json({message: "success", token: asset.generateJWT()})    
                else
                    res.json({ message: "Invalid password"})
        }
        catch{
            res.status(400)
        }
    },
    signup: async (req, res) => {
        User.signup(req.body.email)
        .then((vkey) => res.json( { message: 'success', vkey: vkey }))
        .catch((e) => res.json( { message: 'Invalid email' } ))
    },
    register: async (req, res) => {
        User.findOne({ where: { vkey: req.body.vkey } })
            .then((asset) => {
                if (asset == null)
                    throw 'Invalid key'
                return asset
            })
            .then((asset) => asset.register(req.body))
            .then((success) => {
                if (!success)
                    throw 'Invalid key'
                res.json({ message: 'success' })
            })
            .catch((e) => {
                try{
                    res.json({ message: e.errors[0].message })
                }
                catch{
                    res.json({ message: e })
                }      
            })
    }
}