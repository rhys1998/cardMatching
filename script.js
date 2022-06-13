let cardsNew;
let emojis = [
  '🥔',
  '🍒',
  '🥑',
  '🌽',
  '🥕',
  '🍇',
  '🍉',
  '🍌',
  '🥭',
  '🍍',
  '🍑',
  '🥝',
  '🥥',
  '🍋',
  '🍆',
  '🍄',
  '🥒',
  '🥦',
  '🍏',
  '🍐',
  '🥜',
  '🌶',
  '🍕',
  '🌭',
  '🥪',
  '🍟',
  '🍡',
  '🍩',
  '🍭',
  '🍰',
  '🍫',
  '🍬',
  '🍮',
  '🍦',
  '🍗',
  '🧀',
  '🍿',
  '🥟',
  '🍤'
];
const shuffle = array => {
  const clonedArray = [...array];

  for (let index = clonedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const original = clonedArray[index];

    clonedArray[index] = clonedArray[randomIndex];
    clonedArray[randomIndex] = original;
  }

  return clonedArray;
};

const pickRandom = (array, items) => {
  const clonedArray = [...array];
  const randomPicks = [];

  for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);

    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }

  return randomPicks;
};

function levelNormal(dataDimensions, level, id) {
  const dimensions = dataDimensions;
  console.log('dimensions: ', id);

  const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
  const items = shuffle([...picks, ...picks]);

  let cards = `
      <div class=${level} id=${id} style="grid-template-columns: repeat(${dimensions}, auto)">
          ${items
            .map(
              item => `
              <div class="cardNormal">
                  <div class="card-back card-face"></div>
                  <div class="card-front card-face">${item}</div>
              </div>
          `
            )
            .join('')}
     </div>
  `;

  const parser = new DOMParser().parseFromString(cards, 'text/html');
  document.querySelector('.level1').replaceWith(parser.querySelector('.level1'));
  cardsNew = Array.from(document.getElementsByClassName('cardNormal'));
}

function levelHard(dataDimensions) {
  const dimensions = dataDimensions;
  const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
  const items = shuffle([...picks, ...picks]);

  let cards = `
      <div class="level3" id='hard' style="grid-template-columns: repeat(${dimensions}, auto)">
          ${items
            .map(
              item => `
              <div class="cardHard">
                  <div class="card-back card-face"></div>
                  <div class="card-front card-face">${item}</div>
              </div>
          `
            )
            .join('')}
     </div>
  `;

  const parser = new DOMParser().parseFromString(cards, 'text/html');
  console.log('parser: ', document.querySelector('.level3'));
  console.log('new', parser.querySelector('.level3'));
  document.querySelector('.level3').replaceWith(parser.querySelector('.level3'));
  cardsNew = Array.from(document.getElementsByClassName('cardHard'));
  console.log('cardsNew: ', cardsNew);
}
class AudioController {
  constructor() {
    this.bgMusic = new Audio('assets/Audio/game-music-7408.mp3');
    this.flipSound = new Audio('assets/Audio/CardFlip.wav');
    this.matchSound = new Audio('assets/Audio/match.wav');
    this.victorySound = new Audio('assets/Audio/win.wav');
    this.gameOverSound = new Audio('assets/Audio/loose.wav');
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
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
    // console.log('clonedArray: ', clonedArray);
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
  levelNormal(4, 'level1', 'normal');
  console.log('cardsNew', cardsNew);
  let cards = [];
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  document.getElementById('container').classList.remove('visible');
  document.getElementById('hard').style.display = 'none';
  document.getElementById('game-over-text').classList.remove('visible');
  document.getElementById('victory-text').classList.remove('visible');
  document.getElementById('new').classList.remove('visible');
  document.getElementById('time').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
  // document.getElementById('hard').style.display = 'none';
  // document.getElementById('normal').style.display = 'grid';
  cards = cardsNew;
  let game = new FlipCards(15, cards);
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
  levelNormal(6, 'level1', 'normal');
  let cards = [];
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  document.getElementById('hard').style.display = 'none';
  document.getElementById('container').classList.remove('visible');
  document.getElementById('game-over-text').classList.remove('visible');
  document.getElementById('victory-text').classList.remove('visible');
  document.getElementById('new').classList.remove('visible');
  document.getElementById('time').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
  // document.getElementById('normal').style.display = 'grid';
  // document.getElementById('hard').style.display = 'grid';
  // cards = Array.from(document.getElementsByClassName('cardHard'));
  cards = cardsNew;
  let game = new FlipCards(10, cards);
  // overlays.forEach(overlay => {
  //   overlay.addEventListener('click', () => {
  //     // overlay.classList.remove('visible');
  //     // game.startGame();
  //   });
  // });
  game.startGame();
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

function readyHard() {
  clearInterval(this.timerIntervalId);
  levelHard(8);
  let cards = [];
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  document.getElementById('normal').style.display = 'none';
  document.getElementById('container').classList.remove('visible');
  document.getElementById('game-over-text').classList.remove('visible');
  document.getElementById('victory-text').classList.remove('visible');
  document.getElementById('new').classList.remove('visible');
  document.getElementById('time').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
  // document.getElementById('normal').style.display = 'grid';
  // document.getElementById('hard').style.display = 'grid';
  // cards = Array.from(document.getElementsByClassName('cardHard'));
  cards = cardsNew;
  let game = new FlipCards(10, cards);
  // overlays.forEach(overlay => {
  //   overlay.addEventListener('click', () => {
  //     // overlay.classList.remove('visible');
  //     // game.startGame();
  //   });
  // });
  game.startGame();
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}
