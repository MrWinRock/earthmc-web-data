import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './../Components.css'
import axios from 'axios';
import type { PlayerDetailed, PlayerBasic } from '../../interfaces/player';
import { EARTHMC_API_URL, PROXY_API_URL } from '../../config';
import PlayerModal from './PlayerModal';

const Players = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedPlayerData, setSearchedPlayerData] = useState<PlayerDetailed[] | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorSearch, setErrorSearch] = useState<Error | null>(null);
    const [showRawSearchedData, setShowRawSearchedData] = useState(false);

    const [allPlayers, setAllPlayers] = useState<PlayerBasic[]>([]);
    const [loadingAllPlayers, setLoadingAllPlayers] = useState(true);
    const [errorAllPlayers, setErrorAllPlayers] = useState<Error | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 10;

    // State for the modal
    const [modalPlayer, setModalPlayer] = useState<PlayerDetailed | null>(null);
    const [loadingModalPlayer, setLoadingModalPlayer] = useState(false);
    const [errorModalPlayer, setErrorModalPlayer] = useState<Error | null>(null);


    const toggleRawSearchedData = () => {
        setShowRawSearchedData(prevShowRawData => !prevShowRawData);
    }

    useEffect(() => {
        const fetchAllPlayers = async () => {
            setLoadingAllPlayers(true);
            setErrorAllPlayers(null);
            try {
                const response = await axios.get<PlayerBasic[]>(`${EARTHMC_API_URL}/players`);
                setAllPlayers(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorAllPlayers(err);
                } else {
                    setErrorAllPlayers(new Error(String(err ?? 'An unknown error occurred while fetching all players.')));
                }
            } finally {
                setLoadingAllPlayers(false);
            }
        };
        fetchAllPlayers();
    }, []);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setSearchedPlayerData(null);
            setErrorSearch(null);
            return;
        }
        setLoadingSearch(true);
        setErrorSearch(null);
        setSearchedPlayerData(null);

        try {
            const response = await axios.post<PlayerDetailed[]>(`${PROXY_API_URL}/players`, {
                query: [searchQuery.trim()]
            });
            if (response.data && response.data.length > 0) {
                setSearchedPlayerData(response.data);
                if (response.data.length === 1) {
                    setModalPlayer(response.data[0]);
                }
            } else {
                setSearchedPlayerData([]);
                setErrorSearch(new Error(`Player "${searchQuery}" not found.`));
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorSearch(err);
            } else {
                setErrorSearch(new Error(String(err ?? 'An unknown error occurred while searching for the player.')));
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    const openPlayerModalWithDetails = async (playerIdentifier: string) => {
        setLoadingModalPlayer(true);
        setErrorModalPlayer(null);
        setModalPlayer(null);
        try {
            const response = await axios.post<PlayerDetailed[]>(`${PROXY_API_URL}/players`, {
                query: [playerIdentifier]
            });
            if (response.data && response.data.length > 0) {
                setModalPlayer(response.data[0]);
            } else {
                setErrorModalPlayer(new Error(`Could not fetch details for player: ${playerIdentifier}`));
            }
        } catch (err) {
            if (err instanceof Error) {
                setErrorModalPlayer(err);
            } else {
                setErrorModalPlayer(new Error(String(err ?? `Unknown error fetching details for ${playerIdentifier}`)));
            }
        } finally {
            setLoadingModalPlayer(false);
        }
    };

    const closeModal = () => {
        setModalPlayer(null);
        setErrorModalPlayer(null);
    };

    // Pagination logic for allPlayers list
    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentDisplayedPlayers = allPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
    const totalPages = Math.ceil(allPlayers.length / playersPerPage);

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="data-container">
            <h1>Players</h1>
            <form onSubmit={handleSearch} className="player-search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter player name or UUID to search"
                    className="player-search-input"
                />
                <button type="submit" className="button" disabled={loadingSearch}>
                    {loadingSearch ? 'Searching...' : 'Search Player'}
                </button>
            </form>

            {/* Display Search Results */}
            {loadingSearch && <p>Searching for player...</p>}
            {errorSearch && !loadingSearch && <p>Search Error: {errorSearch.message}</p>}

            {searchedPlayerData && !loadingSearch && (
                <div className="data-display search-results-container">
                    <h2>Search Result:</h2>
                    <div className='button-container search-results-button-container'>
                        <button onClick={toggleRawSearchedData} className='button'>
                            {showRawSearchedData ? 'Hide Raw Searched Data' : 'Show Raw Searched Data'}
                        </button>
                        <button onClick={() => { setSearchedPlayerData(null); setErrorSearch(null); setSearchQuery(''); }} className='button'>
                            Clear Search & Show All Players
                        </button>
                    </div>

                    {showRawSearchedData ? (
                        <>
                            <h3>Raw Searched Player Data:</h3>
                            <pre>{JSON.stringify(searchedPlayerData, null, 2)}</pre>
                        </>
                    ) : (
                        searchedPlayerData.length > 0 ? (
                            searchedPlayerData.map(player => (
                                <div key={player.uuid} className="player-search-item">
                                    <h3>{player.formattedName} ({player.name})</h3>
                                    <p><strong>UUID:</strong> {player.uuid}</p>
                                    <p><strong>Town:</strong> {player.town.name || 'N/A'}</p>
                                    <p><strong>Nation:</strong> {player.nation.name || 'N/A'}</p>
                                    <button onClick={() => setModalPlayer(player)} className="button player-search-details-button">
                                        View Full Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No player found for "{searchQuery}".</p>
                        )
                    )}
                </div>
            )}

            {/* Display All Players List (if no search result is being shown) */}
            {!searchedPlayerData && (
                <div className="all-players-list-container">
                    <h2>All Registered Players ({allPlayers.length})</h2>
                    {loadingAllPlayers && <p>Loading all players...</p>}
                    {errorAllPlayers && !loadingAllPlayers && <p>Error loading players list: {errorAllPlayers.message}</p>}

                    {!loadingAllPlayers && !errorAllPlayers && allPlayers.length > 0 && (
                        <>
                            <div className="data-display">
                                {currentDisplayedPlayers.map(player => (
                                    <div key={player.uuid} className="all-players-item">
                                        <div>
                                            <p><strong>Name:</strong> {player.name}</p>
                                            <p><strong>UUID:</strong> {player.uuid}</p>
                                        </div>
                                        <button onClick={() => openPlayerModalWithDetails(player.uuid)} className="button">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                                {currentDisplayedPlayers.length === 0 && allPlayers.length > 0 && <p>No players to display on this page.</p>}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-controls button-container pagination-controls-container">
                                    <button onClick={prevPage} disabled={currentPage === 1} className="button">
                                        Previous
                                    </button>
                                    <span className="pagination-page-info">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button onClick={nextPage} disabled={currentPage === totalPages} className="button">
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {!loadingAllPlayers && !errorAllPlayers && allPlayers.length === 0 && (
                        <p>No players found in the registry.</p>
                    )}
                </div>
            )}

            {/* Modal Rendering */}
            {loadingModalPlayer && <p className="modal-status-text">Loading player details...</p>}
            {errorModalPlayer && <p className="modal-error-text">Error loading details: {errorModalPlayer.message}</p>}
            <PlayerModal
                isOpen={!!modalPlayer && !loadingModalPlayer && !errorModalPlayer}
                player={modalPlayer}
                onClose={closeModal}
            />
        </div>
    );
}

export default Players;