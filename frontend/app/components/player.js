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
  collectibles
  users
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
      type: this.weaponType,
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

  collectCollectible() {
    for (let i = 0; i < collectibles.length; i += 1) {
      if (
        this.didTouch(
          {
            sizing: {
              radius: collectibles[i].sizeMod * 2,
            },
            body: {
              position: {
                x: collectibles[i].pos.x,
                y: collectibles[i].pos.y,
              },
            },
          },
          'circle'
        ) &&
        !collectibles[i].collected
      ) {
        const numOfPlayers = Object.keys(users).length

        if (numOfPlayers > 1) {
          // Collect
          collectibles[i].collected = true
          collectibles[i].animTimer = 0

          this.weaponType = collectibles[i].type
          this.weapon.type = collectibles[i].type
          this.weapon.settings.image = imgWeapon[collectibles[i].type]

          break
        } else {
          // Bounce off the player
          const dir = p5.Vector.sub(
            collectibles[i].pos,
            this.body.position
          ).normalize()

          const distance =
            (1 / this.body.position.dist(collectibles[i].pos)) * 200

          collectibles[i].velocity = createVector(
            dir.x * distance * 2,
            dir.y * distance * 2
          )
        }
      }
    }
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

    this.collectCollectible()
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
