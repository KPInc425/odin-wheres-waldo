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
      console.log(typeof title);
    
      setPageDefaultTitle(title);
    }
    getDBTitle();
  }, [])

  const handleImgClick = (e) => {
    console.log("click");
    const y = e.pageY;
    const x = e.pageX;

    console.log({x, y});
    console.log(x);
    console.log(y);

    // const img = document.querySelector('.hiddenObjectImage');
    const newCircle = document.createElement('div');
    newCircle.classList.add('clickCircle');
    newCircle.style.left = `${x - 12}px`;
    newCircle.style.top = `${y - 32}px`;

    console.log(newCircle.style.top);
    console.log(newCircle.style.left);

    document.querySelector('.hiddenObjectImage').appendChild(newCircle);


  }


  return (
    <div className="App">
      <h1>{ pageDefaultTitle || "Find the Hidden Object!" }</h1> 
      <ControlBoard />
      <StoryBoard handleImgClick={ handleImgClick }/>
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
