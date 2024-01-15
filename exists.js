
// This maps out whether indices exist or not within a view.
// This is a list of booleans. The nice part is it run-length encodes well depending
// on the order in which you apply changes to the context.
// normal user behavior should likely touch the same file many times in a row.
// This should be used in the context of a causal tree view.
// The other way to represent this is to just store the latest index and then store the indices that exist.
export class Exists {
  constructor () {
    this.exists = []
    this.latestIndex = -1
  }

  add (index) {
    // loop from the latest index + 1 to the index we want to add.
    // set them all to false.
    // then set the index we want to true.
    for (let i = this.latestIndex + 1; i < index; i++) {
      this.exists[i] = false
    }

    this.exists[index] = true
    this.latestIndex = index
  }

  has (index) {
    return this.exists[index] ?? false
  }
}
