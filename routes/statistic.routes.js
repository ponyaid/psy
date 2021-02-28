const { Router } = require('express')
const { Types } = require('mongoose')
const auth = require('../middleware/auth.middleware')
const Test = require('../models/Test')


const router = Router()


router.get('/conditions', auth,
    async (req, res) => {
        try {

            const tests = await Test.aggregate([
                { $match: { psych: Types.ObjectId(req.user.userId) } },
                { $lookup: { from: 'conditions', localField: 'conditionId', foreignField: 'id', as: 'condition' } },
                { $group: { _id: "$conditionId", tests: { $push: "$$ROOT" }, "conditionName": { $push: "$condition.name" } } }
            ])

            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/conditions/:id', auth,
    async (req, res) => {
        try {
            const tests = await Test.aggregate([
                { $match: { psych: Types.ObjectId(req.user.userId), conditionId: Number(req.params.id) } },
                { $lookup: { from: 'conditions', localField: 'conditionId', foreignField: 'id', as: 'condition' } },
                { $lookup: { from: 'pupils', localField: 'pupil', foreignField: '_id', as: 'pupil' } },
                { $lookup: { from: 'classes', localField: 'pupil.class', foreignField: '_id', as: 'class' } },
                { $lookup: { from: 'schools', localField: 'class.school', foreignField: '_id', as: 'school' } },
                { $group: { _id: "$normStatus", tests: { $push: "$$ROOT" } } },

                {$project: {id: 1, tests: 1, }}
            ])

            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router