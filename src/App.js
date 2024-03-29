import './App.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, query, collection } from 'firebase/firestore'

import { getFirebaseConfig } from './firebaseConfig';
import { useEffect, useRef, useState } from 'react';

import hiddenImage1 from './media/images/image1.png'

const firebaseConfig = getFirebaseConfig();


function App() {

  const [ pageDefaultTitle, setPageDefaultTitle ] = useState(null);
  const [ showFoundImageBox, setShowFoundImageBox ] = useState([false, false, false]);
  const [ foundBoxesLocations, setFoundBoxesLocations ] = useState([{top: `0px`, left: `0px`}, {top: `0px`, left: `0px`}, {top: `0px`, left: `0px`}]);
  const [ showTargetBox, setShowTargetBox ] = useState(false);
  const [ targetBoxLocation, setTargetBoxLocation ] = useState({top: `0px`, left: `0px`});
  const [ showActiveLocation, setShowActiveLocation ] = useState(false);
  const [ activeLocation, setActiveLocation ] = useState({top: `0px`, left: `0px`});
  const [ showCursorLocation, setShowCursorLocation ] = useState(false);
  const [ cursorLocation, setCursorLocation ] = useState({top: `0px`, left: `0px`});
  const [ imageClickedCoords, setImageClickedCoords ] = useState([0,0]);
  const [ chosenImage, setChosenImage ] = useState(null);
  const [ imageIndex, setImageIndex ] = useState(1);
  const imgRef = useRef(null);

  useEffect(() => {
    // Had to put async function inside useEffect
    const getDBTitle = async () => {
      // query collection
      // const titleQuery = query(collection(getFirestore(), 'default'));
      // const titleData = await getDocs(titleQuery);
      // const tmpArray = titleData.docs.map(doc => doc.data());
      // console.log(tmpArray[0].title);
    
      // query single doc
      const titleSnap = await getDoc(doc(getFirestore(), 'default', 'HomePage'));
      const title = titleSnap.data().title;
      // console.log(typeof title);
    
      setPageDefaultTitle(title);
    }
    // setChosenImage(hiddenImage1);
    getDBTitle();
  }, [])

  const handleImgClick = (e) => {
    const y = e.pageY;
    const x = e.pageX;
    const rect = imgRef.current.getBoundingClientRect();

    console.log({x, y});
    console.log(`top: ${rect.top} left: ${rect.left}`);
    console.log(`width: ${rect.width} height: ${rect.height}`);
    console.log(`x: ${Math.floor(x - rect.left)} y: ${Math.floor(y - rect.top)}`);
    
    if (checkInBounds(x, y)) {
      // Hardcoded #'s are based on cursor size
      // let newLeft = `${x - 5}px`;
      // let newTop = `${y}px`;
      let newLeft = `${x - 7}px`;
      let newTop = `${y - 7}px`;
      setTargetBoxLocation({ top: newTop, left: newLeft });
      setActiveLocation({ top: newTop, left: newLeft })
      setImageClickedCoords([Math.floor(x - rect.left), Math.floor(y - rect.top)]);
      setShowActiveLocation(true);
      setShowTargetBox(true);
    }
  }

  const startGame = () => {
    console.log('start game');
    setChosenImage(hiddenImage1);
  }

  const moveCursor = (e) => {
    if (chosenImage === null) {
      return;
    }
    const x = e.pageX;
    const y = e.pageY;

    if (checkInBounds(x, y)) {
      const newTop = `${y}px`;
      const newLeft = `${x}px`;
      if (!showCursorLocation) {
        setShowCursorLocation(true);
      }
      setCursorLocation({top: newTop, left: newLeft});
    } else {
      // setShowActiveLocation(false);
      // setShowTargetBox(false);
      setShowCursorLocation(false);
    }
  }

  const checkInBounds = (x, y) => {
    // Get play area for cursor bounds
    const rect = imgRef.current.getBoundingClientRect();
    // console.log(imgRef.current)
    const top = rect.top;
    const left = rect.left
    const cursorSize = 5;

    if ( x > left + cursorSize &&
      y > top + cursorSize &&
      x < (rect.width + left - cursorSize) &&
      y < (rect.height + top - cursorSize)) {
        return true;
    }

    return false;
  }

  const handleClearClick = (e) => {
    if (chosenImage === null) {
      return;
    }
    const x = e.pageX;
    const y = e.pageY;
    if (!checkInBounds(x, y)) {
      setShowActiveLocation(false);
      setShowTargetBox(false);
    }
  }

  const checkCoords = async (e, choice) => {
    e.stopPropagation();
    console.log('Choice: ' + choice);
    console.log('checkings coords');
    const tempChoice = choice;
    const choiceCoords = (await getDoc(doc(getFirestore(), `image${imageIndex}`, choice))).data().coords;
    console.log(choiceCoords);
    console.log(imageClickedCoords);
    if ((choiceCoords[0] < (imageClickedCoords[0] + 30) && choiceCoords[0] > (imageClickedCoords[0] - 30)) && (choiceCoords[1] < (imageClickedCoords[1] + 30) && choiceCoords[1] > (imageClickedCoords[1] - 30))) {
      console.log(choiceCoords[0]);
      console.log(imageClickedCoords[0]);
      console.log('Choice: ' + tempChoice);
      console.log(tempChoice.length);
      console.log('Found Object');
      const choiceIndex = Number(tempChoice.slice(tempChoice.length - 1, tempChoice.length));
      console.log(choiceIndex);
      switch (choiceIndex) {
        case 1:
          setShowFoundImageBox([true, showFoundImageBox[1], showFoundImageBox[2]]);
          setFoundBoxesLocations([activeLocation, foundBoxesLocations[1], foundBoxesLocations[2]]);
          break;
        case 2:
          setShowFoundImageBox([showFoundImageBox[0], true, showFoundImageBox[2]]);
          setFoundBoxesLocations([foundBoxesLocations[0], activeLocation, foundBoxesLocations[2]]);
          break;
        case 3:
          setShowFoundImageBox([showFoundImageBox[0], showFoundImageBox[1], true]);
          setFoundBoxesLocations([foundBoxesLocations[0], foundBoxesLocations[1], activeLocation]);
          break;
        default:
          break;
      }
    } else {
      console.log('Not Here');
    }

  }


  return (
    <div className="App" onMouseMove={ moveCursor } onClick={ handleClearClick }>
      <h1>{ pageDefaultTitle || "Find the Hidden Object!" }</h1> 
      { showCursorLocation && <div id='newCursor' className='cursorCircle' style={ cursorLocation } onClick={ handleImgClick }></div> }
      { showTargetBox
        ?
        <div>
          <TargetBox newStyle={ targetBoxLocation }/> 
          <DropDownMenu location={ activeLocation } checkCoords={ checkCoords }/>
        </div>
        :
        null
      }
      { showFoundImageBox[0]
        ?
        <div>
          <FoundImageBox choice={1} newStyle={ foundBoxesLocations[0] }/> 
        </div>
        :
        null
      }
      { showFoundImageBox[1]
        ?
        <div>
          <FoundImageBox choice={2} newStyle={ foundBoxesLocations[1] }/> 
        </div>
        :
        null
      }
      { showFoundImageBox[2]
        ?
        <div>
          <FoundImageBox choice={3} newStyle={ foundBoxesLocations[2] }/> 
        </div>
        :
        null
      }
      <ControlBoard startGame={ startGame }/>
      { chosenImage &&
        <StoryBoard 
          imgRef={imgRef}  
          handleImgClick={ handleImgClick } 
          showActiveLocation={ showActiveLocation } 
          activeLocation={ activeLocation }
          chosenImage={ chosenImage }
        />
      }
    </div>
  );
}

