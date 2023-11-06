var searchForm = document.getElementById("searchForm"); // the form for searches
var userInput = document.getElementById("formInput"); // get the input user typed
var buttonList = document.getElementById("searchHistory"); // get the container for the search history
var historyButton = document.getElementById("historyButton"); // get the button that is in search history

function handleForm(event){ // handles form submissions

    event.preventDefault(); // prevent page reload

    if(userInput.value != ""){ // make sure text is there
            makeHistoryButton(userInput.value); // make search history button
    }
}

function makeHistoryButton(buttonName){ // adds buttons so user can click to see cities the have searched before
    var button = document.createElement("button");
    button.textContent = buttonName;
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.id = "historyButton";
    buttonList.appendChild(button);
}

searchForm.addEventListener("submit", handleForm); // handle form submit event