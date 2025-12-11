import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/selectors/userSelectors';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Если проверка авторизации еще не завершена, показываем лоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь не авторизован, перенаправляем на страницу логина
  // Сохраняем текущий путь в state, чтобы после логина вернуться обратно
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
