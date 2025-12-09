import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { selectConstructor } from '../../services/selectors/constructorSelectors';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorIngredients } = useSelector(
    selectConstructor
  ) || { bun: null, ingredients: [] };

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    (constructorIngredients || []).forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });
    if (bun) counters[bun._id] = 2; // булка считается сразу 2 штуки (верх/низ)
    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
