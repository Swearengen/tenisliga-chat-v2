import React from 'react'

import teal from '@material-ui/core/colors/teal';
import Typography from '@material-ui/core/Typography';

interface Props {
    usersWhoAreTyping: string[]
}

const TypingIndicator: React.SFC<Props> = (props) => {
    return (
        <div>
            {props.usersWhoAreTyping.length > 0 &&
                <Typography component="div" variant="caption" style={{color: teal[300]}}>
                    <strong>
                        {`${props.usersWhoAreTyping
                        .slice(0, 2)
                        .join(' and ')} is typing`}
                    </strong>
                </Typography>
            }
        </div>
    )
}

export default TypingIndicator
