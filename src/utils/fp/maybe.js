/**
 * @template T
 * @typedef {Object} Privates
 * @prop {Maybe<T>} implementation
 */

/**
 * @typedef {void | null | undefined} Unset
 */

/** @type {WeakMap<Maybe<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Maybe<T>} */ option) {
  const privates = privatesMap.get(option);
  if (!privates) {
    throw new Error('Option - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
class Maybe {
  /**
   * @param {T | Unset} value
   */
  constructor(value) {
    /** @type {Maybe<T>} */
    let implementation;

    if (value === null || value === undefined) {
      implementation = Nothing();
    } else {
      implementation = Something(value);
    }

    privatesMap.set(this, { implementation });
  }

  /**
   * @param {T} defaultValue
   * @returns {T}
   */
  getValue(defaultValue) {
    const { implementation } = getPrivates(this);
    return implementation.getValue(defaultValue);
  }

  /**
   * @returns {T | undefined}
   */
  getRawValue() {
    const { implementation } = getPrivates(this);
    return implementation.getRawValue();
  }

  /**
   * @template R
   * @param {import('utils/fp/types').Mapping<T, R | Unset>} mapping
   * @returns {Maybe<R>}
   */
  map(mapping) {
    const { implementation } = getPrivates(this);
    return implementation.map(mapping);
  }

  /**
   * @template R
   * @param {import('utils/fp/types').Mapping<T, Maybe<R>>} mapping
   * @returns {Maybe<R>}
   */
  flatMap(mapping) {
    const { implementation } = getPrivates(this);
    return implementation.flatMap(mapping);
  }

  /**
   * @param {(v: T) => void} action
   * @returns {Maybe<T>}
   */
  do(action) {
    const { implementation } = getPrivates(this);
    return implementation.do(action);
  }

  /**
   * @param {() => T | void} defaultValueFactory
   * @returns {Maybe<T>}
   */
  default(defaultValueFactory) {
    const { implementation } = getPrivates(this);
    return implementation.default(defaultValueFactory);
  }
}

/**
 * @template T
 * @param {T} value
 * @returns {Maybe<T>}
 */
function Something(value) {
  return {
    getValue() {
      return value;
    },

    getRawValue() {
      return value;
    },

    map(mapping) {
      const mappedValue = mapping(value);
      return new Maybe(mappedValue);
    },

    flatMap(mapping) {
      const mappedValue = mapping(value);
      return mappedValue;
    },

    /**
     * @param {(v: T) => void} action
     * @returns {Maybe<T>}
     */
    do(action) {
      action(value);
      return this;
    },

    /**
     * @returns {Maybe<T>}
     */
    default() {
      return this;
    },
  };
}

/**
 * @type {Maybe<any>}
 */
const nothing = {
  getValue(defaultValue) {
    return defaultValue;
  },
  getRawValue() {
    return undefined;
  },
  map() {
    return Nothing();
  },
  flatMap() {
    return Nothing();
  },
  do() {
    return Nothing();
  },
  default(defaultValueFactory) {
    const defaultValue = defaultValueFactory();
    return new Maybe(defaultValue);
  },
};

function Nothing() {
  return nothing;
}

export { Maybe as default };
