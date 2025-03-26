const screens = document.querySelectorAll('.screen');
const choose_cha_btns = document.querySelectorAll('.choose-cha-btn');
const start_btn = document.getElementById('start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

const SND_CLICK = new Audio('./sound/click.mp3');
const SND_SUCCESS = new Audio('./sound/success.mp3');
const SND_BUTTON = new Audio('./sound/button.mp3');
const SND_FAIL = new Audio('./sound/fail.mp3');

let seconds = 0;
let score = 0;
let selected_cha = {};
let timeInterval = [];
let createTimer = [];

// 시작 버튼
start_btn.addEventListener('click', () => {
  SND_BUTTON.play();
  screens[0].classList.add('on');
});

// 캐릭터 선택
choose_cha_btns.forEach((btn) => {
  btn.addEventListener('click', () => {
    SND_BUTTON.play();
    const img = btn.querySelector('img');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    selected_cha = { src, alt };
    screens[1].classList.add('on');
    setTimeout(createCha, 1000);
    startGame();
  });
});

// 게임 시작
function startGame() {
  timeInterval.push(setInterval(countdownTimer, 1000));
}

// 시간 감소
function countdownTimer() {
  if (seconds === 30) {
    message.classList.add('visible');
    gameEnd();
  } else {
    seconds++;
  }
  timeEl.innerHTML = `Time: ${30 - seconds}`;
}

// 캐릭터 생성
function createCha() {
  const cha = document.createElement('div');
  const { x, y } = getRandomLocation();

  cha.classList.add('cha');
  cha.style.top = `${y}px`;
  cha.style.left = `${x}px`;
  cha.innerHTML = `<img src="${selected_cha.src}" alt="${selected_cha.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
  cha.addEventListener('click', catchCha);
  game_container.appendChild(cha);
}

// 폭탄 생성
function createBomb() {
  const bomb = document.createElement('div');
  const { x, y } = getRandomLocation();

  bomb.classList.add('bomb');
  bomb.style.top = `${y}px`;
  bomb.style.left = `${x}px`;
  bomb.innerHTML = `<img src="./images/bomb.png" style="transform: rotate(${Math.random() * 360}deg)" />`;
  bomb.addEventListener('click', catchBomb);
  game_container.appendChild(bomb);
}

// 위치
function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  return { x, y };
}

// 캐릭터 잡았을 때
function catchCha() {
  SND_CLICK.play();
  increaseScore();
  this.classList.add('caught');
  setTimeout(() => this.remove(), 1000);
  addChas();
}

// 폭탄 잡았을 때
function catchBomb() {
  SND_FAIL.play();
  this.remove();
  resetScore();
}

// 캐릭터 더하기
function addChas() {
  createTimer.push(setTimeout(createCha, 1000));
  createTimer.push(setTimeout(createCha, 1500));
  createTimer.push(setTimeout(createBomb, 3000));
}

// 점수 증가
function increaseScore() {
  score++;
  scoreEl.innerHTML = `Score: ${score}`;
}

// 점수 초기화
function resetScore() {
  score = 0;
  scoreEl.innerHTML = `Score: ${score}`;
}

// 게임 종료
function gameEnd() {
  clearInterval(timeInterval);
  SND_SUCCESS.play();
  createTimer.forEach((cha) => clearTimeout(cha));
  game_container.innerHTML = `<h1>Time Over</h1>
  <p>Your final score is ${score}.</p><button class="btn" onclick="location.reload()">REDO</button>`;
}