//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var buyButton = document.querySelector("#buyButton");
var filterPlace = document.querySelector("#filterPlace");
var shoeCat = document.querySelector('#shoeCat');
var filterDiv = document.querySelector('.filterDiv')

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
        //Render my shoes
        shoeCat.innerHTML = shoeTemplateInstance({
            shoe: data.data
        });
        //avoid duplicate for my dropdown
        var shoeData = data.data;
        console.log(data.data);
        for (var i = 0; i < shoeData.length; i++) {

            if (brandMap[shoeData[i].brand] === undefined) {
                brandMap[shoeData[i].brand] = shoeData[i].brand;
                brandNames.push(shoeData[i].brand);
            }

            if (sizeMap[shoeData[i].size] === undefined) {
                sizeMap[shoeData[i].size] = shoeData[i].size;
                sizeNumbers.push(shoeData[i].size);
            }
        }


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

//Filter shoes from the DB
function filterShoes() {

  console.log("*******");
  var brand = $('#brandSelect').find(':selected').val();
  var size = $('#sizeSelect').find(':selected').val();

    if (brand === "All" && size === "All") {
        getAllShoes();
    }

    else if (brand !== "All" && size !== "All") {
      //getting shoes with a particular brand and size
      $.ajax({
          url: url + "/brand/" + brand + "/size/" + size,
          type: "get"
      }).done(function(data) {
          console.log("Filtered brand", data.data);
          //Render my shoes
          shoeCat.innerHTML = shoeTemplateInstance({
              shoe: data.data
          });
      })
    }
    else if (brand !== "All") {
        // AJAX call to render a particular brand
        $.ajax({
            url: url + "/brand/" + brand,
            type: "get"
        }).done(function(data) {
            console.log("Filtered brand", data.data);
            //Render my shoes
            shoeCat.innerHTML = shoeTemplateInstance({
                shoe: data.data
            });
        })
    }
    else {
        // AJAX call to render a particular size
        console.log("else if block for brand");
        $.ajax({
            url: url + "/size/" + size,
            type: "get"
        }).done(function(data) {
            //Render my shoes
            shoeCat.innerHTML = shoeTemplateInstance({
                shoe: data.data
            });
        })
    }
}

$(document).ready(function(){
console.log('ready---->');

  //event listener that listens to my HTML elements
  addButton.addEventListener('click', function() {
      $('.ui.tiny.modal').modal('show');
  });
  /*buyButton.addEventListener('click', function(){
      $('.ui.mini.modal').modal('show');
  });*/
  $('#brandSelect').on('change', function(){
    filterShoes();
  });

  $('#sizeSelect').on('change', function(){
    filterShoes();
  });
});
