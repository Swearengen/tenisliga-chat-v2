import * as React from 'react'
import { ReactNode } from 'react'

import * as _ from 'lodash'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const styles = (theme: any) => ({
    root: {
        position: 'absolute' as 'absolute',
        height: '100%',
        overflow: 'scroll',
        left: '0',
        right: '0',
        paddingBottom: '190px',
    },
    scrollToEnd: {
        position: 'fixed' as 'fixed',
        background: grey[300],
        bottom: '150px',
        right: '20px',
        padding: '3px',
        borderRadius: '50%',
        cursor: 'pointer'
    }
})

interface Props extends WithStyles<typeof styles> {
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

    componentWillUnmount() {
        if (this.messagesCont) {
            this.messagesCont.removeEventListener('scroll', this.handleScroll);
        }
    }

    messagesContDidMount = (node: any) => {
        this.messagesCont = node
        const { height } = node.getBoundingClientRect()
        const scrollHeight = node.scrollHeight
        if (scrollHeight === height) {
            this.setState({messagesScrolled: true})
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
        this.messagesCont.scroll({top: this.messagesCont.clientHeight})
    }

    render () {
        return(
            <div className={this.props.classes.root} ref={this.messagesContDidMount}>
                {this.props.children}

                {!this.state.messagesScrolled &&
                    <div className={this.props.classes.scrollToEnd} onClick={this.scrollToBottom}>
                        <KeyboardArrowDown />
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(ScrollableCont)