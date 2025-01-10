import './style.css'
import Phaser from 'phaser'

const speedDown = 300;

const gameStartDiv = document.querySelector('#gameStart')
const gameEndDiv = document.querySelector('#gameEnd')
const gameStartBtn = document.querySelector('#gameStartBtn')
const gameLoseOrWinSpan = document.querySelector('#gameLoseOrWinSpan')
const finalScore = document.querySelector('#finalScore')

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter
  }

  preload() {
    this.load.image('bg', '/assets/bg.png');
    this.load.image('basket', '/assets/basket.png')
    this.load.image('apple', '/assets/apple.png')
    this.load.image('money', '/assets/money.png')

    this.load.audio('bgMusic', '/assets/bgMusic.mp3')
    this.load.audio('coin', '/assets/coin.mp3')
  }

  create() {
    this.scene.pause('scene-game')

    this.coinMusic = this.sound.add('coin')

    this.bgMusic = this.sound.add('bgMusic')
    this.bgMusic.play()

    this.add.image(0, 0, 'bg').setOrigin(0, 0)

    this.player = this.physics.add.image(0, 400, 'basket').setOrigin(0, 0)
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)
    this.player.setSize(80, 10)

    this.target = this.physics.add.image(0, 0, 'apple').setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown + 100)

    this.cursor = this.input.keyboard.createCursorKeys()

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.textScore = this.add.text(500-120, 10, 'score: 0', {
      font: '25px Arial',
      fill: '#000000'
    })

    this.textTime = this.add.text(500-480, 10, 'remaining time: 0', {
      font: '25px Arial',
      fill: '#000000'
    })

    this.timedEvent = this.time.delayedCall(20000, this.gameOver, [], this)

    this.emitter = this.add.particles(0, 0, 'money', {
      speed: 100,
      gravityY: speedDown,
      scale: 0.5,
      duration: 50,
      emitting: false
    })
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true)
  }

  update() {
    const {left, right} = this.cursor

    this.remainingTime = this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`remaining time: ${Math.floor(this.remainingTime).toString()}`)

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.target.y >= 500) {
      this.target.setY(0)
      this.target.setX(this.getRandomX())
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480)
  }

  targetHit() {
    this.emitter.start()
    this.coinMusic.play()
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.points++
    this.textScore.setText(`score: ${this.points}`)
  }

  gameOver() {
    this.sys.game.destroy(true)
    gameEndDiv.style.display = 'flex';

    if (this.points >= 15) {
      gameLoseOrWinSpan.innerHTML = 'WIN 😍'
    } else {
      gameLoseOrWinSpan.innerHTML = 'LOSE 😭'
    }
    
    finalScore.innerHTML = this.points
  }
}

const config = {
  type: Phaser.WEBGL, 
  width: 500, 
  height: 500, 
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: speedDown
      },
      debug: true
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config)

gameStartBtn.addEventListener('click', () => {
  gameStartDiv.style.display = 'none';
  game.scene.resume('scene-game')
})