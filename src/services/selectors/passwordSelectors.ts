import { RootState } from '../store';

export const selectPasswordState = (state: RootState) => state.password;
export const selectIsEmailSent = (state: RootState) =>
  state.password.isEmailSent;
export const selectIsPasswordReset = (state: RootState) =>
  state.password.isPasswordReset;
export const selectPasswordLoading = (state: RootState) =>
  state.password.isLoading;
export const selectPasswordError = (state: RootState) => state.password.error;
