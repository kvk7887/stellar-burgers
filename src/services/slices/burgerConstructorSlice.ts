import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';

type TNewOrderResponse = {
  order: TOrder;
  name: string;
};

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TNewOrderResponse | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

// Async thunk для создания заказа
export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  void,
  { state: RootState; rejectValue: string }
>('burgerConstructor/createOrder', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { bun, ingredients } = state.burgerConstructor;

  // Проверяем, что есть булка
  if (!bun) {
    return rejectWithValue('Необходимо выбрать булку');
  }

  // Формируем массив ID ингредиентов для заказа
  const ingredientsIds: string[] = [
    bun._id,
    ...ingredients.map((item) => item._id),
    bun._id
  ];

  try {
    const data = await orderBurgerApi(ingredientsIds);
    return data;
  } catch (e) {
    return rejectWithValue('Ошибка при создании заказа');
  }
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление булки
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },

    // Добавление ингредиента
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      }
      state.ingredients.push(action.payload);
    },

    // Закрытие модального окна заказа
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },

    // Перемещение ингредиента (для drag & drop)
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },

    // Удаление ингредиента по id
    removeIngredientById: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // Очищаем конструктор после успешного заказа
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredientById,
  moveIngredient,
  closeOrderModal
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
