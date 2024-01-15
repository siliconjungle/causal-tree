import { CausalTree } from '../causal-tree.js'

// doesChangeExist (replicaId, globalSeq)
// getChangeIndex (replicaId, globalSeq)
// getChangeUid (index)
// addGlobalChange (globalChange)
// toLocalChange (globalChange)
// toGlobalChange (localChange)
// getNextGlobalParents ()
// getGlobalChangesSinceIndex (localIndex)

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

  diamond()
}

const getGlobalChangesSinceIndex = () => {
  // add a bunch of changes
  // then get the changes since a certain index
  // and make sure they are the right ones
  const causalTree = new CausalTree()

  // loop through 500 times adding linear changes.
  // each change should have a single parent
  const numChanges = 500
  const changes = [
    {
      replicaId: 'a',
      globalSeq: 0,
      parents: [],
    },
  ]

  for (let i = 1; i < numChanges; i++) {
    changes.push({
      replicaId: 'a',
      globalSeq: i,
      parents: [
        {
          replicaId: 'a',
          globalSeq: i - 1,
        },
      ],
    })
  }

  changes.forEach((change) => {
    causalTree.addGlobalChange(change)
  })

  // get changes from 250+
  const index = 250

  const globalChanges = causalTree.getGlobalChangesSinceIndex(index)

  const expected = []

  for (let i = index; i < numChanges; i++) {
    expected.push({
      replicaId: 'a',
      globalSeq: i,
      parents: [
        {
          replicaId: 'a',
          globalSeq: i - 1,
        },
      ],
    })
  }

  if (JSON.stringify(globalChanges) !== JSON.stringify(expected)) {
    throw new Error('expected global changes since index')
  }

  console.log('getGlobalChangesSinceIndex passed')
}

export const run = () => {
  console.log('running causal-tree-test')

  doesChangeExist()
  getChangeIndex()
  getChangeUid()
  addGlobalChange()
  toLocalChange()
  toGlobalChange()
  getNextGlobalParents()
  getGlobalChangesSinceIndex()
}
