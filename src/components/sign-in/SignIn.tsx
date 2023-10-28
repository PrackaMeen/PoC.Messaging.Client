import { useState } from "react"

const signInState = {
    username: ''
}

type SignInProps = {
    onSaveUsername: (username: string) => void
}
type SignInState = typeof signInState

export const SignIn = ({ onSaveUsername }: SignInProps) => {
    const [state, setState] = useState<SignInState>({ ...signInState })

    return (
        <div>
            <input
                placeholder="Write your name in..."
                onChange={(event) => {
                    const username = event.target.value
                    setState((oldState) => {
                        return {
                            ...oldState,
                            username
                        }
                    })
                }}
                onKeyUp={(event) => {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        onSaveUsername(state?.username)
                    }
                }}
            />

            <button onClick={() => onSaveUsername(state?.username)}>
                Save name
            </button >
        </div>
    )
}
