let snakeSize = 5;
let snakeArray = []; 
let speed = 100; 
let direction = 'right';
let board, timer;

console.log('initializing ....')

// 页面加载后 自动运行 
onload = () => {
    console.log('start onload function... ');
    board = document.querySelector('#board');
    createSnake();
    createBean();
    KeyListener();
}


function pause(){
    clearInterval(timer); 
}

function start(){
    timer  = setInterval (()=>move(), speed);
}


function reset(){
    location.reload();
}


function createSnake() {
    console.log('start create snake function...');

    for (let i = 0; i<snakeSize; i++ ) {
        let snake = document.createElement('div');

        if (i == 0){
            snake['style']['backgroundColor'] = 'red';
        }
        snake['style']['left'] = (snakeSize - i -1 )*20 + 'px';
        snakeArray.push(snake)
        board.appendChild(snake);
    }
}


function createBean() {
    console.log('starting create bean .....')
    let bean = document.createElement('span')
    let x = null, y =null;

    // x [0 ~ 1000px]
    // y [0~ 500px]
    // random value x [0-50] * 20 , y [0-25] * 20 
    x = parseInt ( (Math.random()* (1000/20))) * 20 
    y = parseInt ( (Math.random()* (500/20))) * 20 

    checkingXY(); 

    bean['style']['left'] = x +'px';  // '500px'
    bean['style']['top'] = y +'px';  // '500px'
    board.appendChild(bean);

    function checkingXY(){
        for (let i =0; i < snakeArray.length; i++) {
            if (snakeArray[i]['offsetLeft'] === x && snakeArray[i]['offsetTop'] === y ){
                x = parseInt ( (Math.random()* (1000/20))) * 20 
                y = parseInt ( (Math.random()* (500/20))) * 20 
                checkingXY();
                break; 
            }
        }
    }
}


function move(){
    let hLeft = snakeArray[0].offsetLeft;
    let hTop = snakeArray[0].offsetTop;


    for (let i = snakeArray.length-1 ; i>0 ; i--) {
        snakeArray[i]['style']['left'] = snakeArray[i-1]['style']['left'];
        snakeArray[i]['style']['top'] = snakeArray[i-1]['style']['top'];
    }
    
    
    if (direction === 'right'){
        // 判断是否游戏结束
        if (hLeft + 20 >= 1000){
            gameover();
        }
        snakeArray[0]['style']['left'] = hLeft+20 + 'px';
    };
    
    if (direction === 'left'){
        // 判断游戏是否结束 

        snakeArray[0]['style']['left'] = hLeft-20 + 'px';
    };
    
        
    if (direction === 'up'){
        // 判断游戏是否结束 

        snakeArray[0]['style']['top'] = hTop - 20 + 'px';
    };
    
    if (direction === 'down'){
        // 判断游戏是否结束 

        snakeArray[0]['style']['top'] = hTop + 20 + 'px';
    };

    
}

function KeyListener (){
    console.log('keyListener starting .....')
    document.onkeydown = event => {
        let KeyPress = event.key || window.event;
        console.log(KeyPress, typeof(KeyPress));

        switch (KeyPress){
            case 'ArrowLeft':
                if (direction !== 'right'){
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left'){
                    direction = 'right';
                }
                break;
            case 'ArrowUp':
                if (direction !== 'down'){
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up'){
                    direction = 'down';
                }
                break;
        }
        console.log(direction)
    }
}

function gameover(){

    clearInterval(timer);
    location.reload();
    alert('game over!')
}
