import React from 'react';
import { useEffect, useState } from 'react'
import ScoreBoard from './components/ScoreBoard'
import BlueCandy from './images/blue-candy.png'
import GreenCandy from './images/green-candy.png'
import OrangeCandy from './images/orange-candy.png'
import PurpleCandy from './images/purple-candy.png'
import RedCandy from './images/red-candy.png'
import YellowCandy from './images/yellow-candy.png'
import Blank from './images/blank.png'


// defining main assests:
const width = 8;
const candyColors = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy
];


const App = () => {

  // DECLARATIONS:
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // FUNCTIONS:

  // detect column of Four:
  const checkForColumnFour = () => {
    for (let i = 0; i < 40; i++) {
      const columnOfFour = [i, i + width, i + 2 * width, i + 3 * width];
      const decidedColor = currentColorArrangement[i];

      const isBlank = currentColorArrangement[i] === Blank;

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor) && !isBlank) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach(square => currentColorArrangement[square] = Blank);
        return true;
      }
    }
  };

  // detect column of three:
  const checkForColumnThree = () => {
    for (let i = 0; i < 48; i++) {
      const columnOfThree = [i, i + width, i + 2 * width];
      const decidedColor = currentColorArrangement[i];

      const isBlank = currentColorArrangement[i] === Blank;

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor) && !isBlank) {
        columnOfThree.forEach(square => currentColorArrangement[square] = Blank);
        setScoreDisplay((score) => score + 3);
        return true;
      }
    }
  };


  // detect row of Four:
  const checkForRowFour = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];

      const notValids = [];
      for (let j = 1; j < width + 1; j++) {
        notValids.push(j * width - 1);
        notValids.push(j * width - 2);
        notValids.push(j * width - 3);
      }

      const isBlank = currentColorArrangement[i] === Blank;

      if (notValids.includes(i)) continue;

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor) && !isBlank) {
        rowOfFour.forEach(square => currentColorArrangement[square] = Blank);
        setScoreDisplay((score) => score + 4);
        return true;
      }
    }
  };

  // detect row of three:
  const checkForRowThree = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];

      const notValids = [];
      for (let j = 1; j < width + 1; j++) {
        notValids.push(j * width - 1);
        notValids.push(j * width - 2);
      }

      if (notValids.includes(i)) continue;

      const isBlank = currentColorArrangement[i] === Blank;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor) && !isBlank) {
        rowOfThree.forEach(square => currentColorArrangement[square] = Blank);
        setScoreDisplay((score) => score + 3);
        return true;
      }
    }
  };

  // move down candies if below is empty -> gravity:
  // and generate new candies for empty cells:
  const moveIntoSquareBelow = () => {
    for (let i = 0; i < width * width - width; i++) {

      // drop new candies:
      if ((i >= 0 && i <= width) && currentColorArrangement[i] === Blank) {
        let newCandy = candyColors[Math.floor(Math.random() * candyColors.length)];
        currentColorArrangement[i] = newCandy;
      }

      // drop existing candies to below if empty:
      if (currentColorArrangement[i + width] === Blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = Blank;

      }

    }
  };


  // drag and drops with the help of data -ids event:
  // dragEnd means no similar position found where cursor pointed
  // dragDrop means at a similar position it ended.
  const dragStart = (e) => {
    console.log(e.target);
    console.log("drag started");
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    console.log(e.target);
    console.log("drag drop");
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    console.log(e.target);
    console.log('drag end');

    //logic for changing start and drop square:
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));


    // currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor;
    // currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor;

    // make switch limit to U,D,L,R only:
    const validMoves = [
      squareBeingDraggedId + 1,
      squareBeingDraggedId - 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width
    ];

    const isValidMove = validMoves.includes(squareBeingReplacedId);

    if (isValidMove) {
      //switch the colors, will return if not valid moves:
      currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

      const colFour = checkForColumnFour();
      const colThree = checkForColumnThree();
      const rowFour = checkForRowFour();
      const rowThree = checkForRowThree();

      if (squareBeingReplacedId && (colFour || colThree || rowFour || rowThree)) {
        setSquareBeingDragged(null);
        setSquareBeingReplaced(null);
      }
      else {
        currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
        currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
        setCurrentColorArrangement([...currentColorArrangement]);
      }

    }

  }


  // create board of wXw with random candyColors:
  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColorArrangement);
  };


  // DRIVERS
  useEffect(() => {
    createBoard();    //render this after refresh only once.
  }, []);

  // detect for changes at every 100 ms
  // for changing state of arrays, spread works only
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnFour();
      checkForColumnThree();
      checkForRowFour();
      checkForRowThree();

      moveIntoSquareBelow();

      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);

  }, [checkForColumnFour, checkForColumnThree, checkForRowThree, checkForRowFour, moveIntoSquareBelow, currentColorArrangement]);

  console.log(scoreDisplay);
  return (
    <div className='main'>
      <div className="app">
        <div className="game">
          {currentColorArrangement.map((candyColor, index) => (
            <img
              key={index}
              // style={{backgroundColor: candyColor}}
              src={candyColor}
              alt={candyColor}

              data-id={index}

              draggable={true}

              onDragStart={dragStart}

              onDragOver={((e) => e.preventDefault())}
              onDragEnter={((e) => e.preventDefault())}
              onDragLeave={((e) => e.preventDefault())}

              onDrop={dragDrop}
              onDragEnd={dragEnd}

            />
          ))}
        </div>
      

      </div>
      <div className="score">
        <div className="typ">
        Your Score </div> <ScoreBoard score={scoreDisplay} />
      </div>
    </div>
  );
}

export default App;
