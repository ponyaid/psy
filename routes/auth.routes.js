const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const Pupil = require('../models/Pupil')

const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('name', 'Отсутствует имя').notEmpty(),
        check('email', 'Некорректный email').isEmail(),
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

            const { name, email, password, resolution, terms, sex } = req.body

            const condaidate = await Pupil.findOne({ email })

            if (condaidate) {
                return res.status(400).json({ message: "Такой пользователь уже существует" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const pupil = new Pupil({
                name, email, password: hashedPassword, resolution, terms, sex
            })

            await pupil.save()

            res.status(201).json({ message: "Пользователь создан" })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

// /api/auth/login
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
                { pupilId: pupil.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, pupilId: pupil.id })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })

module.exports = router
