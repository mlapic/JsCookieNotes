
var cookieExpirationAdd = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
var cookieExpirationDel = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

var allNotes = [];

function printAll() { 
	out('-- notes');
	printArr(allNotes);
}

function addNew() {
  var note = prompt('Add');
  if(note == null) {
		out('cancel');
		return;
	}
  allNotes.push(note);
  saveAll();
}

function removeOne() {
	if(allNotes.length == 0) {
		out('nothing to remove');
		return;
	}
	var index = prompt('Index to remove (0-' + (allNotes.length - 1) + '):');
	out(index);
	if(index == null) {
		out('cancel');
		return;
	}
	if(index == '') {
		out('input empty');
		return;
	}
	if(isNaN(index)) {		
		out('not a number');
		return;
	}
	if(index < 0 || index >= allNotes.length) {
		out('out of range');
		return;
	}
	out('ok, removing index: ' + index);
	allNotes.splice(index, 1);
  saveAll();
}

function updateOne() {
	if(allNotes.length == 0) {
		out('nothing to update');
		return;
	}
	var index = prompt('Index to update (0-' + (allNotes.length - 1) + '):');
	out(index);
	if(index == null) {
		out('cancel');
		return;
	}
	if(index == '') {
		out('input empty');
		return;
	}
	if(isNaN(index)) {		
		out('not a number');
		return;
	}
	if(index < 0 || index >= allNotes.length) {
		out('out of range');
		return;
	}
  
  var updateNote = prompt('Update', allNotes[index]);
  
  if(updateNote == null) {
		out('update cancel');
		return;
	}
	
  allNotes[index] = updateNote;
  saveAll();
}

function saveAll() { 
	
  if(allNotes.length == 0) {
		out('nothing to save');
		return;
	}
  
  out('-- save:');
  var allNotesTemp = allNotes.slice();
	for(var i = 0; i < allNotesTemp.length; i++) {
  	allNotesTemp[i] = encodeURIComponent(allNotesTemp[i]);
  }
  var saveString = btoa(allNotesTemp.toString());
  allNotesTemp = null;
  out(saveString + '[' + saveString.length + ']');
  
  setCookie('jscn', saveString);
}

function restoreAll() {
  var saveString = getCookieValue('jscn');
  if(saveString.length == 0) {
    out('nothing to restore');
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





// ------------- Util functions -------------

function printArr(arr) {
	for(var i = 0; i < arr.length; i++) {
		out('['+i+'] ' + arr[i]);
	}
	out('------- len=' + arr.length);
}



var buttonsArr = [
	['printAll', 'Print all'], 
	['addNew', 'Add one'],
	['removeOne', 'Remove one'],
  ['updateOne', 'Update one'],
	['saveAll', 'Save'],
	['restoreAll', 'Restore'],
	['clearOutput', 'Clear Output'],
  ['showAllCookies', 'Show cookies'],
  ['deleteAllCookies', 'Delete Cookies']
];


function out(divContent) { document.getElementById("output01").innerHTML += divContent + '<br>'; }

function clearOutput() { document.getElementById("output01").innerHTML = ''; }

function setButtons() {
	var out = '';
	for(var i = 0; i < buttonsArr.length; i++ ) {
		out += '<button onclick="' + buttonsArr[i][0] + '();">' + buttonsArr[i][1] + '</button> '
	}
	document.getElementById("buttonsDiv").innerHTML = out;
}

function init() { setButtons(); }


