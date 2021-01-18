const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const xml2js = require('xml2js')
const Condition = require('./models/Condition')


const parser = new xml2js.Parser()

const app = express()


app.use(express.json({ extended: true }))

// Read content-type: text/plain 
app.use(function (req, res, next) {
    if (req.is('text/*')) {
        req.text = ''
        req.setEncoding('utf8')
        req.on('data', function (chunk) { req.text += chunk })
        req.on('end', next)
    } else {
        next()
    }
})

app.use('/api/pupil', require('./routes/pupil.routes'))
app.use('/api/psych', require('./routes/psych.routes'))
app.use('/api/schools', require('./routes/school.routes'))
app.use('/api/classes', require('./routes/class.routes'))

app.use('/api/conditions', require('./routes/condition.routes'))
app.use('/api/tests', require('./routes/test.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        // Обновление тестов в базе данных

        const conditions = await Condition.find()

        if (conditions) {
            for (let condition of conditions) { await condition.remove() }
        }

        const dir = path.resolve(__dirname, 'conditions')

        fs.readdir(dir, (err, items) => {
            if (err) throw err

            for (var i = 0; i < items.length; i++) {
                const filePath = path.resolve(dir, items[i])

                fs.readFile(filePath, "utf8", async (err, data) => {
                    if (err) throw err

                    parser.parseString(data, async (err, result) => {
                        if (err) throw err

                        const condition = new Condition({
                            id: result.root.test[0].$.code,
                            name: result.root.test[0].$.name,
                            desc: result.root.test[0].section[0].inst[0]['_'],
                            body: JSON.stringify(result),
                            xml: data
                        })

                        await condition.save()
                    })
                })
            }
        })

        app.listen(PORT, () => { console.log(`App has been started on port ${PORT}...`) });

    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()