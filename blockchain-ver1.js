const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash(){
        return SHA256(this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.transactions)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Blog mined: "+ this.hash);
    }
}

class Transaction{
    constructor(sender, receiver, amount){
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
    }
}

class Blockchain{
    constructor(){
        this.difficulty = 4;
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    
    createGenesisBlock(){
        return new Block("20-05-2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[(this.chain.length) - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransaction(minerAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block successfuly mined");
        this.chain.push(block);
        //assuming all the pending transactions are added in the mined block
        //the reward awarded to the miner is also a transaction
        //creating this new transaction
        this.pendingTransactions = [
            //the new coins created does not have a sender
            new Transaction(null, minerAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address){
        let balance = 0;
        for (let block of this.chain){
            for(let trans of block.transactions){
                if (trans.sender === address){
                    balance -= trans.amount;
                }
                if (trans.receiver === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

myCoin.createTransaction(new Transaction("address-1", "address-2", 59));
console.log("Start Mining....")
myCoin.minePendingTransaction("minerAddress");
console.log("Balance of miner: " + myCoin.getBalanceofAddress("minerAddress"));

//note that for miner
//after mining the first block
//his balance will be 0 which is the starting amount
//his reward will be in the pendingtransaction as of now
//and can only be reflected when another block is mined

myCoin.createTransaction(new Transaction("address-3", "address-4", 117));
console.log("Start Mining....")
myCoin.minePendingTransaction("minerAddress");
console.log("Balance of miner: " + myCoin.getBalanceofAddress("minerAddress"));


// console.log("Mining Block 1....")
// myCoin.addBlock(new Block(1, "21-05-21", {amount: 11}));

// console.log("Mining Block 2....")
// myCoin.addBlock(new Block(2, "22-05-21", {amount: 36}));

// console.log(JSON.stringify(myCoin, null, 4));
// console.log("Is chain valid?: "+ myCoin.isValidChain());
// myCoin.chain[1].data = {amount: 108};
// console.log("Is chain valid?: "+ myCoin.isValidChain());


