// Константы для тестовых данных
const INGREDIENT_BEEF_METEORITE = 'Говяжий метеорит (отбивная)';
const INGREDIENT_BUN_KRATOR = 'Краторная булка N-200i';
const INGREDIENT_BUN_KRATOR_TOP = 'Краторная булка N-200i (верх)';
const INGREDIENT_BUN_KRATOR_BOTTOM = 'Краторная булка N-200i (низ)';
const INGREDIENT_FALLENIAN_FRUITS = 'Плоды Фалленианского дерева';
const INGREDIENT_SPICY_SAUCE = 'Соус Spicy-X';

// Константы для категорий
const CATEGORY_BUNS = 'Булки';
const CATEGORY_MAINS = 'Начинки';
const CATEGORY_SAUCES = 'Соусы';

// Константы для текстов интерфейса
const TEXT_SELECT_BUNS = 'Выберите булки';
const TEXT_SELECT_MAIN = 'Выберите начинку';
const TEXT_INGREDIENT_DETAILS = 'Детали ингредиента';
const TEXT_ADD_BUTTON = 'Добавить';
const TEXT_ORDER_BUTTON = 'Оформить заказ';
const TEXT_ORDER_ID = 'идентификатор заказа';
const TEXT_ORDER_NUMBER = '12345';
const TEXT_ORDER_IN_PROGRESS = 'Ваш заказ начали готовить';

