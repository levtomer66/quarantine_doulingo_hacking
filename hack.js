
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 

async function sleepByWords(text) {
	var numWords = text.split(" ").length;
	var numPsiks = (text.match(/,/g) || []).length;
	var sleepVal = numWords*700 + numPsiks*700;
	console.log(`Sleeping ${sleepVal}`);
	await sleep(sleepVal);
}

async function startStory() {
	await sleep(2000);
	console.log("Starting...");
	var start_btn = document.querySelectorAll("button.story-starter-start-story")[0];
	if (start_btn) {
		start_btn.click();
	}

	await sleep(2000);
	for (let i=0;i<elms["elements"].length; i++) {
		cur_elm = elms["elements"][i];
		console.log(i);
		console.log(cur_elm);
	 	if (cur_elm["type"] === "LINE" || cur_elm["type"] === "TITLE") {
		 	await sleepByWords(cur_elm["line"]["content"]["text"]);
	 		console.log("Clicking cont...");
		 	document.querySelectorAll("button.continue")[0].click();

	 	}
	 	else if(cur_elm["type"] === "MULTIPLE_CHOICE" || cur_elm["type"] === "SELECT_PHRASE") {
	 		ansInd = cur_elm['correctAnswerIndex'];
	 		console.log(`Clicking answer index: ${ansInd} and then continue`);
	 		await sleep(500);
	 		document.querySelectorAll("ul.challenge-answers li button")[ansInd].click();
	 		await sleep(500);
	 		document.querySelectorAll("button.continue")[0].click();
	 		// document.querySelectorAll("ul.challenge-answers").children[ansInd].children[0].click()
	 		
	 	}
	 	else if (cur_elm["type"] === "CHALLENGE_PROMPT") {
	 		continue;
	 	}
	 	else if (cur_elm["type"] === "MATCH") {
	 		var tokens_arr = Array.from(document.querySelectorAll("ul.tokens button"));
	 		for (let j=0; j< cur_elm["fallbackHints"].length; j++) {
	 			await sleep(500);
	 			tokens_arr.filter(elem => elem.innerText == cur_elm["fallbackHints"][j]["phrase"])[0].click();
	 			await sleep(500);
	 			tokens_arr.filter(elem => elem.innerText == cur_elm["fallbackHints"][j]["translation"])[0].click();
	 		}
	 		await sleep(2000);
	 		document.querySelectorAll("button.continue")[0].click();
	 	}
	 	else if (cur_elm["type"] === "POINT_TO_PHRASE") {
	 		var ans_arr = Array.from(document.querySelectorAll("div.tappable-phrase"));
	 		var ans_text = Array.from(cur_elm["transcriptParts"]).filter(elem=>elem.selectable)[cur_elm["correctAnswerIndex"]].text;
	 		ans_arr.filter(e => e.textContent == ans_text)[0].click();
	 		await sleep(2000);
	 		document.querySelectorAll("button.continue")[0].click();
	 	}
	 	else if (cur_elm["type"] === "ARRANGE") {
	 		buttons_arr = document.querySelectorAll(".phrase-bank span");
	 		for (let z=0;z<buttons_arr.length;z++) {
	 			buttons_arr[cur_elm["phraseOrder"][z]].click();
	 			await sleep(100);
	 		}
	 		await sleep(1000);
	 		document.querySelectorAll("button.continue")[0].click();
	 	}
	 	else {
	 		console.log("Unknown element");
	 	}
	 	
	 
	};
	document.querySelectorAll("button.continue")[0].click();
	await sleep(2500);
	console.log("Getting new story :)");
 	var stories = JSON.parse(httpGet("https://stories.duolingo.com/api2/stories?fromLanguage=en&learningLanguage=es&masterVersions=false&illustrationFormat=svg"));
	var randSet = stories.sets[getRandomInt(3)];
	var randStory = randSet[getRandomInt(randSet.length)].id;

	loc = "https://stories.duolingo.com/lessons/" + randStory;
	location.replace(loc);
}

(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
        	if (this.responseText.startsWith("{\"elements")) {
            	elms = JSON.parse(this.responseText); //whatever the response was
            	startStory();
            }
        });
        origOpen.apply(this, arguments);
    };
})();

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
 

 
 
 