import React from 'react'
import { ErrorPage } from '../src/UtilComponents/ErrorPage'

export default class extends React.Component {
  render() {
    return <ErrorPage>Please provide userName and userId</ErrorPage>
  }
}