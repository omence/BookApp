'use strict';
console.log('im running');

$('.api-button').on('click', event => {
  console.log('button pressed');
  $('.save-form').toggleClass('hidden');

});


$('.hamburger').on('click', event => {
  console.log('other button pressed');
  $('.navi-holder').toggleClass('nav-hide');
})

$('.edit-button').on('click', event => {
  console.log('other button pressed');
  $('.db-form').toggleClass('detail-hide');
})