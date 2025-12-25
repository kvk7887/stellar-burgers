import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен правильно инициализироваться', () => {
    // Получаем начальное состояние, вызвав редьюсер с undefined и пустым экшеном
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что все редьюсеры присутствуют в корневом состоянии
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('orderDetails');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('password');
  });

  it('должен иметь правильную структуру начального состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем начальное состояние ingredients
    expect(initialState.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });

    // Проверяем начальное состояние burgerConstructor
    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null
    });

    // Проверяем начальное состояние user
    expect(initialState.user).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  it('должен быть функцией', () => {
    expect(typeof rootReducer).toBe('function');
  });

  it('должен возвращать объект состояния при любом экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(typeof state).toBe('object');
    expect(state).not.toBeNull();
  });
});