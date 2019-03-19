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
			const user = await chatkit.instance.getUser({id: userId})
			const userRooms = await chatkit.getUserRooms(userId)

			if (user) {
				app.render(req, res, '/', {...req.query, userRooms})
			}
		} catch (error) {
			if (error.error === 'services/chatkit/not_found/user_not_found') {
				try {
					// =============================================================
					// new user
					// dodat usera u general sobu
					// vratit user rooms di ce bit general soba (treba poziv jer user id-s su tamo)
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

module.exports = router