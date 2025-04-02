import React, { useState } from 'react';
import { getGameStatus, movePlayer, restartGame } from '../services/api';
import CreateMazeModal from '../components/CreateMazeModal';
import '../styles/maze.css';
interface MazeData {
  status: string;
  current_position: [number, number];
  moves_count: number;
  is_completed: boolean;
  maze_size: number;
  exit_position: [number, number];
  distance_to_exit: number;
  maze: number[][];
}

const Maze: React.FC = () => {
  const [mazeData, setMazeData] = useState<MazeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleGameStart = (id: number) => {
    setGameId(id);
    setIsModalOpen(false);
    fetchMazeData(id);
  };

  const fetchMazeData = async (id: number) => {
    try {
      setLoading(true);
      const data = await getGameStatus(id);
      setMazeData(data);
    } catch (err) {
      setError('Error al cargar los datos del laberinto');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (direction: string) => {
    if (!gameId) return;

    try {
      setLoading(true);
      await movePlayer(gameId, direction);
      const updatedData = await getGameStatus(gameId);
      setMazeData(updatedData);
    } catch (error) {
      console.error('Error al mover al jugador:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isModalOpen) {
    return (
      <CreateMazeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGameStart={handleGameStart}
      />
    );
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  if (!mazeData || !mazeData.maze) return <p>Datos del laberinto no disponibles</p>;
  const renderCell = (cellValue: number) => {
    switch (cellValue) {
      case 0:
        return '🟩'; // Camino
      case 1:
        return '🧱'; // Pared
      case 2:
        return '🧍'; // Jugador
      case 3:
        return '🏁'; // Salida
      default:
        return '';
    }
  };

  const handleRestart = async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      await restartGame(gameId);
      const updatedData = await getGameStatus(gameId);
      setMazeData(updatedData);
    } catch (error) {
      console.error('Error al reiniciar la partida:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h1>Estado del Laberinto</h1>
      <p>Movimientos realizados: {mazeData.moves_count}</p>
      <p>Distancia a la salida: {mazeData.distance_to_exit}</p>
      <p>{mazeData.is_completed ? '¡Juego completado!' : 'Sigue avanzando...'}</p>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mazeData.maze_size}, auto)` }}>
        {mazeData.maze.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                padding: '10px',
                textAlign: 'center',
                border: '1px solid black',
              }}
            >
              {renderCell(cellValue)}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="maze-button" onClick={() => handleMove('up')}>Arriba</button>
        <button className="maze-button" onClick={() => handleMove('down')}>Abajo</button>
        <button className="maze-button" onClick={() => handleMove('left')}>Izquierda</button>
        <button className="maze-button" onClick={() => handleMove('right')}>Derecha</button>
        <button className="maze-button" onClick={handleRestart}>Reiniciar Partida</button>
      </div>
    </div>
  );
};

export default Maze;
