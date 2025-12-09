import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ordersReducer } from './slices/ordersSlice';
import { orderDetailsReducer } from './slices/orderDetailsSlice';
import { userReducer } from './slices/userSlice';
import { passwordReducer } from './slices/passwordSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer,
  password: passwordReducer
});
