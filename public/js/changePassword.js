'use strict';

$(function() {
  $('form').on('submit', changePassword);
});

function changePassword(e) {
  e.preventDefault();

  var email = $('#email').val();
  var oldPassword = $('#oldPassword').val();
  var newPassword = $('#newPassword').val();

  $.post('/users/changePassword', {email: email, oldPassword: oldPassword, newPassword: newPassword})
  .success(function(data) {
    alert("Password successfully changed!");
    location.href = '/locations';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });
}
