const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    sex: { type: String },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    terms: { type: Boolean },
    resolution: { type: Boolean },
    birthday: {type: Date, required: true},

    class: {type: Types.ObjectId, ref: 'Class'},

    psych: {type: Types.ObjectId, ref: 'Psych'},

    tests: [{ type: Types.ObjectId, ref: 'Test' }]

})


module.exports = model('Pupil', schema)