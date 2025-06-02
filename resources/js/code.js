/*eslint-env browser */

var startTime, timeOut,
SPACE_CODE = 32,
E_CODE = 101,
THOUSAND = 1000;
let circle,
times,
result,
arrayOfTimes = [];
hasChanged = false;
var startButton;
var trialCounter = 0;
var trials = 10;

function init(){
    startButton = document.querySelector(".button");
    startButton.addEventListener("click", startExperiment);
    document.addEventListener("keydown", onKeyPressed);
    result = document.getElementById("results");
    times = document.getElementById("times");
    description = document.getElementById("description");
}

//experiment is started when the start button is clicked
function startExperiment(){
    resetTest();
    timeOut = setTimeout(changeColor, getRandomTime());
    startButton.classList.add("disabled");
}

//a random amount of seconds is calculated between 2 and 5 seconds
function getRandomTime(){
    var min = 2,
    max = 5,
    rand = Math.floor(Math.random() * (max - min + 1) + min);
    return rand * THOUSAND;
}

function changeColor(){
    circle = document.getElementById("circle");
    circle.style.background = "orange";
    startTime = new Date(); 
    hasChanged = true;
}

//key events triggered
function onKeyPressed(e){
    var neededTime;
    if (e.repeat) { return }
    if(e.keyCode === SPACE_CODE && hasChanged === true){
    	trialCounter++;
        let endtime = new Date();
        neededTime = endtime - startTime;
        arrayOfTimes.push(neededTime);
        result.classList.remove("hidden");
        result.innerHTML = neededTime + "ms";
        resetBackground();
        timeOut = setTimeout(changeColor, getRandomTime());
    }
    if(trialCounter == trials){
    	//result.innerHTML = "Mean: " + countMean() + "ms";
        resetBackground();
        clearTimeout(timeOut);
        showResults();
        document.removeEventListener("keydown", onKeyPressed);
    }
    
}

//the average of all reaction times is calculated
function countMean(){
    var i, mean = 0;
    for(i = 0; i < arrayOfTimes.length; i++){
        mean += parseInt(arrayOfTimes[i], 10);  
    }
    mean /= arrayOfTimes.length;
    return mean;
}

//reset everything to starting condition
function resetTest(){
    arrayOfTimes = [];
    times.innerHTML = "";
    result.classList.add("hidden");
    description.style.visibility = "hidden";
}

//circle color set back to blue
function resetBackground(){
    circle.style.background = "#00b0f0";
    hasChanged = false;
}

//show reaction times for user
function showResults(){
    let finalTimes = "", i;
    for (i = 0; i < arrayOfTimes.length; i++){
        if(i === arrayOfTimes.length - 1){
            finalTimes += arrayOfTimes[i] + "ms";
        }else{
        finalTimes += arrayOfTimes[i] + "ms, ";}
    }
    times.innerHTML = "Reaction times: " + finalTimes;
    saveToCsv();
    arrayOfTimes = [];
}

//csv file is created and ready to download
function saveToCsv(){
	var encodedUri, link;
	let csvContent = "data:text/csv;charset=utf-8,Reaction times in ms (visual)\n";
	arrayOfTimes.forEach(function (infoArray) {
		let row = infoArray + ",";
        csvContent += row + "\r\n";
    });
	encodedUri = encodeURI(csvContent);
	
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "resultsVisual.csv");
	document.body.appendChild(link);
	link.click();
}

init();