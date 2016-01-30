'use strict';

$(document).ready(init);

function init(){
  $("#submitNew").on("click", addZipcode);
  $("#delete").on("click", deleteZipcode);
}

function addZipcode(e){
  e.preventDefault();
  var regex = /^\d{1,5}$/;
  var newZip = $('#newZip').val();

  if (!regex.test(newZip)){
    return alert("Please enter a valid zipcode");
  }

  $.post('/locations/', {newZip: newZip})
    .success(function(data){
      window.location = "/locations/";
  });
}


function deleteZipcode(e){
  e.preventDefault();
  var deleteZip = $('#deleteZip').val();

  $.ajax({
    url: '/locations/',
    method: "DELETE",
    data: {deleteZip: deleteZip}
  })
    .success(function(data){
      window.location = "/locations/";
  });
}
