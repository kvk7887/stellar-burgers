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
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
  });

  it('should add a single ingredient (main) to constructor', () => {
    // Находим ингредиент "Говяжий метеорит (отбивная)" в списке начинок
    cy.contains('Начинки').should('be.visible');

    // Находим карточку ингредиента по названию и кликаем на кнопку "Добавить"
    cy.contains('Говяжий метеорит (отбивная)')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что ингредиент появился в конструкторе
    cy.get('section')
      .contains('Говяжий метеорит (отбивная)')
      .scrollIntoView()
      .should('be.visible');

    // Проверяем, что текст "Выберите начинку" исчез
    cy.contains('Выберите начинку').should('not.exist');
  });

  it('should add bun to constructor', () => {
    // Находим булку "Краторная булка N-200i" в списке булок
    cy.contains('Булки').should('be.visible');

    // Находим карточку булки и кликаем на кнопку "Добавить"
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что булка появилась в конструкторе (верх и низ)
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');

    // Проверяем, что текст "Выберите булки" исчез
    cy.contains('Выберите булки').should('not.exist');
  });

  it('should add multiple fillings to constructor', () => {
    // Добавляем первую начинку
    cy.contains('Говяжий метеорит (отбивная)')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Добавляем вторую начинку
    cy.contains('Плоды Фалленианского дерева')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что обе начинки появились в конструкторе
    cy.get('section')
      .contains('Говяжий метеорит (отбивная)')
      .scrollIntoView()
      .should('be.visible');
    cy.get('section')
      .contains('Плоды Фалленианского дерева')
      .scrollIntoView()
      .should('be.visible');

    // Проверяем, что текст "Выберите начинку" исчез
    cy.contains('Выберите начинку').should('not.exist');
  });

  it('should add bun and fillings to constructor', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что булка добавлена
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');

    // Добавляем начинку
    cy.contains('Говяжий метеорит (отбивная)')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что начинка добавлена
    cy.get('section')
      .contains('Говяжий метеорит (отбивная)')
      .scrollIntoView()
      .should('be.visible');

    // Добавляем соус
    cy.contains('Соус Spicy-X')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что соус добавлен
    cy.get('section').contains('Соус Spicy-X').should('be.visible');
  });

  describe('Modal window tests', () => {
    it('should open ingredient modal window on click', () => {
      // Находим ингредиент и кликаем на него (не на кнопку "Добавить", а на саму карточку)
      cy.contains('Говяжий метеорит (отбивная)')
        .parents('li')
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Проверяем, что в модальном окне отображается информация об ингредиенте
      cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
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
      // Открываем модальное окно
      cy.contains('Говяжий метеорит (отбивная)')
        .parents('li')
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Находим и кликаем на кнопку закрытия (крестик)
      // Кнопка находится в header модального окна, содержит CloseIcon
      cy.get('#modals')
        .find('h3')
        .contains('Детали ингредиента')
        .parent() // header div
        .find('button[type="button"]')
        .should('be.visible')
        .click();

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('should close modal window on overlay click', () => {
      // Открываем модальное окно
      cy.contains('Говяжий метеорит (отбивная)')
        .parents('li')
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Кликаем на оверлей - используем селектор по стилю position: fixed
      // или выбираем div, который не содержит модальное окно
      cy.get('#modals')
        .children('div')
        .filter((index, el) => {
          // Фильтруем div, который имеет position: fixed и покрывает весь экран
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' && 
                 style.top === '0px';
        })
        .first()
        .click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
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

    // Собираем бургер: добавляем булку
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что булка добавлена
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');

    // Добавляем начинку
    cy.contains('Говяжий метеорит (отбивная)')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем, что начинка добавлена
    cy.get('section')
      .contains('Говяжий метеорит (отбивная)')
      .scrollIntoView()
      .should('be.visible');

    // Вызываем клик по кнопке «Оформить заказ»
    cy.contains('Оформить заказ').click();

    // Ждем завершения запроса создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открылось и номер заказа верный
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('12345').should('be.visible');
    cy.contains('Ваш заказ начали готовить').should('be.visible');

    // Закрываем модальное окно
    cy.get('#modals')
      .find('button[type="button"]')
      .should('be.visible')
      .click();

    // Проверяем успешность закрытия модального окна
    cy.contains('идентификатор заказа').should('not.exist');
    cy.contains('12345').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });
});
