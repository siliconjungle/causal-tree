// This allows you to reference longer strings by an index and vice versa.
export class LocalOrder {
  constructor() {
    this.ids = []
    this.indices = {}
  }

  addId(id) {
    this.indices[id] = this.ids.length
    this.ids.push(id)

    return this.indices[id]
  }

  hasId(id) {
    return this.indices[id] !== undefined
  }

  getIndexById(id) {
    return this.indices[id]
  }

  getIdByIndex(index) {
    return this.ids[index]
  }

  hasIndex(index) {
    return this.ids[index] !== undefined
  }
}
