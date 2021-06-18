const mongoose = require('mongoose')
const Schema = mongoose.Schema

var user = new Schema ({
    id: { type: Number, require: true, unique: true},
    password: {type: String, require: true },
    role: {type: String, default:'user'},
    template: { type: Number, require: true },
    name: { type: String, require: true },
    lastname: { type: String, require: true },
    jobposition: { type: String, require: true },
    image : { type: String, require: true },
    
    
})

var putin = new Schema ({
    template: { type: Number, require: true },
    temp: { type: Number, require: true },
    time: { type: String, require: true },
    status: { type: Boolean, require: true }
})

var waterLevel = new Schema({
    status: { type: Boolean, require: true },
})

const userSchema = mongoose.model('users', user)
const putinSchema = mongoose.model('Putin', putin)
const waterLevelSchema = mongoose.model('Waterlevel', waterLevel)

module.exports = {user: userSchema, putin: putinSchema, waterlevel: waterLevelSchema}  