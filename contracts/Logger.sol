// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Any child contract inheriting this contract
// has to implement the specified methods
abstract contract Logger {
    function emitLog() public pure virtual returns (bytes32);
}
