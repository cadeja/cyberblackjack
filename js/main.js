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

    return {
        initDeck,
        shuffleDeck
    }
})()

const GameCtrl = (() => {

    // shuffled deck
    let deck = Deck.shuffleDeck(Deck.initDeck(1));

    let dealerhand = [];
    let playerhand = [];

    function drawCards(numOfCards){
        return deck.splice(0,2);
    }

    console.log(drawCards(2));
    console.log(deck);

})();


const DisplayCtrl = (() => {
    console.log('');
})();