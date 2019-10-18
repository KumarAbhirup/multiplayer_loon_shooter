/* eslint-disable no-global-assign */
/* eslint-disable no-unused-vars */

/* 
  global
  floor
  gameTimer
  textAlign
  Koji
  text
  textSize
  CENTER
  rect
  gameOverRectangleHeight
  fill
  sndEnd
  canEnd
  TOP
  objSize
  width
  height
  Smooth

  Player
  arenaSize
  random
  enemies
  imgPlayer
  imgPlayerIndex

  explosions
  Explosion

  collectibles
  Collectible

  balloons 
  Balloon
  imgBullet

  push
  rect
  circle
  strokeWeight
  noFill
  rectMode
  stroke
  pop

  balloonRadius
  balloonDistance
*/

// To draw the timer in the right place
function drawTimer() {
  let timerMinutes = Math.floor(gameTimer / 60)
  let timerSeconds = Math.floor(gameTimer - timerMinutes * 60)

  if (timerMinutes < 10) {
    timerMinutes = `0${timerMinutes}`
  }

  if (timerSeconds < 10) {
    timerSeconds = `0${timerSeconds}`
  }

  let timerText = `${timerMinutes}:${timerSeconds}`
  const timerSize = objSize * 1.5
  const x = width / 2
  let y = timerSize

  textAlign(CENTER, TOP)

  if (gameTimer <= 0) {
    timerText = Koji.config.strings.gameOverText

    if (!canEnd) {
      canEnd = true
      if (sndEnd) sndEnd.play()
    }

    y = height / 2

    fill(Koji.config.colors.gameOverRectangleColor)

    gameOverRectangleHeight = Smooth(gameOverRectangleHeight, objSize * 6, 4)

    rect(
      0,
      height / 2 - gameOverRectangleHeight * 0.5,
      width,
      gameOverRectangleHeight
    )
    textAlign(CENTER, CENTER)
  }

  textSize(timerSize)
  fill(Koji.config.colors.timerText)
  text(timerText, x, y)
}

// To spawn an enemy
function spawnEnemy(userId, playerName) {
  const toBePushedEnemy = new Player(
    {
      x: random(-arenaSize / 2, arenaSize / 2),
      y: random(-arenaSize / 2, arenaSize / 2),
    },
    { radius: 30 },
    {
      shape: 'circle',
      image: imgPlayer[imgPlayerIndex],
      id: userId,
      playerName: playerName || 'Player',
      movable: true,
    }
  )

  enemies.push(toBePushedEnemy)
}

// To spawn the explosion image
function spawnExplosion(x, y, size) {
  explosions.push(new Explosion(x, y, size))
}

// To spawn collectibles like guns
function spawnCollectible(type) {
  let _type = floor(random() * Koji.config.weapons.weapon.length)

  if (type) {
    _type = type
  }

  collectibles.push(
    new Collectible(
      random(-arenaSize / 2, arenaSize / 2),
      random(-arenaSize / 2, arenaSize / 2),
      _type
    )
  )
}

// Spawn Balloons
function spawnBalloons(type = null) {
  for (let x = -balloonDistance; x <= balloonDistance; x += balloonRadius) {
    for (let y = -balloonDistance; y <= balloonDistance; y += balloonRadius) {
      const balloonType = Math.floor(random(0, imgBullet.length - 1))
      balloons.push(
        new Balloon(
          { x, y },
          { radius: balloonRadius / 2 },
          {
            shape: 'circle',
            image: imgBullet[balloonType],
            type: balloonType,
          }
        )
      )
    }
  }
}
