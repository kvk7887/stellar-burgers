import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { AppThunk } from '../store';

type TAuthResponse = {
  refreshToken: string;
  accessToken: string;
  user: TUser;
};

export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const register =
  (data: TRegisterData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(registerRequest());
      const response = await registerUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      dispatch(registerSuccess(response.user));
    } catch (e) {
      dispatch(registerFailure('Ошибка при регистрации'));
    }
  };

export const login =
  (data: TLoginData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginRequest());
      const response = await loginUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      dispatch(loginSuccess(response.user));
    } catch (e) {
      dispatch(loginFailure('Ошибка при входе'));
    }
  };

export const logout = (): AppThunk => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    dispatch(logoutSuccess());
  } catch (e) {
    dispatch(logoutFailure('Ошибка при выходе'));
  }
};

export const getUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const response = await getUserApi();
    if (response.success) {
      dispatch(getUserSuccess(response.user));
    } else {
      dispatch(getUserFailure('Ошибка при получении данных пользователя'));
    }
  } catch (e) {
    dispatch(getUserFailure('Ошибка при получении данных пользователя'));
  }
};

export const updateUser =
  (user: Partial<TRegisterData>): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateUserRequest());
      const response = await updateUserApi(user);
      if (response.success) {
        dispatch(updateUserSuccess(response.user));
      } else {
        dispatch(updateUserFailure('Ошибка при обновлении данных'));
      }
    } catch (e) {
      dispatch(updateUserFailure('Ошибка при обновлении данных'));
    }
  };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      state.isAuthChecked = true;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      state.isAuthChecked = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthChecked = true;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUserSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      state.isAuthChecked = true;
    },
    getUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthChecked = true;
    },
    updateUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  }
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  clearError,
  setAuthChecked
} = userSlice.actions;

export const userReducer = userSlice.reducer;
