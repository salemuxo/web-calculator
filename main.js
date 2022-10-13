// global variables
let table = document.getElementById("calcTable");
let outputText = document.getElementById("output");
let errorText = document.getElementById("errorOut");
let calcBooleans = {
  toClear: false,
  isChanged: false,
};
// storage arrays
const storedNums = [];
const storedFuncs = [];

// wait for click on calcTable and send button val to btnClicked if isBtn
table.addEventListener("click", (event) => {
  const isBtn = event.target.nodeName === "BUTTON";
  if (!isBtn) return;
  else btnClicked(event.target.textContent);
});

// check which button clicked and run corresponding function
function btnClicked(btnVal) {
  if (btnVal === "C") clearCalc(); // if button is C, clear
  else if (btnVal === "=") calculate(); // if button is =, calculate
  else if (isNaN(btnVal) && btnVal != "." && btnVal != "(-)")
    mathFunc(btnVal); // if button is NaN, C, . or =, send to mathFunc
  else addNum(btnVal); // if button is number or ., send to addNum
}

// clear output and stored values
function clearCalc() {
  outputText.innerHTML = "";
  storedFuncs.length = 0;
  storedNums.length = 0;
}

// push pressed function to storedFuncs, convert to math operators if necessary
function mathFunc(func) {
  if (func === "+" || func === "-") storedFuncs.push(func);
  else if (func === "×") storedFuncs.push("*");
  else if (func === "÷") storedFuncs.push("/");
  else if (func === "xⁿ") storedFuncs.push("**");
  if (outputText.innerHTML.length != 0) {
    storedNums.push(outputText.innerHTML);
    calcBooleans.toClear = true;
    calcBooleans.isChanged = false;
  }
}

// calculate based on storedNums, outputText and storedFuncs
function calculate() {
  // check if there are no numbers, return error
  if (storedNums.length === 0 && outputText.innerHTML.length === 0) {
    addError("Cannot calculate blank equation");
    return;
  }
  let calcString = "";
  // loop through storedNums + storedFuncs and add to calcString
  for (i = 0; i < storedNums.length; i++) {
    calcString += storedNums[i];
    calcString += storedFuncs[i];
  }
  calcString += outputText.innerHTML;

  // convert calcString to equation + calculate
  let calcNum = eval(calcString);
  // if num doesnt fit output box, round and output
  if (measureWidth(calcNum) >= 410) outputText.innerHTML = maxRound(calcNum);
  // if num fits, output
  else outputText.innerHTML = calcNum;
  // clear storage
  storedFuncs.length = 0;
  storedNums.length = 0;
  calcBooleans.toClear = true;
}

// add number to outputText
function addNum(btnVal) {
  if (calcBooleans.toClear) outputText.innerHTML = "";
  calcBooleans.toClear = false;
  calcBooleans.isChanged = true;
  // if trying to add decimal and already contains decimal, give error
  if (btnVal === "." && outputText.innerHTML.includes(btnVal))
    addError("Can't add more than 1 decimal.");
  else if (btnVal === "(-)" && outputText.innerHTML.length === 0)
    outputText.innerHTML += "-";
  // if trying to add negative and num already exists, give error
  else if (btnVal === "(-)") addError("Can't add negative to middle of number");
  else outputText.innerHTML += btnVal;
}

// measure width of string using ctx.measureText()
function measureWidth(text) {
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  ctx.font = "48px Helvetica";
  return ctx.measureText(text).width;
}

// find most decimal places to round number to while fitting output box
function maxRound(num) {
  let maxNum = 0;
  for (let i = 0; measureWidth(num.toFixed(i)) <= 410; i++) {
    maxNum = num.toFixed(i);
  }
  // parseFloat to remove trailing zeros
  return parseFloat(maxNum);
}

// display errorMsg, clear after 3 seconds
function addError(errorMsg) {
  clearTimeout(timeout); // reset timer if already running
  var timeout = setTimeout(clearError, 3000);
  timeout;
  errorText.innerHTML = `Error: ${errorMsg}`;
  function clearError() {
    errorText.innerHTML = "";
  }
}
