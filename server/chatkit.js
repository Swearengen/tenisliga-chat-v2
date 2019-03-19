const Chatkit = require('@pusher/chatkit-server')

module.exports = {
    instance: new Chatkit.default({
        instanceLocator: 'v1:us1:99cebb3b-bac8-4c5c-bcd1-cabf14849b0a',
        key: '9bc98f25-462d-4f8f-a255-7be522ddb42a:zGAM+jjfQM1dvyq0QZuCsBl2RkygCk6+9SWqXNJQSvk=',
    }),

    createUser: async function({userName, userId}) {
        return await this.instance.createUser({
            id: userId,
            name: userName,
        })
    }
}