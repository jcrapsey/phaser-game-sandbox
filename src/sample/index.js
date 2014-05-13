var BlackCat = require('./BlackCat');

var blackCat;
var game;
var cursors;

var preload = function preload(){
  game.load.spritesheet("black_cat", "assets/black_cat.png", 128, 128, 6);
};

var create = function create(){

  cursors = game.input.keyboard.createCursorKeys();

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 250;

  blackCat = new BlackCat(game);
};

var update = function update(){
  blackCat.update({cursors: cursors});
};

game = new Phaser.Game(480, 230, Phaser.AUTO, "game-container", {
  preload: preload,
  create:  create,
  update: update
});
