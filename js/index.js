
let leftWidth = $(".left-side").innerWidth();
let search = document.getElementById("search");
let dataContainer = document.getElementById("dataContainer");
let submitBtn;
let nameInput;
let emailInput;
let phoneInput;
let ageInput;
let passwordInput;
let repasswordInput;
// $(".side-navbar").animate({left : -leftWidth},200);
// $(".menu-list li").css({display: "none"});

$(getMealsByName('').then(function(){
        $(".loading").fadeOut(function(){
            $("body").css("overflow", "visible")
        })
    })
)

function openNav(){
    $(".side-navbar").animate({left : 0},500,function(){
        $(".menu-icon .fa-bars").addClass("d-none");
        $(".menu-icon .fa-xmark").removeClass("d-none");
    })
    $(".menu-list li").slideToggle(500);
}

let boxLeft = $(".side-navbar").offset().left
function closeNav(){
    $(".side-navbar").animate({left : -leftWidth},500,function(){
        $(".menu-icon .fa-bars").removeClass("d-none");
        $(".menu-icon .fa-xmark").addClass("d-none");
    })
    $(".menu-list li").slideToggle(500);
}
closeNav();
$(".menu-icon").on("click",function(){
if($(".side-navbar").css("left")=="0px") {
    closeNav();
}else {
    openNav();
}
})
// $(".menu-icon").on("click",function(){
//     let boxLeft = $(".side-navbar").offset().left
// if(boxLeft === 0) {
//     $(".side-navbar").animate({left : -leftWidth},500,function(){
//         $(".menu-icon .fa-bars").removeClass("d-none");
//         $(".menu-icon .fa-xmark").addClass("d-none");
//     })
//     $(".menu-list li").slideToggle(500);
// }else {
//     $(".side-navbar").animate({left : 0},500,function(){
//         $(".menu-icon .fa-bars").addClass("d-none");
//         $(".menu-icon .fa-xmark").removeClass("d-none");
//     })
//     $(".menu-list li").slideToggle(500);
// }
// })

function showSearchDetails(){
    search.innerHTML=`
    <div class="row mt-3">
            <div class="col-md-6">
                <input type="text" onkeydown="getMealsByName(this.value)" class="form-control bg-transparent text-white" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input type="text" maxlength="1" onkeydown="getMealsByLetter(this.value)" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
            </div>
        </div>
    `
}

async function getMealsByName(name){
    dataContainer.innerHTML = "";
    $(".loading").fadeIn();
    let response =await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let data = await response.json()
    displayMeals(data.meals);
    $(".loading").fadeOut();
}

function displayMeals(arr){
    for(let i = 0 ; i< arr.length ; i++){
        dataContainer.innerHTML +=`
            <div onclick="getMealsDetails(${arr[i].idMeal})" class="card col-lg-3 col-md-4 col-sm-6 px-2">
            <div class="inner position-relative rounded-2 overflow-hidden">
            
                <div class="img-container">
                    <img src='${arr[i].strMealThumb}' class="w-100" alt="">
                </div>
                <div class="layer d-flex justify-content-center align-items-center">
                    <h2 class="lead fw-bold">${arr[i].strMeal}</h2>
                </div>
            </div>
            </div>
    `;
    }
}

async function getMealsByLetter(letter){
    dataContainer.innerHTML = "";
    $(".loading").fadeIn();
    let response =await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let data = await response.json()
    displayMeals(data.meals);
    $(".loading").fadeOut();
}

async function getMealsDetails(mealID){
    dataContainer.innerHTML = "";
    $(".loading").fadeIn();
    let response = await fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    let data = await response.json();
    displayMealDetails(data.meals[0])
    $(".loading").fadeOut();
}

