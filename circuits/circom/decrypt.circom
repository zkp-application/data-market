include "../node_modules/circomlib/circuits/mimc.circom";
include "../node_modules/circomlib/circuits/escalarmulany.circom";

template Decrypt(n) {
    signal input msg[n + 1];
    signal input private_key;
    signal output out[n];

    component hasher[n];

    for (var i = 0; i< n; i++) {
        hasher[i] = MiMC7(91);
        hasher[i].x_in <== private_key;
        hasher[i].k <== msg[0] + i;
        out[i] <== msg[i + 1] - hasher[i].out;
    }
}
