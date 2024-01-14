import { nanoid } from 'nanoid'
import { LocalOrder } from '../local-order.js'

const addId = () => {
  const replicaIds = new Array(1000).fill(0).map(() => {
    return nanoid()
  })

  const localOrder = new LocalOrder()

  replicaIds.forEach((replicaId) => {
    localOrder.addId(replicaId)
  })

  const expectedIds = replicaIds

  const expectedIndices = replicaIds.reduce((acc, replicaId, index) => {
    acc[replicaId] = index
    return acc
  }, {})

  const actualIds = localOrder.ids
  const actualIndices = localOrder.indices

  const idsMatch = JSON.stringify(actualIds) === JSON.stringify(expectedIds)
  const indicesMatch = JSON.stringify(actualIndices) === JSON.stringify(expectedIndices)

  if (!idsMatch) {
    throw new Error('ids do not match')
  }

  if (!indicesMatch) {
    throw new Error('indices do not match')
  }

  console.log('addId passed')
}

const hasId = () => {
  const replicaIds = new Array(1000).fill(0).map(() => {
    return nanoid()
  })

  const localOrder = new LocalOrder()

  replicaIds.forEach((replicaId, index) => {
    if (index % 2 === 0) {
      localOrder.addId(replicaId)
    }
  })

  const expected = new Array(replicaIds.length).fill(0).map((_, index) => {
    return index % 2 === 0
  })

  const actual = replicaIds.map((replicaId) => {
    return localOrder.hasId(replicaId)
  })

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('hasId failed')
  }

  console.log('hasId passed')
}

const getIndexById = () => {
  const replicaIds = new Array(1000).fill(0).map(() => {
    return nanoid()
  })

  const localOrder = new LocalOrder()

  replicaIds.forEach((replicaId, index) => {
    if (index % 2 === 0) {
      localOrder.addId(replicaId)
    }
  })

  const expected = new Array(replicaIds.length).fill(0).map((_, index) => {
    if (index % 2 === 0) {
      return index / 2
    }

    return undefined
  })

  const actual = replicaIds.map((replicaId) => {
    return localOrder.getIndexById(replicaId)
  })

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('getIndexById failed')
  }

  console.log('getIndexById passed')
}

const getIdByIndex = () => {
  const replicaIds = new Array(1000).fill(0).map(() => {
    return nanoid()
  })

  const localOrder = new LocalOrder()

  replicaIds.forEach((replicaId, index) => {
    if (index > 499) {
      return
    }

    localOrder.addId(replicaId)
  })

  const expected = new Array(replicaIds.length).fill(0).map((_, index) => {
    if (index > 499) {
      return undefined
    }

    return replicaIds[index]
  })

  const actual = new Array(replicaIds.length).fill(0).map((_, index) => {
    return localOrder.getIdByIndex(index)
  })

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('getIdByIndex failed')
  }

  console.log('getIdByIndex passed')
}

const hasIndex = () => {
  const replicaIds = new Array(1000).fill(0).map(() => {
    return nanoid()
  })

  const localOrder = new LocalOrder()

  replicaIds.forEach((replicaId, index) => {
    if (index % 2 === 0) {
      localOrder.addId(replicaId)
    }
  })

  const expected = new Array(replicaIds.length).fill(0).map((_, index) => {
    return index < replicaIds.length / 2
  })

  const actual = new Array(replicaIds.length).fill(0).map((_, index) => {
    return localOrder.hasIndex(index)
  })

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('hasIndex failed')
  }

  console.log('hasIndex passed')
}

export const run = () => {
  console.log('running local-order-test')
  addId()
  hasId()
  getIndexById()
  getIdByIndex()
  hasIndex()
}
