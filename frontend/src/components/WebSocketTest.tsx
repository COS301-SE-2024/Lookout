import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WebSocketTest: React.FC = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const socket = new SockJS("http://localhost:8080/ws"); // Ensure this URL is correct
		const stompClient = Stomp.over(socket);

		stompClient.connect(
			{},
			(frame: string) => {
				console.log("Connected: " + frame);

				// Subscribe to a topic
				stompClient.subscribe("/topic/messages", (messageOutput) => {
					const messageBody = JSON.parse(messageOutput.body);
					setMessages((prevMessages) => [
						...prevMessages,
						messageBody.message
					]);
				});
			},
			(err: any) => {
				console.error("Error", err);
				setError("Error: " + JSON.stringify(err));
			}
		);

		return () => {
			stompClient.disconnect();
			console.log("Disconnected");
		};
	}, []);

	const sendMessage = () => {
		const socket = new SockJS("http://localhost:8080/ws");
		const stompClient = Stomp.over(socket);

		stompClient.connect({}, () => {
			stompClient.send(
				"/app/send",
				{},
				JSON.stringify({ message: "Hello from client!" })
			);
		});
	};

	return (
		<div>
			<h1>WebSocket Test</h1>
			{error && <p>{error}</p>}
			<button onClick={sendMessage}>Send Message</button>
			<ul>
				{messages.map((msg, index) => (
					<li key={index}>{msg}</li>
				))}
			</ul>
		</div>
	);
};

export default WebSocketTest;
