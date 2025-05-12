import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import type { NationDetailed } from '../../interfaces/nation';
import NationModal from './NationModal';
import { EARTHMC_API_URL, PROXY_API_URL } from '../../config';
import './../Components.css';

const NATIONS_PER_PAGE = 10;

const Nations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedNationData, setSearchedNationData] = useState<NationDetailed[] | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorSearch, setErrorSearch] = useState<Error | null>(null);
    const [showRawSearchedData, setShowRawSearchedData] = useState(false);

    const [allNations, setAllNations] = useState<NationDetailed[]>([]);
    const [loadingAllNations, setLoadingAllNations] = useState(true);
    const [errorAllNations, setErrorAllNations] = useState<Error | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [modalNation, setModalNation] = useState<NationDetailed | null>(null);
    const [loadingModalNation, setLoadingModalNation] = useState(false);
    const [errorModalNation, setErrorModalNation] = useState<Error | null>(null);

    const toggleRawSearchedData: () => void = () => {
        setShowRawSearchedData((prev) => !prev);
    };

    useEffect(() => {
        const fetchAllNations = async () => {
            setLoadingAllNations(true);
            setErrorAllNations(null);
            try {
                const response = await axios.get<NationDetailed[]>(`${EARTHMC_API_URL}/nations`);
                setAllNations(response.data);
            } catch (err) {
                setErrorAllNations(err instanceof Error ? err : new Error(String(err ?? 'Failed to fetch nations')));
            } finally {
                setLoadingAllNations(false);
            }
        };
        fetchAllNations();
    }, []);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setSearchedNationData(null);
            setErrorSearch(null);
            return;
        }
        setLoadingSearch(true);
        setErrorSearch(null);
        setSearchedNationData(null);

        try {
            const response = await axios.post<NationDetailed[]>(`${PROXY_API_URL}/nations`, {
                query: [searchQuery.trim()],
            });

            if (response.data) {
                setSearchedNationData(response.data);
                if (response.data.length === 1) {
                    setModalNation(response.data[0]);
                }
            } else {
                setSearchedNationData([]);
            }
        } catch (err) {
            setSearchedNationData(null);
            setErrorSearch(err instanceof Error ? err : new Error(String(err ?? 'Search failed')));
        } finally {
            setLoadingSearch(false);
        }
    };

    const openNationModalWithDetails = async (nationIdentifier: string) => {
        setLoadingModalNation(true);
        setErrorModalNation(null);
        setModalNation(null);
        try {
            const response = await axios.post<NationDetailed[]>(`${PROXY_API_URL}/nations`, {
                query: [nationIdentifier],
            });
            if (response.data && response.data.length > 0) {
                setModalNation(response.data[0]);
            } else {
                setErrorModalNation(new Error(`Could not fetch details for nation: ${nationIdentifier}`));
            }
        } catch (err) {
            setErrorModalNation(
                err instanceof Error ? err : new Error(String(err ?? `Unknown error fetching details for ${nationIdentifier}`))
            );
        } finally {
            setLoadingModalNation(false);
        }
    };

    const closeModal = () => {
        setModalNation(null);
        setErrorModalNation(null);
    };

    const indexOfLastNation = currentPage * NATIONS_PER_PAGE;
    const indexOfFirstNation = indexOfLastNation - NATIONS_PER_PAGE;
    const currentDisplayedNations = allNations.slice(indexOfFirstNation, indexOfLastNation);
    const totalPages = Math.ceil(allNations.length / NATIONS_PER_PAGE);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="data-container">
            <h1>Nations</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter nation name or UUID"
                    className="search-input"
                />
                <button type="submit" className="button" disabled={loadingSearch}>
                    {loadingSearch ? 'Searching...' : 'Search Nation'}
                </button>
            </form>

            {loadingSearch && <p>Searching for nation...</p>}
            {errorSearch && !loadingSearch && <p>Search Error: {errorSearch.message}</p>}

            {searchedNationData && !loadingSearch && (
                <div className="data-display search-results-container">
                    <h2>Search Result:</h2>
                    <div className="button-container search-results-button-container">
                        <button onClick={toggleRawSearchedData} className="button">
                            {showRawSearchedData ? 'Hide Raw Data' : 'Show Raw Data'}
                        </button>
                        <button
                            onClick={() => {
                                setSearchedNationData(null);
                                setErrorSearch(null);
                                setSearchQuery('');
                            }}
                            className="button"
                        >
                            Clear Search & Show All Nations
                        </button>
                    </div>

                    {Array.isArray(searchedNationData) && searchedNationData.length > 0 ? (
                        searchedNationData.map((nation) => (
                            <div key={nation.uuid || `fallback-${nation.name}`} className="search-item">
                                <h3>{nation.name}</h3>
                                <p>
                                    <strong>UUID:</strong> {nation.uuid}
                                </p>
                                <p>
                                    <strong>King:</strong> {nation.king.name}
                                </p>
                                <p>
                                    <strong>Capital:</strong> {nation.capital.name}
                                </p>
                                <button
                                    onClick={() => setModalNation(nation)}
                                    className="button search-details-button"
                                >
                                    View Full Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No nation found for "{searchQuery}".</p>
                    )}
                </div>
            )}

            {!searchedNationData && !errorSearch && (
                <div className="all-list-container">
                    <h2>All Registered Nations ({allNations.length})</h2>
                    {loadingAllNations && <p>Loading all nations...</p>}
                    {errorAllNations && !loadingAllNations && <p>Error: {errorAllNations.message}</p>}

                    {!loadingAllNations && !errorAllNations && allNations.length > 0 && (
                        <>
                            <div className="data-display">
                                {currentDisplayedNations.map((nation) => (
                                    <div key={nation.uuid} className="all-item">
                                        <div>
                                            <p>
                                                <strong>Name:</strong> {nation.name}
                                            </p>
                                            <p>
                                                <strong>UUID:</strong> {nation.uuid}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openNationModalWithDetails(nation.uuid)}
                                            className="button"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
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
                    {!loadingAllNations && !errorAllNations && allNations.length === 0 && (
                        <p>No nations found.</p>
                    )}
                </div>
            )}

            {loadingModalNation && <p className="modal-status-text">Loading nation details...</p>}
            {errorModalNation && <p className="modal-error-text">Error loading details: {errorModalNation.message}</p>}
            <NationModal
                isOpen={!!modalNation && !loadingModalNation && !errorModalNation}
                nation={modalNation}
                onClose={closeModal}
            />
        </div>
    );
};

export default Nations;