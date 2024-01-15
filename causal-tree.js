import { LocalOrder } from './local-order.js'
import { LatestSeqs } from './latest-seqs.js'

// ok so we use the local order to store the order in which agents have been seen.
// we also store the order in which we've seen ops.
// we have a check with local order which only applies ops if it's a new op.

// const globalChange = {
//   replicaId: 'uuid',
//   globalSeq: 0,
//   parents: [
//     {
//       replicaId: 'uuid',
//       globalSeq: 0,
//     },
//   ],
// }

// const localChange = {
//   replicaIndex: 0,
//   globalSeq: 0,
//   parentIndices: [
//     changeIndex,
//   ],
// }

// still needs to be run-length encoded
// still needs to have tests written.
export class CausalTree {
  constructor () {
    this.replicaIds = new LocalOrder()
    this.latestSeqs = new LatestSeqs()
    this.changes = []
  }

  doesChangeExist (replicaId, globalSeq) {
    const replicaIndex = this.replicaIds.getIndexById(replicaId)

    if (replicaIndex === undefined) {
      return false
    }

    // find it in the list of changes. let's just use the find method for now but we can optimize this later.
    // this is honestly the *slowest* part of the algorithm atm.
    const change = this.changes.find((change) => {
      return change.replicaIndex === replicaIndex && change.globalSeq === globalSeq
    })

    return change !== undefined
  }

  getChangeIndex (replicaId, globalSeq) {
    const replicaIndex = this.replicaIds.getIndexById(replicaId)

    if (replicaIndex === undefined) {
      return undefined
    }

    // then we need to find the change index.
    return this.changes.findIndex((change) => {
      return change.replicaIndex === replicaIndex && change.globalSeq === globalSeq
    })
  }

  getChangeUid (index) {
    if (this.changes.length - 1 < index) {
      return null
    }

    const localChange = this.changes[index]

    const globalChange = this.toGlobalChange(localChange)

    const { replicaId, globalSeq } = globalChange

    return {
      replicaId,
      globalSeq,
    }
  }

  addGlobalChange (globalChange) {
    const { replicaId, globalSeq, parents } = globalChange

    // first loop through the parents to see if they exist.
    // if they don't exist just return.
    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i]

      if (!this.doesChangeExist(parent.replicaId, parent.globalSeq)) {
        // probably throw an error too.
        return
      }
    }

    const replicaIndex = this.replicaIds.hasId(replicaId) ?
      this.replicaIds.getIndexById(replicaId) :
      this.replicaIds.addId(replicaId)

    if (this.latestSeqs.shouldApplySeqAtIndex(replicaIndex, globalSeq)) {
      this.latestSeqs.applySeqAtIndex(replicaIndex, globalSeq)

      const parentIndices = parents.map((parent) => {
        return this.getChangeIndex(parent.replicaId, parent.globalSeq)
      })

      // loop through the parent indices and then apply them to the latest seqs object.
      for (let i = 0; i < parentIndices.length; ++i) {
        const parentChange = this.changes[parentIndices[i]]

        if (
          this.latestSeqs.shouldMergeAtIndex(
            parentChange.replicaIndex,
            parentChange.globalSeq
          )
        ) {
          this.latestSeqs.mergeAtIndex(parentChange.replicaIndex, parentChange.globalSeq)
        }
      }

      const localChange = {
        replicaIndex,
        globalSeq,
        parentIndices,
      }

      this.changes.push(localChange)

      return localChange
    }
  }

  // this just looks up the change and returns it. It differs from the above
  // as this assumes the change exists.
  toLocalChange (globalChange) {
    const { replicaId, globalSeq, parents } = globalChange

    const replicaIndex = this.replicaIds.getIndexById(replicaId)

    const parentIndices = parents.map((parent) => {
      return this.getChangeIndex(parent.replicaId, parent.globalSeq)
    })

    const localChange = {
      replicaIndex,
      globalSeq,
      parentIndices,
    }

    return localChange
  }

  // this just looks up the change and returns it. It differs from the above
  // as this assumes the change exists.
  toGlobalChange (localChange) {
    // this needs to do the inverse of the above.
    const { replicaIndex, globalSeq, parentIndices } = localChange

    const replicaId = this.replicaIds.getIdByIndex(replicaIndex)

    const parents = parentIndices.map(parentIndex => {
      const localChange = this.changes[parentIndex]
      const { replicaId, globalSeq } = this.toGlobalChange(localChange)

      return {
        replicaId,
        globalSeq,
      }
    })

    const globalChange = {
      replicaId,
      globalSeq,
      parents,
    }

    return globalChange
  }

  getNextGlobalParents () {
    const nextParentIndices = this.latestSeqs.getNextParentIndices()

    const parents = nextParentIndices.map(parentIndex => {
      const replicaId = this.replicaIds.getIdByIndex(parentIndex)
      const globalSeq = this.latestSeqs.seqs[parentIndex]

      return {
        replicaId,
        globalSeq,
      }
    })

    return parents
  }

  getChangesSinceIndex (localIndex) {
    if (this.changes.length -1 > localIndex) {
      const localChanges = this.changes.slice(localIndex)

      const globalChanges = localChanges.map(localChange => {
        const globalChange = this.toGlobalChange(localChange)

        return globalChange
      })

      return globalChanges
    }

    return []
  }
}
