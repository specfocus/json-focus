import { getter } from '@specfocus/main-focus/src/object/property-expr';
import type { SchemaRefDescription } from './base';

const prefixes = {
  context: '$',
  value: '.',
} as const;

export type ReferenceOptions<TValue = unknown> = {
  map?: (value: unknown) => TValue;
};


export class ReferenceSet {
  list: Set<unknown>;
  refs: Map<string, Reference>;

  constructor() {
    this.list = new Set();
    this.refs = new Map();
  }
  get size() {
    return this.list.size + this.refs.size;
  }

  describe() {
    const description = [] as Array<unknown | SchemaRefDescription>;

    for (const item of this.list) description.push(item);
    for (const [, ref] of this.refs) description.push(ref.describe());

    return description;
  }

  toArray() {
    return Array.from(this.list).concat(Array.from(this.refs.values()));
  }

  resolveAll(resolve: (v: unknown) => unknown) {
    return this.toArray().reduce((acc: unknown[],e) => acc.concat(Reference.isRef(e) ? resolve(e) : e),[]);
  }

  add(value: unknown) {
    Reference.isRef(value)
      ? this.refs.set(value.key, value)
      : this.list.add(value);
  }
  delete(value: unknown) {
    Reference.isRef(value)
      ? this.refs.delete(value.key)
      : this.list.delete(value);
  }

  clone() {
    const next = new ReferenceSet();
    next.list = new Set(this.list);
    next.refs = new Map(this.refs);
    return next;
  }

  merge(newItems: ReferenceSet, removeItems: ReferenceSet) {
    const next = this.clone();
    newItems.list.forEach((value) => next.add(value));
    newItems.refs.forEach((value) => next.add(value));
    removeItems.list.forEach((value) => next.delete(value));
    removeItems.refs.forEach((value) => next.delete(value));
    return next;
  }
}

export function create<TValue = unknown>(
  key: string,
  options?: ReferenceOptions<TValue>,
) {
  return new Reference<TValue>(key, options);
}

export default class Reference<TValue = unknown> {
  readonly key: string;
  readonly isContext: boolean;
  readonly isValue: boolean;
  readonly isSibling: boolean;
  readonly path: any;

  readonly getter: (data: unknown) => unknown;
  readonly map?: (value: unknown) => TValue;

  declare readonly __isYupRef: boolean;

  constructor(key: string, options: ReferenceOptions<TValue> = {}) {
    if (typeof key !== 'string')
      throw new TypeError('ref must be a string, got: ' + key);

    this.key = key.trim();

    if (key === '') throw new TypeError('ref must be a non-empty string');

    this.isContext = this.key[0] === prefixes.context;
    this.isValue = this.key[0] === prefixes.value;
    this.isSibling = !this.isContext && !this.isValue;

    let prefix = this.isContext
      ? prefixes.context
      : this.isValue
      ? prefixes.value
      : '';

    this.path = this.key.slice(prefix.length);
    this.getter = this.path && getter(this.path, true);
    this.map = options.map;
  }

  getValue(value: any, parent?: {}, context?: {}): TValue {
    let result = this.isContext ? context : this.isValue ? value : parent;

    if (this.getter) result = this.getter(result || {});

    if (this.map) result = this.map(result);

    return result;
  }

  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */
  cast(value: any, options?: { parent?: {}; context?: {} }) {
    return this.getValue(value, options?.parent, options?.context);
  }

  resolve() {
    return this;
  }

  describe(): SchemaRefDescription {
    return {
      type: 'ref',
      key: this.key,
    };
  }

  toString() {
    return `Ref(${this.key})`;
  }

  static isRef(value: any): value is Reference {
    return value && value.__isYupRef;
  }
}

// @ts-ignore
Reference.prototype.__isYupRef = true;
