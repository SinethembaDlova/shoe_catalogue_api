//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var buyButton = document.querySelector("#buyButton");
var brandSelect = document.querySelector("#brandSelect");
var sizeSelect = document.querySelector("#sizeSelect");








//event listener that listens to my HTML elements

addButton.addEventListener('click', function() {
  $('.small.modal')
  .modal('show')
  ;
})
