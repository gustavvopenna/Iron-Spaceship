// ---------------------------------------------------------
// ------------------ GLOBAL VARIABLES----------------------
// ---------------------------------------------------------

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let background = 'media/background.png'
let carImg1 = 'media/smallorange.png'
let carImg2 = 'media/car2.png'
let obsImg1 = 'media/asteroid.png'

let obstaclesArr = []



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
            (this.y < obstacle.y + obstacle.width) &&
            (this.y + this.width > obstacle.y)
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
  frames++
  //console.log(frames)
}

function startGame() {
  if(interval) return
  interval = setInterval(update, 1000/60)//Estos son los FPS que se dibujan por segundo  
}

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

// ---------------------------------------------------------
// ------------------- HELPER FUNCTIONS---------------------
// ---------------------------------------------------------

function generateObstacles() {
  let carWidth = 30
  let randomWidth = Math.floor(Math.random() * canvas.width - carWidth)
  if (frames % 90 === 0) {
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
    if(car.isTouching(obstacle)) console.log('IS TOUUUUCHING!!!')
  })
}