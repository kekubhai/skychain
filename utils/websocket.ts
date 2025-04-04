import { io, Socket } from 'socket.io-client';
import { store } from '@/redux/store';
import { updateCryptoPrice, setWsConnected } from '@/redux/slices/cryptoSlice';
import { addAlert } from '@/redux/slices/alertSlice';

class WebSocketManager {
  private socket: Socket | null = null;
  private static instance: WebSocketManager;
  private previousPrices: Record<string, number> = {};

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private checkPriceChange(id: string, newPrice: number) {
    if (this.previousPrices[id]) {
      const percentChange = ((newPrice - this.previousPrices[id]) / this.previousPrices[id]) * 100;
      
      // Alert if price change is more than 1%
      if (Math.abs(percentChange) >= 1) {
        const direction = percentChange > 0 ? 'increased' : 'decreased';
        store.dispatch(
          addAlert({
            type: 'price',
            message: `${id.toUpperCase()} price has ${direction} by ${Math.abs(percentChange).toFixed(2)}%`,
          })
        );
      }
    }
    this.previousPrices[id] = newPrice;
  }

  public connect(): void {
    if (this.socket) return;

    this.socket = io('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin');

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      store.dispatch(setWsConnected(true));
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      store.dispatch(setWsConnected(false));
    });

    this.socket.on('prices', (data: Record<string, string>) => {
      Object.entries(data).forEach(([id, priceStr]) => {
        const price = parseFloat(priceStr);
        this.checkPriceChange(id, price);
        
        store.dispatch(
          updateCryptoPrice({
            id,
            price,
            timestamp: Date.now(),
          })
        );
      });
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(setWsConnected(false));
      store.dispatch(
        addAlert({
          type: 'price',
          message: 'Error connecting to crypto price feed',
        })
      );
    });

    // Reconnect on failure
    setInterval(() => {
      if (!this.socket?.connected) {
        console.log('Attempting to reconnect WebSocket...');
        this.socket?.connect();
      }
    }, 5000);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setWsConnected(false));
    }
  }
}

export const wsManager = WebSocketManager.getInstance(); 