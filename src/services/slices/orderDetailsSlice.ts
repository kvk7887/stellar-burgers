import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TIngredient } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { AppThunk } from '../store';

export interface OrderDetailsState {
  order: TOrder | null;
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderDetailsState = {
  order: null,
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchOrderByNumber =
  (number: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchOrderByNumberRequest());
      const data = await getOrderByNumberApi(number);
      if (data.success && data.orders.length > 0) {
        dispatch(fetchOrderByNumberSuccess(data.orders[0]));
      } else {
        dispatch(fetchOrderByNumberFailure('Заказ не найден'));
      }
    } catch (e) {
      dispatch(fetchOrderByNumberFailure('Ошибка при загрузке заказа'));
    }
  };

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    fetchOrderByNumberRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrderByNumberSuccess: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchOrderByNumberFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setOrderIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
    clearOrderDetails: (state) => {
      state.order = null;
      state.ingredients = [];
      state.error = null;
    }
  }
});

export const {
  fetchOrderByNumberRequest,
  fetchOrderByNumberSuccess,
  fetchOrderByNumberFailure,
  setOrderIngredients,
  clearOrderDetails
} = orderDetailsSlice.actions;

export const orderDetailsReducer = orderDetailsSlice.reducer;
