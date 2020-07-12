const {BubbleSort} = require('./BubbleSort');
const {InsertionSort} = require('./InsertionSort');
const {SelectionSort} = require('./SelectionSort');


function sortFunction(algoName){
    switch(algoName){
        case "Bubble Sort": return BubbleSort;
        case "Insertion Sort": return InsertionSort;
        case "Selection Sort": return SelectionSort;
        default: return undefined;
    }
}
module.exports = sortFunction;