/*eslint-env browser */

var startTime, timeOut,
SPACE_CODE = 32,
E_CODE = 101,
THOUSAND = 1000;
let times,
result,
arrayOfTimes = [];
hasPeeped = false;
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

//is getting called when the Start Button is clicked
function startExperiment(){
    resetTest();
    timeOut = setTimeout(playSound, getRandomTime());
    startButton.classList.add("disabled");
}

//a random amount of seconds is calculated between 2 and 5 seconds
function getRandomTime(){
    var min = 2,
    max = 5,
    rand = Math.floor(Math.random() * (max - min + 1) + min);
    return rand * THOUSAND;
}

function playSound(){
    //sound from: https://www.youtube.com/audiolibrary/soundeffects?ar=1587363065099&nv=1
    var audio = new Audio("Beep_Short.mp3");
    audio.play();
    startTime = new Date(); 
    hasPeeped = true;
}

//key events caught
function onKeyPressed(e){
    var neededTime;
    if (e.repeat) { return }
    if(e.keyCode === SPACE_CODE && hasPeeped === true){
        let endtime = new Date();
        trialCounter++;
        neededTime = endtime - startTime;
        arrayOfTimes.push(neededTime);
    	hasPeeped = false;
        result.classList.remove("hidden");
        result.innerHTML = neededTime + "ms";
        timeOut = setTimeout(playSound, getRandomTime());
    } 
    if(trialCounter == trials){
        //result.innerHTML = "Mean: " + countMean() + "ms";
        showResults();
        clearTimeout(timeOut);
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
	let csvContent = "data:text/csv;charset=utf-8,Reaction times in ms (acoustic)\n";
	arrayOfTimes.forEach(function (infoArray) {
		let row = infoArray + ",";
        csvContent += row + "\r\n";
    });
	encodedUri = encodeURI(csvContent);
	
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "resultsAcoustic.csv");
	document.body.appendChild(link);
	link.click();
}

init();