// Some variables that are used multiple times in different places. 

let allPlayerButtons = document.querySelectorAll(".battleship-game__Player-grid__buttons");
let allGuessButtons = document.querySelectorAll(".battleship-game__Guess-grid__buttons");
let gameLogPlayer = document.querySelector(".battleship-game__info__log-content-player");
let gameLogOpponent = document.querySelector(".battleship-game__info__log-content-opponent");
let playerGrid = document.querySelector(".battleship-game__Player-grid");
let opponentGrid = document.querySelector(".battleship-game__Guess-grid")


// Function defined separately so I can use removeEventListener later to lock in ship choices (not possible with anonymous functions)

function chooseShips(event) {
  event.target.classList.toggle("ship-location-choice");
}

allPlayerButtons.forEach(coordinate => {
  coordinate.addEventListener("click", chooseShips)
})

// Event listener to start the game 
const startGameButton = document.querySelector(".battleship-game__info__start-game-button"); 
startGameButton.addEventListener("click", runGame);

function runGame() {
  // Lock ship choices in after "Start Game" is pressed. 
  allPlayerButtons.forEach(coordinate => {
    coordinate.removeEventListener("click", chooseShips);
  })
  let gameLogTitle = document.querySelector(".battleship-game__info__log-title");
  startGameButton.classList.add("game-started"); 
  // Store your ship choices.
  let playerShips = document.querySelectorAll(".ship-location-choice"); // Note this returns a node list. We need to use the spread operator to turn this into an array so that we can use the .filter or .map array iteration methods.
  let playerShipsIdArray = [...playerShips].map(ship => {return ship.id}); // Make new array with all ship choices 
  const numberOfShips = playerShipsIdArray.length; // Get number of ships (used to make an equal number of ships for opponent) 
  const playerBoardIdArray = [...allPlayerButtons].map(coordinate => {
    return coordinate.id;
  }); 
  let opponentBoardIdArray = [...allGuessButtons].map(button => {return button.id});
  let opponentShipsIndexArray = []; // Make this equal to an array containing indexes chosen randomly from 0-100. Amount of indexes generated is equal to number of ships chosen by the player. 
  // Use a for loop to generate this. 
  for (i=0; i<numberOfShips; i++) {
    opponentShipsIndexArray.push(Math.floor(Math.random() * 100));
  }
  let opponentShipsIdArray = opponentShipsIndexArray.map(index => {
    return opponentBoardIdArray[index];
  })
  console.log(opponentShipsIdArray);
  allGuessButtons.forEach(coordinate => {
    coordinate.addEventListener("click", (e) => {
      handlePlayerGuess(opponentShipsIdArray, e.target.id, e.target.classList); // Handle player guess
      setTimeout(handleOpponentGuess(playerShipsIdArray, playerBoardIdArray), 1000); // Handle opponent guess, which is delayed slightly. 
    });
  })
}

// Handle player guess section 

const handlePlayerGuess = (shipsArr, id, classList) => {
  // 1. Determine if it's a hit
  const isHit = isValidHitOnOpponent(shipsArr, id); 
  // 2. For valid hits, remove it from the array and display it on the game log. 
  if (isHit) {
    removeOpponentShip(shipsArr, id, classList);
    classList.toggle("ship-guess-choice-success");
    gameLogPlayer.style.color = "green";
    gameLogPlayer.innerHTML = "<h3> You got a hit! </h3>";
  } else {
    classList.toggle("ship-guess-choice-fail");
    gameLogPlayer.innerHTML = "<h3> You missed! </h3>";
    gameLogPlayer.style.color = "red";
  }
  // 3. If The array length is zero - They have no more ships left - they loose!
  if (shipsArr.length == 0) {
    gameLogPlayer.innerHTML = "<h3> Well Done. You have won Battleship! <br> Your grand prize is: Nothing. </h3>";
    gameLogOpponent.innerHTML = "";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden"
  } 
}

const isValidHitOnOpponent = (shipsArr, id) => {
  if (shipsArr.includes(id)) {
    return true;
  } else {
    return false;
  }
}

const removeOpponentShip = (shipsArr, id) => {
  let index = shipsArr.indexOf(id);
  shipsArr.splice(index, 1);
  return index > -1;
}

// Handle opponent guess section

const handleOpponentGuess = (shipsArr, playerBoardArray) => {
  // 0. Get the computer to generate a guess (done here to allow scope access later on)
  // Generate a random index from 0-100
  let randomOpponentGuessIndex = Math.floor(Math.random() * playerBoardArray.length);
  // // Generate a random player coordinate ID using this index. 
  let randomOpponentIdGuess = playerBoardArray[randomOpponentGuessIndex]; // This has to run everytime the opponent guesses. Therefore, it's placed here. 
  // 1. Determine if it's a hit
  const isHit = isValidHitOnPlayer(shipsArr, randomOpponentIdGuess); 
  // 2. For valid hits, remove it from the array and display it on the game log.
  if (isHit) {
    removePlayerShip(shipsArr, randomOpponentIdGuess);
    document.querySelector(`#${randomOpponentIdGuess}`).classList.toggle("ship-guess-choice-success");
    gameLogOpponent.style.color = "red";
    gameLogOpponent.innerHTML = "<h3> You opponent hit you! </h3>";
    
  } else {
    document.querySelector(`#${randomOpponentIdGuess}`).classList.toggle("ship-guess-choice-fail");
    gameLogOpponent.innerHTML = "<h3> Your opponent missed! </h3>";
    gameLogOpponent.style.color = "green";
  }
  // 3. If The array length is zero - You have no ships left - You lose!
  if (shipsArr.length == 0) {
    gameLogOpponent.innerHTML = "<h3> Oh no! All your ships are sunk and you have lost Battleship. <br> Better luck next time! </h3>";
    gameLogOpponent.style.color = "red";
    gameLogPlayer.innerHTML = "";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden"
  }
  // 4. Stop guesses from being guessed again
  playerBoardArray.splice(randomOpponentGuessIndex, 1); // Remove the current guess from the player board array.  
}

const isValidHitOnPlayer = (shipsArr, IdGuess) => {
  if (shipsArr.includes(IdGuess)) {
    return true;
  } else {
    return false;
  }
}

const removePlayerShip = (shipsArr, IdGuess) => {
  let index = shipsArr.indexOf(IdGuess);
  shipsArr.splice(index, 1); // Remove ship from player ships array
  return index > -1;
}