/* eslint-disable no-unused-vars */

/* 
  global

  Koji
  dispatch
  GameObject
  push
  pop
  text
  textAlign
  CENTER
  textSize
  fill
  noStroke
  createVector
  Smooth
  constrain
  arenaSize
  isMobile
  touching
  p5
  camera
  balloonBorder
  Weapon
  imgWeapon
*/

class Player extends GameObject {
  id = this.settings.id

  playerLabel = this.settings.playerName

  weaponType = this.settings.weaponType

  weapon = new Weapon(
    {
      x: this.body.position.x,
      y: this.body.position.y,
    },
    { radius: 40 },
    {
      shape: 'circle',
      image: imgWeapon[this.weaponType],
      rotate: true,
      movable: true,
      owner: this,
    }
  )

  showPlayerName = () => {
    push()
    fill(Koji.config.colors.negativeFloatingTextColor)
    noStroke()
    textSize(12.5)
    textAlign(CENTER, CENTER)
    text(
      this.playerLabel,
      this.body.position.x,
      this.body.position.y - this.sizing.radius - 8
    )
    pop()
  }

  showWeapon() {
    this.weapon.show()

    this.weapon.body.position.x = this.body.position.x + this.sizing.radius + 15
    this.weapon.body.position.y = this.body.position.y
  }

  update() {
    this.move()

    // Don't let the player run out
    this.body.position.x = constrain(
      this.body.position.x,
      -arenaSize / 2,
      arenaSize / 2
    )
    this.body.position.y = constrain(
      this.body.position.y,
      -arenaSize / 2,
      arenaSize / 2
    )

    // Avoid player get in circle
    if (
      this.didTouch(
        { sizing: balloonBorder.sizing, body: balloonBorder.body },
        'circle'
      )
    ) {
      const oldVelocity = createVector(this.velocity.x, this.velocity.y)
      this.velocity.add(createVector(-oldVelocity.x, -oldVelocity.y).mult(3))
    }

    // Weapon
    this.showWeapon()
  }
}
