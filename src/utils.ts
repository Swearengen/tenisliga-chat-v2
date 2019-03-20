import { format } from 'date-fns'

const MESSAGE_TIME = 'MMMM D, YYYY HH:m:ss'

export const formatMessageDate = (date: string) => {
    return format(date, MESSAGE_TIME)
}