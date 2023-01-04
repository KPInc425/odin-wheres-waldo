import './App.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, query, collection } from 'firebase/firestore'

import { getFirebaseConfig } from './firebaseConfig';
import { useEffect, useState } from 'react';

const firebaseConfig = getFirebaseConfig();

function App() {

  const [pageDefaultTitle, setPageDefaultTitle] = useState(null);


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
    const y = e.pageY;
    const x = e.pageX;

    console.log({x, y});
    // console.log(x);
    // console.log(y);

    // const img = document.querySelector('.hiddenObjectImage');
    if (checkInBounds(x, y)) {
      const newCircle = document.createElement('div');
      newCircle.classList.add('clickCircle');
      newCircle.style.left = `${x - 12}px`;
      newCircle.style.top = `${y - 32}px`;
  
      // console.log(newCircle.style.top);
      // console.log(newCircle.style.left);
  
      document.querySelector('.hiddenObjectImage').appendChild(newCircle);
    }


  }

  const checkInBounds = (x, y) => {
    const rect = document.querySelector('.hiddenObjectImage').getBoundingClientRect();
    const top = rect.top;
    const left = rect.left
    const cursorSize = 10;

    if ( x > left + cursorSize &&
      y > top + cursorSize &&
      x < (rect.width + left - cursorSize) &&
      y < (rect.height + top - cursorSize)) {
        return true;
    }

    return false;
  }

  const moveCursor = (e) => {
    const newCursor = document.getElementById('newCursor');
    // const imgContainer = document.querySelector('.hiddenObjectImage');
    const cursorHalfSize = 10;
    // console.log(imgContainer.offsetWidth);
    // console.log(window.innerWidth);

    // console.log(imgContainer.getBoundingClientRect());
    // const containerRect = imgContainer.getBoundingClientRect();
    // const left = containerRect.left;
    // const top = containerRect.top;
    const x = e.pageX;
    const y = e.pageY;
    console.log({x, y})

    if (checkInBounds(x, y)) {
      newCursor.style.top = `${y}px`;
      newCursor.style.left = `${x}px`;
    }
    // if ( x > (window.innerWidth - imgContainer.offsetWidth) &&
    //      y > (window.innerHeight - imgContainer.offsetHeight + 40) &&
    //      x < (imgContainer.offsetWidth - 10) &&
    //      y < window.innerHeight - (window.innerHeight * 0.02) ) {
    //   newCursor.style.top = `${y}px`;
    //   newCursor.style.left = `${x}px`;
    // }
  }


  return (
    <div className="App" onMouseMove={ moveCursor }>
      <h1>{ pageDefaultTitle || "Find the Hidden Object!" }</h1> 
      <div id='newCursor' className='cursorCircle' onClick={ handleImgClick }></div>
      <ControlBoard />
      <StoryBoard  handleImgClick={ handleImgClick }/>
    </div>
  );
}

const StoryBoard = ({ handleImgClick }) => {
  return (
    <div className='storyBoard backWaldoStyle'>

        <HiddenObjectImage handleImgClick={ handleImgClick } />

    </div>
  )
}

const HiddenObjectImage = ({ handleImgClick }) => {
  return (
    <div className='hiddenObjectImage backWaldoStyle' onClick={ handleImgClick }>

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
