import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { AppThunk } from '../store';

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

// Thunk для создания заказа
export const createOrder = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const { bun, ingredients } = state.constructor;

  // Проверяем, что есть булка
  if (!bun) {
    return;
  }

  // Формируем массив ID ингредиентов для заказа
  // Булки должны быть в начале и конце
  const ingredientsIds: string[] = [
    bun._id,
    ...ingredients.map((item) => item._id),
    bun._id
  ];

  try {
    dispatch(createOrderRequest());
    const data = await orderBurgerApi(ingredientsIds);
    dispatch(createOrderSuccess(data));
  } catch (e) {
    dispatch(createOrderFailure('Ошибка при создании заказа'));
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление булки
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = {
        ...action.payload,
        id: uuidv4()
      };
    },

    // Добавление ингредиента
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      // Убеждаемся, что ingredients инициализирован как массив
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      }
      state.ingredients.push({
        ...action.payload,
        id: uuidv4()
      });
    },
    // Удаление ингредиента по индексу
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    },
    // Удаление ингредиента по id
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    // Перемещение ингредиента (для drag & drop)
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.orderRequest = false;
    },
    // Очистка конструктора
    createOrderRequest: (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
    },
    // Запрос на создание заказа
    createOrderSuccess: (state, action: PayloadAction<TNewOrderResponse>) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      // Очищаем конструктор после успешного заказа
      state.bun = null;
      state.ingredients = [];
    },
    // Успешное создание заказа
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },
    // Ошибка при создании заказа
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    // Закрытие модального окна заказа
    removeIngredientById: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== action.payload
      );
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  removeIngredientById,
  moveIngredient,
  clearConstructor,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  closeOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
