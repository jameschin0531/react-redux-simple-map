import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';

const initialState = {
  value: [],
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const recentSearchSlice = createSlice({
  name: 'recentSearch',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clear: (state) => {
      state.value = [];
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    pushLocation: (state, action) => {
      state.value.push(action.payload);
    },
    spliceLocation: (state, action) => {
      if(action.payload > -1) state.value.splice(action.payload, 1);
    },
  },
});

export const { clear, pushLocation, spliceLocation } = recentSearchSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRecentSearch = (state) => state.recentSearch.value;



export default recentSearchSlice.reducer;
