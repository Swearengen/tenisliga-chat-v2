const express = require('express')
const router = express.Router()
const chatkit = require('../chatkit')

router.post('/users', (req, res) => {
	const {userName,userId} = req.body

	res.status(200).send(`${userName}, ${userId}`)
})

router.post('/authenticate', async (req, res) => {
	const authData = await chatkit.authenticate(req.query.user_id)
	res.status(authData.status).send(authData.body)
})

router.post('/createUser', async (req, res) => {
	const {name, id, avatarURL} = req.body
	await chatkit.createUser({
        name,
        id,
        avatarURL
	})
	.then((user) => {
		return chatkit.addUsersToGeneralRoom([user.id])
	})
	.then(() => {
		res.status(200).send("success")
	})
	.catch((e) => {
		res.status(500).send(e)
	})

})

router.post('/createLeagueRooms', async (req, res) => {
	const data = req.body
	console.log(data, 'data')

	if(data.length > 0) {
		try {
			data.forEach(room => {
				console.log(room, 'room');
				chatkit.createRoom(room)
			})
			res.status(200).send("success")
		} catch (e) {
			return res.status(500).send(e)
		}
	} else {
		return res.status(500).send("error")
	}

})

module.exports = router