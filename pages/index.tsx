import React from 'react'
import Page from '../src/Components/Page'
import { UserJoinedRoom } from '../store/types';

interface Props {
	userName: string
	userId: string
	userRooms: UserJoinedRoom[]
}

export default class extends React.Component<Props> {
    static async getInitialProps(appContext: any) {

		const {userName, userId, userRooms} = appContext.query
		return {userName, userId, userRooms}
	}

  	render() {
		return <Page
			userName={this.props.userName}
			userId={this.props.userId}
			userRooms={this.props.userRooms}
		/>
  	}
}