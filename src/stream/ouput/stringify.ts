// JSON.stringify pipe

const COMMA = ',';
const stringify = (data: unknown) => {
  return JSON.stringify(data) + COMMA;
}

export default stringify;