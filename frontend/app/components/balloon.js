/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  balloonBorder
  imgBullet
  random
  addScore
  lives
  loseLife
*/

class Balloon extends GameObject {
  bullet = this.settings.bullet

  type = this.settings.type

  checkBalloonBorderCollision() {
    if (
      !this.didTouch(
        { sizing: balloonBorder.sizing, body: balloonBorder.body },
        'circle'
      )
    ) {
      addScore(
        -500,
        imgBullet[this.type],
        { x: this.body.position.x, y: this.body.position.y },
        Math.floor(random(5, 10)),
        { floatingText: true }
      )

      // if (lives === 1) {
      //   setTimeout(loseLife, 1000)
      // } else {
      //   loseLife()
      // }

      this.removable = true
    }
  }

  update() {
    this.checkBalloonBorderCollision()
  }
}
