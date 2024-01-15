import { CausalTree } from './causal-tree.js';
import { getAncestorIndices } from './utils.js';

// getAncestorIndices(changes, changeIndex)
// so we can call this method and then we can filter out the ops that are not in the ancestor indices.
// then just apply the ops in order.

// const op = {
  // changeIndex,
  // pos,
  // ins: '',
// }

// pretend there are 3 replicas.
// then have them make changes at different points in time and merge them in (for a server order).
// then run the method which will show us the order of the ops.
