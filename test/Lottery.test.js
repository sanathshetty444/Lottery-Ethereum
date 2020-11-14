const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', async() => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });
  it('allows one account ',async()=>{
      await lottery.methods.enter().send({
        from:accounts[0],
        value:web3.utils.toWei('0.00000011','ether')

      })
      const players= await lottery.methods.getPlayers().call({
          from:accounts[0]
      })
      assert.equal(players[0],accounts[0])
      assert.equal(1,players.length)
  })
  it('allows multiple accounts ',async()=>{
        await lottery.methods.enter().send({
        from:accounts[0],
        value:web3.utils.toWei('0.00000011','ether')

        })
        await lottery.methods.enter().send({
        from:accounts[1],
        value:web3.utils.toWei('0.00000011','ether')

        })
        const players= await lottery.methods.getPlayers().call({
            from:accounts[0]
        })
        assert.equal(players[0],accounts[0])
        assert.equal(players[1],accounts[1])
        assert.equal(2,players.length)
    })
    it('requires minimum amount',async()=>{
        try{
            await lottery.methods.enter().send({
                from:accounts[0],
                value:web3.utils.toWei('0.000000','ether')
        
              })
              assert(false)
            //   this assert bcz if try block executes then it will 
            // contradict the case 
        }
        catch(e){
            assert.ok(e)
        }
    })
    it('only manager can call',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1],
            })
            assert(false)
            //   this assert bcz if try block executes then it will 
            // contradict the case 
        }
        catch(e){
            assert.ok(e)
        }
    });
    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei('2', 'ether')
        });
    
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        console.log(await web3.eth.getBalance(lottery.options.address))
        assert(difference > web3.utils.toWei('1.8', 'ether'));
      });


});