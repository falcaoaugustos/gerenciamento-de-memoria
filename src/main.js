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
  outputFileContainer.innerHTML = "";
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
  displacement.innerHTML = calculateDisplacement(initialPosition, data);
  avarageDisplacement.innerHTML = calculateAvarageDisplacement(displacement.innerHTML, data);
  variance.innerHTML = calculateVariance(avarageDisplacement.innerHTML, data);

  createFileFromDataArray(data);
}

function loadOutputCSCAN(initialPosition, data) {
  displacement.innerHTML = calculateDisplacement(initialPosition, data[0]) + calculateDisplacement(initialPosition, data[1]);
  avarageDisplacement.innerHTML = calculateAvarageDisplacement(displacement.innerHTML, data);
  variance.innerHTML = calculateVariance(avarageDisplacement.innerHTML, data);

  var newData = [];
  data[0].forEach(value => newData.push(value));
  data[1].forEach(value => newData.push(value));

  createFileFromDataArray(newData);
}

function fifo() {
  getInputData();
  transformInputFile(inputFile, algorithms.fifo);
}

function sortSSF(initialPositionValue, data) {
  data.sort(auxSortFunc);
  var currentValue = initialPositionValue;
  var result = [];

  while (data.length > 0) {
    var leftIndex = 0;
    var rightIndex = data.length - 1;
    var medium = Math.floor((leftIndex + rightIndex) / 2);

    while (absolute(leftIndex, rightIndex) > 1) {
      if (data[medium] > currentValue) {
        rightIndex = medium;
      } else {
        leftIndex = medium;
      }

      medium = Math.floor((leftIndex + rightIndex) / 2);
    }

    if (absolute(currentValue, data[leftIndex]) < absolute(currentValue, data[rightIndex])) {
      currentValue = data[leftIndex];
      result.push(data.splice(leftIndex, 1).pop());
    } else {
      currentValue = data[rightIndex];
      result.push(data.splice(rightIndex, 1).pop());
    }
  }
  
  return result;
}

function ssf() {
  getInputData();
  transformInputFile(inputFile, algorithms.ssf);
}

function sortSCAN(initialPositionValue, data) {
  data.sort(auxSortFunc);
  var increasing = true;
  var result = [];

  if (absolute(initialPositionValue, data[0]) < absolute(initialPositionValue, data[data.length - 1])) {
    increasing = false;
  }

  var leftIndex = 0;
  var rightIndex = data.length - 1;
  var medium = Math.floor((leftIndex + rightIndex) / 2);

  while (absolute(leftIndex, rightIndex) > 1) {
    if (data[medium] > initialPositionValue) {
      rightIndex = medium;
    } else {
      leftIndex = medium;
    }

    medium = Math.floor((leftIndex + rightIndex) / 2);
  }

  if (increasing) {
    for (var i = rightIndex; i < data.length; i++) result.push(data[i]);
    for (var i = leftIndex; i > -1; i--) result.push(data[i]);
  } else {
    for (var i = leftIndex; i > -1; i--) result.push(data[i]);
    for (var i = rightIndex; i < data.length; i++) result.push(data[i]);
  }

  return result;
}

function scan() {
  getInputData();
  transformInputFile(inputFile, algorithms.scan);
}

function sortCSCAN(initialPositionValue, data) {
  data.sort(auxSortFunc);
  var increasing = true;
  var result01 = [];
  var result02 = [];

  var leftIndex = 0;
  var rightIndex = data.length - 1;
  var medium = Math.floor((leftIndex + rightIndex) / 2);

  while (absolute(leftIndex, rightIndex) > 1) {
    if (data[medium] > initialPositionValue) {
      rightIndex = medium;
    } else {
      leftIndex = medium;
    }

    medium = Math.floor((leftIndex + rightIndex) / 2);
  }

  if (absolute(initialPositionValue, data[leftIndex]) < absolute(initialPositionValue, data[rightIndex])) {
    increasing = false;
  }

  if (increasing) {
    for (var i = rightIndex; i < data.length; i++) result01.push(data[i]);
    for (var i = 0; i < rightIndex; i++) result02.push(data[i]);
  } else {
    for (var i = leftIndex; i > -1; i--) result01.push(data[i]);
    for (var i = data.length - 1; i > leftIndex; i--) result02.push(data[i]);
  }

  return [result01, result02];
}

function cscan() {
  getInputData();
  transformInputFile(inputFile, algorithms.cscan);
}

const auxSortFunc = (a, b) => a - b;

const algorithms = {
  fifo: result => { loadOutput(initialPosition, transformStringData(result)); },
  ssf: result => { loadOutput(initialPosition, sortSSF(initialPosition, transformStringData(result))); },
  scan: result => { loadOutput(initialPosition, sortSCAN(initialPosition, transformStringData(result))); },
  cscan: result => { loadOutputCSCAN(initialPosition, sortCSCAN(initialPosition, transformStringData(result))); }
}