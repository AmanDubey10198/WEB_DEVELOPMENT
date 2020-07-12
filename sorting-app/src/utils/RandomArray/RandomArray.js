
export function generateRandomArray(){
    let arr = [];
    for(let i=0; i<30; i++){
        arr.push(Math.ceil(Math.random()*15));
    }
    return arr;
}