// Game Variables
var deck = [];
var dealerHand = [];
var player = 'You';
var playerHand = [];
var winner = '';



// Build Card Deck
function card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
}

function makeDeck() {
  this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  this.suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  let cards = [];
  // Create 52 cards
  for(var i = 0; i < this.suits.length; i++) {
    for(var j = 0; j < this.ranks.length; j++) {
      cards.push(new card(this.ranks[j], this.suits[i]));
    }
  }
  return cards;
}



// Display Game Objects
function displayCard(hand, index, faceUp=true) {
  if(faceUp) {
    return "<img class='cards' src='/img/card" + hand[index].suit + hand[index].rank + ".png' alt='" + hand[index].rank + " of " + hand[index].suit + "'> ";
  } else {
    return "<img class='cards' src='/img/cardBack_green2.png' alt='Face Down Card'> ";
  }
}

function displayPoints(selector, hand) {
  $(selector).text(': ' + calcPoints(hand));
}

// Gameplay Functions
function deal() {
  // Deal 2 cards to each player
  dealerHand.push(draw());
  dealerHand.push(draw());
  playerHand.push(draw());
  playerHand.push(draw());

  // Display the cards we just dealt
  $("#dealer-hand").append(displayCard(dealerHand, 0, false) + displayCard(dealerHand, 1));
  $("#player-hand").append(displayCard(playerHand, 0) + displayCard(playerHand, 1));
}

function draw() {
  return deck.pop();
}

function hit(hand, selector) {
    hand.push(draw());
    $(selector).append(displayCard(hand, (hand.length - 1)));
}

function shuffle() {
  // Return cards to deck, clear points
  dealerHand = [];
  playerHand = [];
  winner = '';
  $("#dealer-hand").empty();
  $("#dealer-points").empty();
  $("#player-hand").empty();
  $("#winner").empty();
  deck = makeDeck();
  // Shuffle the deck
  for(let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}




// Check for Win/Loss
function calcPoints(hand) {
  let ptsTotal = 0;
  let numAces = 0;
  hand.forEach(function(card) {
    if(card.rank === 'J' ||
    card.rank === 'Q' ||
    card.rank === 'K'
  ) {
    ptsTotal += 10;
  } else if (card.rank === 'A') {
    ptsTotal += 11;
    numAces += 1;
  } else {
    ptsTotal += parseInt(card.rank);
  }
  });

  ptsTotal = fixBust(hand, ptsTotal, numAces);
  return ptsTotal;
}

function fixBust(hand, pts, aces) {
  // If player busts with ace(s), change pt value from 11 to 1
  // for each ace until pts < 21 OR no aces left to change.
  while(aces && pts > 21) {
    pts -= 10;
    aces -= 1;
  }
  return pts;
}

function checkWinner() {
  let dealerPts = calcPoints(dealerHand);
  let playerPts = calcPoints(playerHand);
  if(dealerPts > 21 && playerPts > 21) {
    return 'Nobunny';
  } else if(dealerPts > 21) {
    return player;
  } else if(playerPts > 21) {
    return 'Dealer';
  } else if(dealerPts > playerPts) {
    return 'Dealer';
  } else if(dealerPts < playerPts) {
    return player;
  } else if(dealerPts === playerPts) {
    return 'Nobunny';
  }
}

function endGame() {
    let winner = checkWinner();
    $("#winner").text(winner + " won! Click deal button to play again.");
    // Show hole card
    $("#dealer-hand img:first-child").replaceWith(displayCard(dealerHand, 0));
    displayPoints("#dealer-points", dealerHand);
}






// Play
$(document).ready(function() {
  shuffle();
  deal();
  displayPoints("#player-points", playerHand);

  $("#deal-button").click(function() {
    shuffle();
    deal();
    displayPoints("#player-points", playerHand);
  });

  $("#hit-button").click(function() {
    // Player's turn
    hit(playerHand, "#player-hand");
    displayPoints("#player-points", playerHand);
    if(calcPoints(playerHand) >= 21) {
      endGame();
    // Dealer's turn
    } else if(calcPoints(dealerHand) < 17) {
      hit(dealerHand, "#dealer-hand");
    }
  });

  $("#stand-button").click(function() {
    if(calcPoints(playerHand) === 21) {
      endGame();
    } else {
      while(calcPoints(dealerHand) < 17) {
        hit(dealerHand, "#dealer-hand");
      }
    }
    endGame();
  });

});
