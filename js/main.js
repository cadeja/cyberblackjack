
class Player {
    constructor(chips){
        this._chips = chips;
    }
    _hand = []
    _handValue = 0
    _bet = 0

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

    get getBet(){
        return this._bet;
    }
    set setBet(n){
        if (n > this._chips){
            this._bet = this._chips;
        } else {
            this._bet = n;
        }
    }

    addToHand(arr){
        this._hand = this._hand.concat(arr);
        this.calcValue();
    }
    updateChips(num){
        this._chips += num;
    }

    resetHand(){
        this._hand = [];
        this._handValue = 0;
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

    let _deck = initShuffledDeck(_numOfDecks);

    // returns array of card values
    // reshuffles new decks if run out
    function drawCards(numOfCards){
        if (_deck.length < numOfCards){

            if (_deck.length == 0){
                _deck = initShuffledDeck(_numOfDecks);
                return _deck.splice(0, numOfCards);
            }

            // add rest of deck to array
            let arr = [];
            numOfCards -= _deck.length;
            arr = _deck.splice(0,_deck.length);

            // set deck to new shuffled deck
            _deck = initShuffledDeck(_numOfDecks);

            // pull remaining cards
            for(let i = 0; i < numOfCards; i++){
                arr.push(_deck.pop());
            }
            return arr;

        } else {
            return _deck.splice(0,numOfCards);
        }
    }

    function draw(numOfCards, player){
        player.addToHand(drawCards(numOfCards));
    }

    return {
        draw
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

    function updateChips(){
        const chips = document.querySelector('#chips');
        chips.textContent = player.getChips;
    }


    return {
        updateCardDisplay,
        revealDealerCards,
        changeConsole,
        updateChips
    }
})();




// where the magic happens
const GameCtrl = (() => {

    /////////////////////////////////////////////
    //             BETTING STAGE               //
    /////////////////////////////////////////////

    

    function betStage(){
        DisplayCtrl.changeConsole(0);
    }



    /////////////////////////////////////////////
    //             PLAYING STAGE               //
    /////////////////////////////////////////////


    function newRound(){
        //clear hands
        player.resetHand();
        dealer.resetHand();

        DisplayCtrl.changeConsole(1);

        DisplayCtrl.updateChips();

        //draw cards
        Deck.draw(2,dealer);
        Deck.draw(2,player);
        DisplayCtrl.updateCardDisplay();

        //check for natural blackjack
        if (dealer.getHandValue == 21 && player.getHandValue == 21){
            roundEnd('tie');
        }
        else if (dealer.getHandValue == 21){
            roundEnd('lose');
        }
        else if (player.getHandValue == 21){
            roundEnd('naturalwin');

            // payout 1.5x chips
        }

    }



    function hit(){
        //add 1 card to hand
        Deck.draw(1,player);
        DisplayCtrl.updateCardDisplay();
        //get new hand value
        player.calcValue();

        //check for bust
        //if bust, change console to round-end
        if(player.getHandValue > 21){
            bust();
        } else if (player.getHandValue == 21){
            blackjack();
        }
    }

    function stand(){
        DisplayCtrl.changeConsole(2);
        // trigger dealer turn
        dealerTurn();
    }

    // event listeners
    const hitBtn = document.querySelector('.hit');
    hitBtn.addEventListener('click',hit);

    const standBtn = document.querySelector('.stand');
    standBtn.addEventListener('click',stand);


    // DEALER LOGIC

    // 1s interval between dealer card pulls
    let dealerTimeout;
    function dealerTurn(){
        dealerTimeout = setInterval(dealerDraw, 1000);
    }
    function dealerDraw(){
        if (dealer.getHandValue < 17){
            Deck.draw(1,dealer);
            DisplayCtrl.updateCardDisplay();
        } else{
            clearInterval(dealerTimeout);

            if (dealer.getHandValue > 21){
                roundEnd('win');
            }

            else if (player.getHandValue > dealer.getHandValue){
                roundEnd('win');
            } else if (player.getHandValue < dealer.getHandValue){
                roundEnd('lose');
            } else if (player.getHandValue == dealer.getHandValue){
                roundEnd('tie');
            }
        }
    }


    /////////////////////////////////////////////
    //                 ROUND END               //
    /////////////////////////////////////////////

    function bust(){
        console.log('bust');
        roundEnd('lose');
    }


    function blackjack(){
        console.log('blackjack');
        dealerTurn();
    }

    function roundEnd(result){
        DisplayCtrl.revealDealerCards();

        switch(result){
            case 'win':
                console.log('you win the round');
                break;
            case 'naturalwin':
                console.log('natural blackjack! + 1.5x bet chips');
                break;
            case 'lose':
                console.log('dealer wins the round');
                break;
            case 'tie':
                console.log('you tie. Bet returned');
                break;
        }

        console.log('round end');
        DisplayCtrl.changeConsole(2);
        setTimeout(newRound, 3000);
    }


    //start game
    // newRound();
    DisplayCtrl.changeConsole(0);

})();