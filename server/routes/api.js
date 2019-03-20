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

module.exports = router