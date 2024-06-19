export function watch(prop, method) {
  prop.watchers.push(method);
};