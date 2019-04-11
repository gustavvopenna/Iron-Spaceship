

let scoreDisplay1 = document.getElementById('score-player-1')
let scoreDisplay2 = document.getElementById('score-player-2')
let playerScoreButton = document.getElementById('player2-button')
console.log(playerScoreButton)

// ---------------------------------------------------------
// ------------------ GLOBAL VARIABLES----------------------
// ---------------------------------------------------------

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let background = 'media/background.png'
let carImg1 = 'media/img/player-orange-2.png'
let carImg2 = 'media/img/enemy-green-1.png'
let obsImg1 = 'media/asteroid.png'
let rewardImg = 'media/Cartoon-Gold-Star.png'
let supplieImg = 'media/gem.png'
let bulletImg = 'media/img/laser-red-5.png'

let obstaclesArr = []
let rewardsArr = []
let suppliesArr = []
let shootsArr = []

let score1 = 0
let score2 = 0 //Quitarlo

const friction = 0.8
let gameStarted = false
const keys = []



// ---------------------------------------------------------
// ------------------------ CLASSES ------------------------
// ---------------------------------------------------------

class Board {
  constructor(img) {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = img
    this.img.onload = () => {
      this.draw()
    }
    this.audio = new Audio()
    this.audio.src = 'media/Space-Battle.mp3'
    this.audio.loop = true
    this.player = 1
  }
  draw() {
    if(this.y > this.height) this.y = 0
    ctx.drawImage(this.img, this.x, this.y - this.height, this.width, this.height)
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
  }
}

