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

const getNextGlobalParents = () => {
  const empty = () => {
    const causalTree = new CausalTree()

    const nextGlobalParents = causalTree.getNextGlobalParents()

    const expected = []

    if (JSON.stringify(nextGlobalParents) !== JSON.stringify(expected)) {
      throw new Error('expected empty next global parents')
    }
  }

  empty()

  const linear = () => {
    const causalTree = new CausalTree()

    const changes = [
      {
        replicaId: 'a',
        globalSeq: 0,
        parents: [],
      },
      {
        replicaId: 'a',
        globalSeq: 1,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 0,
          },
        ],
      },
      {
        replicaId: 'a',
        globalSeq: 2,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 1,
          },
        ],
      },
      {
        replicaId: 'a',
        globalSeq: 3,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 2,
          },
        ],
      },
    ]

    changes.forEach((change) => {
      causalTree.addGlobalChange(change)
    })

    const nextGlobalParents = causalTree.getNextGlobalParents()

    const expected = [
      {
        replicaId: 'a',
        globalSeq: 3,
      },
    ]

    if (JSON.stringify(nextGlobalParents) !== JSON.stringify(expected)) {
      throw new Error('expected linear next global parents')
    }
  }

  linear()

  const fork = () => {
    const causalTree = new CausalTree()

    const changes = [
      {
        replicaId: 'a',
        globalSeq: 0,
        parents: [],
      },
      {
        replicaId: 'a',
        globalSeq: 1,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 0,
          },
        ],
      },
      {
        replicaId: 'a',
        globalSeq: 2,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 1,
          },
        ],
      },
      {
        replicaId: 'b',
        globalSeq: 0,
        parents: [],
      },
      {
        replicaId: 'b',
        globalSeq: 1,
        parents: [
          {
            replicaId: 'b',
            globalSeq: 0,
          },
        ],
      },
      {
        replicaId: 'b',
        globalSeq: 2,
        parents: [
          {
            replicaId: 'b',
            globalSeq: 1,
          },
        ],
      },
    ]

    changes.forEach((change) => {
      causalTree.addGlobalChange(change)
    })

    const nextGlobalParents = causalTree.getNextGlobalParents()

    const expected = [
      {
        replicaId: 'a',
        globalSeq: 2,
      },
      {
        replicaId: 'b',
        globalSeq: 2,
      },
    ]

    if (JSON.stringify(nextGlobalParents) !== JSON.stringify(expected)) {
      throw new Error('expected fork next global parents')
    }
  }

  fork()

  const diamond = () => {
    const causalTree = new CausalTree()

    const changes = [
      {
        replicaId: 'a',
        globalSeq: 0,
        parents: [],
      },
      {
        replicaId: 'a',
        globalSeq: 1,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 0,
          },
        ],
      },
      {
        replicaId: 'a',
        globalSeq: 2,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 1,
          },
        ],
      },
      {
        replicaId: 'b',
        globalSeq: 1,
        parents: [
          {
            replicaId: 'a',
            globalSeq: 0,
          },
        ],
      },
      {
        replicaId: 'b',
        globalSeq: 3,
        parents: [
          {
            replicaId: 'b',
            globalSeq: 1,
          },
          {
            replicaId: 'a',
            globalSeq: 2,
          },
        ],
      },
    ]

    changes.forEach((change) => {
      causalTree.addGlobalChange(change)
    })

    const nextGlobalParents = causalTree.getNextGlobalParents()

    const expected = [
      {
        replicaId: 'b',
        globalSeq: 3,
      },
    ]

    if (JSON.stringify(nextGlobalParents) !== JSON.stringify(expected)) {
      throw new Error('expected diamond next global parents')
    }
  }
}

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
