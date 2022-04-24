import { lazy, mixed } from '.';

describe('lazy', function () {
  it('should throw on a non-schema value', () => {
    // @ts-ignore
    expect(() => lazy(() => undefined).validate()).toThrowError();
  });

  describe('mapper', () => {
    const value = 1;
    // @ts-ignore
    let mapper;

    beforeEach(() => {
      mapper = jest.fn(() => mixed());
    });

    it('should call with value', () => {
      // @ts-ignore
      lazy(mapper).validate(value);
      // @ts-ignore
      expect(mapper).toHaveBeenCalledWith(value, expect.any(Object));
    });

    it('should call with context', () => {
      const context = {
        a: 1,
      };
      // @ts-ignore
      lazy(mapper).validate(value, context);
      // @ts-ignore
      expect(mapper).toHaveBeenCalledWith(value, context);
    });

    it('should allow meta', () => {
      const meta = { a: 1 };
      // @ts-ignore
      const schema = lazy(mapper).meta(meta);

      expect(schema.meta()).toEqual(meta);

      expect(schema.meta({ added: true })).not.toEqual(schema.meta());

      expect(schema.meta({ added: true }).meta()).toEqual({
        a: 1,
        added: true,
      });
    });
  });
});
