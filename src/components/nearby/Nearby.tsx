import { useState } from 'react';
import axios from 'axios';
import './../Components.css';
import { PROXY_API_URL } from '../../config';

interface NearbyQuery {
    target_type: 'TOWN' | 'COORDINATE';
    target: string | [number, number];
    search_type: 'TOWN';
    radius: number;
}

interface NearbyResult {
    name: string;
    uuid: string;
}

const Nearby = () => {
    const [targetType, setTargetType] = useState<'TOWN' | 'COORDINATE'>('TOWN');
    const [townName, setTownName] = useState<string>('');
    const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
    const [radius, setRadius] = useState<number>(100);
    const [results, setResults] = useState<NearbyResult[][] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        const query: NearbyQuery = {
            target_type: targetType,
            target: targetType === 'TOWN' ? townName : coordinates,
            search_type: 'TOWN',
            radius,
        };

        try {
            const response = await axios.post<NearbyResult[][]>(`${PROXY_API_URL}/nearby`, {
                query: [query],
            });
            setResults(response.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(`Failed to fetch nearby data: ${err.message}`);
            } else {
                setError('Failed to fetch nearby data. Please check your input and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getResultsHeader = () => {
        if (targetType === 'TOWN' && townName.trim()) {
            return `Nearby of ${townName}`;
        } else if (targetType === 'COORDINATE') {
            return `Nearby of (${coordinates[0]}, ${coordinates[1]})`;
        }
        return 'Nearby Results';
    };

    return (
        <div className="data-container">
            <h1>Nearby</h1>
            <form className="form-container" onSubmit={(e) => e.preventDefault()}>
                <label className="form-label">
                    Target Type:
                    <select
                        value={targetType}
                        onChange={(e) => {
                            setTargetType(e.target.value as 'TOWN' | 'COORDINATE');
                            setTownName('');
                            setCoordinates([0, 0]);
                        }}
                        className="form-input"
                    >
                        <option value="TOWN">Town</option>
                        <option value="COORDINATE">Coordinate</option>
                    </select>
                </label>
                {targetType === 'TOWN' ? (
                    <label className="form-label">
                        Target Town:
                        <input
                            type="text"
                            value={townName}
                            onChange={(e) => setTownName(e.target.value)}
                            placeholder="Enter town name"
                            className="form-input"
                        />
                    </label>
                ) : (
                    <div className="coordinate-inputs">
                        <label className="form-label">
                            X Coordinate:
                            <input
                                type="number"
                                value={coordinates[0]}
                                onChange={(e) =>
                                    setCoordinates([Number(e.target.value), coordinates[1]])
                                }
                                placeholder="Enter X"
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            Z Coordinate:
                            <input
                                type="number"
                                value={coordinates[1]}
                                onChange={(e) =>
                                    setCoordinates([coordinates[0], Number(e.target.value)])
                                }
                                placeholder="Enter Z"
                                className="form-input"
                            />
                        </label>
                    </div>
                )}
                <label className="form-label">
                    Radius:
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        placeholder="Enter radius"
                        className="form-input"
                    />
                </label>
                <button onClick={handleSearch} className="button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Nearby'}
                </button>
            </form>
            {loading && <p>Loading nearby data...</p>}
            {error && <p className="error-text">{error}</p>}
            {results && (
                <div className="data-display">
                    <h2>{getResultsHeader()}</h2>
                    {results.length > 0 ? (
                        results.map((group, index) => (
                            <div key={index} className="result-group">
                                <ul>
                                    {group.map((item) => (
                                        <li key={item.uuid}>
                                            {item.name} ({item.uuid})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Nearby;