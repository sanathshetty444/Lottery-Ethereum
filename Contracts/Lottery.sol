pragma solidity ^0.4.17; 

 
contract Lottery{
    address [] public players;
    address public manager;
    uint index;
    
    function Lottery() public {
        manager=msg.sender;
    }
    function enter() public payable{
        require(msg.value>0.0000001 ether);
        players.push(msg.sender);
    }
    function random() private view returns (uint){
        return uint(keccak256(block.difficulty,now,players));
    }
    function pickWinner() public restricted {
        index=random()%players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
        
    }
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    function getPlayers() public view returns (address[]) {
        return players;
    }
}