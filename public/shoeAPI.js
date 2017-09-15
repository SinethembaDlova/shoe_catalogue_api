//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var buyButton = document.querySelector("#buyButton");
var brandSelect = document.querySelector("#brandSelect");
var sizeSelect = document.querySelector("#sizeSelect");
var filterPlace = document.querySelector("#filterPlace");


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


//event listener that listens to my HTML elements

addButton.addEventListener('click', function() {
  $('.ui.tiny.modal').modal('show');
})





/*
$.ajax({
    url: "http://demo.steltix.com/jderest/dataservice",
    // <<- can also try http://demo.steltix.com/jderest/formservice with example request object below"
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(reqData)
}).done(function(data) {
    console.log(JSON.stringify(data))
    // <<- log data to console
})
}
*/
