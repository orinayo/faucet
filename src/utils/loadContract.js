import contract from "@truffle/contract";

const loadContract = async (contractName, provider) => {
  const Artifact = await (
    await fetch(`/contracts/${contractName}.json`)
  ).json();
  const _contract = contract(Artifact);
  _contract.setProvider(provider);
  let deployedContract = null;
  try {
    deployedContract = await _contract.deployed();
  } catch (error) {
    console.error("Cannot load the deployed contract")
  }
  return deployedContract;
};

export default loadContract;
