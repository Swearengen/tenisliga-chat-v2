import * as React from 'react'
import { ReactNode } from 'react'

import * as _ from 'lodash'
import grey from '@material-ui/core/colors/grey'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const rootStyles = {
    position: 'absolute' as 'absolute',
    height: '100%',
    overflowX: 'hidden' as 'hidden',
    overflowY: 'scroll' as 'scroll',
    left: '0',
    right: '0',
    paddingBottom: '190px',
}

const scrollToEndStyles = {
    position: 'fixed' as 'fixed',
    background: grey[300],
    bottom: '150px',
    right: '20px',
    padding: '3px',
    borderRadius: '50%',
    cursor: 'pointer'
}

interface Props {
    ref: any
    children: ReactNode
    scrollToBottomNumber: number
    initailyMessagesScrolled: boolean
}

interface State {
    messagesScrolled: boolean
}


class ScrollableCont extends React.Component<Props, State> {

    constructor(props: Props) {
		super(props)
		this.state = {
            messagesScrolled: props.initailyMessagesScrolled
		}
    }

    componentWillUnmount() {
        if (this.messagesCont) {
            this.messagesCont.removeEventListener('scroll', this.handleScroll);
        }
    }

    messagesContDidMount = (node: any) => {
        this.messagesCont = node
        this.messagesCont.addEventListener("scroll", this.handleScroll)
    }

    handleScroll = _.debounce((event: any) => {
        const { scrollTop, offsetHeight } = event.srcElement

        if (scrollTop + offsetHeight - 194 === this.props.scrollToBottomNumber) {
            this.setState({ messagesScrolled: true })
        } else {
            this.setState({ messagesScrolled: false })
        }
    }, 150);

    messagesCont: any = React.createRef()

    scrollToBottom = (scrollToNumber?: number) => {
        this.messagesCont.scroll({top: scrollToNumber ? scrollToNumber : this.props.scrollToBottomNumber})
    }

    render () {
        return(
            <div style={rootStyles} ref={this.messagesContDidMount}>
                {this.props.children}

                {!this.state.messagesScrolled &&
                    <div style={scrollToEndStyles} onClick={(e: any) => this.scrollToBottom()}>
                        <KeyboardArrowDown />
                    </div>
                }
            </div>
        )
    }
}

export default ScrollableCont