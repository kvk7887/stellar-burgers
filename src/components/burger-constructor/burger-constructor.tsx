import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  addBun,
  removeIngredientById,
  moveIngredient,
  clearConstructor,
  closeOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';
import { selectConstructor } from '../../services/selectors/constructorSelectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    selectConstructor
  ) || {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
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
