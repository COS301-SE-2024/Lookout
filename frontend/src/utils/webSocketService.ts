import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

class WebSocketService {
	client: Client | null = null;
	connected: boolean = false;

	connect(token: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client = new Client({
				webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
				connectHeaders: {
					Authorization: `Bearer ${token}` // Pass the JWT token here
				},
				debug: (str) => {
				},
				onConnect: (frame) => {
					this.connected = true;
					resolve();
				},
				onStompError: (frame) => {
					reject(frame);
				},
				onWebSocketError: (error) => {
				},
				onWebSocketClose: (event) => {
					this.connected = false;
				},
				reconnectDelay: 5000 // Reconnect after 5 seconds if the connection is lost
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
