const Module = require('./models')
const Joi = require('joi')
const { Op } = require('sequelize')
const moment = require('moment')

module.exports = {
    //return published module by name or title
    getPublished: async (req,res) => {
        const title = req.query.title || null
        const module_id = req.query.id || null
        
        Module.findOne({where: { [Op.and] : [ {status: 'publish'}, {[Op.or]: [ {title: title},{module_id: module_id} ]} ]} })
        .then((moduleObject) => {if(!moduleObject){throw 'err'} else { res.status(200).json(moduleObject) }})
        .catch(() => { res.status(200).json( {msg: 'Cannot find module'})})
    },
    //get 10 most recent owned modules. if datetime D is specified, return 10 recent modules modified after D
    getRecent: async (req, res) => {
        let time = moment(new Date(req.query.datetime)) || Date.now()
        Module.findAll({
            limit: 10, where: {
                author_id: req.token.user_id,
                date_modified: { [Op.lt]: time }
            },
            order: [['date_modified', 'DESC']]
        })
        .then((moduleObjects) => { res.status(200).json({modules: moduleObjects}) })
        .catch((e) => { res.json({msg: 'Invalid datetime'}) })
    },
    //returns owned module by ID
    load: (req, res) =>{
        const module_id = req.query.module_id
        Module.findOne({ where: { module_id: module_id, author_id: req.token.user_id } })
        .then((moduleObject) => { if (!moduleObject) { throw 'err' } else { res.json(moduleObject) }})
        .catch(() => { res.status(200).json({msg: 'Invalid Module ID'}) })
    },
    //if module_id specified and user owns module, update module
    //else create new module
    save: async (req, res) => {
        //find module by module_id
        Module.findOne({where : {module_id : req.body.module_id, author_id: req.token.user_id}})
        //creates new module
        .catch(() =>  {
            let moduleObject = Module.build()
            moduleObject.author_id = req.token.user_id
            moduleObject.author_name = req.token.username
            return moduleObject
        })
        //if moduleObject is not found with module_id, send error
        .then((moduleObject) => {
            if (!moduleObject) { throw 'Invalid module_id' }
            else { return moduleObject }
        })
        //save data into module
        .then((moduleObject) => moduleObject.saveData(req.body))
        .then(() => res.send())
        .catch((e) => res.json({msg: e}))
    },
    //submit module to admins for approval/revision
    submit: async (req, res) => {
        Joi.object({
            title: Joi.string().max(100).required().label('Title'),
            content: Joi.string().max(500).required().label('Content'),
            sup_notes: Joi.string().max(300).required().label('Supplement Notes'),
            ack: Joi.string().max(300).required().label('Acknowledgements'),
            collab: Joi.string().max(200).label('Collaborators'),
            doi: Joi.string().max(300).label('DOI'),
            keyterms: Joi.string().max(100).required().label('Key Terms'),
            module_id : Joi.number().required()
        })
        .validate(req.body)
        .catch((e) => { throw {msg: e.details[0].message, field: e.details[0].path}})
        .then(() => Module.findOne({where: {author_id: req.token.user_id, module_id: req.body.module_id}}))
        .then((moduleObject) => { if(!moduleObject) { throw {msg: 'Invalid Module ID'}} else {return moduleObject} })
        .then((moduleObject) => moduleObject.saveData(req.body))
        .then((moduleObject) => moduleObject.submit())
        .then(() => res.status(200).json())
        .catch((e) => { res.json(e) })
    },
    publish: async (req, res) => {
        Module.findOne({ where: {module_id: req.body.module_id }})
        .then((moduleObject) => moduleObject.publish())
        .then(() => res.status(200).json())
        .catch((e) => res.status(200).json({msg: 'Invalid Module ID'}))
    }
}