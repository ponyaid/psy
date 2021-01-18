const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    number: { type: Number, required: true },
    letter: { type: String, required: true },

    school: { type: Types.ObjectId, ref: 'School' },
    psych: {type: Types.ObjectId, ref: 'Psych'},

    pupils: [{ type: Types.ObjectId, ref: 'Pupil' }]
})


module.exports = model('Class', schema)