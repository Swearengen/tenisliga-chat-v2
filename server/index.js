const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const path = require('path')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()
const server = express()

app.prepare().then(() => {
    const applicationRoute = require('./routes/index.js')
    const apiRoute = require('./routes/api.js')

    if (!dev) {
        server.use('/_next', express.static(path.join(__dirname, '.next')))
        server.use('/static', express.static('static'))
    }
    // server.use(bodyParser.json())
    server.use('/', applicationRoute)
    server.use('/api', apiRoute)

    server.get('*', (req, res) => {
        return handle(req, res)
    })


    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})

module.exports = {
    server,
    app
}