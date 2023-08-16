var entries = [];
//Takes input from the user and adds it to the entries array
function addEntry() {
  var entryDate = new Date(document.getElementById("entryDate").value);
  var exitDate = new Date(document.getElementById("exitDate").value);

  entries.push({ entry: entryDate, exit: exitDate });

  document.getElementById("entryDate").value = "";
  document.getElementById("exitDate").value = "";

  updateEntryList();
}
//Deletes an entry from the entries array if clicked on the delete button
function deleteEntry(index) {
  entries.splice(index, 1);
  updateEntryList();
}

// Helper function to format a date as "DD/MM/YYYY" in the warning message below when the earliest entry date is not within the last 180 days
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return day + "/" + month + "/" + year;
}
//---------------------------------------------------------------------------------
// below is the main function of the app
// Calculates the number of days left to stay in the country.
// Finds the earliest entry date among all entries.
// Displays warning if the earliest entry date is not within the last 180 days.
// Calculates the total days stayed within the last 180 days.
// Calculates the days left (that the user can stay) within the 180-day limit.
// Checks for exceeding the allowed stay period and displays a warning if so.
// Calculates the last day the user can stay based on the earliest entry date.
// Displays a message indicating the days left to stay.
function calculateDaysLeft() {
  var latestExit = new Date(entries[entries.length - 1].exit);
  var earliestAllowedEntry = new Date(latestExit);
  earliestAllowedEntry.setDate(earliestAllowedEntry.getDate() - 179);

  for (var i = 0; i < entries.length; i++) {
    var entry = new Date(entries[i].entry);

    if (entry < earliestAllowedEntry) {
      document.getElementById("message").innerHTML = "The time range for the given travels exceeds 180 days.";
      return;
    }
  }  
  var currentDate = new Date();
  
  var totalDaysWithin180 = 0;
  for (var i = 0; i < entries.length; i++) {
      var entry = entries[i].entry;
      var exit = entries[i].exit;
      
      var entry180 = new Date(entry);
      entry180.setDate(entry.getDate() - 180);
      
      var timeDiff180 = Math.abs(currentDate.getTime() - entry180.getTime());
      var daysWithin180 = Math.ceil(timeDiff180 / (1000 * 3600 * 24));
      
      var daysAllowed = Math.min(90, daysWithin180);
      var timeDiffEntryExit = Math.abs(exit.getTime() - entry.getTime());
      var daysStayed = Math.ceil(timeDiffEntryExit / (1000 * 3600 * 24));
      
      var daysLeft = daysAllowed - daysStayed;
      if (daysLeft < 0) {
          var daysExceeded = Math.abs(daysLeft);
          document.getElementById("message").innerHTML = "The 90-day stay limit is exceeded by " + daysExceeded + " days.";
          daysLeft = 0;
      } else {
          document.getElementById("message").innerHTML = "";
      }
      
      totalDaysWithin180 += daysStayed;
  }
  
  var totalDaysLeft = 90 - totalDaysWithin180;
  
  if (totalDaysLeft <= 0) {
      var daysExceeded = Math.abs(totalDaysLeft);
      document.getElementById("message").innerHTML = "The 90-day stay limit is exceeded by " + daysExceeded + " days.";
      totalDaysLeft = 0;
  }

  // Find the earliest entry date among all entries
  var earliestEntry = new Date(currentDate);
  for (var i = 0; i < entries.length; i++) {
      if (entries[i].entry < earliestEntry) {
          earliestEntry = entries[i].entry;
      }
  }

  // Calculate the time difference between currentDate and earliestEntry
  var timeDiffBtwnNowAndEarliestEntry = currentDate.getTime() - earliestEntry.getTime();
  var futurePastChecker = Math.ceil(timeDiffBtwnNowAndEarliestEntry / (1000 * 3600 * 24)); //used to check if the dates are not for current dates
  
  // Display a warning only if earliest entry date is not within the last 180 days
  if (futurePastChecker < 180 && futurePastChecker > 0) {
      document.getElementById("warningMessage").innerHTML = "";
  } else {
    document.getElementById("warningMessage").innerHTML = ""; //Beware: You are making calculations for past or future dates.
  }
    
  // Calculate the last day user can stay
  var lastDay = new Date(earliestEntry);
  lastDay.setDate(lastDay.getDate() + 180);
  if (lastDay < currentDate) {
    var resultMessage = totalDaysLeft > 0 ? "You had " + totalDaysLeft + " days left to stay in the country until " + formatDate(lastDay) + ".": "";
    document.getElementById("result").innerHTML = resultMessage; 
  } else {
    var resultMessage = totalDaysLeft > 0 ? "You have " + totalDaysLeft + " days left to stay in the country until " + formatDate(lastDay) + ".": "";
    document.getElementById("result").innerHTML = resultMessage; 
  }
}
//---------------------------------------------------------------------------------

// when the users click on the "Add" button (+), 
// the list is updated with the new entry.
// it sorts the entries by entry date.
// it checks for convergent dates and displays a warning if so.
// adds a delete button next to each entry list item.
function updateEntryList() {
  var entryList = document.getElementById("entryList");
  entryList.innerHTML = "";

  entries.sort(function (a, b) {
    return a.entry - b.entry;
  });

  var convergentWarning = false;
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i].entry.toLocaleDateString();
    var exit = entries[i].exit.toLocaleDateString();
    var entryNumber = i + 1;
    var entryText = "Entry-" + entryNumber + ":";
    var listItemText = entryText + " " + entry + " - " + exit;

    var listItem = document.createElement("li");
    listItem.textContent = listItemText;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("onclick", "deleteEntry(" + i + ")");
    listItem.appendChild(deleteButton);

    entryList.appendChild(listItem);

    if (i > 0 && entries[i].entry <= entries[i - 1].exit) {
      convergentWarning = true;
    }
  }

  if (convergentWarning) {
    document.getElementById("warningMessage").innerHTML = "Beware: The dates are convergent.";
  }
}
// this function clears the entries array and all the fields in the form.
function refresh() {
  entries = [];
  document.getElementById("entryDate").value = "";
  document.getElementById("exitDate").value = "";
  document.getElementById("message").innerHTML = "";
  document.getElementById("warningMessage").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  updateEntryList();
}
