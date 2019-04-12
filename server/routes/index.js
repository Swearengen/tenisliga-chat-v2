const express = require('express')
const router = express.Router()
var url=require('url')

const nextApp = require('../index')
const chatkit = require('../chatkit')

const dev = process.env.NODE_ENV !== 'production'

router.get('/', async (req, res) => {

	// ovo je haharenje umjesto autentifikacije
	if (!dev) {
		const referer = req.headers.referer
		if (!referer) {
			nextApp.app.render(req, res, '/error', {
				errorMessage: "Not allowed"
			})
		}
		const hostname = url.parse(referer).hostname
		if (hostname !== "www.tenisliga.com") {
			nextApp.app.render(req, res, '/error', {
				errorMessage: "Not allowed"
			})
		}
	}

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
			nextApp.app.render(req, res, '/error', {
				errorMessage: error.error_description || 'User Not found'
			})
		}
	} else {
		nextApp.app.render(req, res, '/error', {
			errorMessage: "Please provide userName and userId"
		})
	}

})

module.exports = router