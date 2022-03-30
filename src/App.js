import {useState} from 'react'

import {DndProvider, useDrag, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Drap from './Drap';



function App() {
  
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Drap />
    </DndProvider>
  );
}


export default App;
