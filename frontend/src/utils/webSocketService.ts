import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

class WebSocketService {
	client: Client | null = null;
	connected: boolean = false;

	connect(token: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const protocol =
				window.location.protocol === "https:" ? "https://" : "http://";

			const socketUrl = `${protocol}${window.location.host}/ws`;

			this.client = new Client({
				webSocketFactory: () => new SockJS(socketUrl),
				connectHeaders: {
					Authorization: `Bearer ${token}`
				},
				debug: (str) => {
					console.log(str);
				},
				onConnect: (frame) => {
					this.connected = true;
					resolve();
				},
				onStompError: (frame) => {
					console.error("STOMP Error: ", frame);
					reject(frame);
				},
				onWebSocketError: (error) => {
					console.error("WebSocket Error: ", error);
				},
				onWebSocketClose: (event) => {
					this.connected = false;
					console.warn("WebSocket Closed: ", event);
				},
				reconnectDelay: 5000
			});

			this.client.activate();
		});
	}

	subscribe(topic: string, callback: (message: IMessage) => void) {
		if (this.connected && this.client) {
			const subscription = this.client.subscribe(topic, callback);
			return subscription;
		} else {
			console.error("Cannot subscribe, WebSocket is not connected.");
		}
	}

	unsubscribe(subscription: any) {
		if (subscription) {
			subscription.unsubscribe();
		}
	}

	disconnect() {
		if (this.client) {
			this.client.deactivate();
			this.connected = false;
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
