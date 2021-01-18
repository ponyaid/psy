const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true },
    city: { type: String, required:true },

    psych: { type: Types.ObjectId, ref: 'Psych' },
    classes: [{type: Types.ObjectId, ref: 'Class'}]
})


module.exports = model('School', schema)