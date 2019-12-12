const Module = require('./models').Module
const Joi = require('joi')

module.exports = {
    save: async (req, res) => {
        var result = await Module.save(req)
        res.send(result)
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