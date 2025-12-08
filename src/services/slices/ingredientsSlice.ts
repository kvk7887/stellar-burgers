import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { AppThunk } from '../store';

export interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchIngredientsRequest());
    const data = await getIngredientsApi();
    dispatch(fetchIngredientsSuccess(data));
  } catch (e) {
    dispatch(fetchIngredientsFailure('Ошибка при загрузке ингредиентов'));
  }
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    fetchIngredientsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchIngredientsSuccess: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchIngredientsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchIngredientsRequest,
  fetchIngredientsSuccess,
  fetchIngredientsFailure
} = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
