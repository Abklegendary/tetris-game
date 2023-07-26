document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRand = 0
    let timerId
    let score = 0
    const colors= [
      'orange',
      'red',
      'purple',
      'yellow',
      'cyan'
    ]
    
    //the tetrominoes
    const lTetromino = [ [1, width+1, width*2+1, 2],
     [width, width+1, width+2, width*2+2],
     [1, width+1, width*2+1, width*2], 
     [width, width*2, width*2+1, width*2+2]
    ]
  
    const zTetromino = [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1]
    ]
  
    const tTetromino = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1]
    ]
  
    const oTetromino = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
    ]
  
    const iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
    ]
  
    const TheTerominoes = [lTetromino, zTetromino, tTetromino, oTetromino,iTetromino]
  
    let currentPos = 4
    let currentRot = 0
  
    //randomly sellect a tetromino
    let rand = Math.floor(Math.random()*TheTerominoes.length)
    //console.log(rand)
    let current = TheTerominoes[rand][currentRot]
    
    //draw the first rotation in the first tetromino
    function draw(){
      current.forEach(index => {
          squares[currentPos + index].classList.add('tetromino')
          squares[currentPos + index].style.backgroundColor = colors[rand]
      })
    }
    //draw()
  
  
    //undraw the tetromino
    function undraw(){
      current.forEach(index => {
        squares[currentPos + index].classList.remove('tetromino')
        squares[currentPos + index].style.backgroundColor = ''
      })
    }
    
  
  
  
    //keycodes functions
    function control_key(k) {
      if(k.keyCode == 37) {
        move_left()
      }
      else if(k.keyCode == 38){
        rotate()
      }
      else if(k.keyCode == 39){
        move_right()
      }
      else if(k.keyCode == 40){
        move_down()
      }
    }
    document.addEventListener('keyup', control_key)
  
    function move_down(){
      undraw()
      currentPos += width
      draw()
      freezeTet()
    }
    
    //add functionality to the button
    startBtn.addEventListener('click', () => {
      if (timerId){
        clearInterval(timerId)
        timerId = null
      } else{
        draw()
        timerId = setInterval(move_down, 1000)
        nextRand = Math.floor(Math.random()*TheTerominoes.length)
        display_shapes()
      }
      
    })
  
    //freeze function
    function freezeTet(){
      if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPos + index].classList.add('taken'))
        //start a new tetrimino falling
        rand = nextRand
        nextRand = Math.floor(Math.random() * TheTerominoes.length)
        //console.log(nextRand)
        current = TheTerominoes[rand][currentRot]
        currentPos = 4
        draw()
        display_shapes()
        addScore()
        gameOver()
      }
    }
   
  
    //move the tetromino left, unless there is blockage
    function move_left(){
      undraw()
      const theLeftBlockage = current.some(index => (currentPos + index) % width === 0)
  
      if(!theLeftBlockage) currentPos -=1
  
      if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
        currentPos +=1
      }
      draw()
    }
  
    //function to move the tetrimino right, unless there is a blockage
    function move_right(){
      undraw()
      const theRightBlockage = current.some(index => (currentPos + index) % width === width -1)
  
      if(!theRightBlockage) currentPos +=1
  
      if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
        currentPos -=1
      }
      draw()
    }
  
    //the rotate tetrimino function
    function rotate(){
      undraw()
      currentRot ++
      if(currentRot === current.length){//if the current rotation gets to 4, make it go back to 0
        currentRot = 0
      }
      current = TheTerominoes[rand][currentRot]
      draw()
    }
  
    //show the next tetromino that will come up
    const display_squares = document.querySelectorAll('.mini-grid div')
    const display_width = 4
    let display_index = 0
    
  
    //the tetromino without rotations
    const upNextTet = [
      [1, display_width+1, display_width*2+1, 2], //lTetromino
      [0, display_width, display_width+1, display_width*2+1],//zTetromino
      [1, display_width, display_width+1, display_width+2],//tTetromino
      [0, 1, display_width, display_width+1],
      [1, display_width+1, display_width*2+1, display_width*3+1]//iTetromino
    ]
  
    //display the shapes in the mini grid display
    function display_shapes(){
  
      display_squares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTet[nextRand].forEach( index => {
        display_squares[display_index + index].classList.add('tetromino')
        display_squares[display_index + index].style.backgroundColor = colors[nextRand]
      })
    }
  
    //add scores
    function addScore(){
      for(let i = 0; i <199; i += width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))){
          score += 10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    //gameover
    function gameOver(){
      if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'game over'
        clearInterval(timerId)
      }
    }
  
    
  
  
  
  
  })
  