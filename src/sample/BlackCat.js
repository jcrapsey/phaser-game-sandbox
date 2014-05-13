var BlackCat = function(game){
  var s = game.add.sprite(0, 0, "black_cat");

  s.physicsBodyType = Phaser.Physics.ARCADE;
  game.physics.enable(s, Phaser.Physics.ARCADE);

  s.scale.x = 0.5;
  s.scale.y = 0.5;

  s.anchor.x = 0.5;
  s.anchor.y = 1;

  s.animations.add("ball", [0], 0, false);
  s.animations.add("pickup", [1], 0, false);
  s.animations.add("blink", [4, 2, 3, 4], 6, false);
  s.animations.add("idle", [4], 0, false);

  s.animations.play("blink");

  s.body.bounce.y = 0.6;
  s.body.gravity.y = 9.5;
  s.body.collideWorldBounds = true;

  this.sprite = s;
};

BlackCat.prototype.update = function(options){
  var s = this.sprite;
  var cursors = options.cursors;

  if(s.body.velocity.y > 0){
    s.animations.play("ball");
  }else{
    s.animations.play("idle");
  }

  if(s.body.velocity.x > 0){
    s.scale.x = -0.5;
  }

  if(s.body.velocity.x < 0){
    s.scale.x = 0.5;
  }

  if(cursors.left.isDown){
    s.body.velocity.x = -50;
  }

  if(cursors.right.isDown){
    s.body.velocity.x = 50;
  }

  if(
    !cursors.right.isDown &&
    !cursors.left.isDown
  ){
    s.body.velocity.x = 0;
  }

  if(cursors.up.isDown){
    s.body.velocity.y = 500;
  }
};

module.exports = BlackCat;