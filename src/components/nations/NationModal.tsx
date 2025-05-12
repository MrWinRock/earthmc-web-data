import React from 'react';
import type { NationDetailed, NationResident } from '../../interfaces/nation';
import './../Components.css';

interface NationModalProps {
    nation: NationDetailed | null;
    isOpen: boolean;
    onClose: () => void;
}

const formatDate = (timestamp: number | null): string => {
    if (timestamp === null) return 'N/A';
    return new Date(timestamp).toLocaleString();
};

const formatBoolean = (value: boolean): string => (value ? 'Yes' : 'No');

const renderList = (title: string, items: { name: string; uuid: string }[]) => {
    if (!items || items.length === 0) return null;
    return (
        <>
            <h3>{title} ({items.length}):</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.uuid}>{item.name} ({item.uuid})</li>
                ))}
            </ul>
        </>
    );
};

const NationModal: React.FC<NationModalProps> = ({ nation, isOpen, onClose }) => {
    if (!isOpen || !nation) {
        return null;
    }

    const mapLink = `https://map.earthmc.net/?world=${nation.coordinates.spawn.world}&zoom=5&x=${nation.coordinates.spawn.x.toFixed(
        0
    )}&y=${nation.coordinates.spawn.y.toFixed(0)}&z=${nation.coordinates.spawn.z.toFixed(0)}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button button" onClick={onClose} aria-label="Close modal">X</button>
                <h2>{nation.name}</h2>
                <a href={mapLink} target="_blank" rel="noopener noreferrer">
                    View on Map
                </a>
                <p><strong>UUID:</strong> {nation.uuid}</p>
                {nation.board && <p><strong>Board:</strong> {nation.board}</p>}
                {nation.wiki && <p><strong>Wiki:</strong> <a href={nation.wiki} target="_blank" rel="noopener noreferrer">{nation.wiki}</a></p>}

                <h3>King</h3>
                <p>{nation.king.name} ({nation.king.uuid})</p>

                <h3>Capital</h3>
                <p>{nation.capital.name} ({nation.capital.uuid})</p>

                <h3>Timestamps</h3>
                <p><strong>Registered:</strong> {formatDate(nation.timestamps.registered)}</p>

                <h3>Status</h3>
                <p><strong>Public:</strong> {formatBoolean(nation.status.isPublic)}</p>
                <p><strong>Open:</strong> {formatBoolean(nation.status.isOpen)}</p>
                <p><strong>Neutral:</strong> {formatBoolean(nation.status.isNeutral)}</p>

                <h3>Stats</h3>
                <p><strong>Town Blocks:</strong> {nation.stats.numTownBlocks}</p>
                <p><strong>Residents:</strong> {nation.stats.numResidents}</p>
                <p><strong>Towns:</strong> {nation.stats.numTowns}</p>
                <p><strong>Allies:</strong> {nation.stats.numAllies}</p>
                <p><strong>Enemies:</strong> {nation.stats.numEnemies}</p>
                <p><strong>Balance:</strong> {nation.stats.balance} gold</p>

                {renderList("Residents", nation.residents)}
                {renderList("Towns", nation.towns)}
                {renderList("Allies", nation.allies)}
                {renderList("Enemies", nation.enemies)}

                {nation.ranks && Object.keys(nation.ranks).length > 0 && (
                    <>
                        <h3>Ranks:</h3>
                        {Object.entries(nation.ranks).map(([rankName, players]) => (
                            players.length > 0 && (
                                <div key={rankName}>
                                    <p><strong>{rankName}:</strong></p>
                                    <ul>
                                        {players.map((player: NationResident) => (
                                            <li key={player.uuid}>{player.name} ({player.uuid})</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default NationModal;