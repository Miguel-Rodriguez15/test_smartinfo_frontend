import React, { useState, useEffect } from 'react';
import { createMaze, startGame, getUserGames, getRanking } from '../services/api';
import '../styles/modal.css';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameStart: (gameId: number) => void; 
}

const CreateMazeModal: React.FC<ModalProps> = ({ isOpen, onClose, onGameStart }) => {
  const [mazeSize, setMazeSize] = useState(7);
  const [error, setError] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [viewGames, setViewGames] = useState(false);
  const [viewRanking, setViewRanking] = useState(false);

  useEffect(() => {
    if (viewGames) {
      const fetchUserGames = async () => {
        try {
          const response = await getUserGames();
          setGames(response.games);
        } catch (err) {
          console.error('Error al obtener las partidas:', err);
        }
      };

      fetchUserGames();
    } else if (viewRanking) {
      const fetchRanking = async () => {
        try {
          const response = await getRanking();
          setRanking(response.ranking);
        } catch (err) {
          console.error('Error al obtener el ranking:', err);
        }
      };

      fetchRanking();
    }
  }, [viewGames, viewRanking]);

  const handleCreateMaze = async () => {
    if (mazeSize % 2 === 0) {
      setError('El tamaño del laberinto debe ser impar');
      return;
    }

    try {
      const response = await createMaze({ size: mazeSize });
      const mazeId = response.maze_id;

      const gameResponse = await startGame({ maze_id: mazeId });
      const gameId = gameResponse.game_id;

      onGameStart(gameId); 
    } catch (error) {
      setError('Error al crear la partida');
    }
  };

  const handleResumeGame = (gameId: number) => {
    onGameStart(gameId); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{viewGames ? 'Reanudar Partida' : viewRanking ? 'Ranking' : 'Crear Partida'}</h2>
        </div>

        {viewRanking ? (
          <div>
            {ranking.length > 0 ? (
              <ul>
                {ranking.map((player) => (
                  <li key={player.player_id}>
                    <p>
                      Jugador: {player.username} - Victorias: {player.victories} - Mejor Puntuación: {player.best_score}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay jugadores en el ranking.</p>
            )}
          </div>
        ) : viewGames ? (
          <>
            {games.length > 0 ? (
              <ul>
                {games.map((game) => (
                  <li key={game.game_id}>
                    <p>
                      Partida #{game.game_id} - Tamaño: {game.size} - Movimientos: {game.moves_count} -{' '}
                      {game.is_completed ? 'Completada' : 'En curso'}
                    </p>
                    <button onClick={() => handleResumeGame(game.game_id)}>Reanudar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay partidas disponibles para reanudar.</p>
            )}
          </>
        ) : (
          <>
            <label>Tamaño del laberinto:</label>
            <input type="number" value={mazeSize} onChange={(e) => setMazeSize(Number(e.target.value))} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="modal-button" onClick={handleCreateMaze}>Crear Laberinto</button>
          </>
        )}

        <div style={{ marginTop: '20px' }}>
          <button className="modal-button" onClick={() => {
            setViewGames(true);
            setViewRanking(false);
          }}>Reanudar Partida</button>

          <button className="modal-button" onClick={() => {
            setViewRanking(true);
            setViewGames(false);
          }}>Ranking</button>

          <button className="modal-button" onClick={() => {
            setViewRanking(false);
            setViewGames(false);
          }}>Crear Partida</button>

          <button className="modal-button" onClick={onClose}>Cerrar</button>
        </div>

      </div>
    </div>
  );
};

export default CreateMazeModal;
