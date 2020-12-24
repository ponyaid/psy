const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    sex: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    terms: { type: Boolean },
    resolution: { type: Boolean },

    walkthroughs: [{ type: Types.ObjectId, ref: 'Walkthrough' }]

})


module.exports = model('Pupil', schema)