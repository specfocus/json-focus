/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import {
  array,
  string,
  object,
  mixed,
  number,
  ref,
  lazy,
  SchemaOf,
  date,
  BaseSchema,
  StringSchema,
} from '.';
import type {
  AnyObject,
  AssertsShape,
  DefaultFromShape,
  TypeOfShape,
} from './object';
import type { Config, ResolveFlags, _ } from './base';
import { Preserve } from '@specfocus/main-focus/src/maybe';

type File = string;

mixed().required().nullable();

string().required().nullable();

/** Type utils */
describe('Type utils', () => {
  it('should test', () => {
    const strRequired = string().required();

    // string().default('hi').cast();

    // $ExpectType string
    expect(jest.fn(() => strRequired.cast(undefined))).toThrow();

    //
    const strNullableOptional = string().nullable().optional();

    // $ExpectType string | null | undefined
    strNullableOptional.cast('');

    // $ExpectType string
    expect(jest.fn(() => strNullableOptional.required().validateSync(''))).toThrow();

    //
    //
    const strNullable = string().nullable();

    // $ExpectType string | null | undefined
    expect(jest.fn(() => strNullable.validateSync(''))).not.toThrow();

    const strDefined = string().default('');

    // $ExpectType string
    const _strDefined = strDefined.getDefault();

    const strDefault = string().nullable().default('').nullable().trim();

    // $ExpectType string | null
    expect(jest.fn(() => strDefault.cast(''))).not.toThrow();

    // $ExpectType string | null
    expect(jest.fn(() => strDefault.validateSync(''))).not.toThrow();

    //
    //
    const strDefaultRequired = string().nullable().required().default('').trim();

    // $ExpectType string
    expect(jest.fn(() => strDefaultRequired.cast(''))).not.toThrow();

    // $ExpectType string
    expect(jest.fn(() => strDefaultRequired.validateSync(null))).toThrow();
  });


  it('should test', () => {
    const obj = object({
      string: string<'foo'>().defined(),
      number: number().default(1),
      removed: number().strip(),
      ref: ref('string'),
      nest: object({
        other: string(),
      }),
      lazy: lazy(() => number().defined()),
    });

    type _d1 = DefaultFromShape<typeof obj['fields']>;

    // $ExpectType number | undefined
    type _i1 = TypeOfShape<typeof obj['fields']>['number'];

    // $ExpectType "foo"
    type _i2 = TypeOfShape<typeof obj['fields']>['string'];

    // $ExpectType unknown
    type _i3 = TypeOfShape<typeof obj['fields']>['ref'];

    // $ExpectType number
    type _i33 = TypeOfShape<typeof obj['fields']>['lazy'];

    // $ExpectType number
    type _i4 = AssertsShape<typeof obj['fields']>['number'];

    // $ExpectType "foo"
    type _i5 = AssertsShape<typeof obj['fields']>['string'];

    type _i6 = _<AssertsShape<typeof obj['fields']>>;

    // $ExpectType number
    type _i7 = AssertsShape<typeof obj['fields']>['lazy'];
    expect(jest.fn(() => {
      const cast1 = obj.cast({});

      // $ExpectType string | undefined
      cast1!.nest!.other;

      // $ExpectType "foo"
      cast1!.string;

      // $ExpectType number
      cast1!.number;
    })).toThrow();

    //
    // Object Defaults
    //
    expect(jest.fn(() => {
      const dflt1 = obj.getDefaultFromShape();

      // $ExpectType number
      dflt1.number;

      // $ExpectType undefined
      dflt1.ref;

      // $ExpectType undefined
      dflt1.lazy;

      // $ExpectType undefined
      dflt1.string;

      // $ExpectType undefined
      dflt1.nest.other;
    })).not.toThrow();

    const merge = object({
      field: string().required(),
      other: string().default(''),
    }).shape({
      field: number(),
    });

    // $ExpectType number | undefined
    expect(jest.fn(() => merge.cast({}).field)).not.toThrow();

    // $ExpectType string
    expect(jest.fn(() => merge.cast({}).other)).not.toThrow();
  });
});

