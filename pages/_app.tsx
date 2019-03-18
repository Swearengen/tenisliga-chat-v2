import App, { Container } from 'next/app'
import React from 'react'
import { initializeStore, Store } from '../store/store'
import { Provider } from 'mobx-react'

class MyMobxApp extends App {

  private mobxStore: Store;
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
      : initializeStore(props.initialMobxState)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Provider store={this.mobxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}
export default MyMobxApp