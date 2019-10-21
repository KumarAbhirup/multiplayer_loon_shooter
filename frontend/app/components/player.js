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
  holdingShoot
  bullets
  Bullet
  imgBullet
  weaponCooldown
  balloonRadius
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

  weaponCooldownTimer = 0

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
    this.weapon.update()
  }

  update() {
    this.weaponCooldownTimer -= 1 / 60

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

    // Shoot
    if (touching || holdingShoot) {
      this.shoot()
    }
  }

  shoot() {
    if (this.weaponCooldownTimer <= 0) {
      // Shoot in mouse direction
      this.shootDir = createVector(
        camera.mouseX - this.body.position.x,
        camera.mouseY - this.body.position.y
      )

      const position = createVector(
        this.body.position.x + this.sizing.radius * 0.75,
        this.body.position.y
      )

      position.add(
        p5.Vector.mult(this.weapon.shootDirection, this.sizing.radius)
      )

      // Pushback weapon
      const weaponPushbackDir = createVector(
        position.x - this.weapon.body.position.x,
        position.y - this.weapon.body.position.y
      )

      const pushbackStrength = this.sizing.radius

      weaponPushbackDir.normalize().mult(pushbackStrength)

      this.weapon.body.position = createVector(
        this.weapon.desiredPos.x - weaponPushbackDir.x,
        this.weapon.desiredPos.y - weaponPushbackDir.y
      )

      // Spawn a bullet
      const bullet = new Bullet(
        { x: position.x, y: position.y },
        { radius: balloonRadius / 2 },
        {
          shape: 'circle',
          image: imgBullet[this.weaponType],
          weapon: this.weapon,
          owner: this,
        }
      )

      bullet.rotation = this.shootDir.heading()

      bullet.rotation = this.shootDir.heading() + Math.PI

      bullets.push(bullet)

      this.weaponCooldownTimer = weaponCooldown[this.weaponType]
    }
  }
}
