import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './listingsSlice';

const store = configureStore({
  reducer: {
    listings: reducer,
  }
});

export default store;