// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// similar to abstract contracts
// cannot inherit from contracts, only interfaces
// do not have constructors and state variables
// all declared functions have to be external
interface IFaucet {
    function addFunds() external payable;

    function withdrawFunds(uint256 withdrawAmount) external;
}
