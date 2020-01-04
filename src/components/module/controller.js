const Module = require('./models').Module
const Joi = require('joi')
const { Op } = require('sequelize')

module.exports = {
    //add authentication for modules not ready
    get: async (req,res) => {
        if(!req.query.id && !req.query.title){ res.status(400).json({ msg: 'Invalid request' }) }
        if(req.query.id){
            const mod = await Module.getById(req.query.id)
            if (!mod) {
                res.json({ msg: 'Invalid Module ID' })
            }
            res.json({ status: true, module: mod })
        }else if(req.query.title){
            const mod = await Module.getByTitle(req.query.title)
            if (!mod) {
                res.json({ msg: 'Invalid Module title' })
            }
            res.json({ module: mod })
        }
    },
    getRecent: async (req, res) => {
        //let time = new Date(req.body.datetime)
        const time = Date.now()
        try{
            const mods = await Module.findAll({ limit: 10, where: { author_id: req.token.user_id, date_modified: { [Op.lte]: time } }, order: [['date_modified', 'DESC']] })
            if ( mods == null || mods.length == 0 ){ throw 'err' } else { res.json({ modules: mods }) }
        }
        catch{
            res.json({msg: 'No modules left'})
        }
    },
    save: async (req, res) => {
        var result = await Module.save(req.body, req.token.user_id)
        if(result) { res.json({ module_id: result }) }
        else { res.json({ msg: 'Invalid save'}) }
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