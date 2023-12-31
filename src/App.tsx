import React, { useEffect, useState } from 'react';
import { Messenger, SignIn } from './components'
import { MessagingConnector } from './connector';
import { useToaster } from './components/toaster/Toaster';
import { ConnectionCallback } from './connector/types';

const connector = new MessagingConnector({
  hostname: 'https://localhost:7101'
})

type AppState = {
  userName: string
  selectedUserToMessage: string
  messages: Array<{ fromUser: string, message: string }>
}

function App() {
  const { enqueueSnackbar } = useToaster()
  const [state, setState] = useState<AppState>({
    userName: '',
    selectedUserToMessage: '',
    messages: []
  })

  useEffect(() => {
    const callback = ({ fromUser, message }: { fromUser: string, message: string }) => {
      console.log({ fromUser, message })

      setState((oldState) => {
        return {
          ...oldState,
          messages: [...oldState.messages, { fromUser, message }]
        }
      })
      enqueueSnackbar(`From: ${fromUser} | ${message}`, { variant: 'default' })
    }
    const connectorToast: ConnectionCallback = ({ message, type }) => {
      enqueueSnackbar(message, { variant: type })
    }

    connector.subscribeToConnection(connectorToast)
    connector.subscribeToReceivedMessages(callback)

    return () => {
      connector.unsubscribeToConnection(connectorToast)
      connector.unsubscribeToReceivedMessages(callback)
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: !state.userName ? 'none' : undefined }}>
          Hello {state.userName}!!!
        </div>
      </header>
      <section>
        <SignIn onSaveUsername={(userName) => setState((oldState) => {
          return {
            ...oldState,
            userName
          }
        })} />
      </section>
      <section>
        <Messenger
          users={['Pracka', 'Terka']}
          onMessageSend={(message) => connector.sendMessage({
            message,
            toUser: state.userName
          })}
          onUserSelect={(selectedUserToMessage) => setState((oldState) => {
            return {
              ...oldState,
              selectedUserToMessage
            }
          })}
        />
      </section>
      <section>
        Your messages:
      </section>
      <section>
        {state.messages.map(({ fromUser, message }) => {
          return (
            <li>{fromUser}:{message}</li>
          )
        })}
      </section>
    </div>
  );
}

export default App;
