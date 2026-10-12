//console.log("Benjamin")//
//var A=45
//var B=13
//var C=A+B
//console.log(C)


//conditionals in the next class








let count=0
const countDisplay=document.getElementById('count')
const increaseBtn=document.getElementById('increase')
const decreaseBtn=document.getElementById('decrease')
const resetBtn=document.getElementById('reset')

function updateDisplay(){
    countDisplay.textContent = count;
    if(count > 0){
        countDisplay.style.color = 'green';
    } else if(count < 0){
        countDisplay.style.color = 'red';
    } else {
        countDisplay.style.color = 'black';
    }
}

increaseBtn.addEventListener("click", () => {
    count++;
    updateDisplay();
})

decreaseBtn.addEventListener("click", () => {
    count--;
    updateDisplay();
})

resetBtn.addEventListener("click", () => {
    count = 0;
    updateDisplay();
})









//constA=23//