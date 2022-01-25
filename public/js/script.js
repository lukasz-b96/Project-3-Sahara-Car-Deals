var countryLists = new Array(3);
countryLists["empty"] = [];
countryLists["Aston Martin"] = ["DB11", "DBX", "Vantage"];
countryLists["Bentley"] = ["Bentayga", "Continental GT", "Flying Spur"];
countryLists["Jaguar"] = ["XF", "F-Type", "F-Pace"];
countryLists["Land Rover"] = ["Defender", "Discovery", "Evoque"];
countryLists["McLaren"] = ["Artura", "720S", "Senna"];

// Source
// https://www.w3.org/TR/WCAG20-TECHS/SCR19.html
function countryChange(selectObj) {
  console.log("work :D ");
  var idx = selectObj.selectedIndex;
  var which = selectObj.options[idx].value;
  cList = countryLists[which];
  console.log(which);
  var cSelect = document.getElementById("model");
  while (cSelect.options.length > 0) {
    cSelect.remove(0);
  }
  var newOption;
  for (var i = 0; i < cList.length; i++) {
    newOption = document.createElement("option");
    newOption.value = cList[i];
    newOption.text = cList[i];

    try {
      cSelect.add(newOption);
    } catch (e) {
      cSelect.appendChild(newOption);
    }
  }
}
