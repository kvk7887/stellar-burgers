import { RootState } from '../store';
import { TIngredient } from '@utils-types';

// Базовый селектор - получает все ингредиенты
export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

// Селектор для состояния загрузки
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

// Селектор для ошибки
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

// Селектор для булок
export const selectBuns = (state: RootState): TIngredient[] =>
  state.ingredients.items.filter((item) => item.type === 'bun');

// Селектор для начинок
export const selectMains = (state: RootState): TIngredient[] =>
  state.ingredients.items.filter((item) => item.type === 'main');

// Селектор для соусов
export const selectSauces = (state: RootState): TIngredient[] =>
  state.ingredients.items.filter((item) => item.type === 'sauce');

// Селектор для получения ингредиента по ID
export const selectIngredientById =
  (id: string) =>
  (state: RootState): TIngredient | undefined =>
    state.ingredients.items.find((item) => item._id === id);
