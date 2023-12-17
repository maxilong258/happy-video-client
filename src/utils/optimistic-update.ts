export const optimisticUpdate = <T>(initialData: T, action: (data: T) => T): [T, () => T] => {
  const oldData: T = deepClone(initialData)
  const newData: T = action(oldData);
  const reset: () => T = () => initialData;
  return [newData, reset];
};

const deepClone = (source: any, cache?: Map<any, any>): any => {
  if (!cache) {
    cache = new Map();
  }

  if (source instanceof Object) {
    if (cache.get(source)) {
      return cache.get(source);
    }

    let result: any;

    if (source instanceof Function) {
      if (source.prototype) {
        result = function(this: any) {
          return source.apply(this, arguments);
        };
      } else {
        result = (...args: any[]) => {
          return source.call(undefined, ...args);
        };
      }
    } else if (source instanceof Array) {
      result = [];
    } else if (source instanceof Date) {
      result = new Date(source.getTime());
    } else if (source instanceof RegExp) {
      result = new RegExp(source.source, source.flags);
    } else {
      result = {};
    }

    cache.set(source, result);

    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key] = deepClone(source[key], cache);
      }
    }

    return result;
  } else {
    return source;
  }
};