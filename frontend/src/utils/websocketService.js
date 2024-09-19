import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
	constructor() {
		this.stompClient = null;
		this.isConnected = false; // Track connection state
	}

	async connect() {
		if (this.isConnected) return; // Prevent multiple connections

		console.log("Attempting WebSocket connection...");
		const socket = new SockJS("http://localhost:8080/ws");
		this.stompClient = Stomp.over(socket);

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
		} catch (error) {
			console.error("Connection failed:", error);
		}
	}

	subscribe(destination, callback) {
		if (this.stompClient && this.isConnected) {
			this.stompClient.subscribe(destination, callback);
			console.log(`Subscribed to ${destination}`);
		} else {
			console.error("Cannot subscribe, not connected to WebSocket");
		}
	}

	disconnect() {
		if (this.stompClient && this.isConnected) {
			this.stompClient.disconnect(() => {
				console.log("WebSocket disconnected");
				this.isConnected = false;
			});
		} else {
			console.error("WebSocket is not connected, nothing to disconnect");
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
