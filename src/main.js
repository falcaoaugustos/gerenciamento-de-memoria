const data = "12-9-43-32-50-43-40-20-36-8-34-3-44-12-32-10-8-18-43-11-";

var cylinder = 0;
var initialPosition = 0;
var seekTime = 0;

var displacement = document.getElementById("outputDisplacement");
var avarageDisplacement = document.getElementById("outputAvarageDisplacement");
var variance = document.getElementById("outputVariance");
var standardDeviation = document.getElementById("outputStandardDeviation");

function getInputData() {
  var inputForm = document.getElementById("inputForm");
  cylinder = inputForm.elements.namedItem("cylinder").value;
  initialPosition = inputForm.elements.namedItem("armInitialPosition").value;
  seekTime = inputForm.elements.namedItem("seekTime").value;
}

function transformStringData(data) {
  var dataArray = data.split("-").map(Number);
  dataArray.pop();
  return dataArray;
}

function absolute(a, b) {
  return (a - b) < 0
  ? (a - b) * -1
  : (a - b);
}

function calculateDisplacement(initialPosition, data) {
  var displacement = 0;
  var currentValue = initialPosition;

  data.forEach(i => {
    displacement = displacement + absolute(currentValue, i);
    currentValue = i;
  });

  return displacement;
}

function calculateAvarageDisplacement(displacement, data) {
  return displacement / data.length;
}

function calculateVariance(avarage, data) {
  var variance = 0;
  data.forEach(i => {
    variance = variance + absolute(avarage, i) ** 2;
  });
  return variance;
}

// calculateStandardDeviation() {}

function loadOutput(initialPosition, data) {
  displacement.innerHTML = calculateDisplacement(initialPosition, data);
  avarageDisplacement.innerHTML = calculateAvarageDisplacement(displacement.innerHTML, data);
  variance.innerHTML = calculateVariance(avarageDisplacement.innerHTML, data);
}

function fifo() {
  getInputData();
  loadOutput(initialPosition, transformStringData(data));
}

function ssf() {
  alert("algoritmo SSF");
}

function scan() {
  alert("algoritmo SCAN");
}

function cscan() {
  alert("algoritmo C-SCAN");
}