const chatkit = require('../server/chatkit')
const utils = require('./utils')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const createRooms = async (json) => {
    await asyncForEach(json, async (room) => {
        return chatkit.createRoom(room)
    })
}

const deleteRooms = async (rooms) => {
    await asyncForEach(rooms, async (room) => {
        if (room.custom_data && room.custom_data.leagueRoom) {
            return chatkit.deleteRoom(room.id)
        }
    })
}

module.exports.createLeagueRooms = async (event, context) => {
    let json = utils.getJsonParam(event.body)

    if(json.length > 0) {
        try {
            await createRooms(json)
            return {
                statusCode: 200,
                body: "success"
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: error
            }
        }
	} else {
		return {
            statusCode: 500,
            body: "Error"
        }
	}
}

module.exports.deleteLeagueRooms = async (event, context) => {
    const rooms = await chatkit.getPublicRooms()
	if (rooms.length > 0) {
        try {
            await deleteRooms(rooms)
            return {
                statusCode: 200,
                body: "success"
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: error
            }
        }
	}

	return {
        statusCode: 200,
        body: "No rooms to delete"
    }
}