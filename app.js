const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const xml2js = require('xml2js')
const Test = require('./models/Test')


const parser = new xml2js.Parser()

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
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
            useCreateIndex: true
        })

        // Обновление тестов в базе данных

        const tests = await Test.find()

        if (tests) {
            for (let test of tests) { await test.remove() }
        }

        const dir = path.resolve(__dirname, 'tests')

        fs.readdir(dir, (err, items) => {
            if (err) throw err

            for (var i = 0; i < items.length; i++) {
                const filePath = path.resolve(dir, items[i])

                fs.readFile(filePath, "utf8", async (err, data) => {
                    if (err) throw err

                    parser.parseString(data, async (err, result) => {
                        if (err) throw err

                        const test = new Test({
                            id: result.root.test[0].$.code,
                            name: result.root.test[0].$.name,
                            body: JSON.stringify(result),
                            xml: data
                        })

                        await test.save()
                    })
                })
            }
        })

        //

        app.listen(PORT, () => { console.log(`App has been started on port ${PORT}...`) });

    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()