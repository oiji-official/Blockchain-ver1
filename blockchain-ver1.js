const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Blog mined: "+ this.hash);
    }
}

class Blockchain{
    constructor(){
        this.difficulty = 4;
        this.chain = [this.createGenesisBlock()];
    }
    
    createGenesisBlock(){
        return new Block(0, "20-05-2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[(this.chain.length) - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isValidChain(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            return true;
        }
    }
}

let myCoin = new Blockchain();
console.log("Mining Block 1....")
myCoin.addBlock(new Block(1, "21-05-21", {amount: 11}));

console.log("Mining Block 2....")
myCoin.addBlock(new Block(2, "22-05-21", {amount: 36}));

// console.log(JSON.stringify(myCoin, null, 4));
// console.log("Is chain valid?: "+ myCoin.isValidChain());
// myCoin.chain[1].data = {amount: 108};
// console.log("Is chain valid?: "+ myCoin.isValidChain());


