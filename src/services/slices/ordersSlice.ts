import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';
import { AppThunk } from '../store';

export interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchOrders = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchOrdersRequest());
    const data = await getOrdersApi();
    dispatch(fetchOrdersSuccess(data));
  } catch (e) {
    dispatch(fetchOrdersFailure('Ошибка при загрузке заказов'));
  }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure } =
  ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
