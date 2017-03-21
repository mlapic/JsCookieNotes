
var debug = true;

var cookieExpirationAdd = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
var cookieExpirationDel = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

var allNotes = [];

var noteSelected = '';

$(document).ready(function(){
  
  console.log("---- start");
  
	restoreAll();
	printAll();
  
  $('#closeNewNoteOverlay').click(function(){
    closeOverlay();
    noteSelected = '';
  });
  
  $('#addNewNote').click(function(){
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
  
  $('#deleteNote').click(function(){
    closeOverlay();
    if(noteSelected != '') {
      allNotes.splice(noteSelected, 1);
    }
    noteSelected = '';
    printAll();
    saveAll();
  });
  
  $('#openNewNoteOverlay').click(function(){
    openOverlay(false);
    document.getElementById("newNoteTextArea").value = '';
  });
  
  $('#openSettingsOverlay').click(function(){    
    $( '#settingsOverlay' ).height( '100%' );
    $( '.openOverlay' ).hide();
  });
  
  $('#closeSettings').click(function(){
    $( '#settingsOverlay' ).height( '0%' );
    $( '.openOverlay' ).show();
  });
  
  $('#saveAndCloseSettings').click(function(){
    console.log('#saveAndCloseSettings');
    $( '#settingsOverlay' ).height( '0%' );
    $( '.openOverlay' ).show();
  });
  
  $('#shAllCookiesDebugButton').click( function(){ showAllCookies(); });
  $('#delAllCookiesDebugButton').click( function(){ deleteAllCookies(); });
  $('#clearDebugMessagesButton').click( function(){ $('#debugMessages').html(''); });
});




// ---------- Page Controls ----------

function openOverlay(showTrashButton) {
  if(showTrashButton) {
    $( '.controlButton' ).width( '33%' );
    $( '.addNoteButton' ).css( 'text-align', 'center' );
    $( '.deleteNoteButton' ).show();
  } else {
    $( '.controlButton' ).width( '50%' );
    $( '.addNoteButton' ).css( 'text-align', 'right' );
    $( '.deleteNoteButton' ).hide();
  } 
  $( '#newNoteOverlay' ).height( '100%' );
  $( '.openOverlay' ).hide();
}

function closeOverlay() {
  $( '#newNoteOverlay' ).height( '0%' );
  $( '.openOverlay' ).show();
}

function selectNote(noteId) {
  
	openOverlay(true);
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
  var result = confirm('Delete all cookies from this web page?');
  if(!result)
    return;
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
    //console.log(msg)
    $('#debugMessages').append(msg + '<br>')
  }
}