const DropDownMenu = ({ choiceOne, choiceTwo, choiceThree, location, checkCoords }) => {

  const dropDownLocation = {
    top: `${Number(location.top.split('p')[0]) - 133}px`,
    left: `${Number(location.left.split('p')[0]) - 33}px`,
  }

  return (
    <div className='dropDownMenu' style={ dropDownLocation }>
      <ul>
        <li><h4>Choices</h4></li>
        <MenuChoice choice={ choiceOne || "choice1" } checkCoords={checkCoords} />
        <MenuChoice choice={ choiceTwo || "choice2" } checkCoords={checkCoords} />
        <MenuChoice choice={ choiceThree || "choice3" } checkCoords={checkCoords} />
      </ul>
    </div>
  )
}

const MenuChoice = ({ choice, checkCoords }) => {
  return (
    <li onClick={(e) => checkCoords(e, choice)}>{ choice }</li>
  )
}
    

const TargetBox = ({ newStyle }) => {
  return (
    <div>
      <div className='TargetBox' style={ newStyle }>

      </div>
    </div>
  )
}

const FoundImageBox = ({ newStyle, choice }) => {
  return (
    <div>
      <div className='foundImageBox' style={ newStyle }>
        {`Found Image ${choice}`}
      </div>
    </div>
  )
}

const StoryBoard = ({ handleImgClick, imgRef, showActiveLocation, activeLocation, chosenImage }) => {
  return (
    <div className='storyBoard backWaldoStyle'>

        <HiddenObjectImage 
          imgRef={imgRef} 
          handleImgClick={ handleImgClick } 
          showActiveLocation={ showActiveLocation }
          activeLocation={ activeLocation }
          chosenImage={ chosenImage }
        />

    </div>
  )
}

const HiddenObjectImage = ({ handleImgClick, imgRef, showActiveLocation, activeLocation, chosenImage }) => {
  return (
    <div className='hiddenObjectImage backWaldoStyle' onClick={ handleImgClick }>
      <img ref={ imgRef } src={ chosenImage } alt='hiddenObjectImage' />
      { showActiveLocation 
        ?
        <ActiveLocation activeLocation={ activeLocation } />
        :
        null
      }
    </div>
  )
}

const ActiveLocation = ({ activeLocation }) => {
  return (
    <div className='clickCircle activeLocation' style={ activeLocation }>

    </div>
  )
}

const ControlBoard = ({startGame}) => {
  return (
    <div className='controlBoard flex backWaldoStyle'>
      <CharacterBox />
      <AppControls startGame={ startGame } />
    </div>
  )
}

const CharacterBox = () => {
  return (
    <div className='charBox backWaldoStyle'>
      <h3>Who's Missing?</h3>
      <div className='flexButtons'>
        <div id='char1Avatar' className='circleStyle'></div>
        <div id='char2Avatar' className='circleStyle'></div>
        <div id='char3Avatar' className='circleStyle'></div>
      </div>
    </div>
  )
}

const AppControls = ({startGame}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const handleStartClick = () => {
    setGameStarted(true);
    startGame();
  }
  return (
    <div className='appControls flex backWaldoStyle'>
      <div className="flexButtons">
        <button disabled={gameStarted} className='circleStyle' onClick={handleStartClick}>Start</button>
        <button className='circleStyle'>End</button>
        <button className='circleStyle'>Gallery</button>
        <button className='circleStyle'>High Scores</button>
      </div>
    </div>
  )
}

initializeApp(firebaseConfig);

export default App;
