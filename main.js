// ---------------------------------------------------------
// ------------------ GLOBAL VARIABLES----------------------
// ---------------------------------------------------------

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let background = 'media/background.png'
let carImg1 = 'media/pixel-vector-alien-ship-4.png'
let carImg2 = 'media/car2.png'
let obsImg1 = 'media/asteroid.png'
let rewardImg = 'media/Cartoon-Gold-Star.png'

let obstaclesArr = []
let rewardsArr = []
let score = 0

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
    this.y = canvas.height - 20
    this.width = 30
    this.height = 15
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
    this.width = 20
    this.height = 10
    this.img = new Image()
    this.img.src = obsImg1
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
    this.width = 10
    this.height = 10
    this.img = new Image()
    this.img.src = rewardImg
    this.status = 1
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    this.y++
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
  //Despues dibujamos el canvas
  board.draw()
  car.draw()
  generateObstacles()
  drawObstacles()
  checkCollition()
  generateRewards()
  drawRewards()
  checkCollitionRewards()
  frames++
  //console.log(frames)

  if (keys[39]) {
    if (car.velX < car.speed) {
      car.velX++
      console.log(car.velX)
    }
  }

  if (keys[37]) {
    if (car.velX > -car.speed) {
      car.velX--
      console.log(car.velX)
    }
  }

    //movimiento
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
    //console.log(obstaclesArr)
  }
}

function drawObstacles() {
  obstaclesArr.forEach((obstacle) => {
    obstacle.draw()
    //console.log(' drawwwww obstacle')
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
  })
}

function checkCollitionRewards() {
  rewardsArr.forEach((reward) => {
    if(car.isTouchingReward(reward) && reward.status === 1) {
      ctx.clearRect(reward.x, reward.y, reward.width, reward.height)
      reward.status = 0
      console.log(score++)
    }
  })
}
