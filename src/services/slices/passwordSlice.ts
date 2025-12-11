import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '@api';
import { AppThunk } from '../store';

export interface PasswordState {
  isEmailSent: boolean;
  isPasswordReset: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: PasswordState = {
  isEmailSent: false,
  isPasswordReset: false,
  isLoading: false,
  error: null
};

export const forgotPassword =
  (email: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(forgotPasswordRequest());
      await forgotPasswordApi({ email });
      dispatch(forgotPasswordSuccess());
    } catch (e) {
      dispatch(forgotPasswordFailure('Ошибка при отправке письма'));
    }
  };

export const resetPassword =
  (password: string, token: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(resetPasswordRequest());
      await resetPasswordApi({ password, token });
      dispatch(resetPasswordSuccess());
    } catch (e) {
      dispatch(resetPasswordFailure('Ошибка при сбросе пароля'));
    }
  };

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    forgotPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => {
      state.isEmailSent = true;
      state.isLoading = false;
      state.error = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.isPasswordReset = true;
      state.isLoading = false;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearPasswordState: (state) => {
      state.isEmailSent = false;
      state.isPasswordReset = false;
      state.error = null;
    }
  }
});

export const {
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearPasswordState
} = passwordSlice.actions;

export const passwordReducer = passwordSlice.reducer;