class Vehicle {
  constructor(img, x, y) {
    this.x = x
    this.y = y
    // this.x = canvas.width / 2.2
    // this.y = canvas.height - 50
    this.width = 60
    this.height = 30
    this.img = new Image()
    this.img.src = img

    this.audio = new Audio()
    this.audio.src = 'media/Explosion.mp3'

    this.audioBullet = new Audio()
    this.audioBullet.src = 'media/laser.mp3'

    this.audioReward = new Audio()
    this.audioReward.src = 'media/collet-reward.mp3'
    
    this.speed = 5
    this.velX = 0
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  moveRight() {
    if(this.x < canvas.width - 70) this.x += 10
  }
  moveLeft() {
    if(this.x > 70) this.x -= 10
  }
  moveUp() {
    this.y -=10
  }
  moveDown() {
    this.y += 10
  }
  isTouching(obstacle) {
    return  (this.x < obstacle.x + obstacle.width - 10) &&
            (this.x + this.width > obstacle.x + 10) &&
            (this.y < obstacle.y + obstacle.height - 20) &&
            (this.y + this.height > obstacle.y + 10)
  }
  isTouchingReward(reward) {
    return  (this.x < reward.x + reward.width) &&
            (this.x + this.width > reward.x) &&
            (this.y < reward.y + reward.height) &&
            (this.y + this.height > reward.y)
  }
}

class Obstacle {
  constructor(x) {
    this.x = x
    this.y = 0
    this.width = 60
    this.height = 40
    this.img = new Image()
    this.img.src = obsImg1
    this.status = 1

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
  }
  isTouching(bullet) {
    return  (this.x < bullet.x + bullet.width) &&
            (this.x + this.width > bullet.x) &&
            (this.y < bullet.y + bullet.height) &&
            (this.y + this.height > bullet.y)
  }
}

class Reward {
  constructor(x) {
    this.x = x
    this.y = 0
    this.width = 25
    this.height = 25
    this.img = new Image()
    this.img.src = rewardImg
    this.status = 1

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
  }
}

class Supplie {
  constructor(x) {
    this.x = x
    this.y = 0
    this.width = 25
    this.height = 25
    this.img = new Image()
    this.img.src = supplieImg
    this.status = 1

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 8
    this.height = 25
    this.img = new Image()
    this.img.src = bulletImg
    this.status = 1

    this.audio = new Audio()
    this.audio.src = 'media/Magnum.mp3'

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y--
  }
  // isTouching(reward) {
  //   return  (this.x < reward.x + reward.width) &&
  //           (this.x + this.width > reward.x) &&
  //           (this.y < reward.y + reward.height) &&
  //           (this.y + this.height > reward.y)
  // }
}

// ---------------------------------------------------------
// ---------------------- INSTANCIAS -----------------------
// ---------------------------------------------------------

const board = new Board(background)
const car = new Vehicle(carImg1, canvas.width / 2.2, canvas.height - 50)
const spaceship2 = new Vehicle(carImg2, canvas.width / 2.2, canvas.height - 300)

// ---------------------------------------------------------
// -------------------- MAIN FUNCTIONS ---------------------
// ---------------------------------------------------------

//LA funcion mas importante
let frames = 0
let interval

function update() {
  //primero siempre borramos el board
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  board.draw()
  car.draw()
  spaceship2.draw()
  generateObstacles()
  drawObstacles()
  checkCollition()
  generateRewards()
  drawRewards()
  checkCollitionRewards()
  generateSupplies()
  drawSupplies()
  checkCollitionSupplies()
  
  drawBullets()
  checkCollitionBullets()
  frames++

  // Spaceship1 *car*
  if (keys[39]) {
    if (car.velX < car.speed) {
      car.velX++
    }
  }

  if (keys[37]) {
    if (car.velX > -car.speed) {
      car.velX--
    }
  }

  if (keys[40]) {
    if (car.velY < car.speed) {
      car.velY++
    }
  }

  if (keys[38]) {
    if (car.velY > -car.speed) {
      car.velY--
    }
  }

  if(keys[16]) {
    if(frames%5 === 0) {
      car.audioBullet.play()
      return generateBullets(car.x + car.width - 33, car.y - 20)
    }
  }

  // Spaceship2 
  if (keys[68]) {
    if (spaceship2.velX < spaceship2.speed) {
      spaceship2.velX++
    }
  }

  if (keys[65]) {
    if (spaceship2.velX > -spaceship2.speed) {
      spaceship2.velX--
    }
  }

  if (keys[83]) {
    if (spaceship2.velY < spaceship2.speed) {
      spaceship2.velY++
    }
  }

  if (keys[87]) {
    if (spaceship2.velY > -spaceship2.speed) {
      spaceship2.velY--
    }
  }

  if(keys[86]) {
    if(frames%5 === 0) {
      spaceship2.audioBullet.play()
      return generateBullets(spaceship2.x + spaceship2.width - 33, spaceship2.y - 20)
    }
  }

  //Vehicles movimiento
  car.x += car.velX
  car.velX *= friction

  car.y += car.velY
  car.velY *= friction

  spaceship2.x += spaceship2.velX
  spaceship2.velX *= friction

  spaceship2.y += spaceship2.velY
  spaceship2.velY *= friction
}

function startGame() {
  if(interval) return
  interval = setInterval(update, 1000/60)//Estos son los FPS que se dibujan por segundo  
}

function gameOver() {
  clearInterval(interval)
  board.audio.pause()
  car.audioBullet.pause()
  spaceship2.audioBullet.pause()
  console.log('GAME OOOOOVVVVVEEEEEER')
  gameOverMessague()
}

function reload(){
  window.location.reload(false);
}

// ---------------------------------------------------------
// ----------------------- LISTENERS -----------------------
// ---------------------------------------------------------

//Que evento queremos escuchar
document.addEventListener('keydown', (e) => {
  e.preventDefault()
  switch (e.keyCode) {
    case 32:
      board.audio.play()
      return startGame()
    case 39:
      return car.moveRight()
    case 37:
      return car.moveLeft()
    case 38:
      return car.moveUp()
    case 40:
      return car.moveDown()
    case 68:
      return spaceship2.moveRight()
    case 65:
      return spaceship2.moveLeft()
    case 87:
      return spaceship2.moveUp()
    case 83:
      return spaceship2.moveDown()

    }
})

document.body.addEventListener('keydown', e => {
  if (e.keyCode == 13 && !gameStarted) {
    startGame()
  }
  //para movimiento
  keys[e.keyCode] = true
})

//para movimiento
document.body.addEventListener('keyup', e => {
  keys[e.keyCode] = false
})

playerScoreButton.addEventListener("click", reload);


// ---------------------------------------------------------
// ------------------- HELPER FUNCTIONS---------------------
// ---------------------------------------------------------

// -----OBSTACLES------
function generateObstacles() {
  let carWidth = 30
  let randomWidth = Math.floor(Math.random() * canvas.width - carWidth)
  if (frames % 30 === 0) {
    let obs1 = new Obstacle(randomWidth)
    obstaclesArr.push(obs1)
  }
  if (frames % 35 === 0) {
    let obs1 = new Obstacle(randomWidth)
    obstaclesArr.push(obs1)
  }
}

function drawObstacles() {
  obstaclesArr.forEach((obstacle) => {
    if(obstacle.status === 1) obstacle.draw()

    //Obstacle movimiento
    obstacle.velY++
    obstacle.y += obstacle.velY
    obstacle.velY *= friction
  })
}

function checkCollition() {
  obstaclesArr.forEach((obstacle) => {
    if(car.isTouching(obstacle)&& obstacle.status === 1 || spaceship2.isTouching(obstacle)&& obstacle.status === 1 ) {
      car.audio.play()
      gameOver()
      console.log('Colision de obstaculo con nave')
      console.log(obstacle,car)
    }
  })
}

// ----- REWARDS ------

function generateRewards() {
  let carWidth = 30
  let randomWidth = Math.floor(Math.random() * canvas.width - carWidth)
  if (frames % 100 === 0) {
    let reward1 = new Reward(randomWidth)
    rewardsArr.push(reward1)
    //console.log(rewardsArr)
  }
}

function drawRewards() {
  rewardsArr.forEach((reward) => {
    if(reward.status === 1) reward.draw()

    //Reward movimiento
    reward.velY++
    reward.y += reward.velY
    reward.velY *= friction
  })
}

function checkCollitionRewards() {
  rewardsArr.forEach((reward) => {
    if(car.isTouchingReward(reward) && reward.status === 1 || spaceship2.isTouchingReward(reward) && reward.status === 1) {
      reward.status = 0
      console.log('Colision de reward con nave')
      car.audioReward.play()

      //Change score on every catch
      if(board.player === 1) {
        score1++
        scoreDisplay1.innerHTML = score1
      } else if (board.player === 2) {
        scoreDisplay2.innerHTML = score2
      }
    }
  })
}

// ----- SUPPLIES ------

function generateSupplies() {
  let carWidth = 30
  let randomWidth = Math.floor(Math.random() * canvas.width - carWidth)
  if (frames % 300 === 0) {
    let supplie1 = new Supplie(randomWidth)
    suppliesArr.push(supplie1)
  }
}

function drawSupplies() {
  suppliesArr.forEach((supplie) => {
    if(supplie.status === 1) supplie.draw()

    //Reward movimiento
    supplie.velY++
    supplie.y += supplie.velY
    supplie.velY *= friction
  })
}

function checkCollitionSupplies() {
  suppliesArr.forEach((supplie) => {
    if(car.isTouchingReward(supplie) && supplie.status === 1 || spaceship2.isTouchingReward(supplie) && supplie.status === 1) {
      supplie.status = 0
      console.log('Colision de suplies con nave')
      
      if(board.player === 1) {
        score1 +=3
        scoreDisplay1.innerHTML = score1
      } 
      //return true
    }
  })
}

// ----- BULLETS ------

function generateBullets(x, y) {
  const bullet = new Bullet(x, y)
  shootsArr.push(bullet)
}

function drawBullets() {
  shootsArr.forEach((shoot) => {
    if(shoot.status === 1) shoot.draw()

    //Obstacle movimiento
    shoot.velY--
    shoot.y += shoot.velY
    shoot.velY *= friction
  })
}

function checkCollitionBullets() {
  shootsArr.forEach((shoot) => {
    obstaclesArr.forEach((obstacle) => {
      if(obstacle.isTouching(shoot) && obstacle.status === 1 && shoot.status === 1) {
        obstacle.status = 0
        shoot.status = 0
        console.log('OBSTACLE DESTROYED!!!')
      }
    })
  })
}

function gameOverMessague() {
  ctx.fillStyle = "#FF0000"
  ctx.font = "70px Voyager";
  ctx.fillText(`Game over X__X`, 150, canvas.height / 2)
}


