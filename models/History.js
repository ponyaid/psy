const { Schema, model, Types } = require('mongoose')


const schema = new Schema({
    date: { type: Date, default: Date.now },
    psych: { type: Types.ObjectId, ref: 'Psych' },
    type: { type: String },
    title: { type: String },
    desc: { type: String },
    docId: { type: Types.ObjectId },
    doc: {},
    pupils: [{ type: Types.ObjectId, ref: 'Pupil' }]
})


module.exports = model('History', schema)