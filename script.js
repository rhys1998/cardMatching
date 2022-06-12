// console.log('img', document.getElementsByClassName('card-front card-face'));
let id = true;
let str = '';
let game;
let timer;
class AudioController {
  constructor() {
    // this.bgMusic = new Audio(
    //   'https://raw.githubusercontent.com/WebDevSimplified/Mix-Or-Match/master/Assets/Audio/creepy.mp3'
    // );
    this.flipSound = new Audio('assets/Audio/CardFlip.wav');
    this.matchSound = new Audio('assets/Audio/match.wav');
    this.victorySound = new Audio('assets/Audio/win.wav');
    this.gameOverSound = new Audio('assets/Audio/loose.wav');
    // this.bgMusic.volume = 0;
    // this.bgMusic.loop = true;
  }
  // startMusic() {
  //   this.bgMusic.play();
  // }
  // stopMusic() {
  //   this.bgMusic.pause();
  //   this.bgMusic.currentTime = 0;
  // }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    // this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    // this.stopMusic();
    this.gameOverSound.play();
  }
}

class FlipCards {
  constructor(totalTime, cards) {
    console.log('totalTime: ', totalTime);
    this.timerIntervalId = null;
    this.timeOut = null;
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    console.log('this.timeRemaining: ', this.timeRemaining);
    this.timer = document.getElementById('time-remaining');
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();
  }

  startGame() {
    console.log('start Game');

    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    // console.log('timeRemaining: ', this.timeRemaining);
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    if (this.timeOut) clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      // this.audioController.startMusic();
      this.shuffleCards(this.cardsArray);
      if (this.countdown) clearInterval(this.countdown);
      this.countdown = setInterval(() => {
        this.timeRemaining--;
        // console.log('timeRemaining: ', this.timeRemaining);
        this.timer.innerText = this.timeRemaining;
        if (this.timeRemaining === 0) this.gameOver();
      }, 1000);
      this.busy = false;
    }, 500);

    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }

  // startCountdown() {
  //   if (this.timerIntervalId) clearInterval(this.timerIntervalId);
  //   return (this.timerIntervalId = setInterval(() => {
  //     this.timeRemaining--;
  //     console.log('timeRemaining: ', this.timeRemaining);
  //     this.timer.innerText = this.timeRemaining;
  //     if (this.timeRemaining === 0) this.gameOver();
  //   }, 1000));
  // }
  gameOver() {
    console.log('time', this.timeRemaining);
    clearInterval(this.countdown);
    clearTimeout(this.timeOut);
    this.audioController.gameOver();

    document.getElementById('game-over-text').classList.add('visible');
    // setTimeout(() => {
    //   location.reload();
    // }, 1500);
  }
  victory() {
    clearInterval(this.countdown);
    this.audioController.victory();
    document.getElementById('victory-text').classList.add('visible');
  }

  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) this.cardMatch(card, this.cardToCheck);
    else this.cardMismatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) {
      console.log('victory: ');
      this.victory();
    }
  }
  cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.add('shake');
      card2.classList.add('shake');
    }, 400);
    // setTimeout(() => {
    //   cardOne.classList.remove('shake', 'flip');
    //   cardTwo.classList.remove('shake', 'flip');
    //   cardOne = cardTwo = '';
    //   disableDeck = false;
    // }, 1200);
    setTimeout(() => {
      card1.classList.remove('shake', 'visible');
      card2.classList.remove('shake', 'visible');
      this.busy = false;
    }, 1000);
  }
  shuffleCards(cardsArray) {
    const clonedArray = [...cardsArray];
    console.log('clonedArray: ', clonedArray);
    for (let i = 0; i < clonedArray.length; i++) {
      // const randIndex = Math.floor(Math.random() * (i + 1));
      // console.log('randIndex: ', randIndex);

      // [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];

      const random = Math.floor(Math.random() * clonedArray.length);
      // console.log('random: ', random);

      let previous = clonedArray[i];
      clonedArray[i] = clonedArray[random];
      clonedArray[random] = previous;
    }
    cardsArray = clonedArray;
    cardsArray = cardsArray.map((card, index) => {
      card.style.order = index;
    });
  }
  getCardType(card) {
    return card.getElementsByClassName('card-front card-face')[0].innerHTML;
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      this.matchedCards &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck &&
      this.timeRemaining !== 0
    );
  }
}

// if (document.readyState == 'loading') {
//   document.addEventListener('DOMContentLoaded', ready);
// } else {
//   ready();
// }

function readyNormal() {
  clearInterval(this.timerIntervalId);
  let cards = [];
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  document.getElementById('game-over-text').classList.remove('visible');
  document.getElementById('victory-text').classList.remove('visible');
  document.getElementById('new').classList.remove('visible');
  document.getElementById('time').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
  document.getElementById('medium').style.display = 'none';
  document.getElementById('normal').style.display = 'grid';
  cards = Array.from(document.getElementsByClassName('cardNormal'));

  let game = new FlipCards(50, cards);
  console.log('overlays: ', overlays);
  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      // overlay.classList.remove('visible');
      // game.startGame();
    });
  });
  game.startGame();
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}
function readyMedium() {
  clearInterval(this.timerIntervalId);
  let cards = [];
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  document.getElementById('game-over-text').classList.remove('visible');
  document.getElementById('victory-text').classList.remove('visible');
  document.getElementById('new').classList.remove('visible');
  document.getElementById('time').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
  document.getElementById('normal').style.display = 'none';
  document.getElementById('medium').style.display = 'grid';
  cards = Array.from(document.getElementsByClassName('cardMedium'));
  let game = new FlipCards(100, cards);
  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      // overlay.classList.remove('visible');
      // game.startGame();
    });
  });
  game.startGame();
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}
// function ready() {
//   let gameLevel = 'normal';
//   console.log('document', selectors.board);
//   console.log('string');
//   let cards = [];
//   let overlays = Array.from(document.getElementsByClassName('overlay-text'));

//   if (id == true) {
//     str = 'cardNormal';
//     document.getElementById('normal').style.display = 'grid';
//   } else {
//     str = 'cardMedium';
//   }

//   cards = Array.from(document.getElementsByClassName(str));
//   let timer = id ? 5 : 10;
//   timer = 5;
//   if (!id) {
//     timer = 10;
//   }
//   let game = new FlipCards(timer, cards);

//   console.log('cards: ', cards);

//   overlays.forEach(overlay => {
//     overlay.addEventListener('click', () => {
//       overlay.classList.remove('visible');
//       game.startGame();
//     });
//   });

//   cards.forEach(card => {
//     card.addEventListener('click', () => {
//       game.flipCard(card);
//     });
//   });
// }

// function changeLevelNormal(level) {
//   id = true;
//   document.getElementById('normal').style.display = 'grid';
//   document.getElementById('medium').style.display = 'none';
//   // console.log(' document.getElementById', document.getElementById('normal'));
//   // ready();
// }

// function changeLevelMedium(level) {
//   id = false;
//   document.getElementById('normal').style.display = 'none';
//   document.getElementById('medium').style.display = 'grid';
//   console.log(' document.getElementById', document.getElementById('medium'));
//   // ready();
// }
