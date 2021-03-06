const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Condition = require('../models/Condition')


const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const conditions = await Condition.find()
        res.json(conditions)
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})


router.get('/:id', auth, async (req, res) => {
    try {
        const condition = await Condition.findOne({ id: req.params.id })
        res.json(condition)

    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})


module.exports = router