function displayMealDetails(arr){

    let ingredients = ``;
    for(i=1 ; i<=20; i++){
        if(arr[`strIngredient${i}`]){
            ingredients+=`
            <span class="badge text-bg-info m-2 fs-5">${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}</span>
            `
        }
    }
    let tags = arr.strTags?arr.strTags.split(","): [];
    let tagStr = ``;
    for(i=0 ; i< tags.length ; i++){
        tagStr +=`
        <span class="badge text-bg-info m-2 fs-5">${tags[i]}</span>
        `
    }

    dataContainer.innerHTML += `
    <div class="col-md-4 text-center">
    <div class="img-container rounded-2 bg-info">
        <img src="${arr.strMealThumb}" class="w-100 overflow-hidden" alt="">
    </div>
    <h2 class="mt-3">${arr.strMeal}</h2>
  </div>
  <div class="col-md-8 ps-5">
    <h3 class="h1">Instructions</h3>
    <p>${arr.strInstructions}</p>            
    <h3>Area: ${arr.strArea}</h3>
    <h3>Category: ${arr.strCategory}</h3>
    <h3 class="mb-4">Recipes :</h3>
    ${ingredients}
    <h3 class="mb-4 my-3">Tags :</h3>
    ${tagStr}
    <div class="sources mt-3 ms-2">
        <a href="#" class="btn btn-success">Sources</a>
        <a href="www.youtube.com" class="btn btn-danger">Youtube</a>
    </div>
</div>  
    `
}

async function getMealsCategories() {  
    dataContainer.innerHTML = ``;
    $(".loading").fadeIn();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await response.json();
    displayMealsCategories(data.categories);
    $(".loading").fadeOut();
}

function displayMealsCategories(arr) {  
    
    for(let i=0 ; i < arr.length ; i++){
        dataContainer.innerHTML+=`
        <div onclick="getFilteredMeals('${arr[i].strCategory}')" class="card col-lg-3 col-md-4 col-sm-6 px-2">
                <div class="inner position-relative rounded-2 overflow-hidden">
                    <div class="img-container">
                        <img src=${arr[i].strCategoryThumb} class="w-100" alt="">
                    </div>
                    <div class="layer d-flex flex-column justify-content-start   align-items-center">
                        <h2 class="h3">${arr[i].strCategory}</h2>
                        <p>${arr[i].strCategoryDescription}</p>
                    </div>
                </div>
        </div>
    `;
    }
}

async function getFilteredMeals(category){
    dataContainer.innerHTML=``;
    $(".loading").fadeIn();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    displayFilteredMeals(data.meals)
    $(".loading").fadeOut();
}

function displayFilteredMeals(arr){
    for(let i = 0 ; i< arr.length ; i++){
        dataContainer.innerHTML +=`
            <div onclick="getMealsDetails(${arr[i].idMeal})" class="card col-lg-3 col-md-4 col-sm-6 px-2">
            <div class="inner position-relative rounded-2 overflow-hidden">
            
                <div class="img-container">
                    <img src='${arr[i].strMealThumb}' class="w-100" alt="">
                </div>
                <div class="layer d-flex justify-content-center align-items-center">
                    <h2 class="lead fw-bold">${arr[i].strMeal}</h2>
                </div>
            </div>
            </div>
    `;
    }    
}

async function getFilteredAreas() {  
    dataContainer.innerHTML = ``;
    $(".loading").fadeIn();
    let response =await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await response.json();
    displayAreas(data.meals);
    $(".loading").fadeOut();
}

function displayAreas(arr){
    for(i=0; i<arr.length; i++){
        dataContainer.innerHTML+=`
    <div class="col-lg-3 col-md-4 col-sm-6 text-center">
    <div onclick="getAreaMeals('${arr[i].strArea}')" class="area px-4">
        <i class="fa-solid fa-house-laptop"></i>
        <h2>${arr[i].strArea}</h2>
    </div>
    </div>
    `;
    }
}

async function getAreaMeals(area) {  
    dataContainer.innerHTML = ``;
    $(".loading").fadeIn();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
    displayAreaMeals(data.meals);
    $(".loading").fadeOut();
}

function displayAreaMeals(arr){
    for(let i = 0 ; i< arr.length ; i++){
        dataContainer.innerHTML +=`
            <div onclick="getMealsDetails(${arr[i].idMeal})" class="card col-lg-3 col-md-4 col-sm-6 px-2">
            <div class="inner position-relative rounded-2 overflow-hidden">
            
                <div class="img-container">
                    <img src='${arr[i].strMealThumb}' class="w-100" alt="">
                </div>
                <div class="layer d-flex justify-content-center align-items-center">
                    <h2 class="lead fw-bold">${arr[i].strMeal}</h2>
                </div>
            </div>
            </div>
    `;
    }   
}

