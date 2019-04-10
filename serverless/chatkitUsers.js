const chatkit = require('../server/chatkit')

module.exports.createUser = async (event, context) => {
    const data = new Buffer(event.body, 'base64')
    let json = JSON.parse(data.toString('ascii'))

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
    const data = new Buffer(event.body, 'base64')
    let json = JSON.parse(data.toString('ascii'))

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
    const data = new Buffer(event.body, 'base64')
    let json = JSON.parse(data.toString('ascii'))

    return await chatkit.createUsers(json)
    .then((users) => {
        console.log(users, 'users');
        const userIds = users.map(user => user.id)
        console.log(userIds, 'userIds');
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

// trebat ce dodat metode za:
// 4. dodavanje soba
// 5. brisanje soba
    // tu ce trebat dohvatit sve sobe
    // i izfiltrirat samo sobe lige po customData
    // i onda jednu po jednu izbrisat po id-ju