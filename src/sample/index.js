(function(){
  var blackCat;

  var preload = function preload(){
    GAME.game.load.spritesheet("black_cat", "assets/black_cat.png", 128, 128, 6);
  };

  var create = function create(){
    var game = GAME.game;

    GAME.cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 250;

    blackCat = new BlackCat();
  };

  var update = function update(){
    blackCat.update();
  };

  GAME.game = new Phaser.Game(480, 230, Phaser.AUTO, "game-container", {
    preload: preload,
    create:  create,
    update: update
  });
}());