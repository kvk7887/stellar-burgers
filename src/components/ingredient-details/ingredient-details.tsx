import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredientById } from '../../services/selectors/ingredientsSelectors';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredientFromState = (
    location.state as { ingredient?: TIngredient } | undefined
  )?.ingredient;
  const ingredientFromStore = useSelector((state) =>
    id ? selectIngredientById(id)(state) : undefined
  );
  const ingredientData = ingredientFromState ?? ingredientFromStore;

  if (!ingredientData) return <Preloader />;
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
