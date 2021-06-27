//Create variables here
var dog, happyDog, database, foodS, foodStock, database
var position, dog_image, happyDog_image, food, food_image;
var feed, addFood;
var fedTime, lastFed, foodObj;
function preload() {
  //load the images here
  dog_image = loadImage("images/dogImg1.png")
  happyDog_image = loadImage("images/dogImg.png")
  food_image = loadImage("images/food_image.jpg")
}

function setup() {
  createCanvas(1000, 400);
  database = firebase.database();

  foodObj = new Food();

  dog = createSprite(800, 200, 150, 150);
  dog.shapeColor = "red";
  dog.addImage(dog_image);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);


  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton(" Add Food ");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}
function draw() {
  background("orange")

  foodObj.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed % 12 + " PM", 350, 30);
  }
  else if (lastFed === 0) {
    text("Last Feed: 12 AM", 350, 30);
  }
  else {
    text("Last Feed: " + lastFed + " AM", 350, 30);
  }
  drawSprites();
  //add styles here
  dog.display()
}
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {
  if (x <= 0) {
    x = 0
  } else {
    x = x - 1
  }
  database.ref('/').update({
    'Food': x
  })
}
function feedDog() {
  dog.addImage(happyDog_image);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
  dog.addImage(dog_image);
}
