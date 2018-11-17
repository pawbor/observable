import Observable from './observable';

export default function EmptyObservable() {
  return new Observable((observer) => {
    observer.complete();
  });
}
