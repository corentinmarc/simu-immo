import { createSelector } from 'reselect';

const formSelector = state => state.form;

export const formValueSelector = (name) => createSelector(
    formSelector,
    (form) => form[name]
);