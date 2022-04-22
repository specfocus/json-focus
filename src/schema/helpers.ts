import printValue from './validate/printValue';
// @ts-ignore
export let castAndShouldFail = (schema, value) => {
  expect(() => schema.cast(value)).toThrowError(TypeError);
};
// @ts-ignore
export let castAll = (inst, { invalid = [], valid = [] }) => {
  valid.forEach(([value, result, schema = inst]) => {
    it(`should cast ${printValue(value)} to ${printValue(result)}`, () => {
      expect(schema.cast(value)).toBe(result);
    });
  });

  invalid.forEach((value) => {
    it(`should not cast ${printValue(value)}`, () => {
      castAndShouldFail(inst, value);
    });
  });
};

// @ts-ignore
export let validateAll = (inst, { valid = [], invalid = [] }) => {
  describe('valid:', () => {
    runValidations(valid, true);
  });

  describe('invalid:', () => {
    runValidations(invalid, false);
  });
  // @ts-ignore
  function runValidations(arr, isValid) {
    // @ts-ignore
    arr.forEach((config) => {
      let message = '',
        value = config,
        schema = inst;

      if (Array.isArray(config)) [value, schema, message = ''] = config;

      it(`${printValue(value)}${message && `  (${message})`}`, async () => {
        await expect(schema.isValid(value)).resolves.toEqual(isValid);
      });
    });
  }
};

// @ts-ignore
export function validationErrorWithMessages(...errors) {
  return expect.objectContaining({
    errors,
  });
}


// @ts-ignore
export function ensureSync(fn) {
  let run = false;
  // @ts-ignore
  let resolve = (t) => {
    if (!run) return t;
    throw new Error('Did not execute synchronously');
  };
  // @ts-ignore
  let err = (t) => {
    if (!run) throw t;
    throw new Error('Did not execute synchronously');
  };
  // @ts-ignore
  let result = fn().then(resolve, err);

  run = true;
  return result;
}