describe('ObjectPartial', () => {
  const schema = object({
    // age: number(),
    name: string().required(),
    address: object()
      .shape({
        line1: string().required(),
        zip: number().required(),
      })
      .default(undefined),
  }).nullable();

  const partial = schema.partial();

  // $ExpectType string | undefined
  expect(jest.fn(() => partial.validateSync({ age: '1' })!.name)).toThrow();

  // $ExpectType StringSchema<string | undefined, Config<AnyObject, "">>
  partial.fields.name;

  // $ExpectType string
  expect(jest.fn(() => partial.validateSync({})!.address!.line1)).toThrow();

  const deepPartial = schema.deepPartial();

  // $ExpectType string | undefined
  expect(jest.fn(() => deepPartial.validateSync({ age: '1' })!.name)).toThrow();

  // $ExpectType string | undefined
  expect(jest.fn(() => deepPartial.validateSync({})!.address!.line1)).toThrow();
});

describe('ObjectPick', () => {
  const schema = object({
    age: number(),
    name: string().required(),
  })
    .nullable()
    .required();

  // $ExpectType number | undefined
  expect(jest.fn(() => schema.pick(['age']).validateSync({ age: '1' }).age)).not.toThrow();
});

describe('ObjectOmit', () => {
  const schema = object({
    age: number(),
    name: string().required(),
  })
    .nullable()
    .required();

  // $ExpectType string
  expect(jest.fn(() => schema.omit(['age']).validateSync({ name: '1' }).name)).not.toThrow();

  // $ExpectType string | undefined
  expect(jest.fn(() => schema.omit(['age']).partial().validateSync({ name: '1' }).name)).not.toThrow();
});

describe('SchemaOf', () => {
  type Person = {
    nested?: {
      name: string;
    };
    firstName: string;
    title: string | undefined;
    age?: number;
    colors: string[];
    createdAt: Date;
  };

  type PersonSchema = SchemaOf<Person>;
  const _b: BaseSchema<
    string,
    Config<AnyObject, ''>
  > = null as any as StringSchema<string, Config<AnyObject, ''>>;

  const _t: PersonSchema = object({
    firstName: string().defined(),
    title: string(),
    age: lazy(() => number()),
    colors: array(string().defined()),
    createdAt: date().defined(),
    nested: object({
      name: string().required(),
    }),
  });
});

describe('SchemaOfDate', () => {
  type Employee = {
    hire_date: Date;
    name: string;
  };

  type EmployeeSchema = SchemaOf<Employee>;

  const _t: EmployeeSchema = object({
    name: string().defined(),
    hire_date: date().defined(),
  });
});

describe('SchemaOfDateArray', () => {
  type EmployeeWithPromotions = {
    promotion_dates: Date[];
    name: string;
  };

  type EmployeeWithPromotionsSchema = SchemaOf<EmployeeWithPromotions>;

  const _t: EmployeeWithPromotionsSchema = object({
    name: string().defined(),
    promotion_dates: array().of(date().defined()),
  });
});

describe('SchemaOfFile', () => {
  type Document = {
    file: File;
    date_uploaded: Date;
    notes: string;
  };

  type FileSchema = SchemaOf<Document, File>;

  // @ts-ignore
  const _t: FileSchema = object({
    file: mixed<File>().defined(),
    date_uploaded: date().defined(),
    notes: string().defined(),
  });
});

describe('SchemaOfFileArray', () => {
  type DocumentWithFullHistory = {
    history: File[];
    name: string;
  };

  type DocumentWithFullHistorySchema = SchemaOf<DocumentWithFullHistory, File>;

  // @ts-ignore
  const _t: DocumentWithFullHistorySchema = object({
    name: string().defined(),
    history: array().of(mixed<File>().defined()),
  });
});

