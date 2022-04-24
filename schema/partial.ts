export type OptionalKeys<T extends {}> = {
  [k in keyof T]: undefined extends T[k] ? k : never;
}[keyof T];

export type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;

export type MakePartial<T extends object> = {
  [k in OptionalKeys<T>]?: T[k];
} & {
  [k in RequiredKeys<T>]: T[k]
};
