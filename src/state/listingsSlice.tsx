import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async () => {
    const response = await axios.get('https://u2oyhiwlmc.execute-api.us-east-1.amazonaws.com/production/get-listings');
    return response.data;
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState: {
    items: [],
    filteredItems: [],
    status: 'idle',
    error: null,
    sortBy: 'newest',
    filterStatus: 'all'
  },
  reducers: {
    sortListings: (state, action) => {
      state.sortBy = action.payload;
      state.filteredItems = [...state.items].sort((a, b) => {
        return state.sortBy === 'newest'
        // @ts-ignore
          ? new Date(b.createdAt) - new Date(a.createdAt)
        // @ts-ignore
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    },
    filterByStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.filteredItems = state.items.filter((item) => 
        // @ts-ignore
        action.payload === 'all' || item.status === action.payload
      );
    },
    searchListings: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredItems = state.items.filter((item) =>
        // @ts-ignore
        item.address.toLowerCase().includes(query)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed';
        // @ts-ignore
        state.error = action.error.message;
      });
  }
});

export const { sortListings, filterByStatus, searchListings } = listingsSlice.actions;
export const reducer = listingsSlice.reducer;