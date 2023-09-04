let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let score = document.querySelector("#score span");
let highScore = document.querySelector("#high-score span");
let gameScore = 0;
let gameHighScore = localStorage.getItem("snakeGameHighScore");

let leftButton = document.getElementById("left");
let upButton = document.getElementById("up");
let downButton = document.getElementById("down");
let rightButton = document.getElementById("right");

highScore.innerHTML = gameHighScore || 0;

if (window.screen.width >= 700) {
  canvas.width = 600;
  canvas.height = 600;
} else if (window.screen.width < 700 && window.screen.width >= 550) {
  canvas.width = 500;
  canvas.height = 500;
} else if (window.screen.width < 550 && window.screen.width >= 450) {
  canvas.width = 400;
  canvas.height = 400;
} else if (window.screen.width < 450 && window.screen.width >= 400) {
  canvas.width = 350;
  canvas.height = 350;
} else if (window.screen.width < 400) {
  canvas.width = 300;
  canvas.height = 300;
}

console.log(canvas.width, canvas.height);

let scale = 10;
let rows = canvas.width / scale;
let cols = canvas.height / scale;

class Snake {
  constructor() {
    this.initializer()
  }

  initializer = () => {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
  }

  snakeDraw = () => {
    ctx.fillStyle = "#9bf3f0";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
      this.didEatTail(this.tail[i]);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  };

  updateLocation = () => {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.y >= canvas.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = canvas.height;
    }
  };

  updateDirection = (userDirection) => {
    switch (userDirection) {
      case "Up": {
        this.xSpeed = 0;
        this.ySpeed = -scale;
        break;
      }
      case "Down": {
        this.xSpeed = 0;
        this.ySpeed = scale;
        break;
      }
      case "Left": {
        this.xSpeed = -scale;
        this.ySpeed = 0;
        break;
      }
      case "Right": {
        this.xSpeed = scale;
        this.ySpeed = 0;
        break;
      }
    }
  };

  didFoodEat = (food) => {
    if (this.x === food.x && this.y === food.y) {
      this.total++;
      this.score();
      return true;
    }
    return false;
  };

  didEatTail = (tailPoint) => {
    if (tailPoint.x === this.x && tailPoint.y === this.y) {
      alert("game over");
      this.initializer()
      gameScore = 0;
      score.innerHTML = 0;
    };
  };

  score = () => {
    gameScore += scale;
    score.innerHTML = gameScore;
    if (gameScore > gameHighScore) {
      gameHighScore = gameScore;
      localStorage.setItem("snakeGameHighScore", gameHighScore);
      highScore.innerHTML = gameHighScore;
    }
  };
}

class Food {
  constructor() {
    this.x;
    this.y;
  }

  randomLocation = () => {
    this.x = Math.floor(Math.random() * rows) * scale;
    this.y = Math.floor(Math.random() * cols) * scale;
  };

  generate = () => {
    ctx.fillStyle = "#09010e";
    ctx.fillRect(this.x, this.y, scale, scale);
  };
}

window.addEventListener("load", () => {
  let snake = new Snake();
  let food = new Food();
  food.randomLocation();

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    food.generate();
    snake.snakeDraw();
    snake.updateLocation();
    if (snake.didFoodEat(food)) {
      food.randomLocation();
    }
  }, 100);

  upButton.addEventListener("click", () => {
    snake.updateDirection("Up");
  });

  downButton.addEventListener("click", () => {
    snake.updateDirection("Down");
  });

  leftButton.addEventListener("click", () => {
    snake.updateDirection("Left");
  });

  rightButton.addEventListener("click", () => {
    snake.updateDirection("Right");
  });

  window.addEventListener("keydown", (event) => {
    let userDirection = event.key.replace("Arrow", "");
    snake.updateDirection(userDirection);
  });
});
