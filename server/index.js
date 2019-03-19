const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
// const Chatkit = require('@pusher/chatkit-server')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = (module.exports = next({dev}))
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    const routes = require('./routes/index.js')

    server.use(bodyParser.json())
    server.use('/', routes)

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})