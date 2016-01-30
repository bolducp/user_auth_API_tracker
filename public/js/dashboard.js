'use strict';

$(document).ready(init);

function init(){
  $("#submitNew").on("click", addZipcode);
}

function addZipcode(e){
  e.preventDefault();
  var newZip = $('#newZip').val();

  $.post('/locations/', {newZip: newZip})
    .success(function(data){
      window.location = "/locations/";
      console.log("newLocation ", newLocation);
  });
}
