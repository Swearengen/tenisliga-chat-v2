import React from 'react'
import Page from '../src/Components/Page'
import { UserJoinedRoom, Cursor } from '../store/types';

interface Props {
	userName: string
	userId: string
	userRooms: UserJoinedRoom[]
	userCursors: Cursor[]
}

export default class extends React.Component<Props> {
    static async getInitialProps(appContext: any) {

		const {userName, userId, userRooms, userCursors} = appContext.query
		return {userName, userId, userRooms, userCursors}
	}

  	render() {
		return <Page
			userName={this.props.userName}
			userId={this.props.userId}
			userRooms={this.props.userRooms}
			userCursors={this.props.userCursors}
		/>
  	}
}