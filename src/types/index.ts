import { ActionCreatorsMapObject } from 'redux';

export type Maybe<T> = T | null | undefined;

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type ActionsFromActionCreators<
  AC extends ActionCreatorsMapObject
> = ReturnType<AC[keyof AC]>;
