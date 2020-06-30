let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:

const generateTarget = ()=> Math.floor(Math.random()*10);
//console.log(generateTarget());

//console.log(generateTarget());

const getAbsoluteDistance = (tar, act)=> Math.abs(tar-act)

const compareGuesses=(humanGuess, computerGuess, targetNumber)=>{
  if (humanGuess<0 || humanGuess>9){
    alert("Invalid Input");
    return
  }
  var disOfHuman = getAbsoluteDistance(targetNumber,humanGuess);
  var disOfComputer = getAbsoluteDistance(targetNumber,computerGuess);
  
  if (disOfHuman<=disOfComputer){
    return true;
  }
  return false;
};

//console.log(compareGuesses(1,2,3));


const updateScore = (winner)=>{
  winner = winner.toLowerCase();
  if (winner === 'human'){
    humanScore+=1;
  }
  else{
    computerScore+=1;
  }
};

updateScore('computer');
updateScore('human');

//console.log(computerScore);
//console.log(humanScore);

const advanceRound = () => {
  currentRoundNumber+=1;
};

advanceRound();
//console.log(currentRoundNumber);


