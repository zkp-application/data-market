jest.setTimeout(8000)
import {
    compileAndLoadCircuit,
    executeCircuit,
    getSignalByName,
} from '../'

import {
    IncrementalQuinTree,
    hashOne,
} from 'maci-crypto'

const LEVELS = 5
const ZERO_VALUE = 0

describe('Merkle Tree circuits', () => {
    describe('LeafExists', () => {
        let circuit

        beforeAll(async () => {
            circuit = await compileAndLoadCircuit('data_prove_test.circom')
        })

        it('Valid LeafExists inputs should work', async () => {
            let circuit  = await compileAndLoadCircuit('data_prove_test.circom')
            const tree = new IncrementalQuinTree(LEVELS, ZERO_VALUE, 2)
            const leaves: BigInt[] = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const elem = hashOne(BigInt(i))
                tree.insert(elem)
                leaves.push(elem)
            }

            const root = tree.root

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const proof = tree.genMerklePath(i)

                const circuitInputs = {
                    leaf: leaves[i],
                    path_elements: proof.pathElements,
                    path_index: proof.indices,
                    root: root,
                }

                const witness = await executeCircuit(circuit, circuitInputs)        
                const circuitRoot = getSignalByName(circuit, witness, 'main.root').toString()
                expect(circuitRoot).toEqual(root.toString())
            }
        })

        it('Invalid LeafExists inputs should not work', async () => {
            expect.assertions(2 ** LEVELS)

            let circuit  = await compileAndLoadCircuit('data_prove_test.circom')
            const tree = new IncrementalQuinTree(LEVELS, ZERO_VALUE, 2)
            const leaves: BigInt[] = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                let elem = hashOne(BigInt(i))
                tree.insert(elem)
                leaves.push(hashOne(elem))
            }

            const root = tree.root

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const proof = tree.genMerklePath(i)
                const root = tree.root

                const circuitInputs = {
                    leaf: leaves[i],
                    path_elements: proof.pathElements,
                    path_index: proof.indices,
                    root: root,
                }

                try {
                    await executeCircuit(circuit, circuitInputs)
                } catch {
                    expect(true).toBeTruthy()
                }

            }
        })
    })
})
