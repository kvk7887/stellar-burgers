import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { AppThunk } from '../store';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchFeedsRequest());
    const data = await getFeedsApi();
    dispatch(fetchFeedsSuccess(data));
  } catch (e) {
    dispatch(fetchFeedsFailure('Ошибка при загрузке ленты заказов'));
  }
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchFeedsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFeedsSuccess: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
      state.error = null;
    },
    fetchFeedsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchFeedsRequest, fetchFeedsSuccess, fetchFeedsFailure } =
  feedSlice.actions;

export const feedReducer = feedSlice.reducer;
