const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth.middleware')
const Psych = require('../models/Psych')
const School = require('../models/School')

require('../models/Class')


const router = Router()


router.get('/', auth,
    async (req, res) => {
        try {
            const schools = await School.find({ psych: req.user.userId }).populate('psych')
            res.json(schools)
        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

router.post('/create', auth,
    [
        check('name', 'Отсутствует название школы').notEmpty(),
        check('city', 'Отсутствует город').notEmpty(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при создании школы"
                })
            }

            const { name, city } = req.body

            const school = new School({ name, city, psych: req.user.userId })

            const psych = await Psych.findById(req.user.userId)
            await psych.updateOne({ schools: [...psych.schools, school] })

            await school.save()

            res.status(201).json({ school, message: "Школа успешно создана" })


        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/:id', auth,
    async (req, res) => {
        try {
            const school = await School.findById(req.params.id).populate('classes')
            res.json(school)

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router