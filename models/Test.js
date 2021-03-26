const { Schema, model, Types } = require('mongoose')


const schema = new Schema({
    solution: { type: String },
    normStatus: { type: Boolean },
    date: { type: Date, default: Date.now },
    conditionId: { type: Number, required: true },
    pupil: { type: Types.ObjectId, ref: 'Pupil', required: true },
    psych: { type: Types.ObjectId, ref: 'Psych', required: true },
    class: { type: Types.ObjectId, ref: 'Class', required: true },
    school: { type: Types.ObjectId, ref: 'School', required: true },
}, { toJSON: { virtuals: true } })

schema.virtual('condition', {
    ref: 'Condition',
    localField: 'conditionId',
    foreignField: 'id',
    justOne: true,
})


module.exports = model('Test', schema)