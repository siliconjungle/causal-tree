// The index into the latest seqs object is the agent index in the local order.
export class LatestSeqs {
  constructor () {
    this.seqs = []
    this.mergedSeqs = []
  }

  // these ideally should be applied in order so you don't get gaps in the array.
  applySeqAtIndex (index, seq) {
    this.seqs[index] = seq
  }

  shouldApplySeqAtIndex (index, seq) {
    return this.seqs[index] === undefined || this.seqs[index] < seq
  }

  shouldMergeAtIndex (index, seq) {
    return this.mergedSeqs[index] === undefined || this.mergedSeqs[index] < seq
  }

  mergeAtIndex (index, seq) {
    this.mergedSeqs[index] = seq
  }

  getNextParentIndices () {
    const parentIndices = []

    for (let i = 0; i < this.seqs.length; ++i) {
      const seq = this.seqs[i]
      const mergedSeq = this.mergedSeqs[i]

      const diff = seq - mergedSeq

      if (diff > 0) {
        parentIndices.push(i)
      }
    }

    return parentIndices
  }
}
