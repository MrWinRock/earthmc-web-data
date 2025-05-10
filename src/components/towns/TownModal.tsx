import React from 'react';
import type { TownDetailed, TownResident, TownQuarter, TownRank } from '../../interfaces/town';
import './../Components.css';

interface TownModalProps {
    town: TownDetailed | null;
    isOpen: boolean;
    onClose: () => void;
}

const formatDate = (timestamp: number | null): string => {
    if (timestamp === null) return 'N/A';
    return new Date(timestamp).toLocaleString();
};

const formatBoolean = (value: boolean): string => (value ? 'Yes' : 'No');

const TownModal: React.FC<TownModalProps> = ({ town, isOpen, onClose }) => {
    if (!isOpen || !town) {
        return null;
    }

    const renderResidentList = (title: string, residents: TownResident[] | undefined) => {
        if (!residents || residents.length === 0) return null;
        return (
            <>
                <h3>{title} ({residents.length}):</h3>
                <ul>
                    {residents.map((resident) => (
                        <li key={resident.uuid}>{resident.name} ({resident.uuid})</li>
                    ))}
                </ul>
            </>
        );
    };

    const mapLink = `https://map.earthmc.net/?world=minecraft:overworld&zoom=5&x=${town.coordinates.spawn.x.toFixed(0)}&y=${town.coordinates.spawn.y.toFixed(0)}&z=${town.coordinates.spawn.z.toFixed(0)}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button button" onClick={onClose}>X</button>
                <h2>{town.name}</h2>
                <a href={mapLink} target="_blank" rel="noopener noreferrer">
                    View on Map
                </a>
                <p><strong>UUID:</strong> {town.uuid}</p>
                {town.board && <p><strong>Board:</strong> {town.board}</p>}
                <p><strong>Founder:</strong> {town.founder}</p>
                {town.wiki && <p><strong>Wiki:</strong> <a href={town.wiki} target="_blank" rel="noopener noreferrer">{town.wiki}</a></p>}

                <h3>Mayor</h3>
                <p>{town.mayor.name} ({town.mayor.uuid})</p>

                <h3>Nation</h3>
                <p>{town.nation.name || 'N/A'} {town.nation.uuid && `(${town.nation.uuid})`}</p>

                <h3>Timestamps</h3>
                <p><strong>Registered:</strong> {formatDate(town.timestamps.registered)}</p>
                <p><strong>Joined Nation:</strong> {formatDate(town.timestamps.joinedNationAt)}</p>
                <p><strong>Ruined At:</strong> {formatDate(town.timestamps.ruinedAt)}</p>

                <h3>Status</h3>
                <p><strong>Public:</strong> {formatBoolean(town.status.isPublic)}</p>
                <p><strong>Open:</strong> {formatBoolean(town.status.isOpen)}</p>
                <p><strong>Neutral:</strong> {formatBoolean(town.status.isNeutral)}</p>
                <p><strong>Capital:</strong> {formatBoolean(town.status.isCapital)}</p>
                <p><strong>OverClaimed:</strong> {formatBoolean(town.status.isOverClaimed)}</p>
                <p><strong>Ruined:</strong> {formatBoolean(town.status.isRuined)}</p>
                <p><strong>For Sale:</strong> {formatBoolean(town.status.isForSale)}</p>
                <p><strong>Has Nation:</strong> {formatBoolean(town.status.hasNation)}</p>
                <p><strong>Has Overclaim Shield:</strong> {formatBoolean(town.status.hasOverclaimShield)}</p>
                <p><strong>Outsiders Can Spawn:</strong> {formatBoolean(town.status.canOutsidersSpawn)}</p>

                <h3>Stats</h3>
                <p><strong>Town Blocks:</strong> {town.stats.numTownBlocks}</p>
                <p><strong>Max Town Blocks:</strong> {town.stats.maxTownBlocks}</p>
                <p><strong>Bonus Blocks:</strong> {town.stats.bonusBlocks}</p>
                <p><strong>Residents:</strong> {town.stats.numResidents}</p>
                <p><strong>Trusted:</strong> {town.stats.numTrusted}</p>
                <p><strong>Outlaws:</strong> {town.stats.numOutlaws}</p>
                <p><strong>Balance:</strong> {town.stats.balance} gold</p>
                <p><strong>For Sale Price:</strong> {town.stats.forSalePrice !== null ? `${town.stats.forSalePrice} gold` : 'N/A'}</p>

                <h3>Coordinates</h3>
                <p><strong>Spawn:</strong> World: {town.coordinates.spawn.world}, X: {town.coordinates.spawn.x.toFixed(2)}, Y: {town.coordinates.spawn.y.toFixed(2)}, Z: {town.coordinates.spawn.z.toFixed(2)}</p>
                <p><strong>Home Block:</strong> X: {town.coordinates.homeBlock[0]}, Z: {town.coordinates.homeBlock[1]}</p>
                <p><strong>Town Blocks Count:</strong> {town.coordinates.townBlocks.length}</p>

                {renderResidentList("Residents", town.residents)}
                {renderResidentList("Trusted", town.trusted)}
                {renderResidentList("Outlaws", town.outlaws)}

                {town.quarters && town.quarters.length > 0 && (
                    <>
                        <h3>Quarters ({town.quarters.length}):</h3>
                        <ul>
                            {town.quarters.map((quarter: TownQuarter) => (
                                <li key={quarter.uuid}>{quarter.name} ({quarter.uuid})</li>
                            ))}
                        </ul>
                    </>
                )}

                {town.ranks && Object.keys(town.ranks).length > 0 && (
                    <>
                        <h3>Ranks:</h3>
                        {Object.entries(town.ranks).map(([rankName, players]) => (
                            players.length > 0 && (
                                <div key={rankName}>
                                    <p><strong>{rankName}:</strong></p>
                                    <ul>
                                        {players.map((player: TownRank) => (
                                            <li key={player.uuid}>{player.name} ({player.uuid})</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                    </>
                )}

                <h3>Permissions:</h3>
                <pre>{JSON.stringify(town.perms || {}, null, 2)}</pre>
            </div>
        </div>
    );
};

export default TownModal;