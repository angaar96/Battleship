let allPlayerButtons = document.querySelectorAll(".battleship-game__Player-grid__buttons");
let allGuessButtons = document.querySelectorAll(".battleship-game__Guess-grid__buttons")

// Function defined separately so I can use removeEventListener later to lock in ship choices (not possible with anonymous functions) 
function chooseShips(event) {
  event.target.classList.toggle("ship-location-choice");
}
allPlayerButtons.forEach(coordinate => {
  coordinate.addEventListener("click", chooseShips)
})

allGuessButtons.forEach(button => {
  // Add event listener and then if statement within the callback. If button clicked on is within object containing the other board, then color it green. otherwise red. 
  // button.addEventListener("mousedown", buttonPress)
  // button.addEventListener("mouseup", buttonUnpress)
})

// Lock ship choices in after "Start Game" is pressed. 

let startGameButton = document.querySelector(".battleship-game__info__start-game-button"); 

startGameButton.addEventListener("click", (event) => {
  allPlayerButtons.forEach(coordinate => {
    coordinate.removeEventListener("click", chooseShips)
  })
})

