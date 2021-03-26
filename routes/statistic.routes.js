const { Router } = require('express')
const { Types } = require('mongoose')
const auth = require('../middleware/auth.middleware')
const Test = require('../models/Test')


const router = Router()


router.get('/for-schools/', auth,
    async (req, res) => {
        try {
            const tests = await Test.aggregate([
                { $match: { psych: Types.ObjectId(req.user.userId) } },
                { $lookup: { from: 'schools', localField: 'school', foreignField: '_id', as: 'schoolDetails' } },
                { $group: { _id: "$school", tests: { $push: "$$ROOT" }, "schoolName": { $push: "$schoolDetails.name" } } }
            ])
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/for-classes/:schoolId', auth,
    async (req, res) => {
        try {
            const tests = await Test.aggregate([
                { $match: { psych: Types.ObjectId(req.user.userId), school: Types.ObjectId(req.params.schoolId) } },
                { $lookup: { from: 'classes', localField: 'class', foreignField: '_id', as: 'classDetails' } },
                {
                    $group: {
                        _id: "$class", tests: { $push: "$$ROOT" },
                        "classNumber": { $push: "$classDetails.number" },
                        "classLetter": { $push: "$classDetails.letter" }
                    }
                }
            ])
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/conditions/:classId', auth,
    async (req, res) => {
        try {
            const tests = await Test.aggregate([
                { $match: { psych: Types.ObjectId(req.user.userId), class: Types.ObjectId(req.params.classId) } },
                { $lookup: { from: 'conditions', localField: 'conditionId', foreignField: 'id', as: 'condition' } },
                { $group: { _id: "$conditionId", tests: { $push: "$$ROOT" }, "conditionName": { $push: "$condition.name" } } }
            ])

            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/conditions/:classId/:conditionId', auth,
    async (req, res) => {
        try {
            const tests = await Test.aggregate([
                {
                    $match: {
                        psych: Types.ObjectId(req.user.userId),
                        class: Types.ObjectId(req.params.classId),
                        conditionId: Number(req.params.conditionId)
                    }
                },
                { $lookup: { from: 'conditions', localField: 'conditionId', foreignField: 'id', as: 'condition' } },
                { $lookup: { from: 'pupils', localField: 'pupil', foreignField: '_id', as: 'pupil' } },
                { $lookup: { from: 'classes', localField: 'pupil.class', foreignField: '_id', as: 'class' } },
                { $lookup: { from: 'schools', localField: 'class.school', foreignField: '_id', as: 'school' } },
                { $group: { _id: "$normStatus", tests: { $push: "$$ROOT" } } },

                { $project: { id: 1, tests: 1, } }
            ])

            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router

