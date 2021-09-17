"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Some variables that are used multiple times in different places. 
var allPlayerButtons = document.querySelectorAll(".Player-grid__buttons");
var allGuessButtons = document.querySelectorAll(".Guess-grid__buttons");
var gameLogPlayer = document.querySelector(".battleship-game__info__log-content-player");
var gameLogOpponent = document.querySelector(".battleship-game__info__log-content-opponent");
var playerGrid = document.querySelector(".Player-grid");
var opponentGrid = document.querySelector(".Guess-grid");
var gameInstructions = document.querySelector(".battleship-game__info__header");
var boardHeaders = document.querySelectorAll(".battleship-game__headers");
var startGameButton = document.querySelector(".battleship-game__info__start-game-button"); // This function is defined separately so I can use removeEventListener later to lock in ship choices (not possible with anonymous functions)

function chooseShips(event) {
  event.target.classList.toggle("ship-location-choice");
}

allPlayerButtons.forEach(function (coordinate) {
  coordinate.addEventListener("click", chooseShips);
}); // Event listener to start the game 

startGameButton.addEventListener("click", runGame);

function gameSetup() {
  // Remove start game button after game is started.  
  startGameButton.classList.add("game-started"); // Lock ship choices in after "Start Game" is pressed. 

  allPlayerButtons.forEach(function (coordinate) {
    coordinate.removeEventListener("click", chooseShips);
  });
}

function generateGameComponents() {
  // Store player ship choices.
  var playerShips = document.querySelectorAll(".ship-location-choice"); // Note this returns a node list. We need to use the spread operator to turn this into an array so that we can use the .filter or .map array iteration methods.

  var playerShipsIdArray = _toConsumableArray(playerShips).map(function (ship) {
    return ship.id;
  }); // Make new array with all ship choices 


  var numberOfShips = playerShipsIdArray.length; // Get number of ships (used to make an equal number of ships for opponent) 

  var playerBoardIdArray = _toConsumableArray(allPlayerButtons).map(function (coordinate) {
    return coordinate.id;
  });

  var opponentBoardIdArray = _toConsumableArray(allGuessButtons).map(function (button) {
    return button.id;
  });

  var opponentShipsIndexArray = []; // This will be an array generated with a for loop to containing indexes chosen randomly from 0-100. 
  // The amount of indexes generated will be equal to the number of ships chosen by the player. 

  for (i = 0; i < numberOfShips; i++) {
    opponentShipsIndexArray.push(Math.floor(Math.random() * 100));
  }

  var opponentShipsIdArray = opponentShipsIndexArray.map(function (index) {
    return opponentBoardIdArray[index];
  });
  var gameComponentsObj = {
    "playerShipsIdArray": playerShipsIdArray,
    "playerBoardIdArray": playerBoardIdArray,
    "opponentShipsIdArray": opponentShipsIdArray
  };
  console.log(opponentShipsIdArray);
  return gameComponentsObj;
}

function gameLogic(gameComponents) {
  allGuessButtons.forEach(function (coordinate) {
    coordinate.addEventListener("click", function (e) {
      handlePlayerGuess(gameComponents.opponentShipsIdArray, e.target.id, e.target.classList); // Handle player guess

      setTimeout(handleOpponentGuess(gameComponents.playerShipsIdArray, gameComponents.playerBoardIdArray), 1000); // Handle opponent guess, which is delayed slightly. 
    });
  });
}

function runGame() {
  gameSetup();
  var gameComponents = generateGameComponents();
  gameLogic(gameComponents);
} // Handle player guess section 


var handlePlayerGuess = function handlePlayerGuess(shipsArr, id, classList) {
  // 1. Determine if it's a hit
  var isHit = isValidHitOnOpponent(shipsArr, id); // 2. For valid hits, remove it from the array and display it on the game log. 

  if (isHit) {
    removeOpponentShip(shipsArr, id, classList);
    classList.toggle("ship-guess-choice-success");
    gameLogPlayer.style.color = "green";
    gameLogPlayer.innerHTML = "<h3> You got a hit! </h3>";
  } else {
    classList.toggle("ship-guess-choice-fail");
    gameLogPlayer.innerHTML = "<h3> You missed! </h3>";
    gameLogPlayer.style.color = "red";
  } // 3. If The array length is zero - They have no more ships left - they loose!


  if (shipsArr.length == 0) {
    gameLogPlayer.innerHTML = "<h3> Well Done. You have won Battleship! <br> Your grand prize is: Nothing. </h3>";
    gameLogOpponent.innerHTML = "";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden";
    gameInstructions.style.visibility = "hidden";
    boardHeaders.forEach(function (header) {
      header.style.visibility = "hidden";
    });
  }
};

var isValidHitOnOpponent = function isValidHitOnOpponent(shipsArr, id) {
  if (shipsArr.includes(id)) {
    return true;
  } else {
    return false;
  }
};

var removeOpponentShip = function removeOpponentShip(shipsArr, id) {
  var index = shipsArr.indexOf(id);
  shipsArr.splice(index, 1);
  return index > -1;
}; // Handle opponent guess section


var handleOpponentGuess = function handleOpponentGuess(shipsArr, playerBoardArray) {
  // 0. Get the computer to generate a guess (done here to allow scope access later on)
  // Generate a random index from 0-100
  var randomOpponentGuessIndex = Math.floor(Math.random() * playerBoardArray.length); // // Generate a random player coordinate ID using this index. 

  var randomOpponentIdGuess = playerBoardArray[randomOpponentGuessIndex]; // This has to run everytime the opponent guesses. Therefore, it's placed here. 
  // 1. Determine if it's a hit

  var isHit = isValidHitOnPlayer(shipsArr, randomOpponentIdGuess); // 2. For valid hits, remove it from the array and display it on the game log.

  if (isHit) {
    removePlayerShip(shipsArr, randomOpponentIdGuess);
    document.querySelector("#".concat(randomOpponentIdGuess)).classList.toggle("ship-guess-choice-success");
    gameLogOpponent.style.color = "red";
    gameLogOpponent.innerHTML = "<h3> You opponent hit you! </h3>";
  } else {
    document.querySelector("#".concat(randomOpponentIdGuess)).classList.toggle("ship-guess-choice-fail");
    gameLogOpponent.innerHTML = "<h3> Your opponent missed! </h3>";
    gameLogOpponent.style.color = "green";
  } // 3. If the array length is zero - You have no ships left - You lose!


  if (shipsArr.length == 0) {
    gameLogOpponent.innerHTML = "<h3> Oh no! All your ships are sunk and you have lost Battleship. <br> Better luck next time! </h3>";
    gameLogOpponent.style.color = "red";
    gameLogPlayer.innerHTML = "";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden";
    gameInstructions.style.visibility = "hidden";
    boardHeaders.forEach(function (header) {
      header.style.visibility = "hidden";
    });
  } // 4. Stop guesses from being guessed again


  playerBoardArray.splice(randomOpponentGuessIndex, 1); // Remove the current guess from the player board array.  
};

var isValidHitOnPlayer = function isValidHitOnPlayer(shipsArr, IdGuess) {
  if (shipsArr.includes(IdGuess)) {
    return true;
  } else {
    return false;
  }
};

var removePlayerShip = function removePlayerShip(shipsArr, IdGuess) {
  var index = shipsArr.indexOf(IdGuess);
  shipsArr.splice(index, 1); // Remove ship from player ships array

  return index > -1;
};