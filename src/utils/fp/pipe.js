import compose from './compose';

/**
 * @param  {...import('./types').Mapping<any, any>} fns 
 */
export default function pipe(...fns) {
  return compose(...fns.reverse());
}
