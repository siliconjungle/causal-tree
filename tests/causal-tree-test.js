import { CausalTree } from '../causal-tree.js'

// doesChangeExist (replicaId, globalSeq)
// getChangeIndex (replicaId, globalSeq)
// getChangeUid (index)
// addGlobalChange (globalChange)
// toLocalChange (globalChange)
// toGlobalChange (localChange)
// getNextGlobalParents ()
// getChangesSinceIndex (localIndex)

const doesChangeExist = () => {}

const getChangeIndex = () => {}

const getChangeUid = () => {}

const addGlobalChange = () => {
  
}

const toLocalChange = () => {}

const toGlobalChange = () => {}

const getNextGlobalParents = () => {}

const getChangesSinceIndex = () => {}

export const run = () => {
  console.log('running causal-tree-test')

  doesChangeExist()
  getChangeIndex()
  getChangeUid()
  addGlobalChange()
  toLocalChange()
  toGlobalChange()
  getNextGlobalParents()
  getChangesSinceIndex()
}
