import { array as toposort } from '@specfocus/main-focus/src/graph/toposort';
import { split } from '@specfocus/main-focus/src/object/property-expr';

import Ref from '../reference';
import isSchema from './isSchema';
import { ObjectShape } from '../object';

export default function sortFields(
  fields: ObjectShape,
  excludedEdges: readonly [string, string][] = [],
) {
  let edges = [] as Array<[string, string]>;
  let nodes = new Set<string>();
  let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));

  function addNode(depPath: string, key: string) {
    let node = split(depPath)[0];

    nodes.add(node);
    if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
  }

  for (const key of Object.keys(fields)) {
    let value = fields[key];

    nodes.add(key);

    if (Ref.isRef(value) && value.isSibling) addNode(value.path, key);
    else if (isSchema(value) && 'deps' in value)
      value.deps.forEach((path) => addNode(path, key));
  }

  return toposort(Array.from(nodes), edges).reverse() as string[];
}
