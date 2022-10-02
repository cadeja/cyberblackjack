const Deck = (() => {

    // returns array of cards with number of decks specified
    // all values in array are strings
    function initDeck(numOfDecks){
        let deck = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        return [].concat(... new Array(numOfDecks * 4).fill(deck));
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

    function initShuffledDeck(numOfDecks){
        return shuffleDeck(initDeck(numOfDecks));
    }

    return {
        initShuffledDeck
    }
})()

const GameCtrl = (() => {

    const numOfDecks = 1;
    let dealerhand = [];
    let playerhand = [];

    let deck = Deck.initShuffledDeck(numOfDecks);

    // returns array of card values
    // reshuffles new decks if run out
    function drawCards(numOfCards){
        if (deck.length < numOfCards){

            if (deck.length == 0){
                deck = Deck.initShuffledDeck(numOfDecks);
                return deck.splice(0, numOfCards);
            }

            // add rest of deck to array
            let arr = [];
            numOfCards -= deck.length;
            arr = deck.splice(0,deck.length);

            // set deck to new shuffled deck
            deck = Deck.initShuffledDeck(numOfDecks);

            // pull remaining cards
            for(let i = 0; i < numOfCards; i++){
                arr.push(deck.pop());
            }
            return arr;

        } else {
            return deck.splice(0,numOfCards);
        }
    }

    function newRound(){

    }

})();


const DisplayCtrl = (() => {
    console.log('');
})();