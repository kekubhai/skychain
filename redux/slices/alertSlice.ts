import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  type: 'price' | 'weather';
  message: string;
  timestamp: number;
}

interface AlertState {
  alerts: Alert[];
}

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id' | 'timestamp'>>) => {
      const newAlert: Alert = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.alerts.push(newAlert);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertSlice.actions;

export default alertSlice.reducer; 