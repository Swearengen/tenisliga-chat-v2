import React from 'react'
import { observer } from 'mobx-react'
import teal from '@material-ui/core/colors/teal';
import Typography from '@material-ui/core/Typography';

interface Props {
    usersWhoAreTyping: string[]
}

@observer
class TypingIndicator extends React.Component<Props> {
    render() {
        if (this.props.usersWhoAreTyping.length > 0) {
            return (
                <Typography component="div" variant="caption" style={{color: teal[300]}}>
                    <strong>
                        {`${this.props.usersWhoAreTyping
                        .slice(0, 2)
                        .join(' and ')} is typing`}
                    </strong>
                </Typography>
            )
        }
        return ''
    }
}

export default TypingIndicator
