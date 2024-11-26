let recordsFromDb = [];
let states = [];
let cities = [];
let statesTableBody = ``;
let citiesTableBody = ``;

//validation not take albates only take number like pin code and mobile number
function validateZip(pinCode) {
  let code = pinCode.value;
  pinCode.value = code.replace(/[a-z\s]/g, "");
  if (/[a-z]/.test(code)) {
    document.getElementById("inputZipeColor").innerHTML = "Enter Number";
  }
}

// get Api Method call
function getUserData() {
  fetch("https://670e49f6073307b4ee463ca9.mockapi.io/user")
    .then((response) => response.json())
    .then((json) => {
      recordsFromDb = json;
      document.getElementById("dataPrintPreviously").innerHTML = "";
      for (let element of recordsFromDb) {
        const date = new Date(element.createdDate);
        let recentData = `<div class="col-3 mt-2  hovr " >
    <div class="card " style="width: 12rem;">
      <div class="card-body" onclick="showUserData(${element.id})">
        <div class="mb-1"><i class="fa-solid fa-user" role="button" ></i></div>
        <h5 class="">${element.firstName} ${element.lastName}</h5>
        <h6>${date.getHours()}:${date.getMinutes()} ${date.getHours() < 12 ? `AM` : `PM`
          }</h6>
      </div>
    </div>
                </div > `;
        document.getElementById("dataPrintPreviously").innerHTML =
          recentData + document.getElementById("dataPrintPreviously").innerHTML;
      }
      console.log(recordsFromDb);

    });
}