describe('ExpectType', () => {
  // const str = string();
  // type f = Type<typeof str>;

  type _b = Preserve<Config<any, '' | 's'>['flags'], 'd'>;
  // type _a = HasFlag<Config<any, '' | 's'>['flags'], 'd'>;
  type _f = ResolveFlags<string | undefined, Config<any, ''>['flags']>;

  // $ExpectType (string | undefined)[] | undefined
  expect(jest.fn(() => array(string()).cast(null))).toThrow();

  // $ExpectType string[] | undefined
  expect(jest.fn(() => array(string().required()).validateSync(null))).toThrow();

  // $ExpectType string[]
  expect(jest.fn(() => array(string().default('')).required().validateSync(null))).toThrow();

  // $ExpectType string[] | undefined
  expect(jest.fn(() => array(string().default('')).validateSync(null))).toThrow();

  // $ExpectType string[] | null | undefined
  expect(jest.fn(() => array(string().default('')).nullable().validateSync(null))).not.toThrow();

  // $ExpectType (string | null)[] | undefined
  expect(jest.fn(() => array(string().nullable().default('')).validateSync(null))).toThrow();

  // $ExpectType any[]
  expect(jest.fn(() => array()
    .default([] as number[])
    .getDefault())).not.toThrow();;

  // $ExpectType (string | null)[] | null
  expect(jest.fn(() => array(string().nullable().default(''))
    .nullable()
    .default(() => [] as string[])
    .validateSync(null))).not.toThrow();;

  // $ExpectType string[] | undefined
  // @ts-ignore
  expect(jest.fn(() => array(lazy(() => string().default(''))).validateSync(null))).toThrow();;

  const numList = [1, 2];

  // $ExpectType (number | undefined)[]
  expect(jest.fn(() => array(number()).default(numList).getDefault())).not.toThrow();;
  expect(jest.fn(() => {
    const a1 = object({
      list: array(number().required()).required(),
      nested: array(
        object({
          name: string().default(''),
        }),
      ),
    })
      .required()
      .validateSync(undefined);

    // $ExpectType number[]
    a1.list;

    // $ExpectType string | undefined
    a1.nested?.[0].name;

    // $ExpectType string
    a1.nested![0].name;
  })).toThrow();

  expect(jest.fn(() => {
    // $ExpectType (number | undefined)[]
    const _c1 = array(number())
      .concat(array(number()).required())
      .validateSync([]);
  })).not.toThrow();

  // $ExpectType { [x: string]: any; a: number; }[] | null
  expect(jest.fn(() => {
    // @ts-ignore
    const _definedArray: Array<{ a: number; }> | null = array()
      .of(object({ a: number().required() }))
      .nullable()
      .defined()
      .validateSync([]);
  })).not.toThrow();

  // $ExpectType { [x: string]: any; a: number; }[]
  expect(jest.fn(() => {
    // @ts-ignore
    const _requiredArray: Array<{ a: number; }> = array()
      .of(object({ a: number().required() }))
      .nullable()
      .required()
      .validateSync([]);
  })).not.toThrow();
});

describe('ExpectType 2', () => {
  // $ExpectType string | undefined
  expect(jest.fn(() => lazy(() => string()).cast(3))).not.toThrow();;

  // $ExpectType string | number | undefined
  expect(jest.fn(() => lazy((v) => (typeof v === 'string' ? string() : number())).cast(3))).not.toThrow();;
});

//
// CONCAT
//
describe('Concat', () => {
  // $ExpectType string
  expect(jest.fn(() => mixed<string>().concat(mixed<string>().required()).validateSync(''))).not.toThrow();;

  // $ExpectType string | number | undefined
  expect(jest.fn(() => {
    const _oo = mixed<number>()
      .required()
      .concat(mixed<string>())
      .validateSync('');
  })).not.toThrow();

  expect(jest.fn(() => {
    const _o = object({
      str: string(),
    }).concat(
      object({
        name: string(),
      }),
    );
  })).not.toThrow();

  // $ExpectType string
  expect(jest.fn(() => string().nullable().default('hi').concat(string()).cast(''))).not.toThrow();;

  // $ExpectType number
  expect(jest.fn(() => number().nullable().default(1).concat(number()).cast(''))).toThrow();;

  // $ExpectType string | null
  expect(jest.fn(() => string().default('hi').concat(string().nullable()).cast(''))).not.toThrow();;

  // $ExpectType number | null
  expect(jest.fn(() => number().default(0).concat(number().nullable()).cast(''))).toThrow();;
});

// Context: {
//   type Context = { isCool: boolean };

//   const schema = object({
//     str: string().when('$isCool', {
//       is: true,
//       then: string().required(),
//     }),
//   });
// }
