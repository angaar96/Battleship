"use strict";

var allPlayerButtons = document.querySelectorAll(".battleship-game__Player-grid__buttons");
var allGuessButtons = document.querySelectorAll(".battleship-game__Guess-grid__buttons"); // Function defined separately so I can use removeEventListener later to lock in ship choices (not possible with anonymous functions) 

function chooseShips(event) {
  event.target.classList.toggle("ship-location-choice");
}

allPlayerButtons.forEach(function (coordinate) {
  coordinate.addEventListener("click", chooseShips);
});
allGuessButtons.forEach(function (button) {// Add event listener and then if statement within the callback. If button clicked on is within object containing the other board, then color it green. otherwise red. 
  // button.addEventListener("mousedown", buttonPress)
  // button.addEventListener("mouseup", buttonUnpress)
}); // Lock ship choices in after "Start Game" is pressed. 

var startGameButton = document.querySelector(".battleship-game__info__start-game-button");
startGameButton.addEventListener("click", function (event) {
  allPlayerButtons.forEach(function (coordinate) {
    coordinate.removeEventListener("click", chooseShips);
  });
});