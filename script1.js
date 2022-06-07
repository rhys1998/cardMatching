class AudioController {
  constructor() {
    this.bgMusic = new Audio('assets/Audio/win.wav');
    this.matchSound = new Audio('assets/Audio/match.wav');
    this.flipSound = new Audio('assets/Audio/Assets_Audio_flip.wav');
    this.victorySound = new Audio('assets/Audio/win.wav');
    this.gameOverSound = new Audio('assets/Audio/loose.wav');
    this.bgMusic.volume = 1;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  match() {
    this.matchSound.play();
  }
  flip() {
    this.flipSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class FlipCards {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.flips = document.getElementById('flips');
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchCards = [];
    this.busy = true;
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
    }
  }
  canFlipCard(card) {
    true;
    // return !this.busy && !this.matchCards.includes(card) && !this.cardToCheck;
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new FlipCards(40, cards);
  overlays.forEach(overlays => {
    overlays.addEventListener('click', () => {
      overlays.classList.remove('visible');
      // let audioController = new AudioController();
      // audioController.startMusic();
      game.startGame();
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      //flip card
      game.flipCard(card);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}
