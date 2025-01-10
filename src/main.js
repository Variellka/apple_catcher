import './style.css'
import Phaser from 'phaser'

const speedDown = 300;

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
  }

  preload() {
    this.load.image('bg', '/assets/bg.png');
    this.load.image('basket', '/assets/basket.png')
    this.load.image('apple', '/assets/apple.png')

  }

  create() {
    this.add.image(0, 0, 'bg').setOrigin(0, 0)

    this.player = this.physics.add.image(0, 400, 'basket').setOrigin(0, 0)
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)
    this.player.setSize(80, 10)

    this.target = this.physics.add.image(0, 0, 'apple').setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown)

    this.cursor = this.input.keyboard.createCursorKeys()

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.textScore = this.add.text(500-120, 10, 'score: 0', {
      font: '25px Arial',
      fill: '#000000'
    })

    this.textTime = this.add.text(500-120, 10, 'remaining time: 0', {
      font: '25px Arial',
      fill: '#000000'
    })
  }

  update() {
    const {left, right} = this.cursor

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
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.points++
    this.textScore.setText(`score: ${this.points}`)
  }

  gameOver() {
    
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