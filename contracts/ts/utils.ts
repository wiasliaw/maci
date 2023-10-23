interface SnarkProof {
    pi_a: bigint[];
    pi_b: bigint[][];
    pi_c: bigint[];
}

import { Contract } from 'ethers';
import {
    deployVkRegistry,
    deployTopupCredit,
    deployMaci,
    deployMessageProcessor,
    deployTally,
    deployMockVerifier,
    deployFreeForAllSignUpGatekeeper,
    deployConstantInitialVoiceCreditProxy,
} from './index'

const formatProofForVerifierContract = (
    _proof: SnarkProof,
) => {

    return ([
        _proof.pi_a[0],
        _proof.pi_a[1],

        _proof.pi_b[0][1],
        _proof.pi_b[0][0],
        _proof.pi_b[1][1],
        _proof.pi_b[1][0],

        _proof.pi_c[0],
        _proof.pi_c[1],
    ]).map((x) => x.toString())
}

const deployTestContracts = async (
    initialVoiceCreditBalance: number,
    gatekeeperContract?: Contract
) => {
    const mockVerifierContract = await deployMockVerifier(true)

    if (!gatekeeperContract) {
        gatekeeperContract = await deployFreeForAllSignUpGatekeeper(true)
    }

    const constantIntialVoiceCreditProxyContract = await deployConstantInitialVoiceCreditProxy(
        initialVoiceCreditBalance,
        true 
    )

    // VkRegistry
    const vkRegistryContract = await deployVkRegistry(true)
    const topupCreditContract = await deployTopupCredit(true)

    const {maciContract,stateAqContract,pollFactoryContract,poseidonAddrs} = await deployMaci(
        await gatekeeperContract.getAddress(),
        await constantIntialVoiceCreditProxyContract.getAddress(),
        await mockVerifierContract.getAddress(),
        await vkRegistryContract.getAddress(),
        await topupCreditContract.getAddress(),
        true
    )
    const mpContract = await deployMessageProcessor(await mockVerifierContract.getAddress(), poseidonAddrs[0],poseidonAddrs[1],poseidonAddrs[2],poseidonAddrs[3], true)
    const tallyContract = await deployTally(await mockVerifierContract.getAddress(), poseidonAddrs[0],poseidonAddrs[1],poseidonAddrs[2],poseidonAddrs[3], true)

    return {
        mockVerifierContract,
        gatekeeperContract,
        constantIntialVoiceCreditProxyContract,
        maciContract,
        stateAqContract,
        vkRegistryContract,
        mpContract,
        tallyContract,
    }
}

export {
    deployTestContracts,
    formatProofForVerifierContract,
}
