//Get access to my HTML elements
var addButton = document.querySelector("#addButton");
var uploadButton = document.querySelector("#uploadButton");
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
var createFilters = false;

//Getting all shoes with AJAX
function getAllShoes() {

    $.ajax({
        url: url,
        type: "get"
    }).done(function(data) {

        if (!createFilters) {
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
                sizeFilter: sizeNumbers.sort()
            });
            filterPlace.innerHTML = filterResults;

            createFilters = true;
        }

        //handle sold out items
        if (data.data.in_stock <= 0) {
          document.querySelector("#buyButton").style.display = "none";
          document.querySelector("#soldOutAlert").style.display = "block";
        }

        //Render my shoes
        shoeCat.innerHTML = shoeTemplateInstance({
            shoe: data.data
        });
    })
}

getAllShoes();

//targeting my HTML from the frontend
var brandSelect = document.querySelector("#brandSelect");
var sizeSelect = document.querySelector("#sizeSelect");

function searchBrand() {

  var brand = document.querySelector("#searchBrand").value;
  console.log(brand);
  if (brand === '') {
    getAllShoes();
  }
  else {
    $.ajax({
      url: url + "/brand/" + brand,
      type: "get"
    }).done(function(data) {
      console.log("Searched brand", data.data);

      //Render my shoes
      shoeCat.innerHTML = shoeTemplateInstance({
        shoe: data.data
      });
    });
  }
}


//Filter shoes from the DB
function filterShoes() {
  //display the alert message as soon as we do another thing other after uploading shoe
  document.querySelector("#shoeUploadAlert").style.display = "none";
  document.querySelector("#buyShoeAlert").style.display = "none";

    console.log("*******");
    var brand = $('#brandSelect').find(':selected').val();
    var size = $('#sizeSelect').find(':selected').val();


    if (brand !== "All" && size !== "All") {
        //getting shoes with a particular brand and size
        console.log("else if block for brand and size");
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
    } else if (brand !== "All") {
        // AJAX call to render a particular brand
        console.log("else if block for brand");
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
    } else if (size !== "All") {
        // AJAX call to render a particular size
        console.log("else if block for size");
        $.ajax({
            url: url + "/size/" + size,
            type: "get"
        }).done(function(data) {
            //Render my shoes
            shoeCat.innerHTML = shoeTemplateInstance({
                shoe: data.data
            });
        })
    } else {
        getAllShoes();
    }
}

// Posting shoes to the server
function postShoe() {
    var shoeToUpload = {
        "id": document.querySelector("#addedId").value,
        "brand": document.querySelector("#addedBrand").value,
        "image": document.querySelector("#addedImage").value,
        "color": document.querySelector("#addedColor").value,
        "size": document.querySelector("#addedSize").value,
        "price": document.querySelector("#addedPrice").value,
        "in_stock": document.querySelector("#addedStock").value
    }
    console.log(JSON.stringify(shoeToUpload));
    $.ajax({
        url: url,
        type: "post",
        data: JSON.stringify(shoeToUpload),
        contentType: 'application/json'
    }).done(function(data) {
        console.log('Shoe successfully added');
        console.log(JSON.stringify(data));
        getAllShoes();
        document.querySelector("#shoeUploadAlert").style.display = "block";
    })

}



//A flag to capture a shoe id.
var lastId;

//Creating a modal.
function uniqueModal(id) {
  $('.ui.mini.modal').modal('show');
  lastId = id;
}

function buyShoe(){

  var id = Number(lastId);
  console.log(id);
  var ammount = {ammount: document.querySelector("#howmany").value};
  console.log(JSON.stringify(ammount));

  $.ajax({
    url: url + "/sold/" + id,
    type: "post",
    data: JSON.stringify(ammount),
    contentType: 'application/json'
  }).done(function(data) {
    console.log("You have successfully bought " + ammount + "shoes.");
    getAllShoes();
    document.querySelector("#buyShoeAlert").style.display = "block";
  })
}


$(document).ready(function() {
    console.log('ready---->');

    //event lister for add modal
    addButton.addEventListener('click', function() {
        $('.ui.tiny.modal').modal('show');
    });
    //eventlistener for upload shoe button
    uploadButton.addEventListener('click', postShoe);
    //eventlistener for brand filter
    $('#brandSelect').on('change', function() {
        filterShoes();
    });
    //eventlistener for sizefilter
    $('#sizeSelect').on('change', function() {
        filterShoes();
    });
    $('#searchBrand').keyup(function(){
      searchBrand();
    });
});
