import { Mapping } from 'utils/fp/types';

import Observer from './observer';

export type SubscribeLogic<T> = (observer: Observer<T>) => UnsubscribeLogic;

export type UnsubscribeLogic = void | (() => void);

export type ObserverLike<T> =
  | Next<T>
  | Partial<Observer<T>> & (WithNext<T> | WithError | WithComplete);

export type Next<T> = (v: T) => void;

export interface WithNext<T> {
  next: Next<T>;
}

export interface WithError {
  error: Next<any>;
}

export interface WithComplete {
  complete(): void;
}

export type Transformation<ExternalT, InternalT> = Mapping<
  Observer<ExternalT>,
  Observer<InternalT>
>;
