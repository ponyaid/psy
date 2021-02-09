const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth.middleware')
const School = require('../models/School')
const Class = require('../models/Class')


const router = Router()


router.post('/create', auth,
    [
        check('number', 'Неверный номер класса').notEmpty().isNumeric(),
        check('letter', 'Отсутствует буква класса').notEmpty(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при создании класса"
                })
            }

            const { number, letter, schoolId } = req.body

            const newClass = new Class({ number, letter, school: schoolId, psych: req.user.userId })

            const school = await School.findById(schoolId)
            await school.updateOne({ classes: [...school.classes, newClass] })

            await newClass.save()

            res.status(201).json({ newClass })


        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.get('/:id',
    async (req, res) => {
        try {
            const group = await Class.findById(req.params.id)
                .populate('school').populate('psych').populate('pupils')
            res.json(group)

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router