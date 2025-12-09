import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  closeOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';
import { selectConstructor } from '../../services/selectors/constructorSelectors';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/selectors/userSelectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    selectConstructor
  ) || {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    // Проверяем авторизацию перед созданием заказа
    if (!isAuthChecked) {
      // Если проверка еще не завершена, ждем
      return;
    }

    if (!user) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Если пользователь авторизован, создаем заказ
    dispatch(createOrder());
  };

  const handleCloseOrderModal = () => dispatch(closeOrderModal());

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      (ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients: ingredients || [] }}
      orderModalData={orderModalData?.order ?? null}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
