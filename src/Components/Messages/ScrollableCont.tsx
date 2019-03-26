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
    children: ReactNode
}

interface State {
    messagesScrolled: boolean
}


class ScrollableCont extends React.Component<Props, State> {

    constructor(props: Props) {
		super(props)
		this.state = {
			messagesScrolled: false,
		}
    }

    getAlert() {
        alert('getAlert from Child');
    }

    componentWillUnmount() {
        if (this.messagesCont) {
            this.messagesCont.removeEventListener('scroll', this.handleScroll);
        }
    }

    messagesContDidMount = (node: any) => {
        this.messagesCont = node
        const { height } = this.messagesCont.getBoundingClientRect()
        const scrollHeight = this.messagesCont.scrollHeight

        console.log(scrollHeight, height, 'ffff');
        if (scrollHeight === height) {
            this.setState({messagesScrolled: true})
        } else {
            this.scrollToBottom()
        }
        this.messagesCont.addEventListener("scroll", this.handleScroll)
    }

    handleScroll = _.debounce((event: any) => {
        const { scrollTop, offsetHeight, scrollHeight } = event.srcElement
        if (scrollTop + offsetHeight === scrollHeight) {
            this.setState({ messagesScrolled: true })
        } else {
            this.setState({ messagesScrolled: false })
        }
    }, 150);

    messagesCont: any = React.createRef()

    scrollToBottom = () => {
        console.log(this.messagesCont.clientHeight);

        this.messagesCont.scroll({top: this.messagesCont.clientHeight})
    }

    render () {
        return(
            <div style={rootStyles} ref={this.messagesContDidMount}>
                {this.props.children}

                {!this.state.messagesScrolled &&
                    <div style={scrollToEndStyles} onClick={this.scrollToBottom}>
                        <KeyboardArrowDown />
                    </div>
                }
            </div>
        )
    }
}

export default ScrollableCont