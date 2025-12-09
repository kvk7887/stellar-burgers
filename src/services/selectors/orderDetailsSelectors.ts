import { RootState } from '../store';

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;
export const selectOrderIngredients = (state: RootState) =>
  state.orderDetails.ingredients;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.orderDetails.isLoading;
export const selectOrderDetailsError = (state: RootState) =>
  state.orderDetails.error;
