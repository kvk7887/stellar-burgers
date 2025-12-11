import { FC, memo } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  addBun,
  addIngredient
} from '../../services/slices/burgerConstructorSlice';
import { TIngredient } from '@utils-types';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    // Если фон уже есть, используем его; иначе — текущий location
    const background =
      (location.state as { background?: Location } | undefined)?.background ||
      location;
    const dispatch = useDispatch();

    const cleanIngredient: TIngredient = {
      _id: ingredient._id,
      name: ingredient.name,
      type: ingredient.type,
      proteins: ingredient.proteins,
      fat: ingredient.fat,
      carbohydrates: ingredient.carbohydrates,
      calories: ingredient.calories,
      price: ingredient.price,
      image: ingredient.image,
      image_large: ingredient.image_large,
      image_mobile: ingredient.image_mobile
    };

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(cleanIngredient));
      } else {
        dispatch(addIngredient(cleanIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background, ingredient }}
        handleAdd={handleAdd}
      />
    );
  }
);
