import React from 'react'
import Page from '../src/Components/Page'

interface Props {
	userName: string
	userId: string
}

export default class extends React.Component<Props> {
    static async getInitialProps(appContext: any) {

		const {userName, userId} = appContext.query
		return {userName, userId}
	}

  	render() {
    	return <Page userName={this.props.userName} userId={this.props.userId} />
  	}
}