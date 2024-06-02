import { SetStateAction, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const mockGroups = [
    { id: 1, name: 'Hidden Gems', owner: 'Evelyn Smith', imageUrl: 'https://i.pinimg.com/originals/80/4c/82/804c82e561475688f6c115e3df2d8288.jpg', description: 'Explore the hidden gems of the wilderness.' },
    { id: 2, name: 'For the Love of Trees', owner: 'Alex Anderson', imageUrl: 'https://i.pinimg.com/originals/4d/d7/c0/4dd7c0f68fd9d0d51f13cba3a8f24163.jpg', description: 'A group for tree lovers and conservationists.' },
    { id: 3, name: 'Sunset Moments', owner: 'Harper Garcia', imageUrl: 'https://i.pinimg.com/originals/51/c2/d2/51c2d29f95977f38e9be0d20a599d42c.jpg', description: 'Capture and share beautiful sunset moments.' },
    { id: 4, name: 'Elephant Fanatics', owner: 'Ava Jackson', imageUrl: 'https://i.pinimg.com/originals/62/5b/0e/625b0e73e60198e123ba03a6ae1bc574.jpg', description: 'Dedicated to the protection and admiration of elephants.' },
    { id: 5, name: 'Stripe Savvy Syndicate', owner: 'Anthony Harris', imageUrl: 'https://i.pinimg.com/originals/cb/e7/d3/cbe7d319fa566e5d19d25921d2ec7ca5.jpg', description: 'A group for those passionate about striped animals.' },
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
    const navigate = useNavigate();

    const handleArrowClick = (id: number) => {
        navigate(`/group/${id}`);
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
                                    onClick={() => handleArrowClick(group.id)}
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
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        onClick={(e) => { e.stopPropagation(); handleArrowClick(group.id); }}
                                    >
                                        <FaChevronRight className="text-gray-600" />
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