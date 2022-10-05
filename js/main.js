
class Player {
    constructor(chips){
        this._chips = chips;
    }
    _hand = []
    _handValue = 0

    get getChips(){
        return this._chips;
    }
    set setChips(n){
        this._chips = n;
    }

    get getHand(){
        return this._hand;
    }
    set setHand(arr){
        this._hand = arr;
    }

    get getHandValue(){
        return this._handValue;
    }

    addToHand(arr){
        this._hand = this._hand.concat(arr);
    }
    updateChips(num){
        this._chips += num;
    }

    calcValue(){

        if (this._hand.length == 0) return 0;

        let hand = this._hand.slice();
        
        //get number of aces
        let numOfAces = 0;
        for (let i = 0; i < hand.length; i++){
            if (hand[i] === 'A') numOfAces++;
        }

        // get value of cards that are not aces
        let val = 0;
        for (let i = 0; i < hand.length; i++){
            if (Number(hand[i])){
                val += Number(hand[i]);
            } else if (hand[i] !== 'A'){
                val += 10;
            }
        }

        // handles ace values
        if (numOfAces > 0){
            if (val + 11 + (numOfAces - 1) <= 21){
                val += 11 + (numOfAces - 1);
            } else {
                val += numOfAces;
            }
        }
        this._handValue = val;
        return val;
    }

}

let player = new Player(100);
let dealer = new Player(0);

// deck and deck related functions
const Deck = (() => {

    const _numOfDecks = 1;

    // returns array of cards with number of decks specified
    // all values in array are strings
    function initDeck(num){
        let deck = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        return [].concat(... new Array(num * 4).fill(deck));
    }

    // randomizes order of items in array
    // uses Fisher-Yates
    function shuffleDeck(array){
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    function initShuffledDeck(num){
        return shuffleDeck(initDeck(num));
    }

    let deck = initShuffledDeck(_numOfDecks);

    // returns array of card values
    // reshuffles new decks if run out
    function drawCards(numOfCards){
        if (deck.length < numOfCards){

            if (deck.length == 0){
                deck = Deck.initShuffledDeck(_numOfDecks);
                return deck.splice(0, numOfCards);
            }

            // add rest of deck to array
            let arr = [];
            numOfCards -= deck.length;
            arr = deck.splice(0,deck.length);

            // set deck to new shuffled deck
            deck = Deck.initShuffledDeck(_numOfDecks);

            // pull remaining cards
            for(let i = 0; i < numOfCards; i++){
                arr.push(deck.pop());
            }
            return arr;

        } else {
            return deck.splice(0,numOfCards);
        }
    }


    return {
        deck,
        drawCards
    }
})();


// handles any ui/ux side updates
const DisplayCtrl = (() => {

    // takes hands from player/dealer objs and displays cards in html
    function updateCardDisplay(){
        const dealerArea = document.querySelector('.dealer-cards');
        const playerArea = document.querySelector('.player-cards');
        dealerArea.innerHTML = '';
        playerArea.innerHTML = '';

        for (let i = 0; i < dealer.getHand.length; i++){
            if (i == 0){
                dealerArea.innerHTML += `<div class="card">?</div>`
            } else {
                dealerArea.innerHTML += `<div class="card">${dealer.getHand[i]}</div>`
            }
        }
        for (let i = 0; i < player.getHand.length; i++){
            playerArea.innerHTML += `<div class="card">${player.getHand[i]}</div>`
        }
    }

    function revealDealerCards(){
        const dealerArea = document.querySelector('.dealer-cards');
        dealerArea.innerHTML = '';
        for (let i = 0; i < dealer.getHand.length; i++){
                dealerArea.innerHTML += `<div class="card">${dealer.getHand[i]}</div>`
        }
    }

    // changes console between different states
    // 0: betting, 1: playing, 2: roundEnd
    function changeConsole(num){
        const betting = document.querySelector('.betting');
        const playing = document.querySelector('.playing');
        const roundEnd = document.querySelector('.round-end');

        let arr = [betting, playing, roundEnd];

        for (let i = 0; i < arr.length; i++){
            if (i === num){
                arr[i].classList.remove('inactive');
            } else {
                arr[i].classList.add('inactive');
            }
        }
    }

    return {
        updateCardDisplay,
        revealDealerCards,
        changeConsole
    }
})();




// where the magic happens
const GameCtrl = (() => {

    /////////////////////////////////////////////
    //             BETTING STAGE               //
    /////////////////////////////////////////////


    /////////////////////////////////////////////
    //             PLAYING STAGE               //
    /////////////////////////////////////////////


    function newRound(){
        //draw cards
        dealer.addToHand(Deck.drawCards(2));
        player.addToHand(Deck.drawCards(2));

        dealer.setHandValue = calcValue(dealer.getHand);
        player.setHandValue = calcValue(player.getHand);

        //check for natural blackjack


    }

    function hit(){
        //add 1 card to hand
        player.addToHand(Deck.drawCards(2));
        //get new hand value
        player.calcValue();

        //check for bust
        //if bust, change console to round-end
        if(player.getHandValue > 21){
            console.log('Bust!');
        }
    }

    function stand(){
        // make console inactive
        // trigger dealer turn
    }

    // event listeners
    const hitBtn = document.querySelector('.hit');
    hitBtn.addEventListener('click',hit);

    const standBtn = document.querySelector('.stand');
    standBtn.addEventListener('click',stand);


    /////////////////////////////////////////////
    //                 ROUND END               //
    /////////////////////////////////////////////


})();



//game flow

//player places bet
//deal cards

//player chooses to hit or stand
//player can hit until bust

//after player stands, dealer hits/stands with the following logic:
//if cards value is less than 17, hit until at or above seventeen, else stand

//reveal dealerhand

// round over