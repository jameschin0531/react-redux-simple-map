import { configureStore } from '@reduxjs/toolkit';
import recentSearchReducer from '../features/recentSearch/recentSearchSlice';

export const store = configureStore({
  reducer: {
    recentSearch: recentSearchReducer,
  },
});