describe('Constructor Page', () => {
  beforeEach(() => {
    // Перехватываем запрос на эндпоинт /ingredients
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем страницу
    cy.visit('/');

    // Ждем завершения запроса
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should load ingredients', () => {
    // Проверяем, что ингредиенты загрузились
    cy.contains(CATEGORY_BUNS).should('be.visible');
    cy.contains(CATEGORY_MAINS).should('be.visible');
    cy.contains(CATEGORY_SAUCES).should('be.visible');
  });

  it('should add a single ingredient (main) to constructor', () => {
    // Находим ингредиент "Говяжий метеорит (отбивная)" в списке начинок
    cy.contains(CATEGORY_MAINS).should('be.visible');

    // Находим карточку ингредиента один раз и сохраняем в alias
    cy.contains(INGREDIENT_BEEF_METEORITE)
      .parents('li')
      .as('ingredientCard');

    // Используем alias для клика
    cy.get('@ingredientCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Проверяем, что ингредиент появился в конструкторе
    cy.get('section')
      .contains(INGREDIENT_BEEF_METEORITE)
      .as('constructorSection')
      .scrollIntoView()
      .should('be.visible');

    // Проверяем, что текст "Выберите начинку" исчез
    cy.contains(TEXT_SELECT_MAIN).should('not.exist');
  });

  it('should add bun to constructor', () => {
    // Находим булку "Краторная булка N-200i" в списке булок
    cy.contains(CATEGORY_BUNS).should('be.visible');

    // Находим карточку булки один раз и сохраняем в alias
    cy.contains(INGREDIENT_BUN_KRATOR)
      .parents('li')
      .as('bunCard');

    // Используем alias для клика
    cy.get('@bunCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Проверяем, что булка появилась в конструкторе (верх и низ)
    cy.contains(INGREDIENT_BUN_KRATOR_TOP).should('be.visible');
    cy.contains(INGREDIENT_BUN_KRATOR_BOTTOM).should('be.visible');

    // Проверяем, что текст "Выберите булки" исчез
    cy.contains(TEXT_SELECT_BUNS).should('not.exist');
  });

  it('should add multiple fillings to constructor', () => {
    // Находим карточки ингредиентов один раз
    cy.contains(INGREDIENT_BEEF_METEORITE)
      .parents('li')
      .as('beefCard');
    
    cy.contains(INGREDIENT_FALLENIAN_FRUITS)
      .parents('li')
      .as('fruitsCard');

    // Добавляем первую начинку
    cy.get('@beefCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Добавляем вторую начинку
    cy.get('@fruitsCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Находим секцию конструктора один раз
    cy.get('section').as('constructorSection');

    // Проверяем, что обе начинки появились в конструкторе
    cy.get('@constructorSection')
      .contains(INGREDIENT_BEEF_METEORITE)
      .scrollIntoView()
      .should('be.visible');
    cy.get('@constructorSection')
      .contains(INGREDIENT_FALLENIAN_FRUITS)
      .scrollIntoView()
      .should('be.visible');

    // Проверяем, что текст "Выберите начинку" исчез
    cy.contains(TEXT_SELECT_MAIN).should('not.exist');
  });

  it('should add bun and fillings to constructor', () => {
    // Находим все карточки ингредиентов один раз
    cy.contains(INGREDIENT_BUN_KRATOR)
      .parents('li')
      .as('bunCard');
    
    cy.contains(INGREDIENT_BEEF_METEORITE)
      .parents('li')
      .as('beefCard');
    
    cy.contains(INGREDIENT_SPICY_SAUCE)
      .parents('li')
      .as('sauceCard');

    // Добавляем булку
    cy.get('@bunCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Проверяем, что булка добавлена
    cy.contains(INGREDIENT_BUN_KRATOR_TOP).should('be.visible');
    cy.contains(INGREDIENT_BUN_KRATOR_BOTTOM).should('be.visible');

    // Добавляем начинку
    cy.get('@beefCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Находим секцию конструктора
    cy.get('section').as('constructorSection');

    // Проверяем, что начинка добавлена
    cy.get('@constructorSection')
      .contains(INGREDIENT_BEEF_METEORITE)
      .scrollIntoView()
      .should('be.visible');

    // Добавляем соус
    cy.get('@sauceCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Проверяем, что соус добавлен
    cy.get('@constructorSection')
      .contains(INGREDIENT_SPICY_SAUCE)
      .should('be.visible');
  });

  describe('Modal window tests', () => {
    it('should open ingredient modal window on click', () => {
      // Находим ингредиент один раз
      cy.contains(INGREDIENT_BEEF_METEORITE)
        .parents('li')
        .as('ingredientCard');

      // Кликаем на карточку ингредиента
      cy.get('@ingredientCard')
        .find('a')
        .first()
        .click();

      // Находим модальное окно один раз
      cy.get('#modals').as('modal');

      // Проверяем, что модальное окно открылось
      cy.contains(TEXT_INGREDIENT_DETAILS).should('be.visible');

      // Проверяем, что в модальном окне отображается информация об ингредиенте
      cy.contains(INGREDIENT_BEEF_METEORITE).should('be.visible');
      cy.contains('Калории, ккал').should('be.visible');
      cy.contains('Белки, г').should('be.visible');
      cy.contains('Жиры, г').should('be.visible');
      cy.contains('Углеводы, г').should('be.visible');
      
      // Проверяем конкретные значения для "Говяжий метеорит (отбивная)"
      cy.contains('2674').should('be.visible'); // калории
      cy.contains('800').should('be.visible'); // белки
      cy.contains('800').should('be.visible'); // жиры
      cy.contains('300').should('be.visible'); // углеводы
    });

    it('should close modal window on close button click', () => {
      // Находим ингредиент один раз
      cy.contains(INGREDIENT_BEEF_METEORITE)
        .parents('li')
        .as('ingredientCard');

      // Открываем модальное окно
      cy.get('@ingredientCard')
        .find('a')
        .first()
        .click();

      // Находим модальное окно один раз
      cy.get('#modals').as('modal');

      // Проверяем, что модальное окно открылось
      cy.contains(TEXT_INGREDIENT_DETAILS).should('be.visible');

      // Находим кнопку закрытия через alias модального окна
      cy.get('@modal')
        .find('h3')
        .contains(TEXT_INGREDIENT_DETAILS)
        .parent() // header div
        .find('button[type="button"]')
        .as('closeButton')
        .should('be.visible')
        .click();

      // Проверяем, что модальное окно закрылось
      cy.contains(TEXT_INGREDIENT_DETAILS).should('not.exist');
    });

    it('should close modal window on overlay click', () => {
      // Находим ингредиент один раз
      cy.contains(INGREDIENT_BEEF_METEORITE)
        .parents('li')
        .as('ingredientCard');

      // Открываем модальное окно
      cy.get('@ingredientCard')
        .find('a')
        .first()
        .click();

      // Находим модальное окно один раз
      cy.get('#modals').as('modal');

      // Проверяем, что модальное окно открылось
      cy.contains(TEXT_INGREDIENT_DETAILS).should('be.visible');

      // Находим оверлей через alias модального окна
      cy.get('@modal')
        .children('div')
        .filter((index, el) => {
          // Фильтруем div, который имеет position: fixed и покрывает весь экран
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' && 
                 style.top === '0px';
        })
        .first()
        .as('overlay')
        .click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.contains(TEXT_INGREDIENT_DETAILS).should('not.exist');
    });
  });

  it('should create order successfully', () => {
    // Моковые данные для ответа на запрос данных пользователя
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Моковые данные для ответа на запрос создания заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Подставляем моковые токены авторизации
    cy.setCookie('accessToken', 'mock-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    // Перезагружаем страницу для применения токенов
    cy.visit('/');
    cy.wait('@getIngredients');

    // Находим все карточки ингредиентов один раз
    cy.contains(INGREDIENT_BUN_KRATOR)
      .parents('li')
      .as('bunCard');
    
    cy.contains(INGREDIENT_BEEF_METEORITE)
      .parents('li')
      .as('beefCard');

    // Собираем бургер: добавляем булку
    cy.get('@bunCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Проверяем, что булка добавлена
    cy.contains(INGREDIENT_BUN_KRATOR_TOP).should('be.visible');

    // Добавляем начинку
    cy.get('@beefCard').within(() => {
      cy.contains(TEXT_ADD_BUTTON).click();
    });

    // Находим секцию конструктора один раз
    cy.get('section').as('constructorSection');

    // Проверяем, что начинка добавлена
    cy.get('@constructorSection')
      .contains(INGREDIENT_BEEF_METEORITE)
      .scrollIntoView()
      .should('be.visible');

    // Вызываем клик по кнопке «Оформить заказ»
    cy.contains(TEXT_ORDER_BUTTON).click();

    // Ждем завершения запроса создания заказа
    cy.wait('@createOrder');

    // Находим модальное окно один раз
    cy.get('#modals').as('modal');

    // Проверяем, что модальное окно открылось и номер заказа верный
    cy.contains(TEXT_ORDER_ID).should('be.visible');
    cy.contains(TEXT_ORDER_NUMBER).should('be.visible');
    cy.contains(TEXT_ORDER_IN_PROGRESS).should('be.visible');

    // Закрываем модальное окно через alias
    cy.get('@modal')
      .find('button[type="button"]')
      .should('be.visible')
      .click();

    // Проверяем успешность закрытия модального окна
    cy.contains(TEXT_ORDER_ID).should('not.exist');
    cy.contains(TEXT_ORDER_NUMBER).should('not.exist');

    // Проверяем, что конструктор пуст
    cy.contains(TEXT_SELECT_BUNS).should('be.visible');
    cy.contains(TEXT_SELECT_MAIN).should('be.visible');
  });
});
