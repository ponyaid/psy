const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth.middleware')
const Pupil = require('../models/Pupil')
const Class = require('../models/Class')


const router = Router()

// /api/pupil/register
router.post(
    '/register',
    [
        check('name', 'Отсутствует имя').notEmpty(),
        check('email', 'Некорректный email').isEmail(),
        check('birthday', 'Некорректная дата рождения').isDate(),
        check('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации"
                })
            }

            const { name, email, password, resolution, terms, sex, birthday, classId } = req.body

            const condaidate = await Pupil.findOne({ email })

            if (condaidate) {
                return res.status(400).json({ message: "Такой пользователь уже существует" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const pupil = new Pupil({
                name, email, password: hashedPassword, resolution, terms, sex, birthday, class: classId
            })

            const group = await Class.findById(classId)
            await group.updateOne({ pupils: [...group.pupils, pupil] })

            await pupil.save()

            res.status(201).json({ message: "Пользователь создан" })


        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

// /api/pupil/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при входе в систему"
                })
            }

            const { email, password } = req.body

            const pupil = await Pupil.findOne({ email })

            if (!pupil) {
                return res.status(400).json({ message: "Пользователь не найден" })
            }

            const isMatch = await bcrypt.compare(password, pupil.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Неверный пароль, попробуйте снова" })
            }

            // Create jwt token
            const token = jwt.sign(
                { userId: pupil.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, pupilId: pupil.id, pupil, role: 'pupil' })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


router.post('/update', auth,
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при внесении изменений"
                })
            }

            const { sex, name, surname, birthday, email, id } = req.body

            await Pupil.findByIdAndUpdate(id, { sex, name, surname, birthday, email },
                { new: true },
                (e, pupil) => {
                    if (e) throw new Error(e)
                    return res.json({ pupil })
                }
            )

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router
