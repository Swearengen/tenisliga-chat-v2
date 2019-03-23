import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'mobx-react'
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../src/getPageContext';
import { initializeStore, Store } from '../store/store'

class MyMobxApp extends App {

	private mobxStore: Store;
	private pageContext: any

	static async getInitialProps(appContext: any) {
		// Get or Create the store with `undefined` as initialState
		// This allows you to set a custom default initialState
		const mobxStore = initializeStore() as Store
		// Provide the store to getInitialProps of pages
		appContext.ctx.mobxStore = mobxStore

		let appProps = await App.getInitialProps(appContext)

		return {
			...appProps,
			initialMobxState: mobxStore
		}
	}

	constructor(props: any) {
		super(props)
		const isServer = !process.browser;
		this.mobxStore = isServer
			? props.initialMobxState
			: initializeStore()
		this.pageContext = getPageContext();
	}

	render() {
		const { Component, pageProps } = this.props

		return (
			<Container>
				<JssProvider
					registry={this.pageContext.sheetsRegistry}
					generateClassName={this.pageContext.generateClassName}
				>
					{/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
					<MuiThemeProvider
						theme={this.pageContext.theme}
						sheetsManager={this.pageContext.sheetsManager}
					>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						<Provider store={this.mobxStore}>
							<Component {...pageProps} />
						</Provider>
					</MuiThemeProvider>
				</JssProvider>
			</Container>
		)
	}
}
export default MyMobxApp