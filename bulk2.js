let sx = 400, sy = 300;
let x = -200, y = 0, ix = -200;
let vy = -1, vx = 0, ivy = -1;
const G = 1;
let sm = 1000, m = 10;
let maxv, pocot;
let play = false, resetting = false;

let a, b, fd, ecc, T, focix, fociy, cx, cy, am, bm;
let hyperbolic = false;

let arx = [], ary = [], arvx = [], arvy = [], arn=0;
let time = 0, pret;
let needpre=false;

let zoom = 1;

let unable = false, calculating=false;

let test = "waiting";

function setup() {
  createCanvas(1150, 600);
  background(0);
  cale();
  pre();
}
let testx = 0;
function draw() {
  background(0);
  translate(sx, sy);
  scale(zoom);
  orbit();
  planet();
  star();
  scale(1/zoom);
  translate(-sx, -sy);
  if (play) {
    move();
  }
  buttons();
  varplay();
  if (calculating) {
    textAlign(LEFT);
    fill(255);
    fill(255, 0, 0);
    text("calculating", 50, 100);
  }
  stroke(200);
  line(800, 0, 800, height);
}

let margin = 25;
let ls = 22;
let variablestoshow = ["distance", "speed", "gravitational attraction", "acceleration", "gravitational potential energy", "kinetic energy", "total energy", "momentum",/* "angular speed", "angular momentum", "\"centrifugal\" force",*/ "mass of star", "mass of planet"];
let variablestoshow2 = ["eccentricity", "semi-major axis", "semi-minor axis", "focal distance", "period of orbit"];

function varplay() {    // variables display=
  fill(225);
  let tx = 800 + margin, ty = 60;
  let r = Py(x, y);
  let v = Py(vx, vy);
  let f = G*sm*m/(r*r);
  let Ek = 0.5*m*v*v;
  let Egrav = -f*r;
  let ts = 0;  // tangential speed
  let variablestoshowv = [r, v, f, f / m, Egrav, Ek, Ek + Egrav, m * v,/* ts / r, ts*m*r, 0,*/ sm, m];
  for (let iterator = 0; iterator < variablestoshow.length; iterator++) {
    noStroke();
    ty += ls;
    text(variablestoshow[iterator], tx, ty);
    textAlign(RIGHT);
    text(Number.parseFloat(variablestoshowv[iterator]).toPrecision(4), width - margin, ty);
    textAlign(LEFT);
    stroke(30);
    line(800 + margin, ty - 16, width - margin, ty - 16);
  }
  if (!hyperbolic) {
    ty = height - 60;
    variablestoshowv = [ecc, a, b, fd, T];
    for (let iterator = 0; iterator < variablestoshow2.length; iterator++) {
      noStroke();
      ty -= ls;
      text(variablestoshow2[iterator], tx, ty);
      textAlign(RIGHT);
      text(Number.parseFloat(variablestoshowv[iterator]).toPrecision(4), width - margin, ty);
      textAlign(LEFT);
      stroke(30);
      line(800 + margin, ty - 16, width - margin, ty - 16);
    }
  }
}

let bs = [];
bs[0] = 40;    // play button
bs[1] = [40, 40];    // reset button
bs[2] = 60;    // width of adjust selection buttons
bs[3] = [30, 30];
let selected = 0;

function mouseClicked() {
  if (mouseX < bs[0] && mouseY < bs[0] && !resetting) {
    play = !play;
    if (play && needpre) {
      calculating = true;
      pre();
      needpre=false;
    }
  } else if (mouseY + bs[1][1] > height && mouseX < bs[1][0]) {
    clickedsoreset();
  } else if (mouseY + bs[1][1] > height && mouseX < bs[1][0] + bs[2] * 4) {
    selected = Math.floor((mouseX - bs[1][0]) / bs[2]);
  } else if (mouseY + bs[3][1] > height && mouseX > 800 && mouseX < 800 + (2 * bs[3][0])) {
    if (mouseX - 800 > bs[3][0]) {
      zoom *= 1.25;
    } else {
      zoom /= 1.25;
    }
  }
}

