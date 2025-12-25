import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/slices/userSlice';
import { selectIsAuthChecked } from '../../services/selectors/userSelectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getCookie } from '../../utils/cookie';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  AppHeader,
  OrderInfo,
  IngredientDetails,
  Modal,
  ProtectedRoute
} from '@components';

const App = () => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | undefined;
  const background = state?.background;

  // Загружаем ингредиенты при инициализации приложения
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthChecked) {
      const accessToken = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken || refreshToken) {
        dispatch(getUser());
      } else {
        dispatch(setAuthChecked());
      }
    }
  }, [dispatch, isAuthChecked]);

  // Определяем, должен ли показываться модал при перезагрузке страницы
  const shouldShowModal = useMemo(() => {
    // Если уже есть background в state, используем его
    if (background) return true;

    // Проверяем, соответствует ли URL паттерну модального окна
    const pathname = location.pathname;

    // Если URL соответствует /feed/:number или /profile/orders/:number
    // и нет background, устанавливаем его автоматически
    if (pathname.match(/^\/feed\/\d+$/)) {
      // Это заказ из ленты - должен показываться модал поверх /feed
      return true;
    }

    if (pathname.match(/^\/profile\/orders\/\d+$/)) {
      // Это заказ из профиля - должен показываться модал поверх /profile/orders
      return true;
    }

    return false;
  }, [background, location.pathname]);

  // Автоматически устанавливаем background при перезагрузке страницы с URL заказа
  const effectiveBackground = useMemo(() => {
    if (background) return background;

    const pathname = location.pathname;

    if (pathname.match(/^\/feed\/\d+$/)) {
      // Создаем location для /feed как background
      return {
        pathname: '/feed',
        search: '',
        hash: '',
        state: null,
        key: 'default'
      } as Location;
    }

    if (pathname.match(/^\/profile\/orders\/\d+$/)) {
      // Создаем location для /profile/orders как background
      return {
        pathname: '/profile/orders',
        search: '',
        hash: '',
        state: null,
        key: 'default'
      } as Location;
    }

    return null;
  }, [background, location.pathname]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные страницы (фон) */}
      <Routes location={effectiveBackground || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки поверх фона */}
      {shouldShowModal && effectiveBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={() => {
                  // Если мы на прямой ссылке, перенаправляем на /feed
                  if (!state?.background) {
                    navigate('/feed', { replace: true });
                  } else {
                    window.history.back();
                  }
                }}
                title='Информация о заказе'
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                onClose={() => window.history.back()}
                title='Детали ингредиента'
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  onClose={() => {
                    // Если мы на прямой ссылке, перенаправляем на /profile/orders
                    if (!state?.background) {
                      navigate('/profile/orders', { replace: true });
                    } else {
                      window.history.back();
                    }
                  }}
                  title='Информация о заказе'
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
