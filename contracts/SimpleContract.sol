pragma solidity ^0.5.0;

contract SimpleContract{
    uint public balance;

    function setBalance(uint _balance) public{
        balance = _balance;
    }

  
}