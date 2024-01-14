import { LatestSeqs } from '../latest-seqs.js'

const applySeqAtIndex = () => {
  const changes = [
    {
      replicaIndex: 0,
      globalSeq: 0,
      parentIndices: [],
    },
    {
      replicaIndex: 1,
      globalSeq: 0,
      parentIndices: [],
    },
    {
      replicaIndex: 2,
      globalSeq: 1,
      parentIndices: [0, 1],
    },
    {
      replicaIndex: 0,
      globalSeq: 1,
      parentIndices: [0, 1],
    },
  ]

  const latestSeqs = new LatestSeqs()

  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i]

    latestSeqs.applySeqAtIndex(change.replicaIndex, change.globalSeq)
  }

  const expected = [1, 0, 1]

  const actual = latestSeqs.seqs

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('applySeqAtIndex failed')
  }

  console.log('applySeqAtIndex passed', actual)
}

const shouldApplySeqAtIndex = () => {
  const latestSeqs = new LatestSeqs()

  const changes = [
    {
      replicaIndex: 0,
      globalSeq: 0,
      parentIndices: [],
    },
    {
      replicaIndex: 0,
      globalSeq: 1,
      parentIndices: [0],
    },
    {
      replicaIndex: 0,
      globalSeq: 0,
      parentIndices: [],
    },
    {
      replicaIndex: 0,
      globalSeq: 1,
      parentIndices: [0],
    },
    {
      replicaIndex: 0,
      globalSeq: 2,
      parentIndices: [1],
    },
  ]

  const expected = [true, true, false, false, true]

  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i]

    const actual = latestSeqs.shouldApplySeqAtIndex(change.replicaIndex, change.globalSeq)

    if (actual !== expected[i]) {
      throw new Error('shouldApplySeqAtIndex failed')
    }

    if (actual) {
      latestSeqs.applySeqAtIndex(change.replicaIndex, change.globalSeq)
    }
  }

  console.log('shouldApplySeqAtIndex passed', expected)
}

const shouldMergeAtIndex = () => {
  const latestSeqs = new LatestSeqs()

  latestSeqs.mergedSeqs = [undefined, 0, 1]

  if (!latestSeqs.shouldMergeAtIndex(0, 0)) {
    throw new Error('shouldMergeAtIndex failed')
  }

  if (!latestSeqs.shouldMergeAtIndex(1, 1)) {
    throw new Error('shouldMergeAtIndex failed')
  }

  if (latestSeqs.shouldMergeAtIndex(2, 1)) {
    throw new Error('shouldMergeAtIndex failed')
  }

  if (!latestSeqs.shouldMergeAtIndex(2, 2)) {
    throw new Error('shouldMergeAtIndex failed')
  }

  console.log('shouldMergeAtIndex passed')
}

const mergeAtIndex = () => {
  const latestSeqs = new LatestSeqs()

  latestSeqs.mergeAtIndex(0, 0)
  latestSeqs.mergeAtIndex(0, 1)
  latestSeqs.mergeAtIndex(1, 0)
  latestSeqs.mergeAtIndex(1, 1)
  latestSeqs.mergeAtIndex(2, 2)

  const expected = [1, 1, 2]

  const actual = latestSeqs.mergedSeqs

  console.log(expected, actual)

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('mergeAtIndex failed')
  }

  console.log('mergeAtIndex passed', actual)
}

const getNextParentIndices = () => {
  const latestSeqs = new LatestSeqs()

  let parentSeqs = latestSeqs.getNextParentIndices()

  let expected = []

  let actual = parentSeqs

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('getNextParentIndices failed')
  }

  console.log('getNextParentIndices passed', actual)

  latestSeqs.seqs = [1, 1, 2]
  latestSeqs.mergedSeqs = [0, 0, 1]

  parentSeqs = latestSeqs.getNextParentIndices()

  expected = [0, 1, 2]

  actual = parentSeqs

  console.log(expected, actual)

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('getNextParentIndices failed')
  }

  console.log('getNextParentIndices passed', actual)
}

export const run = () => {
  console.log('running latest-seqs-test')
  applySeqAtIndex()
  shouldApplySeqAtIndex()
  shouldMergeAtIndex()
  mergeAtIndex()
  getNextParentIndices()
}
