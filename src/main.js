var cylinder = 0;
var initialPosition = 0;
var seekTime = 0;
var inputFile = null;

var inputFileType = "";

var displacement = document.getElementById("outputDisplacement");
var avarageDisplacement = document.getElementById("outputAvarageDisplacement");
var variance = document.getElementById("outputVariance");
var standardDeviation = document.getElementById("outputStandardDeviation");
var outputFileContainer = document.getElementById("sortedOutputFile");


function getInputData() {
  var inputForm = document.getElementById("inputForm");
  cylinder = inputForm.elements.namedItem("cylinder").value;
  initialPosition = inputForm.elements.namedItem("armInitialPosition").value;
  seekTime = inputForm.elements.namedItem("seekTime").value;
  inputFile = inputForm.elements.namedItem("requestsFile").files[0];
}

function transformInputFile(inputFile, cb) {
  inputFileType = inputFile.name.split(".");
  inputFileType = inputFileType[inputFileType.length - 1];

  var reader = new FileReader();
  reader.onloadend = () => cb(reader.result);
  reader.readAsText(inputFile);
}

function transformStringData(data) {
  var dataArray = data.split("-").map(Number);
  dataArray.pop();
  return dataArray;
}

function createFileFromDataArray(dataArray) {
  var dataString = "";
  dataArray.forEach(numb => { dataString = dataString + String(numb) + "-" });
  var outputLink = document.createElement("a");
  outputLink.innerHTML = `<a href='data:text/plain;charset=utf-16,${encodeURIComponent(dataString)}' download='output.${inputFileType}'">Baixe o arquivo com a sequencia ordenada!</a>`;
  outputFileContainer.appendChild(outputLink);
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
  console.log(data);
  displacement.innerHTML = calculateDisplacement(initialPosition, data);
  avarageDisplacement.innerHTML = calculateAvarageDisplacement(displacement.innerHTML, data);
  variance.innerHTML = calculateVariance(avarageDisplacement.innerHTML, data);

  createFileFromDataArray(data);
}

function fifo() {
  getInputData();
  transformInputFile(inputFile, algorithms.fifo);
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

const algorithms = {
  fifo: result => { loadOutput(initialPosition, transformStringData(result)); }
}