/* index.js - Tic•Tac•Glow game logic + animations */
const boardEl = document.getElementById('board');
const turnPlayerEl = document.getElementById('turnPlayer');
const restartBtn = document.getElementById('restart');
const overlay = document.getElementById('overlay');
const resultText = document.getElementById('resultText');
const resultIcon = document.getElementById('resultIcon');
const overlayRestart = document.getElementById('overlayRestart');

let board = Array(9).fill(null);
let current = 'X';
let running = true;

const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard(){
  boardEl.innerHTML = '';
  board.forEach((v,i)=>{
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('data-i', i);
    cell.setAttribute('aria-label', `cell ${i+1}`);
    cell.addEventListener('click', onCell);
    boardEl.appendChild(cell);
  });
}

function onCell(e){
  if(!running) return;
  const i = Number(e.currentTarget.dataset.i);
  if(board[i]) return;
  board[i] = current;
  e.currentTarget.classList.add(current === 'X' ? 'x' : 'o');
  e.currentTarget.textContent = current;
  checkState();
  current = current === 'X' ? 'O' : 'X';
  turnPlayerEl.textContent = current;
}

function checkState(){
  // check for win
  for(const combo of WIN_COMBINATIONS){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      // win
      finish(board[a], combo);
      return;
    }
  }
  if(board.every(Boolean)){
    finish(null, null); // draw
  }
}

function finish(winner, combo){
  running = false;
  const cells = [...boardEl.children];
  if(winner){
    // highlight winning cells
    combo.forEach(i=> cells[i].classList.add('win'));
    // show overlay and animation
    if(winner === 'X'){
      resultText.textContent = 'X wins — Nice play!';
      showIcon('trophy');
      fireworks();
    } else {
      resultText.textContent = 'O wins — Tough luck.';
      showIcon('sad');
      boardEl.classList.add('shake');
    }
  } else {
    resultText.textContent = "It's a draw.";
    showIcon('draw');
  }
  overlay.classList.add('show');
}

function showIcon(type){
  // use external SVG icons (CDN) to keep project to three files
  const icons = {
    trophy: 'https://cdn.jsdelivr.net/gh/tabler/tabler-icons@1.39.1/icons/trophy.svg',
    sad: 'https://cdn.jsdelivr.net/gh/tabler/tabler-icons@1.39.1/icons/mood-sad.svg',
    draw: 'https://cdn.jsdelivr.net/gh/tabler/tabler-icons@1.39.1/icons/handshake.svg'
  };
  const url = icons[type];
  resultIcon.innerHTML = `<img src="${url}" alt="${type}">`;
  resultIcon.querySelector('img').style.width = '88px';
}

function fireworks(){
  // simple confetti by creating colored spans
  const colors = ['#00e0a3','#7c5cff','#ffd166','#ff7ab6'];
  const frag = document.createDocumentFragment();
  for(let i=0;i<36;i++){
    const p = document.createElement('span');
    p.className = 'confetti';
    p.style.position = 'fixed';
    p.style.left = Math.random()*100 + '%';
    p.style.top = Math.random()*20 + '%';
    p.style.width = p.style.height = (6+Math.random()*8) + 'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.borderRadius = (Math.random()>0.5? '50%':'2px');
    p.style.opacity = (0.8+Math.random()*0.5).toString();
    p.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    p.style.zIndex = 9999;
    const dur = 1200 + Math.random()*800;
    p.style.transition = `transform ${dur}ms cubic-bezier(.2,.9,.2,1), opacity ${dur}ms linear`;
    frag.appendChild(p);
    // animate
    requestAnimationFrame(()=>{
      p.style.transform = `translateY(${200 + Math.random()*400}px) rotate(${Math.random()*720}deg) translateX(${(Math.random()-0.5)*200}px)`;
      p.style.opacity = '0';
    });
    setTimeout(()=> p.remove(), dur+80);
  }
  document.body.appendChild(frag);
}

function reset(){
  board = Array(9).fill(null);
  current = 'X';
  running = true;
  turnPlayerEl.textContent = current;
  overlay.classList.remove('show');
  boardEl.classList.remove('shake');
  createBoard();
}

restartBtn.addEventListener('click', reset);
overlayRestart.addEventListener('click', reset);

// init
createBoard();
