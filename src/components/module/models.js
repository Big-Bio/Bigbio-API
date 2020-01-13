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

Module.prototype.saveData = async function(data){
    property = ['title', 'content', 'sup_notes', 'ack', 'collab', 'doi', 'keyterms']
    for(var i = 0; i < property.length; i++){
        this[property[i]] = data[property[i]];
    }
    return this.save().catch(() => { throw 'Module Saving Error' })
}

Module.getById = async (id) => {
    const mod =  await Module.findOne({where: {module_id: id}})
    if (mod == null){ return false }
    return mod
}

Module.getByTitle = async(title) => {
    const mod = await Module.findOne({ where: { title: title } })
    if (mod == null){ return false }
    return mod
}

Module.submit = async () => {
    
}



module.exports = {
    Module: Module
}