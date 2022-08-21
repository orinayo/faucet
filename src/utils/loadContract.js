import contract from "@truffle/contract";

const loadContract = async (contractName, provider) => {
  const Artifact = await (
    await fetch(`/contracts/${contractName}.json`)
  ).json();
  const _contract = contract(Artifact);
  _contract.setProvider(provider);
  const deployedContract = await _contract.deployed();
  return deployedContract;
};

export default loadContract;
