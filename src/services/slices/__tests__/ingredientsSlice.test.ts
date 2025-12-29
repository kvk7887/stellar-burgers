import { ingredientsReducer } from '../ingredientsSlice';
import { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsReducer', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  // Вспомогательная функция для создания тестового ингредиента
  const createTestIngredient = (id: string, name: string, type: string): TIngredient => ({
    _id: id,
    name,
    type,
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 200,
    image: 'test-image.png',
    image_large: 'test-image-large.png',
    image_mobile: 'test-image-mobile.png'
  });

  describe('обработка экшена fetchIngredients.pending', () => {
    it('должен установить isLoading в true при вызове pending', () => {
      const action = fetchIngredients.pending('', undefined);
      
      const newState = ingredientsReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.items).toEqual([]);
    });

    it('должен очистить error при вызове pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      
      const action = fetchIngredients.pending('', undefined);
      const newState = ingredientsReducer(stateWithError, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('обработка экшена fetchIngredients.fulfilled', () => {
    it('должен записать данные в items и установить isLoading в false при успешной загрузке', () => {
      const testIngredients: TIngredient[] = [
        createTestIngredient('1', 'Булка', 'bun'),
        createTestIngredient('2', 'Соус', 'sauce'),
        createTestIngredient('3', 'Мясо', 'main')
      ];

      const action = fetchIngredients.fulfilled(testIngredients, '', undefined);
      
      const newState = ingredientsReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.items).toEqual(testIngredients);
      expect(newState.items).toHaveLength(3);
      expect(newState.error).toBeNull();
    });

    it('должен обновить данные, если они уже были в сторе', () => {
      const oldIngredients: TIngredient[] = [
        createTestIngredient('1', 'Старый ингредиент', 'bun')
      ];
      
      const stateWithData = {
        ...initialState,
        items: oldIngredients,
        isLoading: true
      };

      const newIngredients: TIngredient[] = [
        createTestIngredient('2', 'Новый ингредиент', 'sauce')
      ];

      const action = fetchIngredients.fulfilled(newIngredients, '', undefined);
      const newState = ingredientsReducer(stateWithData, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.items).toEqual(newIngredients);
      expect(newState.items).toHaveLength(1);
      expect(newState.error).toBeNull();
    });
  });

  describe('обработка экшена fetchIngredients.rejected', () => {
    it('должен записать ошибку в error и установить isLoading в false при ошибке', () => {
      const errorMessage = 'Ошибка при загрузке ингредиентов';
      
      const action = fetchIngredients.rejected(
        new Error(errorMessage),
        '',
        undefined,
        errorMessage
      );
      
      const newState = ingredientsReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.items).toEqual([]);
    });

    it('должен использовать дефолтное сообщение об ошибке, если payload не передан', () => {
      const action = fetchIngredients.rejected(
        new Error('Network error'),
        '',
        undefined
      );
      
      const newState = ingredientsReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка при загрузке ингредиентов');
      expect(newState.items).toEqual([]);
    });

    it('должен сохранить существующие данные при ошибке', () => {
      const existingIngredients: TIngredient[] = [
        createTestIngredient('1', 'Существующий ингредиент', 'bun')
      ];
      
      const stateWithData = {
        ...initialState,
        items: existingIngredients,
        isLoading: true
      };

      const errorMessage = 'Ошибка сети';
      const action = fetchIngredients.rejected(
        new Error(errorMessage),
        '',
        undefined,
        errorMessage
      );
      
      const newState = ingredientsReducer(stateWithData, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.items).toEqual(existingIngredients);
    });
  });
});
