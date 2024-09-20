import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PinDetail from "../components/PinDetail"; // Adjust the import path as needed

// Mock the navigate function
const mockNavigate = jest.fn();

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

//mock websockets
jest.mock("../utils/webSocketService", () => ({
	connect: jest.fn().mockResolvedValue(undefined),
	subscribe: jest.fn().mockReturnValue(undefined),
	unsubscribe: jest.fn(),
	disconnect: jest.fn()
}));

const mockPost = {
	id: 1,
	username: "user1",
	description: "Description of post",
	groupName: "Group Name",
	groupDescription: "Group Description",
	categoryId: 1,
	groupId: 1,
	title: "Post Title",
	groupPicture: "http://example.com/group.jpg",
	admin: "Admin User",
	userId: 1,
	user: {
		userId: 1,
		userName: "user1",
		email: "user1@example.com",
		passcode: "password",
		role: "user",
		username: "user1",
		authorities: [{ authority: "USER" }],
		isCredentialsNonExpired: true,
		isAccountNonExpired: true,
		isAccountNonLocked: true,
		password: "password",
		isEnabled: true
	},
	group: {
		id: 1,
		name: "Group Name",
		description: "Group Description",
		isPrivate: false,
		userId: 1,
		username: "user1",
		user: {
			email: "user1@example.com",
			passcode: "password",
			role: "user",
			username: "user1",
			authorities: [{ authority: "USER" }],
			isCredentialsNonExpired: true,
			isAccountNonExpired: true,
			isAccountNonLocked: true,
			password: "password",
			isEnabled: true
		},
		picture: "http://example.com/group.jpg",
		createdAt: "2024-01-01T00:00:00Z"
	},
	category: { id: 1, description: "Category Description" },
	picture: "http://example.com/post.jpg",
	latitude: 12.34,
	longitude: 56.78,
	caption: "Caption of the post",
	createdAt: "2024-01-01T00:00:00Z"
};

const mockRelatedPosts = [mockPost];

describe("PinDetail", () => {
	beforeEach(() => {
		mockNavigate.mockClear();
		mockFetch.mockReset();
	});

	test("renders SkeletonPinDetail while loading", async () => {
		mockFetch.mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() => resolve({ json: () => Promise.resolve({}) }),
						1000
					)
				)
		);

		render(
			<MemoryRouter initialEntries={["/post/1"]}>
				<PinDetail />
			</MemoryRouter>
		);
	});

	test("renders post data correctly", async () => {
		mockFetch.mockImplementation((url: string) => {
			if (url.includes("/api/posts/")) {
				return Promise.resolve({
					json: () => Promise.resolve(mockPost)
				});
			}
			if (url.includes("/api/posts/group/")) {
				return Promise.resolve({
					json: () => Promise.resolve({ content: mockRelatedPosts })
				});
			}
			if (url.includes("/api/savedPosts/isPostSaved")) {
				return Promise.resolve({ json: () => Promise.resolve(false) });
			}
			if (url.includes("/api/savedPosts/countSaves")) {
				return Promise.resolve({ json: () => Promise.resolve(0) });
			}
			return Promise.reject("Not Found");
		});

		render(
			<MemoryRouter initialEntries={["/post/1"]}>
				<PinDetail />
			</MemoryRouter>
		);
	});

	test("navigates to map page on View on Map button click", async () => {
		mockFetch.mockImplementation((url: string) => {
			if (url.includes("/api/posts/")) {
				return Promise.resolve({
					json: () => Promise.resolve(mockPost)
				});
			}
			if (url.includes("/api/posts/group/")) {
				return Promise.resolve({
					json: () => Promise.resolve({ content: mockRelatedPosts })
				});
			}
			if (url.includes("/api/savedPosts/isPostSaved")) {
				return Promise.resolve({ json: () => Promise.resolve(false) });
			}
			if (url.includes("/api/savedPosts/countSaves")) {
				return Promise.resolve({ json: () => Promise.resolve(0) });
			}
			return Promise.reject("Not Found");
		});

		render(
			<MemoryRouter initialEntries={["/post/1"]}>
				<PinDetail />
			</MemoryRouter>
		);
	});

	test("navigates to group page on View Group button click", async () => {
		mockFetch.mockImplementation((url: string) => {
			if (url.includes("/api/posts/")) {
				return Promise.resolve({
					json: () => Promise.resolve(mockPost)
				});
			}
			if (url.includes("/api/posts/group/")) {
				return Promise.resolve({
					json: () => Promise.resolve({ content: mockRelatedPosts })
				});
			}
			if (url.includes("/api/savedPosts/isPostSaved")) {
				return Promise.resolve({ json: () => Promise.resolve(false) });
			}
			if (url.includes("/api/savedPosts/countSaves")) {
				return Promise.resolve({ json: () => Promise.resolve(0) });
			}
			return Promise.reject("Not Found");
		});

		render(
			<MemoryRouter initialEntries={["/post/1"]}>
				<PinDetail />
			</MemoryRouter>
		);
	});

	test("handles save and unsave functionality", async () => {
		mockFetch.mockImplementation((url: string, options?: any) => {
			if (url.includes("/api/posts/")) {
				return Promise.resolve({
					json: () => Promise.resolve(mockPost)
				});
			}
			if (url.includes("/api/posts/group/")) {
				return Promise.resolve({
					json: () => Promise.resolve({ content: mockRelatedPosts })
				});
			}
			if (url.includes("/api/savedPosts/isPostSaved")) {
				return Promise.resolve({ json: () => Promise.resolve(false) });
			}
			if (url.includes("/api/savedPosts/countSaves")) {
				return Promise.resolve({ json: () => Promise.resolve(0) });
			}
			if (url.includes("/api/savedPosts/SavePost")) {
				return Promise.resolve({ ok: true });
			}
			if (url.includes("/api/savedPosts/UnsavePost")) {
				return Promise.resolve({ ok: true });
			}
			return Promise.reject("Not Found");
		});

		render(
			<MemoryRouter initialEntries={["/post/1"]}>
				<PinDetail />
			</MemoryRouter>
		);
	});
});
