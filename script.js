 // JSON object for game settings
  let gameSettings = {
    "ballSpeedX": 6,
    "ballSpeedY": 6,
    "paddleSpeed": 10,
    "maxScore": 6 // Winning score
  };

  localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
  let settings = JSON.parse(localStorage.getItem("gameSettings")) || gameSettings;

  console.log("Game Settings Loaded:", settings);


  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var startBtn = document.getElementById("start-btn");
  var pauseBtn = document.getElementById("pause-btn");
  var restartBtn = document.getElementById("restart-btn");
  var animationId;
  var gameRunning = false;
  var gameOver = false;
  var winnerText = "";

  startBtn.addEventListener("click", function() {
    if (!gameRunning && !gameOver) {
      gameRunning = true;
      loop();
    }
  });

  pauseBtn.addEventListener("click", function() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
  });

  restartBtn.addEventListener("click", function() {
    document.location.reload();
  });

  addEventListener("load", (event) => {
    draw();
  });

  // Define ball properties
  var ballRadius = 10;
  var ballX = canvas.width / 2;
  var ballY = canvas.height / 2;
  var ballSpeedX = settings.ballSpeedX;
  var ballSpeedY = settings.ballSpeedY;

  // Define paddle properties
  var paddleHeight = 130;
  var paddleWidth = 10;
  var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  var paddleSpeed = settings.paddleSpeed;

  // Initialize player scores
  let playerScores = { "LeftPlayer": 0, "RightPlayer": 0 };
  localStorage.setItem("playerScores", JSON.stringify(playerScores));

  console.log("Initial Player Scores:", playerScores);

  // Listen for keyboard events
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  var upPressed = false;
  var downPressed = false;
  let wPressed = false;
  let sPressed = false;

  function keyDownHandler(e) {
    if (e.key === "ArrowUp") upPressed = true;
    else if (e.key === "ArrowDown") downPressed = true;
    else if (e.key === "w") wPressed = true;
    else if (e.key === "s") sPressed = true;
  }

  function keyUpHandler(e) {
    if (e.key === "ArrowUp") upPressed = false;
    else if (e.key === "ArrowDown") downPressed = false;
    else if (e.key === "w") wPressed = false;
    else if (e.key === "s") sPressed = false;
  }

  function update() {
    if (gameOver) return;

    let scores = JSON.parse(localStorage.getItem("playerScores"));

    // Move paddles
    if (upPressed && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    else if (downPressed && rightPaddleY + paddleHeight < canvas.height) rightPaddleY += paddleSpeed;

    if (wPressed && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    else if (sPressed && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += paddleSpeed;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY = -ballSpeedY;

    // Ball collision with paddles
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight)
      ballSpeedX = -ballSpeedX;
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
      ballSpeedX = -ballSpeedX;

    // Check if ball goes out (point scored)
    if (ballX < 0) {
      scores.RightPlayer++;
      localStorage.setItem("playerScores", JSON.stringify(scores));
      reset();
    } else if (ballX > canvas.width) {
      scores.LeftPlayer++;
      localStorage.setItem("playerScores", JSON.stringify(scores));
      reset();
    }

    // Check if a player has won
    if (scores.LeftPlayer === settings.maxScore) {
      playerWin("Left Player");
    } else if (scores.RightPlayer === settings.maxScore) {
      playerWin("Right Player");
    }
  }

  function playerWin(player) {
    console.log(`🎉 GAME OVER! ${player} WINS with ${settings.maxScore} points! 🎉`);
    winnerText = ` 🎉 ${player} Wins...`;
    gameOver = true;
    draw();
  }

  function reset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() * 10 - 5;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";

    // Draw middle line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.closePath();

    let textY = -50; // Start position above the canvas
    const textSpeed = 5; // Speed of the animation
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    
      if (gameOver) {
        // Move the text down until it reaches the center
        if (textY < canvas.height / 2) {
          textY += textSpeed;
        }
    
        // Display the winner message
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(winnerText, canvas.width / 2, textY);
    
        requestAnimationFrame(draw); // Continue animating
        return;
      }
    
      // Draw paddles and ball here...
    }
    
    // Call draw function when game over
    if (gameOver) {
      requestAnimationFrame(draw);
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Draw paddles
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw scores
    let scores = JSON.parse(localStorage.getItem("playerScores"));
    ctx.fillText("Score: " + scores.LeftPlayer, 10, 20);
    ctx.fillText("Score: " + scores.RightPlayer, canvas.width - 70, 20);
  }

  
  function loop() {
    if (!gameOver) {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }
  }

  

  tsParticles.load({
    id: "tsparticles",
    options: {
      autoPlay: true,
      background: {
        color: { value: "#232741" },
        
        position: "50% 50%",
        repeat: "no-repeat",
        size: "20%",
        opacity: 1
      },
      backgroundMask: {
        composite: "destination-out",
        cover: { color: { value: "#fff" }, opacity: 1 },
        enable: false
      },
      clear: true,
      defaultThemes: {},
      delay: 0,
      fullScreen: { enable: true, zIndex: 0 },
      detectRetina: true,
      duration: 0,
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: { enable: true, mode: "repulse" },
          onDiv: { selectors: [], enable: false, mode: [], type: "circle" },
          onHover: {
            enable: true,
            mode: "bubble",
            parallax: { enable: false, force: 2, smooth: 10 }
          },
          resize: { delay: 0.5, enable: true }
        },
        modes: {
          trail: { delay: 1, pauseOnStop: false, quantity: 1 },
          attract: {
            distance: 200,
            duration: 0.4,
            easing: "ease-out-quad",
            factor: 1,
            maxSpeed: 50,
            speed: 1
          },
          bounce: { distance: 200 },
          bubble: {
            distance: 250,
            duration: 2,
            mix: false,
            opacity: 0,
            size: 0,
            divs: { distance: 200, duration: 0.4, mix: false, selectors: [] }
          },
          connect: { distance: 80, links: { opacity: 0.5 }, radius: 60 },
          grab: {
            distance: 400,
            links: { blink: false, consent: false, opacity: 1 }
          },
          push: { default: true, groups: [], quantity: 4 },
          remove: { quantity: 2 },
          repulse: {
            distance: 400,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad",
            divs: {
              distance: 200,
              duration: 0.4,
              factor: 100,
              speed: 1,
              maxSpeed: 50,
              easing: "ease-out-quad",
              selectors: []
            }
          },
          slow: { factor: 3, radius: 200 },
          light: {
            area: {
              gradient: {
                start: { value: "#ffffff" },
                stop: { value: "#000000" }
              },
              radius: 1000
            },
            shadow: { color: { value: "#000000" }, length: 2000 }
          }
        }
      },
      manualParticles: [],
      particles: {
        bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
        collisions: {
          absorb: { speed: 2 },
          bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
          enable: false,
          maxSpeed: 50,
          mode: "bounce",
          overlap: { enable: true, retries: 0 }
        },
        color: {
          value: "#ffffff",
          animation: {
            h: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0
            },
            s: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0
            },
            l: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0
            }
          }
        },
        effect: { close: true, fill: true, options: {}, type: [] },
        groups: {},
        move: {
          angle: { offset: 0, value: 90 },
          attract: { distance: 200, enable: false, rotate: { x: 3000, y: 3000 } },
          center: { x: 50, y: 50, mode: "percent", radius: 0 },
          decay: 0,
          distance: {},
          direction: "none",
          drift: 0,
          enable: true,
          gravity: {
            acceleration: 9.81,
            enable: false,
            inverse: false,
            maxSpeed: 50
          },
          path: { clamp: true, delay: { value: 0 }, enable: false, options: {} },
          outModes: { default: "out" },
          random: false,
          size: false,
          speed: { min: 0.1, max: 1 },
          spin: { acceleration: 0, enable: false },
          straight: false,
          trail: { enable: false, length: 10, fill: {} },
          vibrate: false,
          warp: false
        },
        number: {
          density: { enable: true, width: 1920, height: 1080 },
          limit: { mode: "delete", value: 0 },
          value: 160
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            count: 0,
            enable: true,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none"
          }
        },
        reduceDuplicates: false,
        shadow: {
          blur: 0,
          color: { value: "#000" },
          enable: false,
          offset: { x: 0, y: 0 }
        },
        shape: { close: true, fill: true, options: {}, type: "circle" },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            count: 0,
            enable: false,
            speed: 5,
            decay: 0,
            delay: 0,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none"
          }
        },
        stroke: { width: 0 },
        zIndex: { value: 0, opacityRate: 1, sizeRate: 1, velocityRate: 1 },
        destroy: {
          bounds: {},
          mode: "none",
          split: {
            count: 1,
            factor: { value: 3 },
            rate: { value: { min: 4, max: 9 } },
            sizeOffset: true
          }
        },
        roll: {
          darken: { enable: false, value: 0 },
          enable: false,
          enlighten: { enable: false, value: 0 },
          mode: "vertical",
          speed: 25
        },
        tilt: {
          value: 0,
          animation: { enable: false, speed: 0, decay: 0, sync: false },
          direction: "clockwise",
          enable: false
        },
        twinkle: {
          lines: { enable: false, frequency: 0.05, opacity: 1 },
          particles: { enable: false, frequency: 0.05, opacity: 1 }
        },
        wobble: { distance: 5, enable: false, speed: { angle: 50, move: 10 } },
        life: {
          count: 0,
          delay: { value: 0, sync: false },
          duration: { value: 0, sync: false }
        },
        rotate: {
          value: 0,
          animation: { enable: false, speed: 0, decay: 0, sync: false },
          direction: "clockwise",
          path: false
        },
        orbit: {
          animation: {
            count: 0,
            enable: false,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false
          },
          enable: false,
          opacity: 1,
          rotation: { value: 45 },
          width: 1
        },
        links: {
          blink: false,
          color: { value: "#fff" },
          consent: false,
          distance: 100,
          enable: false,
          frequency: 1,
          opacity: 1,
          shadow: { blur: 5, color: { value: "#000" }, enable: false },
          triangles: { enable: false, frequency: 1 },
          width: 1,
          warp: false
        },
        repulse: {
          value: 0,
          enabled: false,
          distance: 1,
          duration: 1,
          factor: 1,
          speed: 1
        }
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      responsive: [],
      smooth: false,
      style: {},
      themes: [],
      zLayers: 100,
      name: "NASA",
      motion: { disable: false, reduce: { factor: 4, value: true } }
    }
  });
  