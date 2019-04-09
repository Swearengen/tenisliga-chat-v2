const chatkit = require('../server/chatkit')

module.exports.authenticate = async (event, context, callback) => {
    const authData = await chatkit.authenticate(event.queryStringParameters.user_id)

    callback(null, {
        statusCode: authData.status,
        body: JSON.stringify(authData.body),
    })
}