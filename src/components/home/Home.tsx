import { useEffect, useState } from 'react'
import './../Components.css'
import axios from 'axios';

interface ApiData {
    version: string;
    moonPhase: string;
    timestamps: {
        newDayTime: number;
        serverTimeOfDay: number;
    };
    status: {
        hasStorm: boolean;
        isThundering: boolean;
    };
    stats: {
        time: number;
        fullTime: number;
        maxPlayers: number;
        numOnlinePlayers: number;
        numOnlineNomads: number;
        numResidents: number;
        numNomads: number;
        numTowns: number;
        numTownBlocks: number;
        numNations: number;
        numQuarters: number;
        numCuboids: number;
    };
    voteParty: {
        target: number;
        numRemaining: number;
    };
}

const getMoonPhaseEmoji = (moonPhase: string): string => {
    switch (moonPhase.toUpperCase()) {
        case 'NEW_MOON':
            return '🌑';
        case 'WAXING_CRESCENT':
            return '🌒';
        case 'FIRST_QUARTER':
            return '🌓';
        case 'WAXING_GIBBOUS':
            return '🌔';
        case 'FULL_MOON':
            return '🌕';
        case 'WANING_GIBBOUS':
            return '🌖';
        case 'LAST_QUARTER':
            return '🌗';
        case 'WANING_CRESCENT':
            return '🌘';
        default:
            return '';
    }
};

// Determine the API base URL based on the environment
const EARTHMC_API_URL = 'https://api.earthmc.net/v3/aurora';

const Home = () => {
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [showRawData, setShowRawData] = useState(false);

    const toggleRawData = () => {
        setShowRawData(prevShowRawData => !prevShowRawData);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ApiData>(`${EARTHMC_API_URL}`);
                setData(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error(String(err ?? 'An unknown error occurred')));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="data-container">
            {loading && <p>Loading server status...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div className="data-display">
                    <div className='button-container'>
                        <button onClick={toggleRawData} className='button'>
                            {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                        </button>
                        <button onClick={() => window.location.reload()} className='button'>
                            Refresh Data
                        </button>
                    </div>


                    {showRawData ? (
                        <>
                            <h3>Raw Data:</h3>
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </>
                    ) : (
                        <>
                            <h2>Server Status (Aurora)</h2>
                            <p><strong>Version:</strong> {data.version}</p>
                            <p><strong>Moon Phase:</strong> {data.moonPhase} {getMoonPhaseEmoji(data.moonPhase)} </p>
                            <p><strong>Storming:</strong> {data.status.hasStorm ? 'Yes' : 'No'}</p>
                            <p><strong>Thundering:</strong> {data.status.isThundering ? 'Yes' : 'No'}</p>

                            <h3>Timestamps:</h3>
                            <p>New Day Time: {new Date(data.timestamps.newDayTime).toLocaleString()}</p>
                            <p>Server Time of Day: {data.timestamps.serverTimeOfDay}</p>

                            <h3>Statistics:</h3>
                            <p>Online Players: {data.stats.numOnlinePlayers} / {data.stats.maxPlayers}</p>
                            <p>Online Nomads: {data.stats.numOnlineNomads}</p>
                            <p>Total Residents: {data.stats.numResidents}</p>
                            <p>Total Nomads: {data.stats.numNomads}</p>
                            <p>Towns: {data.stats.numTowns}</p>
                            <p>Nations: {data.stats.numNations}</p>
                            <p>Town Blocks: {data.stats.numTownBlocks}</p>
                            <p>Quarters: {data.stats.numQuarters}</p>
                            <p>Cuboids: {data.stats.numCuboids}</p>
                            <p>Current In-game Time: {data.stats.time}</p>
                            <p>Full In-game Time: {data.stats.fullTime}</p>

                            <h3>Vote Party:</h3>
                            <p>Target: {data.voteParty.target}</p>
                            <p>Remaining Votes: {data.voteParty.numRemaining}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home