import * as path from 'path'
import * as lineByLine from 'n-readlines'
import * as assert from 'assert'


const circom = require('circom')

const snarkParamsPath = path.isAbsolute(`../params/`)
    ? `../params/`
    : path.resolve(__dirname, `../params/`)


const compileAndLoadCircuit = async (
    circuitPath: string
) => {

    const circuit = await circom.tester(
        path.join(
            __dirname,
            `../circom/data_prove_test.circom`,
        ),
    )

    await circuit.loadSymbols()
    return circuit
}

const executeCircuit = async (
    circuit: any,
    inputs: any,
) => {
    const witness = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(witness)
    await circuit.loadSymbols()

    return witness
}

const getSignalByName = (
    circuit: any,
    witness: any,
    signal: string,
) => {

    return witness[circuit.symbols[signal].varIdx]
}

const getSignalByNameViaSym = (
    circuitName: any,
    witness: any,
    signal: string,
) => {
    const symPath = path.join(snarkParamsPath, `${circuitName}.sym`)
    const liner = new lineByLine(symPath)
    let line
    let index
    let found = false

    while (true) {
        line = liner.next()
        if (!line) { break }
        const s = line.toString().split(',')
        if (signal === s[3]) {
            index = s[1]
            found = true
            break
        }
    }

    assert(found)

    return witness[index]
}

export {
    compileAndLoadCircuit,
    executeCircuit,
    getSignalByName,
}