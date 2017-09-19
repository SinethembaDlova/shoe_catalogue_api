//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var buyButton = document.querySelector("#buyButton");
var brandSelect = document.querySelector("#brandSelect");
var sizeSelect = document.querySelector("#sizeSelect");
var filterPlace = document.querySelector("#filterPlace");
var shoeCat = document.querySelector('#shoeCat');

//Compliling my shoe template
var shoeTemplate = document.querySelector("#shoeTemplate").innerHTML;
var shoeTemplateInstance = Handlebars.compile(shoeTemplate);


//Compling  my filter templates
var filterTemplate = document.querySelector("#filterTemplate").innerHTML;
var filterTemplateInstance = Handlebars.compile(filterTemplate);

// stores dynamic brands and shoes
var brandNames = ["Adidas", "Siya"];
var sizeNumbers = [];



// Rendering my filter template
var filterResults = filterTemplateInstance({
    brandFilter: brandNames,
    sizeFilter: sizeNumbers
});
filterPlace.innerHTML = filterResults;


//My goblal variables
var url = 'http://localhost:5000/api/shoes';
//var brand = brandSelect.value;
//var size =  sizeSelect.value;


//Getting all shoes with AJAX
function getAllShoes() {
  $.ajax({
      url: url,
      type: "get"
  }).done(function(data) {
      console.log(data);
      //var d = JSON.parse(data.data);
      shoeCat.innerHTML += shoeTemplateInstance({
          shoe: data.data
      });
      //shoeCat.innerHTML = shoeResults;
  })
}

getAllShoes();



//event listener that listens to my HTML elements
addButton.addEventListener('click', function() {
    $('.ui.tiny.modal').modal('show');
})
