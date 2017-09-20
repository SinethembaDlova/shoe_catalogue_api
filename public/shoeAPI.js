//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var buyButton = document.querySelector("#buyButton");
var filterPlace = document.querySelector("#filterPlace");
var shoeCat = document.querySelector('#shoeCat');

//Compliling my shoe template
var shoeTemplate = document.querySelector("#shoeTemplate").innerHTML;
var shoeTemplateInstance = Handlebars.compile(shoeTemplate);


//Compling  my filter templates
var filterTemplate = document.querySelector("#filterTemplate").innerHTML;
var filterTemplateInstance = Handlebars.compile(filterTemplate);

// stores dynamic brands and shoes
var brandNames = [];
var sizeNumbers = [];
var brandMap = {};
var sizeMap = {};

//home route
var url = 'http://localhost:5000/api/shoes';



//Getting all shoes with AJAX
function getAllShoes() {
  $.ajax({
      url: url,
      type: "get"
  }).done(function(data) {
      console.log(data);

      //Render my shoes
      shoeCat.innerHTML = shoeTemplateInstance({
        shoe: data.data
      });
      //avoid duplicate for my dropdown
      var shoeData = data.data;
      console.log(data.data);
      for (var i = 0; i < shoeData.length; i++) {

        if (brandMap[shoeData.brand] === undefined) {
          brandMap[shoeData[i].brand] = shoeData[i].brand;
          brandNames.push(shoeData[i].brand);
        }

        if (sizeMap[shoeData[i].size] === undefined) {
          sizeMap[shoeData[i].size] = shoeData[i].size;
          sizeNumbers.push(shoeData[i].size);
        }
      }
      console.log("*****Brands****" + brandNames);
      console.log(brandNames);
      console.log("*****Size******" + sizeNumbers);

      // Rendering my filter template
      var filterResults = filterTemplateInstance({
          brandFilter: brandNames,
          sizeFilter: sizeNumbers
      });
      filterPlace.innerHTML = filterResults;
  })
}
getAllShoes();

//targeting my HTML from the frontend
var brandSelect = document.querySelector("#brandSelect");
var sizeSelect = document.querySelector("#sizeSelect");

//my brand and sizes
var brand = brandSelect.value;
var size =  sizeSelect.value;

//Filter shoes from the DB
function filterShoes() {

}


//event listener that listens to my HTML elements
addButton.addEventListener('click', function() {
    $('.ui.tiny.modal').modal('show');
});
brandSelect.addEventListener('change', filterShoes);
sizeSelect.addEventListener('change',filterShoes);
