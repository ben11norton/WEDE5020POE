// SECTION FOR index.html
// functions we call on our page load

// global variables 
let surfSpotCardToFillIn;

// here we need to check which page we are on when our script reloads after navigating to a new page
let activePageName;
// so we can add a div with an id on each page to tell us which page we are on
checkActivePage();
function checkActivePage(){
    var activePageDiv = document.querySelector('.activePageTag');
    activePageName = activePageDiv.id;
}

// now we know what page we are on we can activate different functions accordingly
triggerActivePageFunctions();
function triggerActivePageFunctions(){

    switch (activePageName) {
        case "dashboardPage":
            checkAndDisplaySurfSpots();
            break;
        case "addSurfSpotPage":
            checkAndDisplaySurfSpots();
            break;
        case "personalPage":
            break;
        case "exploreSurfSpotsPage":
            break;
        case "aboutPage":
            break;
        default:
            break;
    }
}

function checkAndDisplaySurfSpots(){
    let storedString = localStorage.getItem('surfSpotDetailsLocalStorageArray');
    let storedSurfSpotsForDashboard = [];

    if (storedString && storedString !== "undefined") {
        storedSurfSpotsForDashboard = JSON.parse(storedString);
    }
    // get our cached surf spots from our addSurfSpot page

    // then we can loop through each of our stored suf spot details
    // to display on our surf spot dashboard section or when we are reloading our addSurfSpotPage
    for(let i = 0; i < storedSurfSpotsForDashboard.length; i++){
        // so we can have up to 3 sotred surf spot information objects
        // we can assing out surfSpotCardToFillIn to our corresponding dashboard card using the index of our stored spots
        var surfSpotCardIndex = i + 1;
        var surfSpotCard = document.getElementById(`surfSpot${surfSpotCardIndex}`);
        surfSpotCardToFillIn = surfSpotCard;
        // and then populate the information like we do on our addSurfSpotModal
        // and pass in each of our objects
        var surfSpotObjectToShowOnDashboard = storedSurfSpotsForDashboard[i];
        showNewSurfSpotInfo(surfSpotObjectToShowOnDashboard)
    }
}


// SECTION FOR addSurfSpot.html
// keeping track of our modal globally here to hide and show
let addSurfSpotModalInstance;

// here we store our form data using a  global object
// we will use our input and select id's and store them as key value pairs
// using the id as the key and the input.value as the value in our addNewSurfSpot function
var surfSpotDetails = {};
// and we will then add them to an array which we can then cache to display the details on our dashboard
let surfSpotDetailsArray = [];

// and we will also store which add spot card we clicked on
// so we can populate the correct card with the information
// which is stored in surfSpotCardToFillIn

function showAddSurfSpotModal(newSurfSpotCard){
    // assign the card we clicked on to populate our details 
    surfSpotCardToFillIn = newSurfSpotCard;
    //  fist we show our boostrap modal using our onclick event
    const addSurfSpotModalElement = document.getElementById('addSurfSpotModal');
    addSurfSpotModalInstance = new bootstrap.Modal(addSurfSpotModalElement);
    addSurfSpotModalInstance.show();
}

function addNewSurfSpot(addSurfSpotButton){
    const addSurfSpotModal = document.getElementById('addSurfSpotModal');

    // get all our inputs and selects
    var surfSpotInputFields = addSurfSpotModal.querySelectorAll('input, select, textarea');

    // loop throgh them
    for(let i = 0; i < surfSpotInputFields.length; i++){
        // grab their id's
        var inputField = surfSpotInputFields[i];
        var inputId = inputField.id;

        // grab the corresponding value
        var inputValue = inputField.value;

        // store our key value pair in out global object to then use to show this information on the page
        surfSpotDetails[inputId] = inputValue;


        // then we clear our inputfields ready for the next surf spot to be added
        inputField.value = '';
    }

    // here we now need to store our details in our global array to cache
    // so we can add to our global array, alongside an id key we can use to then access later:
    var surfSpotDetailsId = surfSpotDetailsArray.length + 1;
    var surfSpotDetailsToStore = {
        id: surfSpotDetailsId,
        surfSpotDetails: surfSpotDetails
    };

    // push into the array
    surfSpotDetailsArray.push(surfSpotDetailsToStore);

    // and store to our local storage cache to show on the dashboard
    localStorage.setItem('surfSpotDetailsLocalStorageArray', JSON.stringify(surfSpotDetailsArray));

    // display our infomation in our card
    showNewSurfSpotInfo(surfSpotDetails);

    // lastly we hide our modal
    addSurfSpotModalInstance.hide();
    // catering for our edit modal hide
    var modalBackdrop = document.querySelector('.modal-backdrop.fade.show');
    if(modalBackdrop){
        modalBackdrop.remove();
    }
}


