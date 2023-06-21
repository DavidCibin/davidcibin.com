Play it here [here](http://davidcibin.com/)

# Western Tic-Tac-Toe

This is my first project using HTML CSS and JavaScript

<img src="/images/ttt-print.png" alt="print" border="0">

PSEUDOCODE

* Define the required constants:
  * Define a colors object with keys of 'null' (when the square is empty) and players 1 & -1. The value assigned to each key represents the color to display for an empty square (null), player 1, and player -1.
  * Define the 8 possible winning combinations, each containing three indexes of the board that make a winner if they hold the same player value.

* Define the required variables used to track the state of the game:
  * Use a board array to represent the squares.    
  * Use a turn variable to remember whose turn it is.
  * Use a winner variable to represent three different possibilities - a player that won, a tie, or a game in play.


* Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable, and performant:
  * Store the 9 elements that represent the squares on the page.

* Upon loading, the app should:
  * Initialize the state variables:
    * Initialize the board array to 9 nulls to represent empty squares. The 9 elements will "map" to each square, where index 0 maps to the top-left square and index 8 maps to the bottom-right square.
    * Initialize whose turn it is to 1 (player 'X'). Player 'O' will be represented by -1.
    * Initialize winner to null to represent that there is no winner or tie yet. Winner will hold the player value (1 or -1) if there's a winner. Winner will hold a 'T' if there's a tie. 
  * Render those state variables to the page:
    * Render the board:
      * Loop over each of the 9 elements that represent the squares on the page, and for each iteration:
      * Use the index of the iteration to access the mapped value from the board array.
      * Set the background color of the current element by using the value as a key on the colors lookup object (constant.
    * Render a message:
      * If winner has a value other than null (game still in progress), render whose turn it is - use the color name for the player, converting it to upper case.
      * If winner is equal to 'T' (tie), render a tie message.
      * Otherwise, render a congratulatory message to which player has won - use the color name for the player, converting it to uppercase.
  * Wait for the user to click a square

* Handle a player clicking a square:
  * Obtain the index of the square that was clicked by either:
    * "Extracting" the index from an id assigned to the element in the HTML, or
    * Looping through the cached square elements using a for loop and breaking out when the current square element equals the event object's target.
  * If the board has a value at the index, immediately return because that square is already taken.
  * If winner is not null, immediately return because the game is over.
  * Update the board array at the index with the value of turn.
  * Flip turns by multiplying turn by -1 (flips a 1 to -1, and vice-versa).
  * Set the winner variable if there's a winner:
    * Loop through the each of the winning combination arrays defined.
    * Total up the three board positions using the three indexes in the current combo.
    * Convert the total to an absolute value (convert any negative total to positive).
    * If the total equals 3, we have a winner! Set winner to the board's value at the index specified by the first index in the combo array. Exit the loop.
  * If there's no winner, check if there's a tie:
    * Set winner to 'T' if there are no more nulls in the board array.
  * All state has been updated, so render the state to the page (step 4.2).
        

* Handle a player clicking the "new game" button:
  * Do steps 4.1 (initialize the state variables) and 4.2 (render).
