export const getInnerAncestorIndices = (changes, changeIndex, ancestors = new Set()) => {
  const change = changes[changeIndex]

  const { parentIndices } = change

  for (let i = 0; i < parentIndices.length; ++i) {
    const parentIndex = parentIndices[i]

    ancestors.add(parentIndex)

    getAncestorIndices(changes, parentIndex, ancestors)
  }

  return ancestors
}

export const getAncestorIndices = (changes, changeIndex) => {
  const ancestors = getInnerAncestorIndices(changes, changeIndex)

  return Array.from(ancestors)
}

// This is inefficient, this should really be implemented as a breadth first search.
export const getAncestorDistances = (changeIndex, changes, ancestorIndices = {}, distance = 0) => {
  const change = changes[changeIndex]

  const { parentIndices } = change

  for (let i = 0; i < parentIndices.length; ++i) {
    const parentIndex = parentIndices[i]

    ancestorIndices[parentIndex] = Math.min(ancestorIndices[parentIndex] ?? Infinity, distance)

    getAncestorDistances(parentIndex, changes, ancestorIndices, distance + 1)
  }

  return ancestorIndices
}

export const getClosestCommonAncestorIndex = (changes, changeIndices) => {
  const ancestorIndices = changeIndices.map((changeIndex) => {
    return getAncestorDistances(changeIndex, changes)
  })

  // now that we have the distances for each change.
  // we can just loop through and find the smallest distance that is common to all changes.
  const commonAncestorIndices = Object.keys(ancestorIndices[0]).filter((ancestorIndex) => {
    return ancestorIndices.every((ancestorIndices) => {
      return ancestorIndices[ancestorIndex] !== undefined
    })
  })

  if (commonAncestorIndices.length === 0) {
    return -1
  }

  // ok so now we have the common ancestor indices - so we just need to loop through them calculating the distances by adding them together.
  // across the different changes. Then we can just find the smallest distance.
  const commonAncestorDistances = commonAncestorIndices.map((commonAncestorIndex) => {
    return ancestorIndices.reduce((acc, ancestorIndices) => {
      return acc + ancestorIndices[commonAncestorIndex]
    }, 0)
  })

  const minDistance = Math.min(...commonAncestorDistances)

  const minDistanceIndex = commonAncestorDistances.findIndex((distance) => {
    return distance === minDistance
  })

  return commonAncestorIndices[minDistanceIndex]
}
