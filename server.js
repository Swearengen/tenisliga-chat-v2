const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const Chatkit = require('@pusher/chatkit-server')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:99cebb3b-bac8-4c5c-bcd1-cabf14849b0a',
    key: '9bc98f25-462d-4f8f-a255-7be522ddb42a:zGAM+jjfQM1dvyq0QZuCsBl2RkygCk6+9SWqXNJQSvk=',
})

async function createUser({userName, userId}) {
    return await chatkit.createUser({
        id: userId,
        name: userName,
    })
}

app.prepare().then(() => {
    const server = express()

    server.use(bodyParser.json())

    server.get('/', async (req, res) => {
        const {userName, userId} = req.query
        if (userName && userId) {
            try {
                // =============================================================
                // existing user
                // dohvatit sve idejve soba usera i poslat ih na klijenta
                const user = await chatkit.getUser({id: userId})
                if (user) {
                    app.render(req, res, '/', req.query)
                }
            } catch (error) {
                if (error.error === 'services/chatkit/not_found/user_not_found') {
                    try {
                        // =============================================================
                        // new user
                        // dodat usera u general sobu i pod channels id vratit general id
                        const newUser = await createUser(req.query)
                        app.render(req, res, '/', req.query)
                    } catch (error) {
                        app.render(req, res, '/error', {errorMessage: error.error_description || 'Server Error'})
                    }
                } else {
                    app.render(req, res, '/error', {errorMessage: error.error_description || 'Server Error'})
                }
            }
        } else {
            app.render(req, res, '/error', {errorMessage: "Please provide userName and userId"})
        }

    })

    server.post('/users', (req, res) => {
        const {userName, userId} = req.body

        res.status(200).send(`${userName}, ${userId}`)
    })

    server.post('/authenticate', (req, res) => {
        const authData = chatkit.authenticate({ userId: req.query.user_id })
        res.status(authData.status).send(authData.body)
    })

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})