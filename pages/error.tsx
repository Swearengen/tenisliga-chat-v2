import React from 'react'
import { ErrorPage } from '../src/Components/UtilComponents/ErrorPage'

interface Props {
	errorMessage: string
}

export default class extends React.Component<Props> {
  	static async getInitialProps({ query }: {query: any }) {
		// const isServer = !!req
		const {errorMessage} = query

		return {errorMessage}
	}

	render() {
		return <ErrorPage>{this.props.errorMessage}</ErrorPage>
	}
}