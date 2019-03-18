import React from 'react'

import { CurrentUser } from '../../store/types';

interface Props {
	currentUser?: CurrentUser
}

export default class extends React.Component<Props> {

  	render() {
        if (this.props.currentUser) {
            return (
                <div> dfsfdsfsd {`${this.props.currentUser.userName}, ${this.props.currentUser.userId}`}</div>
            )
        } else {
            return ''
        }
  	}
}