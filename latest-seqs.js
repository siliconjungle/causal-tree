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

  // ok uhm... it can't just be the parent indices right...?
  // doesn't it need to be the global sequence numbers?
  getNextParentIndices () {
    console.log('this.seqs', this.seqs)
    console.log('this.mergedSeqs', this.mergedSeqs)
    const parentIndices = []

    for (let i = 0; i < this.seqs.length; ++i) {
      const seq = this.seqs[i]
      const mergedSeq = this.mergedSeqs[i]

      const diff = seq - mergedSeq

      if (diff > 0) {
        parentIndices.push(i)
      }
    }

    console.log('parentIndices', parentIndices)

    return parentIndices
  }
}
