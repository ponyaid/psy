const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    sex: { type: String },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    patronymic: { type: String },
    about: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    terms: { type: Boolean },
    createDate: { type: Date, default: Date.now },
    birthday: { type: Date, required: true },

    pupils: [{ type: Types.ObjectId, ref: 'Pupil' }],
    schools: [{ type: Types.ObjectId, ref: 'School' }],
    meets: [{ type: Types.ObjectId, ref: 'Meet' }]
})


module.exports = model('Psych', schema)