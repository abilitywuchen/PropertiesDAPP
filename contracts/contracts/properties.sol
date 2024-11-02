pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract properties is ERC721 {

    event PropertyOnSell(uint256 id, uint256 price, address owner);
    event PropertyDoNotSell(uint256 id);
    event PropertySold(uint256 id, address buyer);

    struct Property {
        uint256 id;
        address owner;
        bool on_sell;
        uint256 price;
        uint256 sell_start_time;
    }

    address organizer;

    mapping (uint256 => Property) properties_exist;
    uint256 next_property_id;

    constructor() ERC721("properties","PRP") {
        next_property_id = 0;
        organizer = msg.sender;
    }

    function newProperty(address to) external {
        _safeMint(to, next_property_id);
        properties_exist[next_property_id] = Property(next_property_id, to, false, 0, 0);
        next_property_id++;
    }

    function getMyProperties() external view returns (Property[] memory) {
        uint256 num = balanceOf(msg.sender);
        Property[] memory my_properties = new Property[](num);
        uint256 top = 0;
        for (uint256 i = 0; i < next_property_id; i++){
            if(ownerOf(i) == msg.sender){
                my_properties[top] = properties_exist[i];
                top++;
            }
        }
        return my_properties;
    }

    function getPropertiesOnSell() external view returns (Property[] memory) {
        uint256 num = 0;
        for(uint256 i = 0; i < next_property_id; i++){
            if(properties_exist[i].on_sell == true){
                num++;
            }
        }
        Property[] memory properties_on_sell = new Property[](num);
        uint256 top = 0;
        for(uint256 i = 0; i < next_property_id; i++){
            if(properties_exist[i].on_sell == true){
                properties_on_sell[top] = properties_exist[i];
                top++;
            }
        }
        return properties_on_sell;
    }
    
    function putPropertyOnSell(uint256 id, uint256 price) external returns (Property memory) {
        properties_exist[id].on_sell = true;
        properties_exist[id].price = price;
        properties_exist[id].sell_start_time = block.timestamp;
        emit PropertyOnSell(id,price,msg.sender);
        return properties_exist[id];
    }

    function cancelPropertySelling(uint256 id) external returns (Property memory) {
        properties_exist[id].on_sell = false;
        properties_exist[id].price = 0;
        properties_exist[id].sell_start_time = 0;
        emit PropertyDoNotSell(id);
        return properties_exist[id];
    }

    function buyProperty(uint256 id) external payable returns (Property memory){
        uint256 time_last = block.timestamp - properties_exist[id].sell_start_time;
        uint256 fee = properties_exist[id].price * time_last / 10000;
        uint256 max_fee = properties_exist[id].price * 5 / 100;
        if(fee > max_fee) fee = max_fee;
        payable(organizer).transfer(fee);
        payable(properties_exist[id].owner).transfer(properties_exist[id].price - fee);
        _transfer(properties_exist[id].owner,msg.sender,id);
        properties_exist[id].owner = msg.sender;
        properties_exist[id].on_sell = false;
        properties_exist[id].price = 0;
        properties_exist[id].sell_start_time = 0;
        emit PropertySold(id,msg.sender);
        return properties_exist[id];
    } 
}