import './App.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, query, collection } from 'firebase/firestore'

import { getFirebaseConfig } from './firebaseConfig';
import { useEffect, useRef, useState } from 'react';

import hiddenImage from './media/images/image1.png'

const firebaseConfig = getFirebaseConfig();

function App() {

  const [ pageDefaultTitle, setPageDefaultTitle ] = useState(null);
  const [ showTargetBox, setShowTargetBox ] = useState(false);
  const [ targetBoxLocation, setTargetBoxLocation ] = useState({top: `0px`, left: `0px`})
  const [ showActiveLocation, setShowActiveLocation ] = useState(false);
  const [ activeLocation, setActiveLocation ] = useState({top: `0px`, left: `0px`});
  const [ cursorLocation, setCursorLocation ] = useState({top: `0px`, left: `0px`});
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
    getDBTitle();
  }, [])

  const handleImgClick = (e) => {
    const y = e.pageY;
    const x = e.pageX;
    const rect = imgRef.current.getBoundingClientRect();

    console.log({x, y});
    console.log(`top: ${rect.top} left: ${rect.left}`);
    console.log(`width: ${rect.width} height: ${rect.height}`);
    console.log(`x: ${x - rect.left} y: ${y - rect.top}`);

    if (checkInBounds(x, y)) {
      // Hardcoded #'s are based on cursor size
      // let newLeft = `${x - 5}px`;
      // let newTop = `${y}px`;
      let newLeft = `${x - 7}px`;
      let newTop = `${y - 7}px`;
      setTargetBoxLocation({ top: newTop, left: newLeft });
      setActiveLocation({ top: newTop, left: newLeft })
      setShowActiveLocation(true);
      setShowTargetBox(true);
    }
  }

  const moveCursor = (e) => {
    const x = e.pageX;
    const y = e.pageY;

    if (checkInBounds(x, y)) {
      const newTop = `${y}px`;
      const newLeft = `${x}px`;
      setCursorLocation({top: newTop, left: newLeft});
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
    const x = e.pageX;
    const y = e.pageY;
    if (!checkInBounds(x, y)) {
      setShowActiveLocation(false);
      setShowTargetBox(false);
    }
  }


  return (
    <div className="App" onMouseMove={ moveCursor } onClick={ handleClearClick }>
      <h1>{ pageDefaultTitle || "Find the Hidden Object!" }</h1> 
      <div id='newCursor' className='cursorCircle' style={ cursorLocation } onClick={ handleImgClick }></div>
      { showTargetBox
        ?
        <div>
          <TargetBox newStyle={ targetBoxLocation }/> 
          <DropDownMenu location={ activeLocation }/>
        </div>
        :
        null
      }
      <ControlBoard />
      <StoryBoard 
        imgRef={imgRef}  
        handleImgClick={ handleImgClick } 
        showActiveLocation={ showActiveLocation } 
        activeLocation={ activeLocation }
      />
    </div>
  );
}

const DropDownMenu = ({ choiceOne, choiceTwo, choiceThree, location }) => {

  const dropDownLocation = {
    top: `${Number(location.top.split('p')[0]) - 133}px`,
    left: `${Number(location.left.split('p')[0]) - 33}px`,
  }

  return (
    <div className='dropDownMenu' style={ dropDownLocation }>
      <ul>
        <li><h4>Choices</h4></li>
        <li>{ choiceOne || "choice1" }</li>
        <li>{ choiceTwo || "choice2" }</li>
        <li>{ choiceThree || "choice3" }</li>
      </ul>
    </div>
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

const StoryBoard = ({ handleImgClick, imgRef, showActiveLocation, activeLocation }) => {
  return (
    <div className='storyBoard backWaldoStyle'>

        <HiddenObjectImage 
          imgRef={imgRef} 
          handleImgClick={ handleImgClick } 
          showActiveLocation={ showActiveLocation }
          activeLocation={ activeLocation }
        />

    </div>
  )
}

const HiddenObjectImage = ({ handleImgClick, imgRef, showActiveLocation, activeLocation }) => {
  return (
    <div className='hiddenObjectImage backWaldoStyle' onClick={ handleImgClick }>
      <img ref={ imgRef } src={ hiddenImage } alt='hiddenObjectImage' />
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

const ControlBoard = () => {
  return (
    <div className='controlBoard flex backWaldoStyle'>
      <CharacterBox />
      <AppControls />
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

const AppControls = () => {
  return (
    <div className='appControls flex backWaldoStyle'>
      <div className="flexButtons">
        <button className='circleStyle'>Start</button>
        <button className='circleStyle'>End</button>
        <button className='circleStyle'>Gallery</button>
        <button className='circleStyle'>High Scores</button>
      </div>
    </div>
  )
}

initializeApp(firebaseConfig);

export default App;