function clickedsoreset() {
  resetting = !resetting;
  if (resetting) {
    play = false;
    x = ix;
    y = 0;
    vx = 0;
    vy = ivy;
    time = 0;
  }
}

let smouseX, smouseY;
let svalue;
let changenow;

function mousePressed() {
  if (resetting && mouseY > bs[0] && mouseY + bs[1][1] < height) {
    smouseX = mouseX;
    smouseY = mouseY;
    if (selected == 0) {
      svalue = x + 0;
    } else if (selected == 1) {
      svalue = vy + 0;
    } else if (selected == 2) {
      svalue = sm + 0;
    } else if (selected == 3) {
      svalue = m + 0;
    }
    changenow = true;
  }
}

function mouseDragged() {
  
  if (resetting && changenow) {
    needpre=true;
    time=0;
    let del = mouseX - smouseX;
    if (selected == 0) {
      x = svalue + del;
      if (x > -50) {
        x = -50;
      }
      ix = x+0;
      
    } else if (selected == 1) {
      vy = svalue - (del * 0.001);
      ivy = vy + 0;
    } else if (selected == 2) {
      sm = sm + del;
      if (sm < 100) {
        sm = 100;
      }
    } else if (selected == 3) {
      if (m + del < sm * 0.01 && m + del > 0) {
        m = m + del;
      }
    }
    cale();
  }
}

function mouseReleased() {
  changenow=false;
}

function buttons() {
  message = '';
  fill('red');
  rect(0, 0, bs[0], bs[0]);
  textAlign(CENTER);
  fill(255);
  if(play){
    message = 'pause';
  } else {
    message = 'play';
  }
  text(message, bs[0]/2, bs[0]/2);
                                // play/pause
                                
  fill(190, 42, 245);
  rect(0, height - bs[1][1], bs[1][0], bs[1][1]);
  fill(255);
  if (!resetting) {
    message = 'reset';
  } else {
    message = 'done';
  }
  text(message, bs[1][0] / 2, height - (bs[1][1] / 2));
                                // reset
  
  if (resetting){
    stroke(190, 42, 245);
    let bx = bs[1][0]+0;
    let by = height - bs[1][1];
    for (let iterator = 0; iterator < 4; iterator++) {
      if (iterator == selected) {
        fill(151, 104, 240);
      } else {
        fill(122, 60, 240);
      }
      rect(bx + (iterator * bs[2]), by, bs[2], bs[1][1]);
    }
    fill(200);
    noStroke();
    by = by + (bs[1][1] / 2);
    bx = bx + (bs[2] / 2);
    text("position", bx, by);
    bx = bx + bs[2];
    text("speed", bx, by);
    bx = bx + bs[2];
    text("star\nmass", bx, by);
    bx = bx + bs[2];
    text("planet\nmass", bx, by);
    textAlign(LEFT);
    fill(200, 45, 30);
    let choices = ["position", "speed", "star mass", "planet mass"];
    text("Drag to adjust " + choices[selected], 30, height - (bs[1][1]*1.5));
  }
  
  textAlign(CENTER);
  stroke(150);
  fill(100);
  rect(800, height - bs[3][1], bs[3][0], bs[3][1]);
  rect(800 + bs[3][0], height - bs[3][1], bs[3][0], bs[3][1]);
  noStroke();
  fill(150);
  text("-", 800 + (bs[3][0]/2), height - (bs[3][1]/2));
  text("+", 800 + (bs[3][0]*1.5), height - (bs[3][1]/2));
  textAlign(LEFT);
}

function pre() {
  let starttime = millis()+0;
  scrutiny = 10000;
  textAlign(LEFT);
  fill(255, 0, 0);
  text("calculating", 50, 100);
  pre1(scrutiny);
  if (Py(arx[0]-arx[arn-1], ary[0]-ary[arn-1]) > 0.5) {
    unable = true;
    clickedsoreset();
  }
  /*while(Py(arx[0]-arx[arn-1], ary[0]-ary[arn-1]) > 1.1 && workon) {
    scrutiny *= 10;
    pre1(scrutiny);
    if (millis() - starttime > 10000) {
      unable = true;
      clickedsoreset(); // though not clicked, doing what would have been if was clicked
      break;
    } else {
      unable = false;
    }
  }*/
}

