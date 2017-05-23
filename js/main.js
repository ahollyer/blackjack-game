var deck = [];
var dealerHand = [];
var playerHand = [];
var bust = false;

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

function shuffle() {
  // Return cards to the deck
  dealerHand = [];
  playerHand = [];
  $("#dealer-hand").empty();
  $("#player-hand").empty();
  deck = makeDeck();
  // Shuffle the deck
  for(let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function draw() {
  return deck.pop();
}

function displayCard(hand, index, faceUp=true) {
  if(faceUp) {
    return "<img class='cards' src='/img/card" + hand[index].suit + hand[index].rank + ".png' alt='" + hand[index].rank + " of " + hand[index].suit + "'> "
  } else {
    return "<img class='cards' src='/img/cardBack_green2.png' alt='Face Down Card'> "
  }
}

function displayPoints(hand, selector) {
  let ptsTotal = 0;
  hand.forEach(function(card) {
    if(card.rank === 'J' ||
       card.rank === 'Q' ||
       card.rank === 'K'
    ) {
      ptsTotal += 10;
    } else if (card.rank === 'A') {
      ptsTotal += 11;
    } else {
      ptsTotal += parseInt(card.rank);
    }
  });

  $(selector).text(ptsTotal);
}

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

$(document).ready(function() {
  shuffle();
  deal();
  displayPoints(playerHand, "#player-points");

  $("#deal-button").click(function() {
    shuffle();
    deal();
    // Hide dealer points
    // displayPoints(dealerHand, "#dealer-points");
    displayPoints(playerHand, "#player-points");
  });

  $("#hit-button").click(function() {
    // Deal a card
    playerHand.push(draw());
    // Display card
    $("#player-hand").append(displayCard(playerHand, (playerHand.length - 1)));
    // Add points
    displayPoints(playerHand, "#player-points");
  });

});
