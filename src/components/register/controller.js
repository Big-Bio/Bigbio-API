const Joi = require('joi')
const Models = require('./models')
const Email = Models.Email



module.exports = {
    signup: async (req, res) => {
        const schema = Joi.object({ email: Joi.string().required().email() })
        try{
            if (await schema.validate({ email: req.body.email }).error !== null)
                throw 'err'
            vkey = await Email.insert(req.body.email);
            if ( vkey === false)
                throw 'err'
            res.json({ message: 'sucess', vkey: vkey})
            
        }
        catch{
            res.json({ message: 'Invalid email' })
        }
    }
}