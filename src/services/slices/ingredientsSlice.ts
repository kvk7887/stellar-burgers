import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

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

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (e) {
    return rejectWithValue('Ошибка при загрузке ингредиентов');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при загрузке ингредиентов';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
