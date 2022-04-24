import { Serializer } from './Serializer';
import { ObjectSerializer } from './ObjectSerializer';

const stringify = (op?: any, sep?: any, cl?: any, indent?: number): ReadableStream => {
  const serializer = new Serializer(op, sep, cl, indent);

  return serializer.stream;
}

export const stringifyObject = (op?: any, sep?: any, cl?: any, indent?: number) => {
  const serializer = new ObjectSerializer(op, sep, cl, indent);
  return serializer.stream;
}

export default stringify;
