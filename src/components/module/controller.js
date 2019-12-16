const Module = require('./models').Module
const Joi = require('joi')

module.exports = {
    get: async (req,res) => {
        if(!req.query.id && !req.query.title){
            res.status(400).json({ status: false, err: 'Invalid request' })
        }
        if(req.query.id){
            const mod = await Module.getById(req.query.id)
            if (!mod) {
                res.json({ status: false, err: 'Invalid Module ID' })
            }
            res.json({ status: true, module: mod })
        }else if(req.query.title){
            const mod = await Module.getByTitle(req.query.title)
            if (!mod) {
                res.json({ status: false, err: 'Invalid Module title' })
            }
            res.json({ status: true, module: mod })
        }
    },
    save: async (req, res) => {
        var result = await Module.save(req.body, req.token.user_id)
        if(result)
            res.json({status: true, module_id: result})
        else
            res.json({status:false, err: 'Invalid save'})
    },
    submit: async (req, res) => {
        const schema = Joi.object({
            title: Joi.string().max(100).required().label('Title'),
            content: Joi.string().max(500).required(),
            sup_notes: Joi.string().max(300).required(),
            ack: Joi.string().max(300).required(),
            collab: Joi.string().max(200).required(),
            doi: Joi.string().max(300).required(),
            keyterms: Joi.string().max(100).required()
        })
    },
    publish: async (req, res) => {
        
    }
}