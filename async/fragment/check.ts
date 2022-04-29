const check = (x: any, y: any): any => {
  if ('string' === typeof x)
    return y == x;
  else if (x && 'function' === typeof x.exec)
    return x.exec(y);
  else if ('boolean' === typeof x || 'object' === typeof x)
    return x;
  else if ('function' === typeof x)
    return x(y);
  return false;
};

export default check;
