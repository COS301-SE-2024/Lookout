import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
	private client: any;

	constructor() {
		this.client = null;
	}

	connect(
		onMessageReceived: (message: any) => void,
		onError: (err: any) => void
	) {
		const socket = new SockJS("http://localhost:8080/ws");
		this.client = Stomp.over(socket);

		this.client.connect(
			{},
			(frame: any) => {
				console.log("Connected: " + frame);
				// Subscribe to a topic
				this.client.subscribe(
					"/topic/messages",
					(messageOutput: any) => {
						onMessageReceived(messageOutput);
					}
				);

				// Example: Sending a sample message
				this.client.send(
					"/app/send",
					{},
					JSON.stringify({ message: "Hello world!" })
				);
			},
			(err: any) => {
				console.error("Error:", err);
				if (onError) {
					onError(err);
				}
			}
		);
	}

	disconnect() {
		if (this.client !== null) {
			this.client.disconnect();
			console.log("Disconnected");
		}
	}

	sendMessage(destination: string, message: any) {
		if (this.client !== null && this.client.connected) {
			this.client.send(destination, {}, JSON.stringify(message));
		}
	}
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
