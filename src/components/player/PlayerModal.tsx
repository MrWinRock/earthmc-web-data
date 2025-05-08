import React from 'react';
import type { PlayerDetailed } from '../../interfaces/player';
import './../Components.css';

interface PlayerModalProps {
    player: PlayerDetailed | null;
    isOpen: boolean;
    onClose: () => void;
}

const formatDate = (timestamp: number | null) => {
    if (timestamp === null) return 'N/A';
    return new Date(timestamp).toLocaleString();
};

const PlayerModal: React.FC<PlayerModalProps> = ({ player, isOpen, onClose }) => {
    if (!isOpen || !player) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button button" onClick={onClose}>X</button>
                <h2>{player.formattedName} ({player.name})</h2>
                <p><strong>UUID:</strong> {player.uuid}</p>
                {player.title && <p><strong>Title:</strong> {player.title}</p>}
                {player.surname && <p><strong>Surname:</strong> {player.surname}</p>}
                {player.about && <p><strong>About:</strong> {player.about}</p>}

                <h3>Town & Nation</h3>
                <p><strong>Town:</strong> {player.town.name || 'N/A'} {player.town.uuid && `(${player.town.uuid})`}</p>
                <p><strong>Nation:</strong> {player.nation.name || 'N/A'} {player.nation.uuid && `(${player.nation.uuid})`}</p>

                <h3>Timestamps</h3>
                <p><strong>Registered:</strong> {formatDate(player.timestamps.registered)}</p>
                <p><strong>Joined Town:</strong> {formatDate(player.timestamps.joinedTownAt)}</p>
                <p><strong>Last Online:</strong> {formatDate(player.timestamps.lastOnline)}</p>

                <h3>Status</h3>
                <p><strong>Online:</strong> {player.status.isOnline ? 'Yes' : 'No'}</p>
                <p><strong>NPC:</strong> {player.status.isNPC ? 'Yes' : 'No'}</p>
                <p><strong>Mayor:</strong> {player.status.isMayor ? 'Yes' : 'No'}</p>
                <p><strong>King:</strong> {player.status.isKing ? 'Yes' : 'No'}</p>
                <p><strong>Has Town:</strong> {player.status.hasTown ? 'Yes' : 'No'}</p>
                <p><strong>Has Nation:</strong> {player.status.hasNation ? 'Yes' : 'No'}</p>

                <h3>Stats</h3>
                <p><strong>Balance:</strong> {player.stats.balance} gold</p>
                <p><strong>Friends Count:</strong> {player.stats.numFriends}</p>

                {player.ranks.townRanks.length > 0 && (
                    <p><strong>Town Ranks:</strong> {player.ranks.townRanks.join(', ')}</p>
                )}
                {player.ranks.nationRanks.length > 0 && (
                    <p><strong>Nation Ranks:</strong> {player.ranks.nationRanks.join(', ')}</p>
                )}

                {player.friends.length > 0 && (
                    <>
                        <h3>Friends ({player.friends.length}):</h3>
                        <ul>
                            {player.friends.map(friend => (
                                <li key={friend.uuid}>{friend.name} ({friend.uuid})</li>
                            ))}
                        </ul>
                    </>
                )}

                <h3>Permissions:</h3>
                <pre>{JSON.stringify(player.perms, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PlayerModal;