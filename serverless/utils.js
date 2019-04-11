module.exports.getJsonParam = (eventBody) => {
    const data = new Buffer(eventBody, 'base64')
    let json = JSON.parse(data.toString('ascii'))

    return json
}