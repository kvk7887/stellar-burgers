import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '@api';

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

export const forgotPassword = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('password/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await forgotPasswordApi({ email });
  } catch (e) {
    return rejectWithValue('Ошибка при отправке письма');
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>(
  'password/resetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      await resetPasswordApi({ password, token });
    } catch (e) {
      return rejectWithValue('Ошибка при сбросе пароля');
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearPasswordState: (state) => {
      state.isEmailSent = false;
      state.isPasswordReset = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isEmailSent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при отправке письма';
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isPasswordReset = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при сбросе пароля';
      });
  }
});

export const { clearPasswordState } = passwordSlice.actions;

export const passwordReducer = passwordSlice.reducer;
