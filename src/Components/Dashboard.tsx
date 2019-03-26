import React from 'react';
import * as _ from 'lodash'

import { observer } from 'mobx-react';
import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';

import { Store } from '../../store/store';
import { Loader } from './UtilComponents/Loader';
import AppHeader  from './Header'
import Sidebar from './Sidebar';
import MessagesList from './Messages/MessagesList';
import MessageForm from './Messages/MessageForm';
import TypingIndicator from './Messages/TypingIndicator';
import { ErrorPage } from './UtilComponents/ErrorPage';

const styles = (theme: any) => createStyles({
    root: {
      display: 'flex',
	  height: '100vh',
	},
	appBarSpacer: theme.mixins.toolbar,
    content: {
		flexGrow: 1,
		paddingTop: '65px',
		overflow: 'hidden',
		background: theme.palette.background.default,
		position: 'relative',
	},
	footer: {
        position: 'absolute' as 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
		padding: '15px 30px',
		background: theme.palette.background.default,
		borderTop: '1px solid #c5c5c5'
    },
})

export const DRAWER_WIDTH = 340;


interface Props extends WithStyles<typeof styles> {
    store: Store
    userId: string
}

interface State {
	open: boolean
}

@observer
class Dashboard extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			open: true,
		}
	}

	componentDidMount() {
        const { store, userId } = this.props
		store.connectUser(userId)
	}

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	sendTypingEvent = () => {
        this.props.store.sendUserTypingEvent()
	}

	sendMessage = (text: string) => {
        this.props.store.sendMessage(text)
	}

	render() {
		const { classes } = this.props
		const { store } = this.props


		if (store.loading) {
			return (
				<Loader />
			)
		}

		if (store.errorMessage) {
			return (
				<ErrorPage>{store.errorMessage}</ErrorPage>
			)
		}

		return (
			<div className={classes.root}>

				<AppHeader open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} />
				<Sidebar open={this.state.open} handleDrawerClose={this.handleDrawerClose} />

				<main className={classes.content}>
					{
						!_.isEmpty(store.messages) &&
						!_.isEmpty(store.roomUsers) &&
						<div>
							<MessagesList
								messages={store.messages!}
								roomUsers={store.roomUsers!}
								userId={this.props.userId}
								lastMessageId={store.getLastMessageId}
                            />
						</div>
					}
					<div className={classes.footer}>
						<TypingIndicator usersWhoAreTyping={store.usersWhoAreTyping} />
                        <MessageForm onChange={this.sendTypingEvent} onSubmit={this.sendMessage} />
					</div>
				</main>

			</div>
		);
	}
}

export default withStyles(styles)(Dashboard)