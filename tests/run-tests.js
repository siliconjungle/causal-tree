import { run, run as runLocalOrderTest } from './local-order-test.js'
import { run as runLatestSeqsTest } from './latest-seqs-test.js'
import { run as runCausalTreeTest } from './causal-tree-test.js'

runLocalOrderTest()
runLatestSeqsTest()
runCausalTreeTest()
