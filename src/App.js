import './App.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, query, collection } from 'firebase/firestore'

import { getFirebaseConfig } from './firebaseConfig';
import { useEffect, useRef, useState } from 'react';

const firebaseConfig = getFirebaseConfig();

function App() {

  const [ pageDefaultTitle, setPageDefaultTitle ] = useState(null);
  const [ showTargetBox, setShowTargetBox ] = useState(false);
  const [ targetBoxLocation, setTargetBoxLocation ] = useState({top: `0px`, left: `0px`})
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
    // console.log("click");
    
    // remove activeLocation if exists
    let activeLocation = document.querySelector('.activeLocation');
    console.log(activeLocation);
    if (activeLocation) {
      activeLocation.classList.remove('activeLocation');
    }
    const y = e.pageY;
    const x = e.pageX;

    console.log({x, y});
    // console.log(x);
    // console.log(y);

    // const img = document.querySelector('.hiddenObjectImage');
    if (checkInBounds(x, y)) {
      const newCircle = document.createElement('div');
      newCircle.classList.add('clickCircle','activeLocation');
      let newLeft = `${x - 7}px`;
      let newTop = `${y - 29}px`;
      // Hardcoded #'s are based on cursor size
      newCircle.style.left = newLeft;
      newCircle.style.top = newTop;
      document.querySelector('.hiddenObjectImage').appendChild(newCircle);
      setTargetBoxLocation({ top: newTop, left: newLeft });
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


  return (
    <div className="App" onMouseMove={ moveCursor }>
      <h1>{ pageDefaultTitle || "Find the Hidden Object!" }</h1> 
      <div id='newCursor' className='cursorCircle' style={ cursorLocation } onClick={ handleImgClick }></div>
      { showTargetBox
        ?
        <TargetBox newStyle={ targetBoxLocation }/> 
        :
        null
      }
      <ControlBoard />
      <StoryBoard imgRef={imgRef}  handleImgClick={ handleImgClick }/>
    </div>
  );
}

const TargetBox = ({ newStyle }) => {
  return (
    <div>
      <div className='TargetBox' style={ newStyle }>

      </div>
    </div>
  )
}

const StoryBoard = ({ handleImgClick, imgRef }) => {
  return (
    <div className='storyBoard backWaldoStyle'>

        <HiddenObjectImage imgRef={imgRef} handleImgClick={ handleImgClick } />

    </div>
  )
}

const HiddenObjectImage = ({ handleImgClick, imgRef }) => {
  return (
    <div ref={ imgRef } className='hiddenObjectImage backWaldoStyle' onClick={ handleImgClick }>

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
