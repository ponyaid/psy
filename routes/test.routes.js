const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Test = require('../models/Test')
const Pupil = require('../models/Pupil')
const History = require('../models/History')
const Condition = require('../models/Condition')


const router = Router()

router.post('/create', auth,
    async (req, res) => {
        try {
            const { conditionId, pupils } = req.body

            if (!pupils.length) {
                throw new Error('Выберите хотя бы одного ученика')
            }

            for (let pupilId of pupils) {
                const test = new Test({ conditionId, pupil: pupilId, psych: req.user.userId })
                await test.save()

                await Pupil.findById(pupilId, function (err, pupil) {
                    if (!err) {
                        pupil.tests = [...pupil.tests, test._id]
                        pupil.save()
                    }
                })
            }

            await Condition.findOne({ id: conditionId }, function (err, condition) {
                if (!err) {
                    const history = new History({
                        type: 'Тест',
                        psych: req.user.userId,
                        title: condition.name,
                        desc: condition.desc,
                        docId: condition._id,
                        pupils: pupils
                    })
                    history.save()
                }
            })

            res.status(201).json({ message: "Тесты успешно отправлены" })

        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    })

router.post('/solution', async (req, res) => {
    try {
        const { testId, solution, normStatus } = req.body
        const test = await Test.findByIdAndUpdate(testId, { solution, normStatus })
        res.status(201).json({ test })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

router.get('/by-pupil-id', auth,
    async (req, res) => {
        try {
            const tests = await Test.find({ pupil: req.user.userId })
                .sort({ date: 'desc' })
                .populate('condition')
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

router.get('/by-psych-id', auth,
    async (req, res) => {
        try {
            const tests = await Test.find({ psych: req.user.userId })
                .sort({ date: 'desc' })
                .populate('condition')
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('condition')
        res.json(test)

    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

module.exports = router