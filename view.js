import { CausalTree } from './causal-tree.js';
import { getAncestorIndices } from './utils.js';
import { Exists } from './exists.js';

// getAncestorIndices(changes, changeIndex)
// so we can call this method and then we can filter out the ops that are not in the ancestor indices.

// const op = {
  // changeIndex,
  // pos,
  // ins: '',
// }

// this file is an *index* or *view* into the causal tree.
// the causal tree defines the ordering but this defines the ops applied to a specific view.

class View {
  constructor () {}

  // the view is a list of ops that have been applied to a context.
  // this could just be a run-length encoded set of whether something exists or not.
}
