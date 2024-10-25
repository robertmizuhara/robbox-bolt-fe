import { useEffect, useRef, useState, useCallback } from 'react';
import { Player } from '../types/game';

interface WebSocketMessage {
  type: 'players_update' | 'game_start' | 'error' | 'pong';
  payload: any;
}

const WS_RECONNECT_DELAY = 2000;
const MAX_RECONNECT_ATTEMPTS = 3;
const PING_INTERVAL = 15000;

export function useWebSocket(clientUuid: string, gameCode: string) {
  console.log('useWebSocket hook initialized', { clientUuid, gameCode });
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<number>();
  const reconnectAttempts = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameType, setGameType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    console.log('Attempting to connect WebSocket');
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already open');
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = '8000';
      
      // Add required parameters
      const params = new URLSearchParams({
        game_code: gameCode,
        origin: window.location.origin
      });
      
      const socket = new WebSocket(
        `${protocol}//${host}:${port}/ws/${clientUuid}?${params.toString()}`
      );

      // Set a reasonable timeout for the connection attempt
      const connectionTimeout = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          socket.close();
          setError('Connection timed out. Please try again.');
        }
      }, 5000);

      socket.onopen = () => {
        console.log('WebSocket connection established successfully');
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Start ping interval
        pingInterval.current = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping' }));
          }
        }, PING_INTERVAL);
      };

      socket.onmessage = (event) => {
        console.log('Raw WebSocket message:', event.data); // Log the raw message
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Parsed WebSocket message:', message); // Log the parsed message

          switch (message.type) {
            case 'players_update':
              console.log('Received players update:', message.payload);
              setPlayers(message.payload.players);
              setGameType(message.payload.gameType); // Set the gameType from the message
              break;
            case 'error':
              console.log('Received error message:', message.payload);
              setError(message.payload.message);
              break;
            case 'pong':
              console.log('Received pong message');
              break;
            default:
              console.log('Received unknown message type:', message.type);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err, event.data);
        }
      };

      socket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        clearInterval(pingInterval.current);
        setIsConnected(false);
        
        if (event.code === 1003) {
          setError('Server rejected the connection. Please refresh the page.');
        } else if (event.code === 1008) {
          setError('Connection rejected due to policy violation.');
        } else if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          setTimeout(connect, WS_RECONNECT_DELAY);
        } else {
          setError('Connection lost. Please refresh the page to reconnect.');
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Failed to connect to game server. Please check your connection.');
      };

      ws.current = socket;
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect to game server. Please try again later.');
    }
  }, [clientUuid, gameCode]);

  useEffect(() => {
    console.log('useEffect in useWebSocket running');
    connect();
    return () => {
      console.log('Cleaning up WebSocket connection');
      try {
        clearInterval(pingInterval.current);
        if (ws.current) {
          ws.current.close();
          ws.current = null;
        }
      } catch (error) {
        console.error('Error closing WebSocket connection:', error);
      }
    };
  }, [connect]);

  const logWebSocketState = useCallback(() => {
    if (ws.current) {
      console.log('WebSocket state:', {
        readyState: ws.current.readyState,
        bufferedAmount: ws.current.bufferedAmount,
        protocol: ws.current.protocol,
        url: ws.current.url
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(logWebSocketState, 5000); // Log every 5 seconds
    return () => clearInterval(interval);
  }, [logWebSocketState]);

  return { isConnected, players, gameType, error };
}
