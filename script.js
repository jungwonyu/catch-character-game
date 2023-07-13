const screens = document.querySelectorAll('.screen');
const choose_cha_btns = document.querySelectorAll('.choose-cha-btn');
const start_btn = document.getElementById('start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

let seconds = 0;
let score = 0;
let selected_cha = {};

// 시작 버튼
start_btn.addEventListener('click', () => screens[0].classList.add('on'));

// 캐릭터 선택
choose_cha_btns.forEach((btn) => {
  btn.addEventListener('click', () => {
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
  setInterval(increaseTime, 1000);
}

// 시간 증가
function increaseTime() {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  
  // 30초에 게임 종료
  if (seconds === 30) {
    message.classList.add('visible');
    gameEnd();
  } else {
    seconds++;
  }
  timeEl.innerHTML = `Time: ${m}:${s}`;
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
  increaseScore();
  this.classList.add('caught');
  setTimeout(() => this.remove(), 2000);
  addChas();
}

// 캐릭터 더하기
function addChas() {
  setTimeout(createCha, 1000);
  setTimeout(createCha, 1500);
}

// 점수 증가
function increaseScore() {
  score++;
  scoreEl.innerHTML = `Score: ${score}`;
}

// 게임 종료
function gameEnd() {
  game_container.innerHTML = `<h1>Time Over</h1>
  <p>Your final score is ${score}</p><button class="btn" onclick="location.reload()">REDO</button>`;
}

