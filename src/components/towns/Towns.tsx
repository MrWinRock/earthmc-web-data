import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import type { TownBasic, TownDetailed } from '../../interfaces/town';
import TownModal from './TownModal';
import './../Components.css';

const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://api.earthmc.net';
const TOWNS_PER_PAGE = 10;

const Towns = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedTownData, setSearchedTownData] = useState<TownDetailed[] | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorSearch, setErrorSearch] = useState<Error | null>(null);
    const [showRawSearchedData, setShowRawSearchedData] = useState(false);

    const [allTowns, setAllTowns] = useState<TownBasic[]>([]);
    const [loadingAllTowns, setLoadingAllTowns] = useState(true);
    const [errorAllTowns, setErrorAllTowns] = useState<Error | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [modalTown, setModalTown] = useState<TownDetailed | null>(null);
    const [loadingModalTown, setLoadingModalTown] = useState(false);
    const [errorModalTown, setErrorModalTown] = useState<Error | null>(null);

    const toggleRawSearchedData = () => {
        setShowRawSearchedData(prev => !prev);
    };

    useEffect(() => {
        const fetchAllTowns = async () => {
            setLoadingAllTowns(true);
            setErrorAllTowns(null);
            try {
                const response = await axios.get<TownBasic[]>(`${API_BASE_URL}/v3/aurora/towns`);
                setAllTowns(response.data);
            } catch (err) {
                setErrorAllTowns(err instanceof Error ? err : new Error(String(err ?? 'Failed to fetch towns')));
            } finally {
                setLoadingAllTowns(false);
            }
        };
        fetchAllTowns();
    }, []);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setSearchedTownData(null);
            setErrorSearch(null);
            return;
        }
        setLoadingSearch(true);
        setErrorSearch(null);
        setSearchedTownData(null);

        try {
            const response = await axios.post<TownDetailed[]>(`${API_BASE_URL}/v3/aurora/towns`, {
                query: [searchQuery.trim()]
            });

            console.log('API Response:', response.data);

            if (response.data) {
                setSearchedTownData(response.data);
                if (response.data.length === 1) {
                    setModalTown(response.data[0]);
                }
            } else {
                setSearchedTownData([]);
            }
        } catch (err) {
            setSearchedTownData(null);
            setErrorSearch(err instanceof Error ? err : new Error(String(err ?? 'Search failed')));
        } finally {
            setLoadingSearch(false);
        }
    };

    const openTownModalWithDetails = async (townIdentifier: string) => {
        setLoadingModalTown(true);
        setErrorModalTown(null);
        setModalTown(null);
        try {
            const response = await axios.post<TownDetailed[]>(`${API_BASE_URL}/v3/aurora/towns`, {
                query: [townIdentifier]
            });
            if (response.data && response.data.length > 0) {
                setModalTown(response.data[0]);
            } else {
                setErrorModalTown(new Error(`Could not fetch details for town: ${townIdentifier}`));
            }
        } catch (err) {
            setErrorModalTown(err instanceof Error ? err : new Error(String(err ?? `Unknown error fetching details for ${townIdentifier}`)));
        } finally {
            setLoadingModalTown(false);
        }
    };

    const closeModal = () => {
        setModalTown(null);
        setErrorModalTown(null);
    };

    const indexOfLastTown = currentPage * TOWNS_PER_PAGE;
    const indexOfFirstTown = indexOfLastTown - TOWNS_PER_PAGE;
    const currentDisplayedTowns = allTowns.slice(indexOfFirstTown, indexOfLastTown);
    const totalPages = Math.ceil(allTowns.length / TOWNS_PER_PAGE);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="data-container">
            <h1>Towns</h1>
            <form onSubmit={handleSearch} className="player-search-form"> {/* Reusing player-search-form style */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter town name or UUID"
                    className="player-search-input" // Reusing player-search-input style
                />
                <button type="submit" className="button" disabled={loadingSearch}>
                    {loadingSearch ? 'Searching...' : 'Search Town'}
                </button>
            </form>

            {loadingSearch && <p>Searching for town...</p>}
            {errorSearch && !loadingSearch && <p>Search Error: {errorSearch.message}</p>}

            {searchedTownData && !loadingSearch && (
                <div className="data-display search-results-container">
                    <h2>Search Result:</h2>
                    <div className='button-container search-results-button-container'>
                        <button onClick={toggleRawSearchedData} className='button'>
                            {showRawSearchedData ? 'Hide Raw Data' : 'Show Raw Data'}
                        </button>
                        <button onClick={() => { setSearchedTownData(null); setErrorSearch(null); setSearchQuery(''); }} className='button'>
                            Clear Search & Show All Towns
                        </button>
                    </div>

                    {Array.isArray(searchedTownData) && searchedTownData.length > 0 ? (
                        searchedTownData.map((town) => (
                            <div key={town.uuid || `fallback-${town.name}`} className="player-search-item">
                                <h3>{town.name}</h3>
                                <p><strong>UUID:</strong> {town.uuid}</p>
                                <p><strong>Mayor:</strong> {town.mayor.name}</p>
                                <p><strong>Nation:</strong> {town.nation.name || 'N/A'}</p>
                                <button onClick={() => setModalTown(town)} className="button player-search-details-button">
                                    View Full Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No town found for "{searchQuery}".</p>
                    )}
                </div>
            )}

            {!searchedTownData && !errorSearch && (
                <div className="all-players-list-container"> {/* Reusing all-players-list-container style */}
                    <h2>All Registered Towns ({allTowns.length})</h2>
                    {loadingAllTowns && <p>Loading all towns...</p>}
                    {errorAllTowns && !loadingAllTowns && <p>Error: {errorAllTowns.message}</p>}

                    {!loadingAllTowns && !errorAllTowns && allTowns.length > 0 && (
                        <>
                            <div className="data-display">
                                {currentDisplayedTowns.map(town => (
                                    <div key={town.uuid} className="all-players-item"> {/* Reusing all-players-item style */}
                                        <div>
                                            <p><strong>Name:</strong> {town.name}</p>
                                            <p><strong>UUID:</strong> {town.uuid}</p>
                                        </div>
                                        <button onClick={() => openTownModalWithDetails(town.uuid)} className="button">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="pagination-controls button-container pagination-controls-container">
                                    <button onClick={prevPage} disabled={currentPage === 1} className="button">Previous</button>
                                    <span className="pagination-page-info">Page {currentPage} of {totalPages}</span>
                                    <button onClick={nextPage} disabled={currentPage === totalPages} className="button">Next</button>
                                </div>
                            )}
                        </>
                    )}
                    {!loadingAllTowns && !errorAllTowns && allTowns.length === 0 && (
                        <p>No towns found.</p>
                    )}
                </div>
            )}

            {loadingModalTown && <p className="modal-status-text">Loading town details...</p>}
            {errorModalTown && <p className="modal-error-text">Error loading details: {errorModalTown.message}</p>}
            <TownModal
                isOpen={!!modalTown && !loadingModalTown && !errorModalTown}
                town={modalTown}
                onClose={closeModal}
            />
        </div>
    );
};

export default Towns;