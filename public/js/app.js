'use strict';
console.log('im running');

$('.api-button').on('click', event => {
  console.log('button pressed');
  $('.save-form').toggleClass('hidden');

});

