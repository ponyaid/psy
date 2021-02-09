const { Schema, model } = require('mongoose')


const schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String },
    body: { type: Object, required: true },
    xml: { type: String, required: true }
})


module.exports = model('Condition', schema)