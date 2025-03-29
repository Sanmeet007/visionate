function matchInterface<T1 extends Object, T2 extends Object>(
  v: T1 | T2,
  prop: string
): v is T1 {
  return v.hasOwnProperty(prop) !== undefined;
}
