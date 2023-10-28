import * as signalR from "@microsoft/signalr";
import {
    IMessagingConnector,
    ReceivedMessageCallback,
    MessagingConnectorArgs
} from "./types";
import {
    MESSAGE_RECEIVED,
    SEND_MESSAGE_TO_ALL
} from "./constants";

export class MessagingConnector implements IMessagingConnector {
    private _hostname: string = ''
    private _connection: signalR.HubConnection
    private _subscribedToMessageReceived: ReceivedMessageCallback[] = []

    constructor(args: MessagingConnectorArgs) {
        this._hostname = args.hostname

        this._connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this._hostname}/hub`)
            .build();

        this._connection.on(MESSAGE_RECEIVED, this.ooReceivedMessages)
        this._connection.start().catch((err) => document.write(err))
    }

    sendMessage = ({ message, toUser }: { toUser: string, message: string }) => {
        this._connection.send(SEND_MESSAGE_TO_ALL, toUser, message)
    }

    ooReceivedMessages = (username: string, message: string) => {
        this._subscribedToMessageReceived.forEach((callback) => {
            callback({
                fromUser: username,
                message
            })
        })
    }

    subscribeToReceivedMessages = (callback: ReceivedMessageCallback) => {
        this._subscribedToMessageReceived.push(callback)
    }

    unsubscribeToReceivedMessages = (callback: ReceivedMessageCallback) => {
        this._subscribedToMessageReceived = this._subscribedToMessageReceived.filter((existingCallback) => {
            return existingCallback !== callback
        })
    }
}