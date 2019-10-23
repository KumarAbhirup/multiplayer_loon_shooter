/* eslint-disable no-unused-vars */

/* 
  global

  Koji
  dispatch
  GameObject
  createVector
  Smooth
  isMobile
  usingKeyboard
  camera
  player
*/

class Weapon extends GameObject {
  owner = this.settings.owner

  type = this.owner.weaponType

  shootDirection = createVector(0, 0)

  rotation = null

  update() {
    this.desiredPos = createVector(
      this.owner.body.position.x + (this.sizing.radius / 2) * 0.75,
      this.owner.body.position.y
    )

    this.body.position.x = Smooth(this.body.position.x, this.desiredPos.x, 2)
    this.body.position.y = Smooth(this.body.position.y, this.desiredPos.y, 2)

    this.rotateInPlayer()
  }

  rotateInPlayer() {
    // Player won't be able to shoot properly in mobile.
    this.shootDirection = createVector(
      camera.mouseX - this.owner.body.position.x,
      camera.mouseY - this.owner.body.position.y
    ).normalize()

    let angleDir = this.shootDirection.heading()

    angleDir += Math.PI

    if (this.owner === player) {
      this.body.angle = angleDir
    }
  }
}
