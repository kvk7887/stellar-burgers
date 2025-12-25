import { burgerConstructorReducer } from '../burgerConstructorSlice';
import { addIngredient, removeIngredientById, moveIngredient } from '../burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorReducer', () => {
  // Вспомогательная функция для создания тестового ингредиента
  const createTestIngredient = (id: string, _id: string, name: string): TConstructorIngredient => ({
    _id,
    id,
    name,
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 200,
    image: 'test-image.png',
    image_large: 'test-image-large.png',
    image_mobile: 'test-image-mobile.png'
  });

  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  describe('обработка экшена добавления ингредиента', () => {
    it('должен добавить ингредиент в пустой массив', () => {
      const ingredient = createTestIngredient('1', 'ingredient-1', 'Соус');
      
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(ingredient)
      );

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(ingredient);
      expect(newState.bun).toBeNull();
    });

    it('должен добавить ингредиент в существующий массив', () => {
      const firstIngredient = createTestIngredient('1', 'ingredient-1', 'Соус');
      const secondIngredient = createTestIngredient('2', 'ingredient-2', 'Сыр');
      
      const stateWithOneIngredient = burgerConstructorReducer(
        initialState,
        addIngredient(firstIngredient)
      );

      const newState = burgerConstructorReducer(
        stateWithOneIngredient,
        addIngredient(secondIngredient)
      );

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0]).toEqual(firstIngredient);
      expect(newState.ingredients[1]).toEqual(secondIngredient);
    });

    it('не должен изменять другие поля состояния', () => {
      const ingredient = createTestIngredient('1', 'ingredient-1', 'Соус');
      
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(ingredient)
      );

      expect(newState.bun).toBeNull();
      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toBeNull();
    });
  });

  describe('обработка экшена удаления ингредиента', () => {
    it('должен удалить ингредиент по id', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');
      const ingredient3 = createTestIngredient('3', 'ingredient-3', 'Мясо');

      // Добавляем три ингредиента
      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));
      state = burgerConstructorReducer(state, addIngredient(ingredient3));

      expect(state.ingredients).toHaveLength(3);

      // Удаляем второй ингредиент
      const newState = burgerConstructorReducer(state, removeIngredientById('2'));

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].id).toBe('1');
      expect(newState.ingredients[1].id).toBe('3');
      expect(newState.ingredients.find(ing => ing.id === '2')).toBeUndefined();
    });

    it('не должен удалять ингредиенты с другим id', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');

      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));

      // Пытаемся удалить несуществующий id
      const newState = burgerConstructorReducer(state, removeIngredientById('999'));

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].id).toBe('1');
      expect(newState.ingredients[1].id).toBe('2');
    });

    it('должен корректно обработать удаление из пустого массива', () => {
      const newState = burgerConstructorReducer(
        initialState,
        removeIngredientById('1')
      );

      expect(newState.ingredients).toHaveLength(0);
    });

    it('не должен изменять другие поля состояния', () => {
      const ingredient = createTestIngredient('1', 'ingredient-1', 'Соус');
      let state = burgerConstructorReducer(initialState, addIngredient(ingredient));

      const newState = burgerConstructorReducer(state, removeIngredientById('1'));

      expect(newState.bun).toBeNull();
      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toBeNull();
    });
  });

  describe('обработка экшена изменения порядка ингредиентов в начинке', () => {
    it('должен переместить ингредиент с первого места на последнее', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');
      const ingredient3 = createTestIngredient('3', 'ingredient-3', 'Мясо');

      // Добавляем три ингредиента
      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));
      state = burgerConstructorReducer(state, addIngredient(ingredient3));

      // Перемещаем первый элемент (индекс 0) на последнее место (индекс 2)
      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe('2'); // Бывший второй стал первым
      expect(newState.ingredients[1].id).toBe('3'); // Бывший третий стал вторым
      expect(newState.ingredients[2].id).toBe('1'); // Бывший первый стал последним
    });

    it('должен переместить ингредиент с последнего места на первое', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');
      const ingredient3 = createTestIngredient('3', 'ingredient-3', 'Мясо');

      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));
      state = burgerConstructorReducer(state, addIngredient(ingredient3));

      // Перемещаем последний элемент (индекс 2) на первое место (индекс 0)
      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ dragIndex: 2, hoverIndex: 0 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe('3'); // Бывший последний стал первым
      expect(newState.ingredients[1].id).toBe('1');
      expect(newState.ingredients[2].id).toBe('2');
    });

    it('должен переместить ингредиент на соседнюю позицию', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');
      const ingredient3 = createTestIngredient('3', 'ingredient-3', 'Мясо');

      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));
      state = burgerConstructorReducer(state, addIngredient(ingredient3));

      // Перемещаем второй элемент (индекс 1) на первое место (индекс 0)
      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ dragIndex: 1, hoverIndex: 0 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe('2'); // Бывший второй стал первым
      expect(newState.ingredients[1].id).toBe('1'); // Бывший первый стал вторым
      expect(newState.ingredients[2].id).toBe('3'); // Третий остался на месте
    });

    it('не должен изменять другие поля состояния', () => {
      const ingredient1 = createTestIngredient('1', 'ingredient-1', 'Соус');
      const ingredient2 = createTestIngredient('2', 'ingredient-2', 'Сыр');

      let state = burgerConstructorReducer(initialState, addIngredient(ingredient1));
      state = burgerConstructorReducer(state, addIngredient(ingredient2));

      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 1 })
      );

      expect(newState.bun).toBeNull();
      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toBeNull();
    });
  });
});