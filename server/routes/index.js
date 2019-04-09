const express = require('express')
const router = express.Router()
const nextApp = require('../index')
const chatkit = require('../chatkit')

router.get('/', async (req, res) => {
	const {userName,userId} = req.query
	if (userName && userId) {
		try {
			// =============================================================
			// existing user
			const user = await chatkit.instance.getUser({id: userId})
			const userRooms = await chatkit.getUserRooms(userId)
			const userCursors = await chatkit.getReadCursorsForUser(userId)

			if (user) {
				nextApp.app.render(req, res, '/', {...req.query, userRooms, userCursors})
			}
		} catch (error) {
			if (error.error === 'services/chatkit/not_found/user_not_found') {
				try {
					// =============================================================
					// new user
					const newUser = await chatkit.createUser(req.query)
					await chatkit.addUserToGeneralRoom(userId)
					const userRooms = await chatkit.getUserRooms(userId)

					nextApp.app.render(req, res, '/', {...req.query, userRooms})
				} catch (error) {
					nextApp.app.render(req, res, '/error', {
						errorMessage: error.error_description || 'Server Error'
					})
				}
			} else {
				nextApp.app.render(req, res, '/error', {
					errorMessage: error.error_description || 'Server Error'
				})
			}
		}
	} else {
		nextApp.app.render(req, res, '/error', {
			errorMessage: "Please provide userName and userId"
		})
	}

})

module.exports = router