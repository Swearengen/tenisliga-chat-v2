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

	if(data.length > 0) {
		try {
			data.forEach(room => {
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

router.post('/deleteLeagueRooms', async (req, res) => {
	const rooms = await chatkit.getPublicRooms()

	if (rooms.length > 0) {
		try {
			rooms.forEach(room => {
				if (room.custom_data && room.custom_data.leagueRoom) {
					console.log(room);

					chatkit.deleteRoom(room.id)
				}
			})
			res.status(200).send("success")
		} catch (e) {
			return res.status(500).send(e)
		}
	}

	res.status(200).send("no rooms to delete")
})

module.exports = router