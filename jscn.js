
var debug = false;

var cookieExpirationAdd = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
var cookieExpirationDel = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

var allNotes = [];

var noteSelected = '';


// ---------- DEBUG ----------

function out(msg) {
  if(debug) {
    console.log(msg)
  }
}


// ---------- Page Controls ----------

function initJscnPage() {
	if(!debug) {
		document.getElementById('debugControlsDiv').style.display = 'none';
	}
	restoreAll();
	printAll();
}

function openOverlay() {
		document.getElementById('overlay').style.height = "100%";
		document.getElementById('circle').style.visibility = "hidden";
}

function closeOverlay() {
		document.getElementById('overlay').style.height = "0%";
		document.getElementById('circle').style.visibility = "visible";
}

function newNoteButtonClick() {
	openOverlay();
	document.getElementById("newNoteTextArea").value = '';
}

function closeOverlayButtonClick() { 
	closeOverlay();
	noteSelected = '';
}

function addNewNoteButtonClick() {
	closeOverlay();
	if(noteSelected != '') {
		allNotes[noteSelected] = document.getElementById("newNoteTextArea").value;
	} else {
		allNotes.push(document.getElementById("newNoteTextArea").value);
	}
	noteSelected = '';
	printAll();
	saveAll();
}

function deleteNoteButtonClick() {
	closeOverlay();
	if(noteSelected != '') {
		allNotes.splice(noteSelected, 1);
	}
	noteSelected = '';
	printAll();
	saveAll();
}

function selectNote(noteId) {
	openOverlay();
	document.getElementById('newNoteTextArea').value = document.getElementById(noteId).innerHTML;
	noteSelected = noteId.substring('noteId'.length, noteId.length);
}

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
