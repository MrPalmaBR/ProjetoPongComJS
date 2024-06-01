// Variáveis da bolinha
let xBolinha;
let yBolinha;
let diametroBolinha = 20;
let raioBolinha = diametroBolinha / 2;

// Velocidade da bolinha
let velocidadeXBolinha = 10;
let velocidadeYBolinha = 10;

// Variáveis da minha raquete
let xMinhaRaquete;
let yMinhaRaquete;
let espessuraMinhaRaquete = 10;
let alturaMinhaRaquete = 80;
let velocidadeMinhaRaquete = 12;

// Variáveis da raquete do oponente
let xRaqueteOponente;
let yRaqueteOponente;
let espessuraRaqueteOponente = espessuraMinhaRaquete;
let alturaRaqueteOponente = alturaMinhaRaquete;
let velocidadeYOponente = velocidadeMinhaRaquete;

// Outras variáveis
let colidiu = false;
let velocidadeMaximaOponente = 4;
let rastroBolinha = [];

// Variáveis para controlar os níveis
let ultimoNivelAumentado = 0;
let ultimoNivelReduzido = 0;
let pontosMudancaFase = 3;

// Sons do jogo
let raquetada;
let ponto;
let trilha;

// Placar do jogo
let meusPontos = 0;
let pontosOponente = 0;

function setup() {
  createCanvas(600, 450);
  xBolinha = width / 2;
  yBolinha = height / 2;
  xMinhaRaquete = 10;
  yMinhaRaquete = height / 2 - alturaMinhaRaquete / 2;
  xRaqueteOponente = width - (10 + espessuraRaqueteOponente);
  yRaqueteOponente = yMinhaRaquete;
  trilha.loop();
}

function draw() {
  background(0);
  fill("green");
  mostraBolinha();
  movimentaBolinha();
  verificaColisaoBorda();
  mostraRaquete(xMinhaRaquete, yMinhaRaquete);
  mostraRaquete(xRaqueteOponente, yRaqueteOponente);
  movimentaMinhaRaquete();
  verificaColisaoRaquete(xMinhaRaquete, yMinhaRaquete);
  verificaColisaoRaquete(xRaqueteOponente, yRaqueteOponente);
  movimentaRaqueteOponente();
  incluiPlacar();
  marcaPonto();
  bolinhaNaoFicaPresa();
  aumentaNivelOponente();
  reduzNivelOponente();
  rastroDaBolinha();
}

function rastroDaBolinha(){
  rastroBolinha.push({ x: xBolinha, y: yBolinha });
  if (rastroBolinha.length > 3) {
    rastroBolinha.shift();
  }
  for (let i = 0; i < rastroBolinha.length; i++) {
    let opacidade = map(i, 0, rastroBolinha.length - 1, 255, 0); // Opacidade decrescente
    fill(255, opacidade); // Define a cor e opacidade
    circle(rastroBolinha[i].x, rastroBolinha[i].y, diametroBolinha);
  }
}

function mostraBolinha() {
  circle(xBolinha, yBolinha, diametroBolinha);
}

function movimentaBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function mostraRaquete(x, y) {
  rect(x, y, espessuraMinhaRaquete, alturaMinhaRaquete);
}

function verificaColisaoBorda() {
  if (xBolinha + raioBolinha > width || xBolinha - raioBolinha < 0) {
    velocidadeXBolinha *= -1;
  }

  if (yBolinha + raioBolinha > height || yBolinha - raioBolinha < 0) {
    velocidadeYBolinha *= -1;
  }
}

function movimentaMinhaRaquete() {
  if (keyIsDown(UP_ARROW)) {
    yMinhaRaquete -= velocidadeMinhaRaquete;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yMinhaRaquete += velocidadeMinhaRaquete;
  }
  yMinhaRaquete = constrain(yMinhaRaquete, 0, height - alturaMinhaRaquete);
}

function verificaColisaoRaquete(x, y) {
  colidiu = collideRectCircle(
    x,
    y,
    espessuraMinhaRaquete,
    alturaMinhaRaquete,
    xBolinha,
    yBolinha,
    raioBolinha
  );
  if (colidiu) {
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

/*function movimentaRaqueteOponente() {
  if (keyIsDown(87)) {
    yRaqueteOponente -= velocidadeYOponente;
  }
  if (keyIsDown(83)) {
    yRaqueteOponente += velocidadeYOponente;
  }
  yRaqueteOponente = constrain(
    yRaqueteOponente,
    0,
    height - alturaRaqueteOponente
  );
}*/

function movimentaRaqueteOponente() {
  velocidadeYOponente =
    yBolinha - yRaqueteOponente - alturaMinhaRaquete / 2 - 30;
  velocidadeYOponente = constrain(
    velocidadeYOponente,
    -velocidadeMaximaOponente,
    velocidadeMaximaOponente
  ); // Limita a velocidade
  yRaqueteOponente += velocidadeYOponente;
}

function incluiPlacar() {
  fill("orange");
  rect(174, 28, 50, 30);
  rect(375, 28, 50, 30);
  fill("white");
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(20);
  text(meusPontos, 200, 50);
  text(pontosOponente, 400, 50);
}

function marcaPonto() {
  if (xBolinha > 595) {
    meusPontos++;
    ponto.play();
  }
  if (xBolinha < 5) {
    pontosOponente++;
    ponto.play();
  }
}

function preload() {
  trilha = loadSound("trilha.mp3");
  ponto = loadSound("ponto.mp3");
  raquetada = loadSound("raquetada.mp3");
}

function bolinhaNaoFicaPresa() {
  if (xBolinha - raioBolinha < 0) {
    xBolinha = 20;
  }
  if (xBolinha + raioBolinha > width) {
    xBolinha = width - 20;
  }
}

function aumentaNivelOponente() {
  if (
    meusPontos % pontosMudancaFase == 0 &&
    meusPontos > 0 &&
    meusPontos > ultimoNivelAumentado &&
    velocidadeMaximaOponente <= 9
  ) {
    velocidadeMaximaOponente += 1;
    ultimoNivelAumentado = meusPontos; // Atualiza o último nível em que o aumento ocorreu
    console.log(
      "Nível do oponente aumentado! Velocidade: " + velocidadeMaximaOponente
    ); // Mensagem no console (opcional)
  }
}

function reduzNivelOponente() {
  if (
    pontosOponente % pontosMudancaFase == 0 &&
    pontosOponente > 0 &&
    pontosOponente > ultimoNivelReduzido &&
    velocidadeMaximaOponente > 3
  ) {
    // Define o limite mínimo para a velocidade
    velocidadeMaximaOponente -= 1;
    ultimoNivelReduzido = pontosOponente;
    console.log(
      "Nível do oponente reduzido! Velocidade: " + velocidadeMaximaOponente
    );
  }
}
