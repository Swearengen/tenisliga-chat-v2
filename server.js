const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.get('/a', (req, res) => {
    return app.render(req, res, '/a', req.query)
  })

  server.post('/users', (req, res) => {
    const { userName } = req.body
    const { userId } = req.body

    res.status(200).send(`${userName}, ${userId}`)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})