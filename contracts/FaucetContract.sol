// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint256 public numOfFunders;

    mapping(address => bool) public funders;
    mapping(uint256 => address) public lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 Ether"
        );
        _;
    }

    // called when you make a transaction that doesn't specify function name to call
    receive() external payable {}

    // override - indicates a function implemented from an abstract contract
    // pure - indicates the function won't read/alter the storage state
    function emitLog() public pure override returns (bytes32) {
        return "Hello World";
    }

    // function transferOwnership(address newOwner) external onlyOwner {
    //     owner = newOwner;
    // }

    // external functions can be called via contracts and other transactions
    function addFunds() external payable override {
        address funder = msg.sender;

        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdrawFunds(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    // private - accessible only within the contract
    // internal - accessible only within the contract and derived contract

    // view - it indicates the function will not alter the storage state. read-only calls, no gas fee
    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}
