const express = require('express')
const router = express.Router()
const app = require('../index')
const chatkit = require('../chatkit')

router.get('/', async (req, res) => {
	const {userName,userId} = req.query
	if (userName && userId) {
		try {
			// =============================================================
			// existing user
			// dohvatit sve idejve soba usera i poslat ih na klijenta
			const user = await chatkit.instance.getUser({id: userId})
			if (user) {
				app.render(req, res, '/', req.query)
			}
		} catch (error) {
			if (error.error === 'services/chatkit/not_found/user_not_found') {
				try {
					// =============================================================
					// new user
					// dodat usera u general sobu i pod channels id vratit general id
					const newUser = await chatkit.createUser(req.query)
					app.render(req, res, '/', req.query)
				} catch (error) {
					app.render(req, res, '/error', {
						errorMessage: error.error_description || 'Server Error'
					})
				}
			} else {
				app.render(req, res, '/error', {
					errorMessage: error.error_description || 'Server Error'
				})
			}
		}
	} else {
		app.render(req, res, '/error', {
			errorMessage: "Please provide userName and userId"
		})
	}

})

router.post('/users', (req, res) => {
	const {userName,userId} = req.body

	res.status(200).send(`${userName}, ${userId}`)
})

router.post('/authenticate', (req, res) => {
	const authData = chatkit.authenticate({
		userId: req.query.user_id
	})
	res.status(authData.status).send(authData.body)
})

module.exports = router