import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { email, password });
    console.log(response);

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } else {
      throw new Error(response.data.message || 'No se recibió el token');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la petición:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error de conexión');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error inesperado');
    }
  }
};

export const getGameStatus = async (gameId: number) => {
  try {
    const response = await api.get(`/games/status?game_id=${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el estado del juego:', error);
    throw error;
  }
};

export const movePlayer = async (gameId: number, direction: string) => {
  try {
    const response = await api.post('/move', { game_id: gameId, direction });
    return response.data;
  } catch (error) {
    console.error('Error al mover al jugador:', error);
    throw error;
  }
};

export const createMaze = async (data: { size: number }) => {
  try {
    const response = await api.post('/mazes', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el laberinto:', error);
    throw error;
  }
};

export const startGame = async (data: { maze_id: number }) => {
  try {
    const response = await api.post('/games/start', data);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar el juego:', error);
    throw error;
  }
};

export const getUserGames = async () => {
  try {
    const response = await api.get('/games/user');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las partidas del usuario:', error);
    throw error;
  }
};

export const restartGame = async (gameId: number) => {
  try {
    const response = await api.post('/games/restart', { game_id: gameId });
    return response.data;
  } catch (error) {
    console.error('Error al reiniciar la partida:', error);
    throw error;
  }
};

export const getRanking = async () => {
  try {
    const response = await api.get('/ranking');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el ranking:', error);
    throw error;
  }
};

export const register = async (data: { username: string, email: string, password: string }) => {
  try {
    const response = await api.post('/register', data);
    console.log(response);

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } else {
      throw new Error(response.data.message || 'No se recibió el token');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la petición:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error de conexión');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error inesperado');
    }
  }
};



export default api;
