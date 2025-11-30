import { BattleRoom, Player, Scenario } from '@/types/game';

// Generate random room code
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate player ID
export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create new room
export const createRoom = (hostName: string, scenarios: Scenario[]): BattleRoom => {
  const roomId = generateRoomCode();
  const playerId = generatePlayerId();
  
  const host: Player = {
    id: playerId,
    name: hostName,
    score: 0,
    answers: [],
    isReady: false,
    isHost: true,
  };

  const room: BattleRoom = {
    id: roomId,
    hostId: playerId,
    players: [host],
    scenarios,
    currentScenarioIndex: 0,
    status: 'waiting',
    createdAt: Date.now(),
  };

  return room;
};

// Join existing room
export const joinRoom = (roomId: string, playerName: string): Player => {
  const playerId = generatePlayerId();
  
  const player: Player = {
    id: playerId,
    name: playerName,
    score: 0,
    answers: [],
    isReady: false,
    isHost: false,
  };

  return player;
};

// Mock WebSocket-like event emitter
class RoomEventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export const roomEvents = new RoomEventEmitter();

// Simulate network storage (would be Firebase in production)
class RoomStorage {
  private storage: Map<string, BattleRoom> = new Map();

  saveRoom(room: BattleRoom) {
    this.storage.set(room.id, room);
    // Simulate network broadcast
    setTimeout(() => {
      roomEvents.emit('room-update', room);
    }, 100);
  }

  getRoom(roomId: string): BattleRoom | null {
    return this.storage.get(roomId) || null;
  }

  deleteRoom(roomId: string) {
    this.storage.delete(roomId);
  }

  getAllRooms(): BattleRoom[] {
    return Array.from(this.storage.values());
  }
}

export const roomStorage = new RoomStorage();

// Calculate battle results
export const calculateBattleWinner = (players: Player[]): Player => {
  return players.reduce((winner, player) => {
    return player.score > winner.score ? player : winner;
  }, players[0]);
};
