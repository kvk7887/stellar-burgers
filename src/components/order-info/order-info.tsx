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
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(selectOrderDetails);
  const ingredients = useSelector(selectOrderIngredients);
  const allIngredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectOrderDetailsLoading);

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

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
