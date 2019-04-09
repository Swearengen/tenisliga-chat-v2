const querystring = require('querystring');
const chatkit = require('../server/chatkit')

module.exports.authenticate = async (event, context, callback) => {
    const authData = await chatkit.authenticate(event.queryStringParameters.user_id)

    callback(null, {
        statusCode: authData.status,
        body: JSON.stringify(authData.body),
    })
}

module.exports.createUser = async (event, context) => {
    const data = new Buffer(event.body, 'base64')
    let json = JSON.parse(data.toString('ascii'))

    return await chatkit.createUser({
        name: json.name,
        id: json.id,
        avatarURL: json.avatarURL
    })
    .then((user) => {
        return chatkit.addUserToGeneralRoom(user.id)
    })
    .then(() => {
        const response = {
            statusCode: 200,
            body: "success"
        }

        return response
    })
    .catch((e) => {
        const response = {
            statusCode: 500,
            body: e
        }

        return response
    })

}

// trebat ce dodat metode za:

// 2. kreiranje usera u batchu
// 3. delete jednog usera
// 4. dodavanje soba
// 5. brisanje soba
    // tu ce trebat dohvatit sve sobe
    // i izfiltrirat samo sobe lige po customData
    // i onda jednu po jednu izbrisat po id-ju