// post method api call
function submitData() {
  const firstName = document.getElementById("inputText1").value;
  const lastName = document.getElementById("inputText2").value;
  const fatherName = document.getElementById("inputText3").value;
  const motherName = document.getElementById("inputText4").value;
  const address = document.getElementById("inputAddress").value;
  const addressOptonal = document.getElementById("inputAddress2").value;
  const city = document.getElementById("inputCity").value;
  const state = document.getElementById("inputState").value;
  const zipCode = document.getElementById("inputZip").value;
  const cityId1 = cities.find((el) => el.cityValue == city);
  const cityId = cityId1.id;
  const getData = {
    firstName,
    lastName,
    fatherName,
    motherName,
    details: {
      address,
      addressOptonal,
      city,
      state,
      zipCode,
      cityId,
    },
    createdDate: new Date().toISOString(),
  };

  if (firstName == "" || !firstName.trim()) {
    document.getElementById("inputText1").style.border = " 1px solid red";
    document.getElementById("inputTextColor1").innerHTML = "Enter First Name";
    return;
  }
  if (fatherName == "" || !fatherName.trim()) {
    document.getElementById("inputText3").style.border = " 1px solid red";
    document.getElementById("inputTextColor3").innerHTML = "Enter Father Name";
    return;
  }
  if (motherName == "" || !motherName.trim()) {
    document.getElementById("inputText4").style.border = " 1px solid red";
    document.getElementById("inputTextColor4").innerHTML = "Enter Mother Name";
    return;
  }
  if (address == "" || !address.trim()) {
    document.getElementById("inputAddress").style.border = " 1px solid red";
    document.getElementById("inputAddressColor").innerHTML = "Enter Address";
    return;
  }

  if (state == "blank") {
    document.getElementById("inputState").style.border = " 1px solid red";
    return;
  }

  // if (zipCode.length !== 6) {
  //   document.getElementById("inputZip").style.border = " 1px solid red";
  //   document.getElementById("inputZipeColor").innerHTML = "Enter Code";
  // }
  if (firstName.trim() &&
    fatherName.trim() &&
    motherName.trim() &&
    address.trim() &&
    state != "blank" &&
    zipCode.length == 6) {
    Swal.fire({
      title: "Submitted Successfully!",
      text: "Your Details are saved!",
      icon: "success",
    });

    document.getElementById("dataPrintPreviously").style.display = "none";

    fetch("https://670e49f6073307b4ee463ca9.mockapi.io/user", {
      method: "POST",
      body: JSON.stringify(getData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        clearForm();
      });
  }
}

// show data in modal
function showUserData(user) {
  clearRedBoder();
  const userData = recordsFromDb.find((el) => el.id == user);
  console.log(userData)
  if (userData) {
    let newState = states.find(el => el.stateValue == userData.details.state);
    let newCity = cities.find(el => el.id == userData.details.cityId);
    console.log(userData.details.city)
    console.log(newCity);

    let modalInData = `<div class="modal fade" id = "exampleModalToggle" aria-hidden="true" aria - labelledby="exampleModalToggleLabel" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalToggleLabel"> ${userData.firstName
      } ${userData.lastName}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row g-0">
            <div class="col-6" style="font-size: 15px; text-transform: capitalize">
              Father Name: ${userData.fatherName}
            </div>
            <div class="col-6" style="font-size: 15px; text-transform: capitalize">
              Mother Name: ${userData.motherName}
            </div>
            <div class="row g-0 my-2 p-2  border rounded-2" style="background-color:#f8f8f870;">
              <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                Address: ${userData.details.address}
              </div>
              ${userData.details.addressOptonal ? `<div class="col-6" style="font-size: 15px; text-transform: capitalize">
                                Address 2: ${userData.details.addressOptonal}  </div>` : ``}
              <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                State: ${newState.stateName}
              </div>
              <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                City: ${newCity.cityName}
              </div>
              <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                Zip Code: ${newCity.zipCodeCity}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer ">
          <button onclick="editData(${userData.id})"
            data-bs-dismiss="modal" aria-label="Close" style="font-size: 16px; text-transform: capitalize" class="btn  w-25  btn-primary">Edit User </button>
          <button onclick="deletData(${userData.id})"
            data-bs-dismiss="modal" aria-label="Close" style="font-size: 16px; text-transform: capitalize" class="btn  w-25  btn-danger">Delete User </button>
        </div>
      </div>
    </div>
    </div > `;
    document.getElementById("demo").innerHTML = modalInData;
    const myModal = new bootstrap.Modal(
      document.getElementById("exampleModalToggle")
    );
    myModal.show();
  }
}

// edit method back details in form
function editData(user) {
  clearRedBoder();

  document.getElementById("dataPrintPreviously").style.display = "none";

  document.getElementById("submitData").style.display = "none";

  document.getElementById("showData").style.display = "none";

  document.getElementById("searchUser").style.display = "none";

  document.getElementById("deletData").style.display = "block";

  document.getElementById("saveUpdateData").style.display = "block";

  let saveBtn = `<button id = "saveChanges"   class="btn w-100 btn-danger" onclick = "updateData(${user})"> Save Changes</button>`;

  let deleted = `<button id = "deletData1" class="btn w-100 btn-danger" onclick = "cancel()"> Cancel</button> `;

  document.getElementById("deletData").innerHTML = deleted;

  document.getElementById("saveUpdateData").innerHTML = saveBtn;

  const userData = recordsFromDb.find((el) => el.id == user);

  console.log(userData)

  document.getElementById("inputText1").value = userData.firstName;

  document.getElementById("inputText2").value = userData.lastName;

  document.getElementById("inputText3").value = userData.fatherName;

  document.getElementById("inputText4").value = userData.motherName;

  document.getElementById("inputAddress").value = userData.details.address;

  document.getElementById("inputAddress2").value = userData.details.addressOptonal;

  document.getElementById("inputState").value = userData.details.state;

  changeState();

  document.getElementById("inputCity").value = userData.details.city;

  document.getElementById("inputZip").value = userData.details.zipCode;

}

// put method and new save update method
function updateData(user) {
  const firstName = document.getElementById("inputText1").value;
  const lastName = document.getElementById("inputText2").value;
  const fatherName = document.getElementById("inputText3").value;
  const motherName = document.getElementById("inputText4").value;
  const address = document.getElementById("inputAddress").value;
  const addressOptonal = document.getElementById("inputAddress2").value;
  const city = document.getElementById("inputCity").value;
  const state = document.getElementById("inputState").value;
  const zipCode = document.getElementById("inputZip").value;

  if (firstName == "" || !firstName.trim()) {
    document.getElementById("inputText1").style.border = " 1px solid red";
    document.getElementById("inputTextColor1").innerHTML = "Enter First Name";
    return;
  }
  if (fatherName == "" || !fatherName.trim()) {
    document.getElementById("inputText3").style.border = " 1px solid red";
    document.getElementById("inputTextColor3").innerHTML = "Enter Father Name";
    return;
  }
  if (motherName == "" || !motherName.trim()) {
    document.getElementById("inputText4").style.border = " 1px solid red";
    document.getElementById("inputTextColor4").innerHTML = "Enter Mother Name";
    return;
  }
  if (address == "" || !address.trim()) {
    document.getElementById("inputAddress").style.border = " 1px solid red";
    document.getElementById("inputAddressColor").innerHTML = "Enter Address";
    return;
  }
  if (city == "blank") {
    document.getElementById("inputCity").style.border = " 1px solid red";
    return;
  }
  if (state == "blank") {
    document.getElementById("inputState").style.border = " 1px solid red";
    return;
  }

  if (zipCode.length !== 6) {
    document.getElementById("inputZip").style.border = " 1px solid red";
    document.getElementById("inputZipeColor").innerHTML = "Enter Code";
  }
  console.log("hey");
  if (
    firstName.trim() &&
    fatherName.trim() &&
    motherName.trim() &&
    address.trim() &&
    state != "blank" &&
    city != "blank" &&
    zipCode.length == 6
  ) {
    clearRedBoder();

    document.getElementById("deletData").style.display = "none";

    document.getElementById("saveUpdateData").style.display = "none";

    document.getElementById("submitData").style.display = "block";

    document.getElementById("showData").style.display = "block";

    document.getElementById("searchUser").style.display = "block";

    const userData = recordsFromDb.find((el) => el.id == user);

    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.fatherName = fatherName;
    userData.motherName = motherName;
    userData.details = {
      address,
      addressOptonal,
      city,
      state,
      zipCode,
    };
    createdDate: new Date().toISOString();

    fetch(`https://670e49f6073307b4ee463ca9.mockapi.io/user/${user}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let updateData = json;
        ShowAllDetails();
        clearForm();
      });
  }
}

// delet Api method call
function deletData(user) {

  fetch(`https://670e49f6073307b4ee463ca9.mockapi.io/user/${user}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      clearForm();
      document.getElementById("deletData").style.display = "none";

      document.getElementById("saveUpdateData").style.display = "none";

      document.getElementById("submitData").style.display = "block";

      document.getElementById("showData").style.display = "";

      document.getElementById("searchUser").style.display = "";

      ShowAllDetails();
    });
}

//clear border after any
function clearRedBoder() {
  document.getElementById("inputText1").style.border = "1px solid #dee2e6";

  document.getElementById("inputText3").style.border = "1px solid #dee2e6";

  document.getElementById("inputText4").style.border = "1px solid #dee2e6";

  document.getElementById("inputAddress").style.border = "1px solid #dee2e6";

  document.getElementById("inputCity").style.border = "1px solid #dee2e6";

  document.getElementById("inputState").style.border = "1px solid #dee2e6";

  document.getElementById("inputZip").style.border = "1px solid #dee2e6";

  document.getElementById("inputTextColor1").innerHTML = ``;
  document.getElementById("inputTextColor3").innerHTML = ``;
  document.getElementById("inputTextColor4").innerHTML = ``;
  document.getElementById("inputAddressColor").innerHTML = ``;
  document.getElementById("inputZipeColor").innerHTML = ``;
}

//cancel btn click back to form
function cancel() {
  document.getElementById("deletData").style.display = "none";

  document.getElementById("saveUpdateData").style.display = "none";

  document.getElementById("submitData").style.display = "block";

  document.getElementById("showData").style.display = "";

  document.getElementById("searchUser").style.display = "";
  document.getElementById("dataPrintPreviously").style.display = "none";

  clearRedBoder();
  clearForm();
}

//form clear on click
function clearForm() {
  const firstName = document.getElementById("inputText1").value;
  const lastName = document.getElementById("inputText2").value;
  const fatherName = document.getElementById("inputText3").value;
  const motherName = document.getElementById("inputText4").value;
  const address = document.getElementById("inputAddress").value;
  const addressOptonal = document.getElementById("inputAddress2").value;
  const city = document.getElementById("inputCity").value;
  const state = document.getElementById("inputState").value;
  const zipCode = document.getElementById("inputZip").value;

  if (firstName) {
    document.getElementById("inputText1").value = "";
  }
  if (lastName) {
    document.getElementById("inputText2").value = "";
  }
  if (fatherName) {
    document.getElementById("inputText3").value = "";
  }
  if (motherName) {
    document.getElementById("inputText4").value = "";
  }
  if (address) {
    document.getElementById("inputAddress").value = "";
  }
  if (addressOptonal) {
    document.getElementById("inputAddress2").value = "";
  }
  if (zipCode) {
    document.getElementById("inputZip").value = "";
  }
  if (city) {
    document.getElementById("inputCity").value = "blank";
  }
  if (state) {
    document.getElementById("inputState").value = "blank";
  }
}

// onclick Show All Data
function ShowAllDetails() {
  document.getElementById("dataPrintPreviously").style.display = "";
  getUserData();
  clearRedBoder();
  clearForm();
}

ShowAllDetails();

//onclick change input form to check box
function changeDisplay() {
  document.getElementById("SubmitFormPart").style.display = "";
  document.getElementById("CheckFormPart").style.display = "none";
  document.getElementById("dataPrintPreviously").style.display = "";
}

//on click change check box to input form
function searchDisplay() {
  document.getElementById("SubmitFormPart").style.display = "none";
  document.getElementById("CheckFormPart").style.display = "";
  document.getElementById("dataPrintPreviously").style.display = "none";
}

//search data and respose a modal
function searchData() {
  const fName = document.getElementById("firstNameCheck").value;
  const lName = document.getElementById("lastNameCheck").value;

  fetch("https://670e49f6073307b4ee463ca9.mockapi.io/user")
    .then((response) => response.json())
    .then((json) => {
      let recordsFromDb = json;

      document.getElementById("dataPrintPreviously").innerHTML = "";

      // Flag to track if we found matching data
      let found = false;

      for (let element of recordsFromDb) {
        if (fName == element.firstName || lName == element.lastName) {
          found = true; // Set flag to true when a match is found

          let newPop = `
              <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalToggleLabel">${element.firstName
            } ${element.lastName}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="row g-0">
                        <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                          Father Name: ${element.fatherName}
                        </div>
                        <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                          Mother Name: ${element.motherName}
                        </div>
                        <div class="row g-0 my-2 p-2 border rounded-2" style="background-color: #f8f8f870;">
                          <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                            Address: ${element.details.address}
                          </div>
                          ${element.details.addressOptonal
              ? `<div class="col-6" style="font-size: 15px; text-transform: capitalize">
                                  Address 2: ${element.details.addressOptonal}
                                </div>`
              : ``}
                          <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                            State: ${element.details.state}
                          </div>
                          <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                            City: ${element.details.city}
                          </div>
                          <div class="col-6" style="font-size: 15px; text-transform: capitalize">
                            Zip Code: ${element.details.zipCode}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            `;

          document.getElementById("demo").innerHTML = newPop;
          const myModal = new bootstrap.Modal(
            document.getElementById("myModal")
          );
          myModal.show();
          break; // Break the loop once a match is found
        }
      }
      // If no match was found, show the error alert
      if (!found) {
        Swal.fire({
          icon: "error",
          title: "No Data Found",
          text: "Something went wrong!",
        });
      }
    });
}

//////get Api work
function showState(isTableState = false) {
  fetch("https://671a34b0acf9aa94f6a99bad.mockapi.io/state")
    .then((response) => response.json())
    .then((json) => {
      states = json;
      states.sort((a, b) => a.stateName.localeCompare(b.stateName));
      console.log(states);
      buildStateView();
      buildStateViewTable(isTableState);
      citiesGet();
    });
}

////get api state 
showState();

///state work done/////post APi
function newAddState() {
  let stateName = document.getElementById("newStateAdd").value;
  let stateValue = document.getElementById("stateValue").value;

  let statePost = {
    stateName,
    stateValue,
    createdAt: new Date().toISOString(),
  };

  if (stateName == "" || !stateName.trim()) {
    document.getElementById("newStateAdd").style.border = "1px solid red";
    document.getElementById("alertShowStateName").innerHTML =
      "Enter State Value";
    return;
  }

  if (stateValue == "" || !stateValue.trim()) {
    document.getElementById("stateValue").style.border = "1px solid red";
    document.getElementById("alertShowStateValue").innerHTML =
      "Enter State Value";
    return;
  }

  document.getElementById("alertShowStateValue").style.display = "block";
  document.getElementById("alertShowStateName").style.display = "block";

  for (const element of states) {

    if (stateName.toLowerCase() == element.stateName.toLowerCase()) {
      document.getElementById("alertShowStateName").innerHTML = "State Name Already Exists";
      document.getElementById("newStateAdd").style.border = "1px solid red";
      return;
    }

    if (stateValue.toLowerCase() == element.stateValue.toLowerCase()) {
      document.getElementById("alertShowStateValue").innerHTML = "Already Exits";
      document.getElementById("stateValue").style.border = "1px solid red";
      return;
    }
  }

  if (stateName.trim() && stateValue.trim()) {
    document.getElementById("newStateAdd").value = ``;
    document.getElementById("stateValue").value = ``;
    document.getElementById("alertShowStateValue").style.display = "none";
    document.getElementById("alertShowStateName").style.display = "none";

    fetch("https://671a34b0acf9aa94f6a99bad.mockapi.io/state", {
      method: "POST",
      body: JSON.stringify(statePost),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        showState(true);
      });
  }
}

/////create options state in  select 
function buildStateView() {
  let createOptionState = `<option value="blank" selected disabled > Choose </option>`;
  for (const state of states) {
    createOptionState += `<option value="${state.stateValue}" >${state.stateName} </option>`;
  }
  document.getElementById("inputState").innerHTML = createOptionState;
}

///in modal table print 
function buildStateViewTable(isTableState) {
  statesTableBody = `<table class="table" id="tablePrint">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">State Name</th>
      <th scope="col">State Value</th>
      <th scope="col">Time</th>
    </tr>
  </thead>
  <tbody>`;
  let countId = 0;
  for (const state of states) {
    countId++;
    const date = new Date(state.createdAt);
    statesTableBody += `<tr>
    <th scope="row">${countId}</th>
    <td>${state.stateName}</td>
    <td>${state.stateValue}</td>
    <td>${date.getHours()}:${date.getMinutes()} ${date.getHours() < 12 ? `AM` : `PM`}</td>
  </tr>`;
  }
  statesTableBody += `</tbody>
</table>`;
  if (isTableState) {
    document.getElementById("tablePrint").innerHTML = statesTableBody;
  }
}

///////new state add modal template ////
function statesAdd() {

  let modalInData = `<div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalToggleLabel">New State Add </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" >
          <div class="row g-1">
            <div class="col-6">
            <lable>State Name:</lable>
              <input type="text" class="form-control w-100"
                id="newStateAdd"  oninput="resetError()" name="state" />
                <div style="color:red; " id="alertShowStateName"> </div>
               </div>
            <div class="col-6">
            <lable>State Value:</lable>
                 <input type="text" class="form-control w-100"
                id="stateValue"  oninput="resetError()" name="state" />
                 <div style="color:red;"  id="alertShowStateValue"> </div>
            </div>
            <div class="col-12">
              <button onclick="newAddState()" style="font-size: 16px; text-transform: capitalize" class="btn  mt-2 w-100  btn-primary">Add State</button>
            </div>
          </div>
        </div>
               <div class="modal-footer" style="max-height:400px; overflow: auto;" >
       ${statesTableBody}
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("demo").innerHTML = modalInData;
  const myModal = new bootstrap.Modal(
    document.getElementById("exampleModalToggle")
  );

  myModal.show();

}

// border reset on click
function resetBorder(inputId) {
  document.getElementById(inputId).style.border = "1px solid #dee2e6";
  document.getElementById("inputTextColor1").innerHTML = ``;
  document.getElementById("inputTextColor3").innerHTML = ``;
  document.getElementById("inputTextColor4").innerHTML = ``;
  document.getElementById("inputAddressColor").innerHTML = ``;
  document.getElementById("inputZipeColor").innerHTML = ``;
}

// reset value add state error
function resetError() {
  document.getElementById('newStateAdd').style.border = "1px solid #dee2e6";
  document.getElementById('stateValue').style.border = "1px solid #dee2e6";
  document.getElementById("alertShowStateValue").innerHTML = "";
  document.getElementById("alertShowStateName").innerHTML = "";
}

//////get api cities /////
function citiesGet(isTable = false) {
  fetch("https://671a34b0acf9aa94f6a99bad.mockapi.io/city")
    .then((response) => response.json())
    .then((json) => {
      cities = json;
      cities.sort((a, b) => a.cityName.localeCompare(b.cityName));
      // console.log(cities);
      buildCityViewTable(isTable);
      changeState();
    });
}

/////state get to cities 
function stateToCitites() {
  let onselectedState = document.getElementById('inputState').value;
  if (onselectedState != 'blank') {
    // citiesGet();   
  }
}

/////tableprint city///////
function buildCityViewTable(isTable) {
  citiesTableBody = `<table class="table" id="tablePrint1">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">City Name</th>
      <th scope="col">City Value</th>
      <th scope="col">State</th>
      <th scope="col">Zip Code</th>
      <th scope="col">Time</th>
      <th scope="col">Action</th>

    </tr>
  </thead>
  <tbody>`;
  let countId = 0;

  for (const city of cities) {
    countId++;
    const date = new Date(city.createdAt);
    let getState = states.find(el => el.id == city.stateId)
    citiesTableBody += `<tr>
    <th scope="row">${countId}</th>
    <td>${city.cityName}</td>
    <td>${city.cityValue}</td>
    <td>${getState.stateName}</td>
    <td>${city.zipCodeCity}</td>
    <td>${date.getHours()}:${date.getMinutes()} ${date.getHours() < 12 ? `AM` : `PM`}</td>
        <td>${`<i class="fa-solid me-2  fa-pen-to-square"style="cursor: pointer;" onclick="editCities(${city.id})"  ></i> 
          <i class="fa-solid text-danger fa-trash" onclick="deletCities(${city.id})" style="cursor: pointer;" ></i>`}</td>
  </tr>`;
  }
  citiesTableBody += `</tbody>
  </table>`;
  if (isTable) {
    document.getElementById("tablePrint1").innerHTML = citiesTableBody;
  }
}

/////////onclick cities modal 
function citiesAdd() {
  clearRedBoder();
  let stateVariable;
  for (const state of states) {
    stateVariable += `<option value="${state.stateValue}" >${state.stateName} </option>`;
  }
  let modalCity = `<div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalToggleLabel">City Add </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" >
          <div class="row g-1">
            <div class="col-6">
              <lable>States</lable>
              <select id="inputState1" class="form-select" onchange="resetBorder('inputState1')" name="state"
                style="cursor: pointer">
                <option  value="blank" selected disabled > Choose </option>
                ${stateVariable}
              </select>
            </div>
            <div class="col-6">
              <lable>City Name:</lable>
              <input type="text" class="form-control w-100"
              oninput="resetCitiesError()"
                id="cityAddName" name="state" />
              <div style="color:red; " id="alertShowCityName"> </div>
            </div>
            <div class="col-6">
              <lable>City Value:</lable>
              <input type="text" class="form-control w-100"
              oninput="resetCitiesError()"  
                id="citiesValue" name="state" />
              <div style="color:red;" id="alertShowCityValue"> </div>
            </div>
              <div class="col-6">
              <lable>Zip Code:</lable>
              <input type="text"  maxlength="6" size="6"  class="form-control w-100"
              oninput="resetCitiesError() , validateZip(this)"  
                id="zipCodeCities" name="zipeCode" />
              <div style="color:red;" id="alertShowZipCode"></div>
            </div>
            <div class="col-12">
            <div id="updateCityBtn" > </div>
              <button id="addCityBtn" onclick="submitCity()" style="font-size: 16px; text-transform: capitalize" class="btn w-100  btn-primary">Add City</button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="max-height:400px; overflow: auto;" >
        ${citiesTableBody}
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("demo").innerHTML = modalCity;
  const myModal = new bootstrap.Modal(
    document.getElementById("exampleModalToggle")
  );
  myModal.show();
}

/////submit city function post api
function submitCity() {
  let cityName = document.getElementById('cityAddName').value;
  let cityValue = document.getElementById('citiesValue').value;
  let onSelectState = document.getElementById('inputState1').value;
  let zipCodeCity = document.getElementById('zipCodeCities').value;

  if (onSelectState == '') {
    document.getElementById("inputState1").style.border = "1px solid red";
    return;
  }

  let findStateId = states.find((el) => (el.stateValue == onSelectState));
  // console.log(findStateId);
  let stateId = findStateId.id;
  let citiesMatch = cities.filter((el) => (el.stateId == stateId));
  // console.log(citiesMatch);
  let stateValueInCity = findStateId.stateValue;

  let newArrayCities = {
    cityName,
    cityValue,
    stateId,
    createdAt: new Date().toISOString(),
    stateValueInCity,
    zipCodeCity
  }

  console.log(newArrayCities)
  document.getElementById("alertShowCityValue").style.display = "block";
  document.getElementById("alertShowCityName").style.display = "block";



  if (cityName == "" || !cityName.trim()) {
    // if (cityName == citiesMatch.cityName || !cityName.trim()) {
    document.getElementById("cityAddName").style.border = "1px solid red";
    document.getElementById("alertShowCityName").innerHTML =
      "Enter City Value";
    return;
  }

  if (cityValue == "" || !cityValue.trim()) {
    document.getElementById("citiesValue").style.border = "1px solid red";
    document.getElementById("alertShowCityValue").innerHTML =
      "Enter City Value";
    return;
  }
  if (zipCodeCity.length != 6 || !zipCodeCity.trim()) {
    document.getElementById("zipCodeCities").style.border = "1px solid red";
    document.getElementById("alertShowZipCode").innerHTML =
      "Enter Code";
    return;
  }


  for (const element of citiesMatch) {
    if (cityName.toLowerCase() == element.cityName.toLowerCase()) {
      document.getElementById("alertShowCityName").innerHTML = "City Name Already Exists";
      document.getElementById("cityAddName").style.border = "1px solid red";
      return;
    }

    if (cityValue.toLowerCase() == element.cityValue.toLowerCase()) {
      document.getElementById("alertShowCityValue").innerHTML = "Already Exits";
      document.getElementById("citiesValue").style.border = "1px solid red";
      return;
    }
    if (zipCodeCity == element.zipCodeCity) {
      document.getElementById("zipCodeCities").style.border = "1px solid red";
      document.getElementById("alertShowZipCode").innerHTML =
        "Already Exits";
      return;
    }
  }

  if (cityName.trim() && cityName.trim()) {
    document.getElementById("cityAddName").value = ``;
    document.getElementById("citiesValue").value = ``;
    document.getElementById("alertShowCityValue").style.display = "none";
    document.getElementById("alertShowCityName").style.display = "none";
    document.getElementById('zipCodeCities').value = ``;

    fetch("https://671a34b0acf9aa94f6a99bad.mockapi.io/city", {
      method: "POST",
      body: JSON.stringify(newArrayCities),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log(json)
        citiesGet(true);
        resetCitiesError();
      });
  }
}

/////reset cities error
function resetCitiesError() {
  document.getElementById('cityAddName').style.border = "1px solid #dee2e6";
  document.getElementById('citiesValue').style.border = "1px solid #dee2e6";
  document.getElementById('zipCodeCities').style.border = "1px solid #dee2e6";
  document.getElementById("alertShowCityValue").innerHTML = "";
  document.getElementById("alertShowCityName").innerHTML = "";
  document.getElementById("alertShowZipCode").innerHTML = "";
}

////state enter and able to cities 
function changeState() {
  let stateValueInput = document.getElementById('inputState');
  let disabledcities = document.getElementById('inputCity');
  disabledcities.disabled = stateValueInput.value == "";

  let onselected = document.getElementById('inputState').value;
  if (onselected != 'blank') {

    let findStateId1 = states.find((el) => (el.stateValue == onselected));
    console.log(findStateId1)

    let citiesPrintByStateId = cities.filter(el => el.stateId == findStateId1.id)
    console.log(citiesPrintByStateId)


    let createOptionCity = `<option value="blank" selected disabled > Choose </option>`;
    for (const city of citiesPrintByStateId) {
      createOptionCity += `<option value="${city.cityValue}" >${city.cityName} </option>`;
    }
    document.getElementById("inputCity").innerHTML = createOptionCity;

  }

}

function onCitiesZipCoded() {
  let citySelected = document.getElementById('inputCity').value;
  let findStateId1 = cities.find((el) => (el.cityValue == citySelected));
  console.log(findStateId1.zipCodeCity)
  document.getElementById('inputZip').value = findStateId1.zipCodeCity;
}

//////edit cities work
function editCities(city) {
  // document.getElementById("cityAddName").value = ``;
  // document.getElementById("citiesValue").value = ``;
  // console.log('edit City work Done')
  resetCitiesError();
  let cityData = cities.find(el => el.id == city);
  let stateNameById = states.find(el => el.id == cityData.stateId);
  // console.log(stateNameById)
  document.getElementById("cityAddName").value = cityData.cityName;
  document.getElementById("citiesValue").value = cityData.cityValue;
  document.getElementById("inputState1").value = stateNameById.stateValue;
  document.getElementById('zipCodeCities').value = cityData.zipCodeCity;
  document.getElementById("addCityBtn").style.display = "none";
  let updateCityBtn = `<button class="btn w-100 btn-primary" id="updatecitiesBtn" onclick="updateCities(${city})">  Update City </button>`;
  document.getElementById("updateCityBtn").innerHTML = updateCityBtn;

  console.log(city, cityData)

}


//////update cities on click put api
function updateCities(city) {
  let cityName = document.getElementById('cityAddName').value;
  let cityValue = document.getElementById('citiesValue').value;
  let onSelectState = document.getElementById('inputState1').value;
  let zipCodeCity = document.getElementById('zipCodeCities').value;
  if (onSelectState == 'blank') {
    document.getElementById("inputState1").style.border = "1px solid red";
    return;
  }

  let findStateId = states.find((el) => (el.stateValue == onSelectState));
  let stateId = findStateId.id;
  let citiesMatch = cities.filter((el) => (el.stateId == stateId));
  let onCitiesId = cities.filter((el) => el.id != city);
  let onCitiesIdSelected = cities.find((el) => el.id == city);
  let checkCities = citiesMatch.filter((el) => el.id != city);
  let stateValueInCity = findStateId.stateValue;
  let newArrayCities = {
    cityName,
    cityValue,
    stateId,
    createdAt: new Date().toISOString(),
    stateValueInCity,
    zipCodeCity,
  }

  document.getElementById("alertShowCityValue").style.display = "block";
  document.getElementById("alertShowCityName").style.display = "block";


  if (cityName == "" || !cityName.trim()) {
    document.getElementById("cityAddName").style.border = "1px solid red";
    document.getElementById("alertShowCityName").innerHTML =
      "Enter City Value";
    return;
  }

  if (cityValue == "" || !cityValue.trim()) {
    document.getElementById("citiesValue").style.border = "1px solid red";
    document.getElementById("alertShowCityValue").innerHTML =
      "Enter City Value";
    return;
  }
  if (zipCodeCity.length != 6 || !zipCodeCity.trim()) {
    document.getElementById("zipCodeCities").style.border = "1px solid red";
    document.getElementById("alertShowZipCode").innerHTML =
      "Enter Code";
    return;
  }



  if(cityName.toLowerCase() == onCitiesIdSelected.cityName.toLowerCase() && cityValue.toLowerCase() == onCitiesIdSelected.cityValue.toLowerCase()
  && zipCodeCity == onCitiesIdSelected.zipCodeCity  
  ){
    console.log("Match all details!")
    resetCitiesError();
    document.getElementById('inputState1').value = "blank";
    document.getElementById("cityAddName").value = ``;
    document.getElementById("citiesValue").value = ``;
    document.getElementById("alertShowCityValue").style.display = "none";
    document.getElementById("alertShowCityName").style.display = "none";
    document.getElementById('zipCodeCities').value = ``;
    document.getElementById("updatecitiesBtn").style.display = "none";
    document.getElementById("addCityBtn").style.display = "";
    return;
  }



  

  for (const element of onCitiesId) {
    if (cityValue.toLowerCase() == element.cityValue.toLowerCase()) {
      document.getElementById("alertShowCityValue").innerHTML = "Already Exits";
      document.getElementById("citiesValue").style.border = "1px solid red";
      console.log("error")
      return;
    }
    if (zipCodeCity == element.zipCodeCity) {
      document.getElementById("zipCodeCities").style.border = "1px solid red";
      document.getElementById("alertShowZipCode").innerHTML =
        "Already Exits";
      return;
    }
  }


  for (const element of checkCities) {
    // console.log(element.cityValue)
    if (cityValue.toLowerCase() == element.cityValue.toLowerCase()) {
      document.getElementById("alertShowCityValue").innerHTML = "Already Exits";
      document.getElementById("citiesValue").style.border = "1px solid red";
      console.log("error22222")
      return;
    }
    if (zipCodeCity == element.zipCodeCity) {
      document.getElementById("zipCodeCities").style.border = "1px solid red";
      document.getElementById("alertShowZipCode").innerHTML =
        "Already Exits";
      return;
    }
  }



  if (cityName.trim()) {
    document.getElementById("cityAddName").value = ``;
    document.getElementById("citiesValue").value = ``;
    document.getElementById("alertShowCityValue").style.display = "none";
    document.getElementById("alertShowCityName").style.display = "none";
    document.getElementById('zipCodeCities').value = ``;
    document.getElementById('inputState1').value = "blank";
    document.getElementById("updatecitiesBtn").style.display = "none";
    document.getElementById("addCityBtn").style.display = "";


    fetch(`https://671a34b0acf9aa94f6a99bad.mockapi.io/city/${city}`, {
      method: "PUT",
      body: JSON.stringify(newArrayCities),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        citiesGet(true);
        resetCitiesError();
        // showUserData(user);
      });

  }

}


//////delete cities api 
function deletCities(city) {

  let cityValueFindById = cities.find(el => el.id == city);
  console.log(cityValueFindById);

  let userCityData = recordsFromDb.find(el => el.details.city == cityValueFindById.cityValue)
  console.log(userCityData);

  console.log(recordsFromDb);

  if (userCityData) {
    Swal.fire("City Exits in User Can't Delete!");
  } else {
    fetch(`https://671a34b0acf9aa94f6a99bad.mockapi.io/city/${city}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((json) => {
        document.getElementById("cityAddName").value = ``;
        document.getElementById("citiesValue").value = ``;
        document.getElementById("alertShowCityValue").style.display = "none";
        document.getElementById("alertShowCityName").style.display = "none";
        document.getElementById('zipCodeCities').value = ``;
        document.getElementById('inputState1').value = ``;
        resetCitiesError();
        citiesGet(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "City Deleted Successfully",
          showConfirmButton: false,
          timer: 1500
        });
      });
  }
}