const chatkit = require('../server/chatkit')
const utils = require('./utils')

module.exports.createUser = async (event, context) => {
    let json = utils.getJsonParam(event.body)

    return await chatkit.createUser({
        name: json.name,
        id: json.id,
        avatarURL: json.avatarURL
    })
    .then((user) => {
        return chatkit.addUsersToGeneralRoom([user.id])
    })
    .then(() => {
        return {
            statusCode: 200,
            body: "success"
        }
    })
    .catch((e) => {
        return {
            statusCode: 500,
            body: e
        }
    })

}

module.exports.deleteUser = async (event, context) => {
    let json = utils.getJsonParam(event.body)

    return await chatkit.deleteUser(json.id)
    .then(() => {
        return {
            statusCode: 200,
            body: "success"
        }
    })
    .catch((e) => {
        return {
            statusCode: 500,
            body: e
        }
    })
}

module.exports.bulkCreateUsers = async (event, context) => {
    let json = utils.getJsonParam(event.body)

    return await chatkit.createUsers(json)
        .then((users) => {
            const userIds = users.map(user => user.id)
            return chatkit.addUsersToGeneralRoom(userIds)
        })
        .then(() => {
            return {
                statusCode: 200,
                body: "success"
            }
        })
        .catch((e) => {
            return {
                statusCode: 500,
                body: e
            }
        })
}