async function getFilteredIng(){
    dataContainer.innerHTML=``;
    $(".loading").fadeIn();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await response.json();
    displayIng(data.meals.slice(0,20));
    $(".loading").fadeOut();
}

function displayIng(arr){
    for(i=0; i<arr.length; i++){
        dataContainer.innerHTML+=`
    <div class="col-lg-3 col-md-4 col-sm-6 text-center ">
    <div onclick="getIngMeals('${arr[i].strIngredient}')" class="area px-4">
        <i class="fa-solid fa-house-laptop"></i>
        <h2 class="ing">${arr[i].strIngredient}</h2>
        <p class=''>${arr[i].strDescription.split(" ").slice(0,15).join(" ")}</p>
    </div>
    </div>
    `;
    }
}

async function getIngMeals(ing) {  
    dataContainer.innerHTML = ``;
    $(".loading").fadeIn();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    let data = await response.json();
    displayAreaMeals(data.meals);
    $(".loading").fadeOut();
}

function displayIngMeals(arr){
    for(let i = 0 ; i< arr.length ; i++){
        dataContainer.innerHTML +=`
            <div onclick="getMealsDetails(${arr[i].idMeal})" class="card col-lg-3 col-md-4 col-sm-6 px-2">
            <div class="inner position-relative rounded-2 overflow-hidden">
            
                <div class="img-container">
                    <img src='${arr[i].strMealThumb}' class="w-100" alt="">
                </div>
                <div class="layer d-flex justify-content-center align-items-center">
                    <h2 class="lead fw-bold">${arr[i].strMeal}</h2>
                </div>
            </div>
            </div>
    `;
    }   
}

function displayContactUs(){
    $(".loading").fadeIn(500);
    dataContainer.innerHTML=`
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input onkeyup="validate()" oninput="validateAlert(nameValidation, nameInput)" onfocus="showAlert(nameInput)" id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="validate()" oninput="validateAlert(emailValidation, emailInput)" onfocus="showAlert(emailInput)" id="emailInput" type="email" class="form-control" placeholder="Enter Your E-mail">
                <div id="emailAlert" class="alert alert-danger w-100 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="validate()" oninput="validateAlert(phoneValidation, phoneInput)" onfocus="showAlert(phoneInput)" id="phoneInput" type="number" class="form-control" placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="validate()" oninput="validateAlert(ageValidation, ageInput)" onfocus="showAlert(ageInput)" id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="validate()" oninput="validateAlert(passwordValidation, passwordInput)" onfocus="showAlert(passwordInput)" id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
            <input onkeyup="validate()" oninput="validateAlert(repasswordValidation, repasswordInput)" onfocus="showAlert(repasswordInput)" id="repasswordInput" type="password" class="form-control" placeholder="Repassword">
            <div id="repasswordAlert" class="alert alert-danger w-100 d-none">
                    Enter valid repassword
                </div>
            </div>
            <div class="col">
                <button disabled class="btn btn-danger" id="submitBtn">Submit</button>
            </div>
        </div>
    </div>

</div>
    `
    submitBtn = document.getElementById('submitBtn');
    nameInput = document.getElementById('nameInput');
    emailInput = document.getElementById('emailInput');
    phoneInput = document.getElementById('phoneInput');
    ageInput = document.getElementById('ageInput');
    passwordInput = document.getElementById('passwordInput');
    repasswordInput = document.getElementById('repasswordInput');
    $(".loading").fadeOut(500);
}
// ! REGEX

function nameValidation(){
    return (/^[a-z ,.'-]+$/i.test(document.getElementById("nameInput").value));
}
function emailValidation(){
    return (/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(document.getElementById("emailInput").value));
}
function phoneValidation(){
    return (/^01[0125][0-9]{8}$/.test(document.getElementById("phoneInput").value));
}
function ageValidation(){
    return (/^(1[89]|[2-9]\d)$/gm.test(document.getElementById("ageInput").value));
}
function passwordValidation(){
    return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(document.getElementById("passwordInput").value));
}
function repasswordValidation(){
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value ;
}

function validateAlert(inputValidation, element){
    if(inputValidation()){
        element.nextElementSibling.classList.add('d-none');
    }else{
        element.nextElementSibling.classList.remove('d-none');
    }
}
 function showAlert(element){
    element.nextElementSibling.classList.remove('d-none');
 }

function validate(){
    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}