function lo00_board() {
  let id = 00;
  let cont = document.getElementById(id + "-content-content");
  cont.innerHTML = `<div  id='00-board-head'><img id='00-flags-1' style='padding-left:10px;' src='src/sprites/dig-0.png'><img id='00-flags-2' src='src/sprites/dig-0.png'><img id='00-flags-3' src='src/sprites/dig-0.png'><img id='00-face' style='padding-left:10px;padding-right:10px;' src='src/sprites/smiley.png'><img id='00-time-1' src='src/sprites/dig-0.png'><img id='00-time-2' src='src/sprites/dig-0.png'><img id='00-time-3' src='src/sprites/dig-0.png'></div>`;
  let width = 9;
  let height = 10;
  let board = [];
  let score = 0;
  let time = 0;
  let timer = setInterval(() => {
    try {
      time += 1;
      let ttime = (`00` + time.toString()).split(``);
      document.getElementById(`00-time-3`).src = `src/sprites/dig-${
        ttime[ttime.length - 1]
      }.png`;
      document.getElementById(`00-time-2`).src = `src/sprites/dig-${
        ttime[ttime.length - 2]
      }.png`;
      document.getElementById(`00-time-1`).src = `src/sprites/dig-${
        ttime[ttime.length - 3]
      }.png`;
    } catch (e) {
      clearInterval(timer);
    }
  }, 1000);
  let bombs = 0;
  let max_bombs = 10;
  for (let i = 0; i != height; i++) {
    let temp = [];
    for (let i = 0; i != width; i++) {
      if (Math.random() < 0.13 && bombs < max_bombs) {
        temp.push(-1);
        bombs++;
      } else {
        temp.push(0);
      }
    }
    board.push(temp);
  }
  for (let i = 0; i != board.length; i++) {
    for (let ii = 0; ii != board[i].length; ii++) {
      if (board[i][ii] != -1) {
        board[i][ii] =
          (i != 0 ? board[i - 1][ii] == -1 : 0) +
          (i != 0 && ii != 0 ? board[i - 1][ii - 1] == -1 : 0) +
          (ii != 0 ? board[i][ii - 1] == -1 : 0) +
          (i != height - 1 && ii != 0 ? board[i + 1][ii - 1] == -1 : 0) +
          (i != height - 1 ? board[i + 1][ii] == -1 : 0) +
          (i != height - 1 && ii != width - 1
            ? board[i + 1][ii + 1] == -1
            : 0) +
          (ii != width - 1 ? board[i][ii + 1] == -1 : 0) +
          (i != 0 && ii != width - 1 ? board[i - 1][ii + 1] == -1 : 0);
      }
    }
  }
  let tbombs = (`00` + bombs.toString()).split(``);
  document.getElementById(`00-flags-3`).src = `src/sprites/dig-${
    tbombs[tbombs.length - 1]
  }.png`;
  document.getElementById(`00-flags-2`).src = `src/sprites/dig-${
    tbombs[tbombs.length - 2]
  }.png`;
  document.getElementById(`00-flags-1`).src = `src/sprites/dig-${
    tbombs[tbombs.length - 3]
  }.png`;
  for (let l in board) {
    for (let ll in board[l]) {
      cont.innerHTML +=
        '<img id="00-board-' +
        l +
        "-" +
        ll +
        '" onclick="if(this.src.includes(`space-flag.png`)){return};let board = ' +
        JSON.stringify(board) +
        ";if(" +
        board[l][ll] +
        "==-1){for(let i in board){for(let ii in board[i]){document.getElementById(`00-board-${i}-${ii}`).onclick = null;document.getElementById(`00-board-${i}-${ii}`).oncontextmenu = null;if(board[i][ii]==-1){document.getElementById(`00-board-${i}-${ii}`).src=`src/sprites/space-bomb.png`;};};};this.src=`src/sprites/bomb-ex.png`;document.getElementById(`00-face`).src=`src/sprites/dead.png`;clearInterval(" +
        timer +
        ");}else{(function rev(x,y){if(board[y][x]!=0){return};if(x>0){ for(let i = x-1; i>=0; i--){if(document.getElementById(`00-board-${y}-${i}`).src.includes(`src/sprites/space-uncl.png`)==false){break};document.getElementById(`00-board-${y}-${i}`).src=`src/sprites/space-${board[y][i]}.png`;if(board[y][i]!=0){break};rev(i,y); }; };; if(y>0){ for(let i = y-1; i>=0; i--){if(document.getElementById(`00-board-${i}-${x}`).src.includes(`src/sprites/space-uncl.png`)==false){break};document.getElementById(`00-board-${i}-${x}`).src=`src/sprites/space-${board[i][x]}.png`;if(board[i][x]!=0){break};rev(x,i); }; }; ;;;  if(x<board[0].length-1){ for(let i = x+1; i<=board[0].length-1; i++){if(document.getElementById(`00-board-${y}-${i}`).src.includes(`src/sprites/space-uncl.png`)==false){break};document.getElementById(`00-board-${y}-${i}`).src=`src/sprites/space-${board[y][i]}.png`;if(board[y][i]!=0){break};rev(i,y); }; };; if(y<board.length-1){ for(let i = y+1; i<=board.length-1; i++){if(document.getElementById(`00-board-${i}-${x}`).src.includes(`src/sprites/space-uncl.png`)==false){break};document.getElementById(`00-board-${i}-${x}`).src=`src/sprites/space-${board[i][x]}.png`;if(board[i][x]!=0){break};rev(x,i); }; };;   })(" +
        ll +
        "," +
        l +
        ");document.getElementById(`00-face`).src = `src/sprites/shock.png`;setTimeout(()=>{document.getElementById(`00-face`).src = `src/sprites/smiley.png`;},700);document.getElementById(this.id).src=`src/sprites/space-" +
        board[l][ll] +
        '.png`;};for(let b in board){for(let bb in board[b]){if(board[b][bb]!=-1&&(document.getElementById(`00-board-${b}-${bb}`).src.includes(`space-uncl`)||document.getElementById(`00-board-${b}-${bb}`).src.includes(`space-flag`))){console.log(b,bb,board[b][bb]);return false};}};;document.getElementById(`00-face`).src = `src/sprites/cool.png`;for(let z in board){for(let zz in board[z]){document.getElementById(`00-board-${z}-${zz}`).onclick = null;document.getElementById(`00-board-${z}-${zz}`).oncontextmenu = null;};}" oncontextmenu="let b3 = document.getElementById(`00-flags-3`).src; b3 = b3.split(`-`)[b3.split(`-`).length-1].split(`.`)[0];let b2 = document.getElementById(`00-flags-2`).src; b2 = b2.split(`-`)[b2.split(`-`).length-1].split(`.`)[0];let b1 = document.getElementById(`00-flags-1`).src; b1 = b1.split(`-`)[b1.split(`-`).length-1].split(`.`)[0];let bombs = parseInt(b1+b2+b3);if(this.src.includes(`space-flag.png`)){this.src=`src/sprites/space-uncl.png`;bombs++;}else{if(bombs>0){this.src=`src/sprites/space-flag.png`;bombs--;}};let tbombs = (`00` + bombs.toString().replace(/-/g,`0`)).split(``);document.getElementById(`00-flags-3`).src =`src/sprites/dig-${tbombs[tbombs.length -1]}.png`;document.getElementById(`00-flags-2`).src =`src/sprites/dig-${tbombs[tbombs.length -2]}.png`;document.getElementById(`00-flags-1`).src =`src/sprites/dig-${tbombs[tbombs.length -3]}.png`;;return false;" src="src/sprites/space-uncl.png">';
    }
  }
  document.getElementById(`00-face`).onclick = () => {
    lo00_board();
  };
}
lo00_board();
