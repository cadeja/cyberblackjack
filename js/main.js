

let player = {
    _chips: 100,
    _hand: [],

    get getChips(){
        return this._chips;
    },
    set setChips(n){
        this._chips = n;
    },

    get getHand(){
        return this._hand;
    },
    set setHand(arr){
        this._hand = arr;
    },

    addToHand(arr){
        this._hand = this._hand.concat(arr);
    },
    updateChips(num){
        this._chips += num;
    }
}

let dealer = {
    _hand: [],

    get getHand(){
        return this._hand;
    },
    set setHand(arr){
        this._hand = arr;
    },

    addToHand(arr){
        this._hand = this._hand.concat(arr);
    },
}

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
            dealerArea.innerHTML += `<div class="card">${dealer.getHand[i]}</div>`
        }
        for (let i = 0; i < player.getHand.length; i++){
            playerArea.innerHTML += `<div class="card">${player.getHand[i]}</div>`
        }
    }


    return {
        updateCardDisplay
    }
})();




// where the magic happens
const GameCtrl = (() => {

    function calcValue(hand){
        
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
        return val;
    }

    function newRound(){
        dealer.setHand = Deck.drawCards(2);
        player.setHand = Deck.drawCards(2);

        DisplayCtrl.updateCardDisplay();
    }

    //hit button
    const hit = document.querySelector('.hit');
    hit.addEventListener('click',(e) => {
        e.preventDefault();
        player.addToHand(Deck.drawCards(1));
        console.log(calcValue(player.getHand));
        DisplayCtrl.updateCardDisplay();
    })


    newRound();
    console.log(calcValue(player.getHand));
})();

