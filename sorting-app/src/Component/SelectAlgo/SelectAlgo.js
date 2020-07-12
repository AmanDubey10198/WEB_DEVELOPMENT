import React from 'react';
import './SelectAlgo.js';

export class SelectAlgo extends React.Component{
    constructor(props){
        super(props);
        this.selectAlgo = this.selectAlgo.bind(this);
    }
    selectAlgo(e){
        this.props.setAlgo(e.target.value);
    }

    render(){
        return (
                <select onChange = {this.selectAlgo} name = "algorithm"  id = "algorithm">
                    <option>Bubble Sort</option>
                    <option>Insertion Sort</option>
                    <option>Selection Sort</option>
                </select>
        );
    }
}