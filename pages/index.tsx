import React from 'react'
import Page from '../src/Components/Page'
import { UserRoom } from '../store/types';

interface Props {
	userName: string
	userId: string
	userRooms: UserRoom[]
}

export default class extends React.Component<Props> {
    static async getInitialProps(appContext: any) {

		const {userName, userId, userRooms} = appContext.query
		return {userName, userId, userRooms}
	}

  	render() {
		console.log(this.props.userRooms, 'hhhhh');

    	return <Page userName={this.props.userName} userId={this.props.userId} />
  	}
}