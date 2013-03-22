/**
 * Created with JetBrains PhpStorm.
 * User: misa.guo
 * Date: 12-12-17
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */

var blocks = []
    , snake, map, move;

// 生成地图
function init(){
    
    // 初始化地图
    map = new Map();
    // 初始化蛇
    snake = new Snake();
    // 每0.2秒让蛇移动
    setInterval(function(){
        snake.move();
    }, 200);

    move = new Move(snake);
    // 生成蛋
    map.dropEgg();
    document.onkeydown = function(e){
        var moveTo = e.keyIdentifier;
        switch(moveTo){
            case 'Left':
                move.moveLeft();
                return false;
                break;
            case 'Right':
                move.moveRight();
                return false;
                break;
            case 'Up':
                move.moveUp();
                return false;
                break;
            case 'Down':
                move.moveDown();
                return false;
                break;
            default:
                return false;
        }
    }

}

var Map = function(){
    var main = document.getElementById("main")
        , temp = document.createDocumentFragment();
    this.width = 40;
    this.height= 40;
    for(var k=0; k<this.height; k++){
        var tempArr = [];
        for(var i=0; i<this.width; i++){
            var block = document.createElement('div');
            block.id = 'id-' + i + '-' + k;
            block.className = 'block';
            temp.appendChild(block);
            tempArr.push(block);
        }
        blocks.push(tempArr);
    }
    main.appendChild(temp);
}

Map.prototype.dropEgg = function(){
    var exist = false
        , bodies = snake.bodies;
    do {
        var x = parseInt(Math.random() * this.width)
            , y = parseInt(Math.random() * this.height);
        // 判断生成的蛋的坐标是否跟蛇的身体重合
        for(var i=0; i<bodies.length; i++){
            if(bodies[i].x == x && bodies[i].y == y){
                exist = true;
            }
        }
    } while(exist);
    this.egg = blocks[y][x];
    this.egg.className += ' blue';

    this.egg.x = x;
    this.egg.y = y;
}

var Snake = function(){
    // 生成蛇的身体
    this.bodies = [];
    for(var i=0; i<8; i++){
        var body = {
            x: 7-i,
            y: 0,
            block: blocks[0][7-i]
        };
        body.block.className += ' grey';
        this.bodies.push(body);
    }
    // 蛇头
    this.bodies[0].block.className = 'block red';
    // 蛇移动的方向
    this.moveTo = [1,0];
};

// 移动
Snake.prototype.move = function(){
    // 新的蛇头
    var head = {
        x: 0,
        y: 0,
        block: ''
    };
    head.x = this.bodies[0].x + this.moveTo[0];
    head.y = this.bodies[0].y + this.moveTo[1];
    //判断是否撞到墙           |
    if(head.x < 0 || head.x >map.width || head.y < 0 || head.y > map.height) {
        alert('撞墙');
        location.href = location.href;
    }
    head.block = blocks[head.y][head.x];
    this.bodies.unshift(head);
    this.bodies[0].block.className = 'block red';
    // 把原来的蛇头方块变成身体
    this.bodies[1].block.className = 'block grey';
    //判断是否咬到自己的身体
    for(var i=1; i<this.bodies.length; i++){
        if(this.bodies[i].x == head.x && this.bodies[i].y == head.y){
            alert('咬到自己');
            location.href = location.href;
        }
    }
    //判断蛇头坐标跟egg坐标是否重合
    if(head.x == map.egg.x && head.y == map.egg.y){
        return this.eat()
    } else {
        // 把蛇尾方块变成白色
        var length = this.bodies.length;
        this.bodies[length - 1].block.className = 'block';
        // 拿掉蛇尾
        this.bodies.pop();
    }

}

// 吃东西
Snake.prototype.eat = function(){
    //
    return map.dropEgg();
}


var Move = function(snake){
    this.snake = snake;
}

Move.prototype.moveLeft = function(){
    if(this.snake.moveTo[0] == 1 && this.snake.moveTo[1] == 0) return false;
    this.snake.moveTo = [-1,0];
}

Move.prototype.moveRight = function(){
    if(this.snake.moveTo[0] == -1 && this.snake.moveTo[1] == 0) return false;
    this.snake.moveTo = [1,0];
}

Move.prototype.moveUp = function(){
    if(this.snake.moveTo[0] == 0 && this.snake.moveTo[1] == 1) return false;
    this.snake.moveTo = [0,-1];
}

Move.prototype.moveDown = function(){
    if(this.snake.moveTo[0] == 0 && this.snake.moveTo[1] == -1) return false;
    this.snake.moveTo = [0,1];
}

