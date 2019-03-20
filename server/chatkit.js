const Chatkit = require('@pusher/chatkit-server')

const GENERAL_ROOM_ID = '19398846'

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
    },

    getUserRooms: async function(userId) {
        return await this.instance.getUserRooms({userId})
            .then((res) => res)
    },

    addUserToGeneralRoom: async function(userId) {
        return await this.instance.addUsersToRoom({
            roomId: GENERAL_ROOM_ID,
            userIds: [userId]
        })
    },

    authenticate: async function (userId) {
        return await this.instance.authenticate({userId})
    }
}