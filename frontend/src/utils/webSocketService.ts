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
					console.log(`WebSocket Debug: ${str}`);
				},
				onConnect: (frame) => {
					console.log("WebSocketService: Connected", frame);
					this.connected = true;
					resolve();
				},
				onStompError: (frame) => {
					console.error("WebSocketService: STOMP error", frame);
					reject(frame);
				},
				onWebSocketError: (error) => {
					console.error("WebSocketService: WebSocket error", error);
				},
				onWebSocketClose: (event) => {
					console.log("WebSocketService: WebSocket closed", event);
					this.connected = false;
				},
				reconnectDelay: 5000 // Reconnect after 5 seconds if the connection is lost
			});

			console.log("WebSocketService: Activating client");
			this.client.activate();
		});
	}

	subscribe(topic: string, callback: (message: IMessage) => void) {
		if (this.connected && this.client) {
			console.log(`WebSocketService: Subscribing to topic: ${topic}`);
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
			console.log("WebSocketService: Deactivating client");
			this.client.deactivate();
			this.connected = false;
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
