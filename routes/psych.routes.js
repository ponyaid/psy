const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const Psych = require('../models/Psych')

const router = Router()

// /api/psych/register
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

            const { sex, name, surname, patronymic, about, email, password, terms, birthday } = req.body

            const condaidate = await Psych.findOne({ email })

            if (condaidate) {
                return res.status(400).json({ message: "Такой пользователь уже существует" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const psych = new Psych({
                name, email, password: hashedPassword, terms, sex, surname, patronymic, about, birthday
            })

            await psych.save()

            res.status(201).json({ message: "Пользователь создан" })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

// /api/psych/login
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

            const psych = await Psych.findOne({ email }).populate('schools')

            if (!psych) {
                return res.status(400).json({ message: "Пользователь не найден" })
            }

            const isMatch = await bcrypt.compare(password, psych.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Неверный пароль, попробуйте снова" })
            }

            // Create jwt token
            const token = jwt.sign(
                { userId: psych.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, psychId: psych.id, psych, role: 'psych' })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

module.exports = router