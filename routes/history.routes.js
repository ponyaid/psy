const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const History = require('../models/History')


const router = Router()

router.get('/', auth,
    async (req, res) => {
        try {
            const histories = await History.find({ psych: req.user.userId })
                .sort({ date: 'desc' }).limit(10)
                .populate('pupils')
            res.json(histories)
        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
    })


module.exports = router