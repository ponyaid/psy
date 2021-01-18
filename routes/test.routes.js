const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Test = require('../models/Test')
const Pupil = require('../models/Pupil')


const router = Router()

router.post('/create', async (req, res) => {
    try {
        const { conditionId, pupils } = req.body

        for (let pupilId of pupils) {
            const test = new Test({ conditionId, pupil: pupilId })
            await test.save()

            await Pupil.findById(pupilId, function (err, pupil) {
                if (!err) {
                    pupil.tests = [...pupil.tests, test._id]
                    pupil.save()
                }
            })
        }

        res.status(201).json({ message: "Success" })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

router.post('/solution', async (req, res) => {
    try {
        const { testId, solution } = req.body

        const test = await Test.findByIdAndUpdate(testId, { solution })

        res.status(201).json({ test })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

router.get('/', auth,
    async (req, res) => {
        try {
            const tests = await Test.find({ pupil: req.user.userId }).populate('condition')
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

router.get('/not-passed', auth,
    async (req, res) => {
        try {
            const tests = await Test.find({ pupil: req.user.userId, solution: null })
            res.json(tests)

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
        res.json(test)

    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

module.exports = router