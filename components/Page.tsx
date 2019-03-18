import React from 'react'
import { inject, observer } from 'mobx-react'

import { Store } from '../store/store'
import Clock from './Clock'

interface Props { }

interface InjectedProps extends Props {
    light: boolean;
    lastUpdate: number;
    start: () => void;
    stop: () => void;
}

// @inject('store')
@inject(({store}: {store: Store}) => ({
    lastUpdate: store.lastUpdate,
    light: store.light,
    start: store.start,
    stop: store.stop
}))
@observer
class Page extends React.Component<Props> {

    get injected() {
        return this.props as InjectedProps;
    }
    componentDidMount() {
        this.injected.start()
    }

    componentWillUnmount() {
        this.injected.stop()
    }

    render() {
        const { light, lastUpdate } = this.injected

        return (
            <div>
                <Clock
                    lastUpdate={lastUpdate}
                    light={light}
                />
            </div>
        )
    }
}

export default Page