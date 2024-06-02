import { SetStateAction, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const mockGroups = [
    { id: 6, name: 'Mountain Climbers', owner: 'Liam Johnson', description: 'A group for mountain climbing enthusiasts.', imageUrl: 'https://source.unsplash.com/1600x900/?mountain' },
    { id: 7, name: 'Ocean Explorers', owner: 'Emma Brown', description: 'Discover the secrets of the ocean.', imageUrl: 'https://source.unsplash.com/1600x900/?ocean' },
    { id: 8, name: 'Bird Watchers', owner: 'Sophia Davis', description: 'A community for bird watching lovers.', imageUrl: 'https://source.unsplash.com/1600x900/?bird' },
    { id: 9, name: 'Art Admirers', owner: 'Noah Martinez', description: 'Share and discuss your favorite art pieces.', imageUrl: 'https://source.unsplash.com/1600x900/?art' },
    { id: 10, name: 'Tech Geeks', owner: 'Isabella Gonzalez', description: 'A place for tech enthusiasts to share and learn.', imageUrl: 'https://source.unsplash.com/1600x900/?technology' },
    { id: 11, name: 'Photography Pros', owner: 'Oliver Lee', description: 'A community for professional photographers to share tips and photos.', imageUrl: 'https://source.unsplash.com/1600x900/?photography' },
    { id: 12, name: 'Cooking Masters', owner: 'Mia Walker', description: 'Share and learn recipes from master chefs.', imageUrl: 'https://source.unsplash.com/1600x900/?cooking' },
    { id: 13, name: 'Fitness Freaks', owner: 'Jackson Harris', description: 'Join us to get fit and share your fitness journey.', imageUrl: 'https://source.unsplash.com/1600x900/?fitness' },
    { id: 14, name: 'Book Lovers', owner: 'Sophia Thompson', description: 'A group for avid readers to share and discuss books.', imageUrl: 'https://source.unsplash.com/1600x900/?books' },
    { id: 15, name: 'Travel Enthusiasts', owner: 'Liam Wilson', description: 'Share your travel experiences and tips with fellow travelers.', imageUrl: 'https://source.unsplash.com/1600x900/?travel' },
    { id: 16, name: 'Music Maniacs', owner: 'Emma Robinson', description: 'A group for music lovers to share and discover new music.', imageUrl: 'https://source.unsplash.com/1600x900/?music' },
    { id: 17, name: 'Movie Buffs', owner: 'Oliver Martinez', description: 'Discuss and review the latest movies with other movie buffs.', imageUrl: 'https://source.unsplash.com/1600x900/?movies' },
    { id: 18, name: 'Gaming Gurus', owner: 'Lucas Taylor', description: 'A community for gamers to share tips and play together.', imageUrl: 'https://source.unsplash.com/1600x900/?gaming' },
    { id: 19, name: 'Pet Lovers', owner: 'Ella Thomas', description: 'Share your love for pets and discuss pet care tips.', imageUrl: 'https://source.unsplash.com/1600x900/?pets' },
    { id: 20, name: 'Gardeners United', owner: 'James White', description: 'A group for gardening enthusiasts to share their gardening experiences.', imageUrl: 'https://source.unsplash.com/1600x900/?gardening' },
];

const SearchGroups = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState(mockGroups);
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
        setFilteredGroups(
            mockGroups.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    const handleSearchChange = (event: { target: { value: SetStateAction<string> }; }) => {
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
                                    key={group.id}
                                    className="flex items-center p-4 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
                                    onClick={() => navigate(`/group/${group.id}`)}
                                >
                                    <img
                                        src={group.imageUrl}
                                        alt={`${group.name} logo`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">{group.name}</div>
                                        <div className="text-gray-500">{group.owner}</div>
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
