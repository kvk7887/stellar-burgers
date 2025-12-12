import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  setOrderIngredients
} from '../../services/slices/orderDetailsSlice';
import {
  selectOrderDetails,
  selectOrderIngredients,
  selectOrderDetailsLoading
} from '../../services/selectors/orderDetailsSelectors';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors/ingredientsSelectors';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(selectOrderDetails);
  const ingredients = useSelector(selectOrderIngredients);
  const allIngredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectOrderDetailsLoading);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  useEffect(() => {
    if (orderData && allIngredients.length > 0) {
      const orderIngredients = orderData.ingredients
        .map((id) => allIngredients.find((ing) => ing._id === id))
        .filter((ing): ing is TIngredient => ing !== undefined);
      dispatch(setOrderIngredients(orderIngredients));
    }
  }, [dispatch, orderData, allIngredients]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Показываем прелоадер только во время загрузки заказа или ингредиентов
  if (
    isLoading ||
    isIngredientsLoading ||
    (orderData && !ingredients.length && allIngredients.length === 0)
  ) {
    return <Preloader />;
  }

  // Если заказ загружен, но ингредиенты еще не обработаны, показываем прелоадер
  if (orderData && allIngredients.length > 0 && !ingredients.length) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
