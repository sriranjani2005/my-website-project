function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({success:true, message:'App running'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var action = body.action || '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if(!ss) throw new Error('Create this script from the Google Sheet (Extensions → Apps Script)');

    if(action === 'saveEmail'){
      var sheet = getOrCreateSheet(ss,'Emails');
      sheet.appendRow([new Date(), body.email || '']);
      return jsonResponse({success:true});
    } else if(action === 'saveContact'){
      var sheet = getOrCreateSheet(ss,'Contacts');
      sheet.appendRow([new Date(), body.name || '', body.email || '', body.phone || '', body.message || '']);
      return jsonResponse({success:true});
    } else {
      return jsonResponse({success:false, error:'Unknown action'});
    }
  } catch(err){
    return jsonResponse({success:false, error: err.message});
  }
}

function getOrCreateSheet(ss,name){
  var sh = ss.getSheetByName(name);
  if(!sh){ sh = ss.insertSheet(name); if(name==='Emails') sh.appendRow(['Timestamp','Email']); if(name==='Contacts') sh.appendRow(['Timestamp','Name','Email','Phone','Message']); }
  return sh;
}

function jsonResponse(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
