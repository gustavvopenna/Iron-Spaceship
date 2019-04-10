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
let carImg1 = 'media/imgSaul/player-orange-2.png'
let carImg2 = 'media/car2.png'
let obsImg1 = 'media/asteroid.png'
let rewardImg = 'media/Cartoon-Gold-Star.png'
let supplieImg = 'media/gem.png'
let bulletImg = 'media/imgSaul/laser-red-5.png'

let obstaclesArr = []
let rewardsArr = []
let suppliesArr = []
let shootsArr = []

let score1 = 0
let score2 = 0

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
  constructor(img) {
    this.x = canvas.width / 2.2
    this.y = canvas.height - 50
    this.width = 60
    this.height = 30
    this.img = new Image()
    this.img.src = img
    
    this.speed = 5
    this.velX = 0
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  moveRight() {
    if(this.x < canvas.width - 43) this.x += 10
  }
  moveLeft() {
    if(this.x > 10) this.x -= 10
  }
  isTouching(obstacle) {
    return  (this.x < obstacle.x + obstacle.width) &&
            (this.x + this.width > obstacle.x) &&
            (this.y < obstacle.y + obstacle.height) &&
            (this.y + this.height > obstacle.y)
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

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
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

    this.speed = 1
    this.velY = 0
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y--
  }
}

// ---------------------------------------------------------
// ---------------------- INSTANCIAS -----------------------
// ---------------------------------------------------------

const board = new Board(background)
const car = new Vehicle(carImg1)


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
  frames++

  // Vehicles Speed
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

  if(keys[83]) {
    if(frames%5 === 0) {
      return generateBullets(car.x + car.width -33, car.y - 20)
    }
  }

  //Vehicles movimiento
  car.x += car.velX
  car.velX *= friction
}

function startGame() {
  if(interval) return
  interval = setInterval(update, 1000/60)//Estos son los FPS que se dibujan por segundo  
}

function gameOver() {
  clearInterval(interval)
  console.log('GAME OOOOOVVVVVEEEEEER')
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
      return startGame()
    case 39:
      return car.moveRight()
    case 37:
      return car.moveLeft()
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

//Para el player 2
// playerScoreButton.addEventListener('click', e => {
//   console.log('butttttooooooooon')
//   startGame()
//   board.player = 2
// })
playerScoreButton.addEventListener("click", reload);


// ---------------------------------------------------------
// ------------------- HELPER FUNCTIONS---------------------
// ---------------------------------------------------------

// -----OBSTACLES------
function generateObstacles() {
  let carWidth = 30
  let randomWidth = Math.floor(Math.random() * canvas.width - carWidth)
  if (frames % 40 === 0) {
    let obs1 = new Obstacle(randomWidth)
    obstaclesArr.push(obs1)
    //console.log(obstaclesArr)
  }
}

function drawObstacles() {
  obstaclesArr.forEach((obstacle) => {
    obstacle.draw()

    //Obstacle movimiento
    obstacle.velY++
    obstacle.y += obstacle.velY
    obstacle.velY *= friction
  })
}

function checkCollition() {
  obstaclesArr.forEach((obstacle) => {
    if(car.isTouching(obstacle)) gameOver()
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
    if(car.isTouchingReward(reward) && reward.status === 1) {
      reward.status = 0

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
  if (frames % 180 === 0) {
    let supplie1 = new Supplie(randomWidth)
    suppliesArr.push(supplie1)
    console.log(suppliesArr)
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
    if(car.isTouchingReward(supplie) && supplie.status === 1) {
      supplie.status = 0
      return true

      //Change score on every catch
      // if(board.player === 1) {
      //   score1++
      //   scoreDisplay1.innerHTML = score1
      // } else if (board.player === 2) {
      //   scoreDisplay2.innerHTML = score2
      // }
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
    shoot.draw()

    //Obstacle movimiento
    shoot.velY--
    shoot.y += shoot.velY
    shoot.velY *= friction
  })
}