function pre1(scrutiny) {
  pret = 1/maxv;
  arn = 0;
  let acct = pret/scrutiny;
  for (let iterator = 0; iterator < T / acct; iterator++) {
    if(iterator%scrutiny == 0) {
      let target = iterator/scrutiny;
      arx[target] = x;
      ary[target] = y;
      arvx[target] = vx;
      arvy[target] = vy;
      arn++;
    }
    moves(acct);
  }
}

function cale() {
  if (y == 0 && vx == 0){
    hyperbolic = false;
    v = Py(vx, vy);
    r = Math.abs(x);
    Ek = 0.5 * m * v * v;
    Egrav = -G*sm*m/r;
    if (Ek / (-Egrav) < 0.5) {
        ecc = (0.5 - (Ek / -Egrav)) * 2;
        fd = (ecc * r) / (1 + ecc);
        a = r - fd;
        b = Math.sqrt(sq(a) - sq(fd));
        focix = x * ((fd + fd) / r);
        fociy = y * ((fd + fd) / r);
        cx = focix / 2;
        cy = fociy / 2;
        am = a + a;
        bm = b + b;
        minEgrav = -G*sm*m/(am + x);
        maxEk = Ek + Egrav - minEgrav;
        maxv = Math.sqrt(maxEk / (0.5 * m));
      } else if (Ek / (-Egrav) > 0.5 && Ek / (-Egrav) < 1) {
        ecc = ((Ek / (-Egrav))- 0.5) * 2;  //0.3
        fd = (ecc * r) / (1 - ecc);
        a = r + fd;
        b = Math.sqrt(sq(a) - sq(fd));
        focix = /*(x * ((fd + fd) / r))*/fd+fd;
        fociy = /*(y * ((fd + fd) / r))*/0;
        cx = (focix) / 2;
        cy = (fociy) / 2;
        am = a + a;
        bm = b + b;
        maxv = Math.sqrt(Ek / (0.5 * m));
      } else if (Ek / -Egrav == 0.5) {
        ecc = 0;
        fd = 0;
        a = r;
        b = a;
        focix = sx;
        fociy = sy;
        cx = sx;
        cy = sy;
        am = a + a;
        bm = b + b;
        maxv = Math.abs(vy);
      } else {
        hyperbolic = true;
      }
      T = Math.sqrt((39.478417604 * a*a*a) / (G * sm));
      pocot = 1 / maxv;
  } else {
    console.log("can't predict orbit ¯\_(<_<)_/¯");
  }
}
/*
function move() {
  times = Math.ceil(maxv * 1000);
  for (let iterator = 0; iterator < times; iterator++) {
    moves(1 / times);
  }
}
*/
function move() {
  let target = Math.floor((time%T)/pret);
  x = arx[target];
  y = ary[target];
  vx = arvx[target];
  vy = arvy[target];
  time++;
}

function moves(smallt){
  r = Py(x,y);
  f = -G * sm * m / (r*r);
  acc = f / m;
  ax = acc * x/r;
  ay = acc * y/r;
  x = x + (vx * smallt) + (0.5 * ax * smallt * smallt);
  y = y + (vy * smallt) + (0.5 * ay * smallt * smallt);
  vx = vx + (ax * smallt);
  vy = vy + (ay * smallt);
}

function cnsole() {
  if (unable) {
    noStroke();
    fill(255, 0, 0);
    text("sorry, can not suitably predict orbit", 50, 100);
  }
}

function orbit () {
  if (!hyperbolic) {
    noFill();
    stroke(150);
    ellipse(cx, cy, am, bm);
    stroke(50);
    line(focix, fociy, x, y);
    line(0, 0, x, y);
  }
}

function planet(){
  fill('#1EF54E');
  noStroke();
  ellipse(x, y, 12, 12);
}

function star(){
  let sw = 50;
  let wr = sw/2;
  for (let ww = sw; ww>=wr; ww-=2/zoom) {
    let ratio = (sw-ww) / wr;
    fill(255 * ratio, 255 * ratio, 255 * ratio);
    ellipse(0, 0, ww, ww);
  }
}

function Py(a,b){
  return Math.sqrt((a*a)+(b*b));
}
