require('dotenv').config()
const sequelize = require('sequelize')
const db = require('../../config/db')

const Module = db.define('modules', {
    module_id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    author_id: { type: sequelize.INTEGER },
    status: { type: sequelize.STRING },
    title: { type: sequelize.STRING },
    content: { type: sequelize.STRING },
    sup_notes: { type: sequelize.STRING },
    ack: { type: sequelize.STRING },
    collab: { type: sequelize.STRING },
    doi: { type: sequelize.STRING },
    keyterms: { type: sequelize.STRING },
    parent_id: { type: sequelize.INTEGER },
    approved_by: { type: sequelize.INTEGER },
    date_created: { type: sequelize.DATE },
    date_modified: { type: sequelize.DATE },
}, { timestamps: false })

Module.save = async (req) => {
    try{
        let mod_obj
        if (!req.body.module_id)
            mod_obj = Module.build()
        else
            mod_obj = await Module.findOne({ where: { module_id: req.body.module_id, author_id: req.token.user_id } })
        const data = req.body
        prop = ['title', 'content', 'sup_notes', 'ack', 'collab', 'doi', 'keyterms']
        for (var i = 0; i < prop.length; i++) {
            mod_obj[prop[i]] = data[prop[i]]
        }
        mod_obj.author_id = req.token.user_id
        mod_obj.date_created = Date.now()
        mod_obj.date_modified = mod_obj.date_created
        await mod_obj.save()
        return { status: true, module_id: mod_obj.module_id }
    }catch(e){
        return { status: false, msg: 'Saving error'}
    } 
}

Module.getById = async(id) => {
    const mod =  await Module.findOne({where: {module_id: id}})
    if (mod == null){
        return false
    }
    return mod
}

Module.getByTitle = async(title) => {
    const mod = await Module.findOne({ where: { title: title } })
    if (mod == null) {
        return false
    }
    return mod
}

Module.submit = async () => {

}

module.exports = {
    Module: Module
}