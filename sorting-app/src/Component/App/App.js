import React from 'react';
import './App.css';

import {SelectAlgo} from '../SelectAlgo/SelectAlgo';
import {Reset} from '../Reset/Reset';
import {Run} from '../Run/Run';
import {Boxes} from '../Boxes/Boxes';
import {generateRandomArray} from '../../utils/RandomArray/RandomArray';

const sortFunction = require('../../utils/SortingAlgorithms/sortFunction');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      randomArray: generateRandomArray(),
      sortingAlgo: "Bubble Sort",
    }
    this.setRandomArray = this.setRandomArray.bind(this);
    this.setSortingAlgorithm = this.setSortingAlgorithm.bind(this);
    this.updateArray = this.updateArray.bind(this);
    this.runSorting = this.runSorting.bind(this);
  }

  // function for resetting array
  setRandomArray(){
    this.setState({
      randomArray: generateRandomArray()
    })
  }

  // function for setting algo type
  setSortingAlgorithm(name){
    this.setState({
      sortingAlgo: name
    });
  }

  // update the array according to sorting algo
  updateArray(sortedArray){
    this.setState({
      randomArray:sortedArray
    });
  }

  // run sorting function
  async runSorting(){
    const sortIt = sortFunction(this.state.sortingAlgo);
    const generator = sortIt(this.state.randomArray);
    
    let val = [];
    do{
        val = generator.next().value;
        if(val){
          this.updateArray(val);
        }
        // using await sleep here
        await sleep(10);
    }while(val);

  }

  // rendering array
  render() {
    return (
      <div className="App">
        <header>
          <SelectAlgo setAlgo = {this.setSortingAlgorithm}/>
          <Reset newArray = {this.setRandomArray} />
          <Run runSorting = {this.runSorting} />

        </header>
        <article>
          <Boxes array = {this.state.randomArray} />
        </article>
        
      </div>
    );
  }
  
}

export default App;
