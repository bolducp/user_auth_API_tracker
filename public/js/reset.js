'use strict';
var $email;

$(function() {
  $email = $('#email');
  $('form').on('submit', resetUser);
});

function resetUser(e) {
  e.preventDefault();

  var email = $email.val();

  $.post('/users/resetPassword', {email})
  .success(function(data) {
    alert("Check your email for reset instructions");
    location.href = '/';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });
}
