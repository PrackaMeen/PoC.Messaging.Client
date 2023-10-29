import * as signalR from "@microsoft/signalr";
import {
    IMessagingConnector,
    ReceivedMessageCallback,
    MessagingConnectorArgs,
    ConnectionCallback
} from "./types";
import {
    MESSAGE_RECEIVED,
    SEND_MESSAGE_TO_ALL
} from "./constants";

export class MessagingConnector implements IMessagingConnector {
    private _hostname: string = ''
    private _connection: signalR.HubConnection
    private _subscribedToMessageReceived: ReceivedMessageCallback[] = []
    private _subscribedToConnection: ConnectionCallback[] = []

    constructor(args: MessagingConnectorArgs) {
        this._hostname = args.hostname

        this._connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this._hostname}/hub`)
            .build();

        this._connection.on(MESSAGE_RECEIVED, this.onReceivedMessages)
        this._connection.start()
            .then(() => this.onConnectionSucceed(`Connection established to '${args.hostname}'...`))
            .catch(this.onConnectionFailed)
    }

    sendMessage = ({ message, toUser }: { toUser: string, message: string }) => {
        this._connection.send(SEND_MESSAGE_TO_ALL, toUser, message)
    }

    subscribeToReceivedMessages = (callback: ReceivedMessageCallback) => {
        this._subscribedToMessageReceived.push(callback)
    }
    unsubscribeToReceivedMessages = (callback: ReceivedMessageCallback) => {
        this._subscribedToMessageReceived = this._subscribedToMessageReceived.filter((existingCallback) => {
            return existingCallback !== callback
        })
    }

    subscribeToConnection = (callback: ConnectionCallback) => {
        this._subscribedToConnection.push(callback)
    }
    unsubscribeToConnection = (callback: ConnectionCallback) => {
        this._subscribedToConnection = this._subscribedToConnection.filter((existingCallback) => {
            return existingCallback !== callback
        })
    }

    private onReceivedMessages = (username: string, message: string) => {
        this._subscribedToMessageReceived.forEach((callback) => {
            callback({
                fromUser: username,
                message
            })
        })
    }

    private onConnectionSucceed = (message: string) => {
        this._subscribedToConnection.forEach((callback) => {
            callback({ message, type: 'success' })
        })
    }

    private onConnectionFailed = (errorReason: any) => {
        this._subscribedToConnection.forEach((callback) => {
            callback({ message: String(errorReason), type: 'error' })
        })
    }
}