export const isWatch = Symbol('WatchType');

export function watch(prop, method) {
  prop.watchers.push(method);
};