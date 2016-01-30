'use strict';

$(document).ready(init);

function init(){
  $("#submitNew").on("click", addZipcode);
}

function addZipcode(e){
  e.preventDefault();
  var regex = /^\d{1,5}$/;
  var newZip = $('#newZip').val();
  console.log("clicked!");

  if (!regex.test(newZip)){
    return alert("Please enter a valid zipcode");
  }

  $.post('/locations/', {newZip: newZip})
    .success(function(data){
      window.location = "/locations/";
  });
}