function showNewSurfSpotInfo(surfSpotDetailsObject){
    // here we now use our global object with our details
    // to populate our surfSpotCardToFillIn card

    // first we clear our surf spot card
    surfSpotCardToFillIn.innerHTML = '';

    // then we grab our hidden surf spot card with boiler plate details
    // and we clone it
    var addSurfSpotCardDetailsHidden = document.getElementById('addSurfSpotCardDetailsHidden');
    var newSurfSpotCardDetails = addSurfSpotCardDetailsHidden.cloneNode(true);

    // then we populate this cloned boilet plate details card
    var newSurfSpotDetails = newSurfSpotCardDetails.querySelectorAll('span');

    // loop through all our children divs
    for (let i = 0; i < newSurfSpotDetails.length; i ++){
        var newSurfSpotDetail = newSurfSpotDetails[i];

        // then using their class we can match up the values from our global object
        var newSurfSpotDetailKey = newSurfSpotDetail.className.split('CardDetails')[0];
        var newSurfSpotDetailValue = surfSpotDetailsObject[newSurfSpotDetailKey];

        // and we can set our value to the matching div
        newSurfSpotDetail.textContent= newSurfSpotDetailValue;
    }

    // lastly we append this filled in card to our surfSpotCardToFillIn
    surfSpotCardToFillIn.appendChild(newSurfSpotCardDetails);

    // and then we unhide our card
    newSurfSpotCardDetails.style.display = 'flex';
    // and remove it's hidden id so next surf spot added doesn't get muddled up
    newSurfSpotCardDetails.id = '';
}


function editSurfSpot(editSpotBtn){
    //  open our surf spot modal
    var newSurfSpotCard = editSpotBtn.parentNode.parentNode;
    showAddSurfSpotModal(newSurfSpotCard)

    // then we grab our key to access the surf spot details array
    var surfSpotDetailsId = newSurfSpotCard.id;
    var surfDetailsKey = parseInt(surfSpotDetailsId.split('surfSpot')[1]);

    let surfSpotDetailsToPopulateModal = {};
    // using our key we can loop through our surfSpotDetailsArray
    for(let i = 0; i < surfSpotDetailsArray.length; i++){
        var surfSpotDetails = surfSpotDetailsArray[i];
        // then grab our details using our matching key here
        if(surfSpotDetails.id === surfDetailsKey){
            surfSpotDetailsToPopulateModal = surfSpotDetails.surfSpotDetails;
        }
    }

    // then we populate our modal 
    populateEditSurfSpotModal(surfSpotDetailsToPopulateModal);
}

function populateEditSurfSpotModal(surfSpotDetailsToPopulateModal){
    var addSurfSpotModal = document.getElementById('addSurfSpotModal');
    // get all our inputs and selects
    var surfSpotInputFields = addSurfSpotModal.querySelectorAll('input, select, textarea');

    // loop throgh them
    for(let i = 0; i < surfSpotInputFields.length; i++){
        // grab their id's
        var inputField = surfSpotInputFields[i];
        var inputId = inputField.id;

        // grab the corresponding surf details in our object
        var matchingDetails = surfSpotDetailsToPopulateModal[inputId];

        // then we pre-populate our form
        inputField.value = matchingDetails ?? '';
    }
}


function deleteSurfSpot(deleteSpotBtn){
    // first we clear our surf spot card and return it to its original content
    var newSurfSpotCard = deleteSpotBtn.parentNode.parentNode;
    var restoreSurfSpotContents = document.getElementById('restoreSurfSpotContents');
    var contentsToRestore = restoreSurfSpotContents.innerHTML;
    newSurfSpotCard.innerHTML = contentsToRestore;

    // then we can grab our surf spot key and then clear our storage
    var surfSpotDetailsId = newSurfSpotCard.id;
    var surfDetailsKey = parseInt(surfSpotDetailsId.split('surfSpot')[1]);

    // now we have our key we can clear our storage
    var surfSpotDetailsArray = JSON.parse(localStorage.getItem('surfSpotDetailsLocalStorageArray')) || [];

    // so we can loop through the stroed array
    for(let i = 0; i < surfSpotDetailsArray.length; i++){
        var id = surfSpotDetailsArray[i].id;
        if(id === surfDetailsKey){
            // then we remove this from our storage
            surfSpotDetailsArray.splice(i, 1);
            // stop the loop once found and removed
            break;
        }
    }

    // save the updated array back to localStorage
    localStorage.setItem('surfSpotDetailsLocalStorageArray', JSON.stringify(surfSpotDetailsArray));

    // lasty we reload the page
    window.location.reload();
}

function clearAllSurfSpots(){
    // here we can jsut clea our local storage of all our spots
    console.log('surf spots are being removed');
    localStorage.removeItem('surfSpotDetailsLocalStorageArray');
    // then we refresh the page to show the clear
    window.location.reload();
}
