// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
        uint256 status; // 0: Created, 1: Shipped, 2: Delivered
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint256 id, string name, uint256 price, address owner);
    event ProductShipped(uint256 id, address owner);
    event ProductDelivered(uint256 id, address owner);

    function createProduct(string memory _name, uint256 _price) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, 0);
        emit ProductCreated(productCount, _name, _price, msg.sender);
    }

    function shipProduct(uint256 _id) public {
        require(products[_id].owner == msg.sender, "Only the owner can ship the product.");
        products[_id].status = 1;
        emit ProductShipped(_id, msg.sender);
    }

    function deliverProduct(uint256 _id) public {
        require(products[_id].owner == msg.sender, "Only the owner can deliver the product.");
        products[_id].status = 2;
        emit ProductDelivered(_id, msg.sender);
    }
}