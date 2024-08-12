import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ExploreGroup from "../components/ExploreGroup";

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockGroup = {
  id: 1,
  name: "Group One",
  description: "Description for Group One",
  isPrivate: false,
  user: null,
  picture: "http://example.com/group1.jpg",
  createdAt: "2021-01-01T00:00:00.000Z"
};

describe("ExploreGroup", () => {
  test("renders group content", () => {
    render(
      <Router>
        <ExploreGroup group={mockGroup} />
      </Router>
    );

    // Check if the group image, name, and description are rendered
    expect(screen.getByAltText(mockGroup.name)).toBeInTheDocument();
    expect(screen.getByText(mockGroup.name)).toBeInTheDocument();
    expect(screen.getByText(mockGroup.description)).toBeInTheDocument();
  });

  test("handles group click and navigates to group detail page", () => {
    render(
      <Router>
        <ExploreGroup group={mockGroup} />
      </Router>
    );

    // Find the group element
    const groupElement = screen.getByAltText(mockGroup.name).closest('div');
    
    // Ensure groupElement is not null before interacting with it
    if (groupElement) {
      fireEvent.click(groupElement);
      expect(mockNavigate).toHaveBeenCalledWith(`/group/${mockGroup.id}`, { state: { group: mockGroup } });
    } else {
      throw new Error('Group element not found');
    }
  });
});
