import Observable from './observable';

/**
 * @param {*} error
 */
export default function ErrorObservable(error) {
  return new Observable((observer) => {
    observer.error(error);
  });
}
