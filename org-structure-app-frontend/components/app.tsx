import React from 'react';
import showTotalView from './tree';
import { returnToPreviousId } from './tree';


function App() {
  showTotalView();
  return (
    <div id="container">
      <button type="button" className = 'total-view-button' id="total-view-button" onClick={showTotalView}>Общий вид</button>
      <button type="button" className='back-button' id="back-button" onClick={returnToPreviousId}>Назад</button>
  </div>
  )
}

export default App;
