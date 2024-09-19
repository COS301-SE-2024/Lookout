import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
	constructor() {
		this.stompClient = null;
		this.isConnected = false;
		this.subscriptions = {};
	}

	async connect() {
		if (this.isConnected) {
			console.log("Already connected to WebSocket");
			return;
		}

		console.log("Attempting WebSocket connection...");
		const socket = new SockJS("http://localhost:8080/ws");
		this.stompClient = Stomp.over(socket);

		this.stompClient.debug = null;

		try {
			await new Promise((resolve, reject) => {
				this.stompClient.connect(
					{},
					(frame) => {
						console.log("Connected: " + frame);
						this.isConnected = true;
						resolve();
					},
					(error) => {
						console.error("WebSocket connection error:", error);
						this.isConnected = false;
						reject(error);
					}
				);
			});

			this.stompClient.onclose = () => {
				console.log("WebSocket connection closed");
				this.isConnected = false;
				this.stompClient = null;
			};
		} catch (error) {
			console.error("Connection failed:", error);
		}
	}

	subscribe(destination, callback) {
		if (this.stompClient && this.isConnected) {
			if (this.subscriptions[destination]) {
				console.log(`Already subscribed to ${destination}`);
				return;
			}

			const subscription = this.stompClient.subscribe(
				destination,
				callback
			);
			this.subscriptions[destination] = subscription;
			console.log(`Subscribed to ${destination}`);
		} else {
			console.error("Cannot subscribe, not connected to WebSocket");
		}
	}

	unsubscribe(destination) {
		if (this.subscriptions[destination]) {
			this.subscriptions[destination].unsubscribe();
			delete this.subscriptions[destination];
			console.log(`Unsubscribed from ${destination}`);
		} else {
			console.log(`No active subscription to ${destination}`);
		}
	}

	disconnect() {
		if (this.stompClient && this.isConnected) {
			Object.keys(this.subscriptions).forEach((destination) => {
				this.unsubscribe(destination);
			});

			this.stompClient.disconnect(() => {
				console.log("WebSocket disconnected");
				this.isConnected = false;
				this.stompClient = null;
			});
		} else {
			console.error("WebSocket is not connected, nothing to disconnect");
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
