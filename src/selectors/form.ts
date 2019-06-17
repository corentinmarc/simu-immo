import { createSelector } from 'reselect';

import { GlobalState } from 'reducers';
import { FormState, FormField } from 'reducers/form';

const formSelector = (state: GlobalState): FormState => state.form;

export const formValueSelector = (name: FormField) =>
  createSelector(
    formSelector,
    form => form[name],
  );
