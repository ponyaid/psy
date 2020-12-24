const { Router } = require('express')
const Test = require('../models/Test')


const router = Router()

router.get('/', async (req, res) => {
    try {
        const tests = await Test.find()
        res.json(tests)
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findOne({ id: req.params.id })
        res.json(test) 
        
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

// router.post('/', async (req, res) => {
//     try {
//         console.log(req.headers.authorization)
//         res.status(201).json({ message: "Данные успешно отправлены" })
//     } catch (e) {
//         res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
//     }
// })

module.exports = router