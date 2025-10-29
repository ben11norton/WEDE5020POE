// SECTION FOR index.html
let storedSurfSpotsForDashboard = JSON.parse(localStorage.getItem('currentSurfSpot')) || [];
debugger;




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
let surfSpotCardToFillIn;

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
    // so we store a copy we can add to our global array:
    var surfSpotDetailsToStore = { ...surfSpotDetails };
    surfSpotDetailsArray.push(surfSpotDetailsToStore);

    // and store to our local storage cache to show on the dashbaord
    localStorage.setItem('currentSurfSpot', JSON.stringify(surfSpotDetailsArray));

    // display our infomation in our card
    showNewSurfSpotInfo();

    // lastly we hide our modal
    addSurfSpotModalInstance.hide();
}


function showNewSurfSpotInfo(){
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
        var newSurfSpotDetailValue = surfSpotDetails[newSurfSpotDetailKey];

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


