import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    userName: string;
    email: string;
    passcode: string;
    role: string;
    isEnabled: boolean;
    password: string;
    username: string;
    authorities: { authority: string }[];
    isAccountNonLocked: boolean;
    isCredentialsNonExpired: boolean;
    isAccountNonExpired: boolean;
}
  
interface Group {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    user: User | null;
    picture: string;
    createdAt: string;
}

interface GroupResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Group[];
}

const SearchGroups: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
    const navigate = useNavigate();

    const handleJoinClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (joinedGroups.includes(id)) {
            setJoinedGroups(joinedGroups.filter(groupId => groupId !== id));
        } else {
            setJoinedGroups([...joinedGroups, id]);
        }
    };

    useEffect(() => {
        // Fetch groups from API
        fetch('/api/groups')
            .then(response => response.json())
            .then((data: GroupResponse) => {
                console.log('Fetched groups:', data.content);
                setGroups(data.content);
                setFilteredGroups(data.content);
            })
            .catch(error => console.error('Error fetching groups:', error));
    }, []);

    useEffect(() => {
        setFilteredGroups(
            groups.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (group.user && group.user.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (group.user && group.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                group.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, groups]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Search</h2>
            <div className="mb-3">
                <div className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        aria-label="Search"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 border border-gray-300 border-l-0 rounded-r bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <FaSearch />
                    </button>
                </div>
            </div>
            <div>
                {filteredGroups.length > 0 ? (
                    <ul>
                        {filteredGroups.map(group => (
                            <li key={group.id} className="mb-2">
                                <div
                                    className="flex items-center p-4 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
                                    onClick={() => navigate(`/group/${group.id}`, { state: { group } })}
                                >
                                    <img
                                        src={group.picture}
                                        alt={`${group.name} logo`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">{group.name}</div>
                                        <div className="text-gray-500">{group.user ? group.user.userName : 'No owner'}</div>
                                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                                    </div>
                                    <button
                                        className={`flex items-center justify-center w-20 h-10 rounded-full ${
                                            joinedGroups.includes(group.id) ? 'bg-green-200 text-black border border-red 2px' : 'bg-blue-500 text-white hover:bg-blue-600'
                                        } focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                        onClick={(e) => handleJoinClick(e, group.id)}
                                    >
                                        {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No groups found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchGroups;
