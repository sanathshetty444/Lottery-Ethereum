import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import lottery from './lottery'
import React,{useEffect} from 'react'
function App() {
  const [manager,setManager]=React.useState('')
  const [players,setPlayers]=React.useState([])
  const [balance,setBalance]=React.useState('')
  const [input_val,setInput_val]=React.useState(0)
  const [message,setMessage]= React.useState("")
  web3.eth.getAccounts().then(console.log)
  
  useEffect(()=>{
    async function fetchData(){
      const manager=await lottery.methods.manager().call()
      const balancenew = await web3.eth.getBalance(lottery.options.address)
      const playernew = await lottery.methods.getPlayers().call()
      setManager(manager)
      setPlayers(playernew)
      setBalance(balancenew)

    }
    fetchData();
    
  },[])
  async function ONSubmit(e){
    e.preventDefault();
   
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on Transaction Success.....')
    const balancenew = await web3.eth.getBalance(accounts[0])
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>KOKOKOLOL",web3.utils.fromWei(balancenew,'ether'),accounts[0]);
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(input_val,'ether')
    })
    
    setMessage('You have been entered')

  }
  async function winner(e){
    e.preventDefault();
    console.log("CLICKED");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    })
    setMessage('Winner has been picked')

  }
  return (
    <div>  
      
      <h2>Lottery Contract</h2>
      <p>
        Managed By : {manager}
        There are {players.length} people entered, competing to win {web3.utils.fromWei(balance,'ether')}
      </p>

      <hr/>
      <form action="" onSubmit={ONSubmit }>
        <label htmlFor="">Amount to enter</label>
        <input type="number" value={input_val} onChange={(e)=>setInput_val(e.target.value)}/> 
        <button type='submit'>Enter</button>
      </form>


      <hr/>
        <h4>Pick A Winner</h4>
        <button onClick={winner}>PICK</button>
      <hr/>

      {message }

      

    </div>

  );
}

export default App;

