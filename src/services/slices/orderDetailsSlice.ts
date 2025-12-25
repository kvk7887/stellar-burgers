import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TIngredient } from '@utils-types';
import { getOrderByNumberApi } from '@api';

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

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderDetails/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    if (data.success && data.orders.length > 0) {
      return data.orders[0];
    } else {
      return rejectWithValue('Заказ не найден');
    }
  } catch (e) {
    return rejectWithValue('Ошибка при загрузке заказа');
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    setOrderIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
    clearOrderDetails: (state) => {
      state.order = null;
      state.ingredients = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при загрузке заказа';
      });
  }
});

export const { setOrderIngredients, clearOrderDetails } =
  orderDetailsSlice.actions;

export const orderDetailsReducer = orderDetailsSlice.reducer;
