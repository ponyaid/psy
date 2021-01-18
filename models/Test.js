const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    date: { type: Date, default: Date.now },
    solution: { type: String },
    conditionId: { type: Number, required: true },
    pupil: { type: Types.ObjectId, ref: 'Pupil' },
}, { toJSON: { virtuals: true } })


schema.virtual('condition', {
    ref: 'Condition',
    localField: 'conditionId',
    foreignField: 'id',
    justOne: true,
})


module.exports = model('Test', schema)