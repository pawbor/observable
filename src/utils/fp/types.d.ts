export type Mapping<T, R> = (v: T) => R;
export type Predicate<T> = (v: T) => boolean;

export interface Mappable<T> {
  map<R>(m: Mapping<T, R | null>): Mappable<R>
}
