export type MessagingConnectorArgs = {
    hostname: string
}
export type ReceivedMessageCallback = (args: { fromUser: string, message: string }) => void
export type ConnectionCallback = (args: { message: string, type: 'success' | 'error' }) => void
export interface IMessagingConnector {
    sendMessage: ({ message, toUser }: { toUser: string, message: string }) => void
    
    subscribeToReceivedMessages: (callback: ReceivedMessageCallback) => void
    unsubscribeToReceivedMessages: (callback: ReceivedMessageCallback) => void
    
    subscribeToConnection: (callback: ConnectionCallback) => void
    unsubscribeToConnection: (callback: ConnectionCallback) => void
}
