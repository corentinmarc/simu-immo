import { FormActions } from './form';
import { DataActions } from './data';

export { default as actionCreator } from './actionCreator';

export type AllActions = FormActions | DataActions;
