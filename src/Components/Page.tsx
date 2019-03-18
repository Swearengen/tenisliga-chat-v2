import React from 'react'
import { inject, observer } from 'mobx-react'

import { Store } from '../../store/store'
import { CurrentUser } from '../../store/types';
import Dashboard from './Dashboard'

interface Props {
    userName: string;
    userId: string;
}

interface InjectedProps extends Props {
    currentUser: CurrentUser;
    setCurrentUser: (userName: string, userId: string) => void
}

@inject(({store}: {store: Store}) => ({
    currentUser: store.currentUser,
    setCurrentUser: store.setCurrentUser
}))
@observer
class Page extends React.Component<Props> {

    get injected() {
        return this.props as InjectedProps;
    }
    componentDidMount() {
        this.injected.setCurrentUser(this.props.userName, this.props.userId)
    }

    render() {
        const { currentUser } = this.injected

        return (
            <div>
                <Dashboard currentUser={currentUser} />
            </div>
        )
    }
}

export default Page