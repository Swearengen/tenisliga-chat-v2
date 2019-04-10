const Chatkit = require('@pusher/chatkit-server')
const path = require('path')
const prod = process.env.NODE_ENV === 'production'
const dotenv = require('dotenv').config({
    path: path.join(__dirname, `../environment/.env.${prod ? 'prod' : 'dev'}`)
})

module.exports = {
    instance: new Chatkit.default({
        instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
        key: process.env.CHATKIT_INSTANCE_KEY,
    }),

    createUser: async function({name, id, avatarURL}) {
        return await this.instance.createUser({id, name, avatarURL})
    },

    createUsers: async function(users) {
        return await this.instance.createUsers({users})
    },

    deleteUser: async function(userId) {
        return await this.instance.deleteUser({userId})
    },

    getUserRooms: async function(userId) {
        return await this.instance.getUserRooms({userId})
            .then((res) => res)
    },

    getReadCursorsForUser: async function(userId) {
        return await this.instance.getReadCursorsForUser({userId})
            .then((res) => res)
    },

    addUsersToGeneralRoom: async function(userIds) {
        return await this.instance.addUsersToRoom({
            roomId: process.env.GENERAL_ROOM_ID,
            userIds
        })
    },

    authenticate: async function (userId) {
        return await this.instance.authenticate({userId})
    },

}