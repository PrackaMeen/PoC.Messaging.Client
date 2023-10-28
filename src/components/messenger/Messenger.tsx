import { useState } from "react"

const MessengerState = {
    selectedUser: '',
    messageToSend: ''
}

type MessengerProps = {
    users: string[]
    onUserSelect: (selectedUser: string) => void
    onMessageSend: (message: string) => void
}
type MessengerState = typeof MessengerState

export const Messenger = ({ users, onUserSelect, onMessageSend }: MessengerProps) => {
    const [state, setState] = useState<MessengerState>({ ...MessengerState })

    return (
        <div>
            <input
                placeholder="Type your message in..."
                onChange={(event) => {
                    const messageToSend = event.target.value
                    setState((oldState) => {
                        return {
                            ...oldState,
                            messageToSend
                        }
                    })
                }}
                onKeyUp={(event) => {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        onMessageSend(state?.messageToSend)
                    }
                }}
            />

            <fieldset
                onChange={(event) => {
                    const selectedUser = (event.target as EventTarget & HTMLInputElement).value
                    setState((oldState) => {
                        return {
                            ...oldState,
                            selectedUser
                        }
                    })
                    onUserSelect(selectedUser)
                }}
            >
                <legend>Select user to write to:</legend>
                {users.map((user) => {
                    return (
                        <div key={user}>
                            <input type="radio" id={user} name="messenger" value={user} />
                            <label htmlFor={user}>{user}</label>
                        </div>
                    )
                })}
            </fieldset>

            <button onClick={() => onMessageSend(state?.messageToSend)}>
                Send message
            </button >
        </div>
    )
}
