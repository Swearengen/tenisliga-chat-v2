import React from 'react'
import { inject, observer } from 'mobx-react'

import { Store } from '../../store/store'
import { UserJoinedRoom } from '../../store/types';
import Dashboard from './Dashboard'

interface Props {
    userName: string;
    userId: string;
    userRooms: UserJoinedRoom[]
}

interface InjectedProps extends Props {
    store: Store
}

@inject('store')
@observer
class Page extends React.Component<Props> {

    get injected() {
        return this.props as InjectedProps;
    }
    componentDidMount() {
        this.injected.store.setUserJoinedRoom(this.props.userRooms)
    }

    render() {
        const { store } = this.injected

        return (
            <div>
                <Dashboard store={store} userId={this.props.userId} />
            </div>
        )
    }
}

export default Page