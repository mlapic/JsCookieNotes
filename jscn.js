
var debug = true;

var cookieExpirationAdd = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
var cookieExpirationDel = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

var allNotes = [];

var noteSelected = '';

$(document).ready(function(){
  
  //if(!debug) { document.getElementById('debugControlsDiv').style.display = 'none'; }
	restoreAll();
	printAll();
  setCrossInCircle();
  
  $('#closeAddNewNoteButton').click(function(){
    closeOverlay();
    noteSelected = '';
  });
  
  $('#addNewNoteButton').click(function(){
    closeOverlay();
    var value = document.getElementById("newNoteTextArea").value;
    if(noteSelected != '') {
      allNotes[noteSelected] = value;
    } else {
      allNotes.push(value);
    }
    noteSelected = '';
    printAll();
    saveAll();
  });
  
  $('#deleteNoteButton').click(function(){
    closeOverlay();
    if(noteSelected != '') {
      allNotes.splice(noteSelected, 1);
    }
    noteSelected = '';
    printAll();
    saveAll();
  });
  
  $('#circle').click(function(){
    openOverlay();
    document.getElementById("newNoteTextArea").value = '';
  });
  
  $('#settingsCircle').click(function(){
    document.getElementById('settingsOverlay').style.height = "100%";
    document.getElementById('settingsCircle').style.visibility = "hidden";
  });
  
  $('#closeSettingsButton').click(function(){
    document.getElementById('settingsOverlay').style.height = "0%";
    document.getElementById('settingsCircle').style.visibility = "visible";
  });
  
  
  
  $('#shAllCookiesDebugButton').click( function(){ showAllCookies(); });
  $('#delAllCookiedDebugButton').click( function(){ deleteAllCookies(); });
});




// ---------- Page Controls ----------

function openOverlay() {
		document.getElementById('overlay').style.height = "100%";
		document.getElementById('circle').style.visibility = "hidden";
}

function closeOverlay() {
		document.getElementById('overlay').style.height = "0%";
		document.getElementById('circle').style.visibility = "visible";
}

function selectNote(noteId) {
	openOverlay();
	document.getElementById('newNoteTextArea').value = document.getElementById(noteId).innerHTML;
	noteSelected = noteId.substring('noteId'.length, noteId.length);
}




// <div class="note" id="noteId1" onclick="selectNote('noteId1');"></div>
function printAll() {
  var nWrap = document.getElementById('notesWrapperDiv');
  var allNotesHTML = '';
  for(var i = 0; i < allNotes.length; i++) {
    allNotesHTML += '<div class="note" id="noteId' + i + '" onclick="selectNote(\'noteId' + i + '\');">';
    allNotesHTML += allNotes[i] + '</div>';
  }
  nWrap.innerHTML = allNotesHTML;
	nWrap.style.display = 'block';
	if(allNotes.length == 0) {
		nWrap.style.display = 'none';
	}
  allNotesHTML = '';
}

// save all notes in allNotes array in a cookie
function saveAll() { 
  if(allNotes.length == 0) {
    deleteAllCookies();
		return;
	}
  var allNotesTemp = allNotes.slice();
	for(var i = 0; i < allNotesTemp.length; i++) {
  	allNotesTemp[i] = encodeURIComponent(allNotesTemp[i]);
  }
  var saveString = btoa(allNotesTemp.toString());
  allNotesTemp = null;
  setCookie('jscn', saveString);
}


// restore all notes from cookie to allNotes array
function restoreAll() {
  var saveString = getCookieValue('jscn');
  if(saveString.length == 0) {
    return;
  }
	allNotes = atob(saveString).split(',');
	for(var i = 0; i < allNotes.length; i++) {
  	allNotes[i] = decodeURIComponent(allNotes[i]);
  }
}


// ------------- Cookie functions -------------

function setCookie(cName, cValue) {
  document.cookie = cName + "=" + cValue + cookieExpirationAdd;            
}

function deleteCookie(cName) {
  document.cookie = cName + "=" + cookieExpirationDel;
}

function getCookieValue(cName) {
  var cArray = document.cookie.split(";");
  var cNameTmp = '';
  for(var i = 0; i < cArray.length; i++) {
    cNameTmp = cArray[i].trim().split("=")[0];
    if(cNameTmp === cName) {
      return cArray[i].trim().split("=")[1];
    }
  }
  return '';
}

function deleteAllCookies() {
  if(document.cookie != '') {
    var cArray = document.cookie.split(";");
    for(var i = 0; i < cArray.length; i++) {
      deleteCookie(cArray[i].trim().split("=")[0])
    }
  }
}

function showAllCookies() {
  if(document.cookie != '') {
    out(document.cookie + ' [' + document.cookie.length + ']');
  } else {
    out('nothing');
  }          
}

// ---------- DEBUG ----------

function out(msg) {
  if(debug) {
    console.log(msg)
  }
}


// ------------- circle  -------------

function setCrossInCircle() {
  var width = document.getElementById('circle').offsetWidth;
  var height = document.getElementById('circle').offsetHeight;
  out(width);
  out(height);
  var crossShortSide = document.getElementById('cross').offsetWidth;
  var crossLongSide = document.getElementById('cross').offsetHeight;
  out(crossShortSide);
  out(crossLongSide);
  var x = (width - crossShortSide) / 2;
  var y = (height - crossLongSide) / 2;
  out(x);
  out(y);
  document.getElementById('cross').style.left = x + 'px';
  document.getElementById('cross').style.top = y + 'px';
  document.getElementById('settingsCross').style.left = x + 'px';
  document.getElementById('settingsCross').style.top = y + 'px';
}

