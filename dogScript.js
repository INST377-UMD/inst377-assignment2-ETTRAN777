const dogCommands = {
    'hello': () => alert('Hello'),
    'change the color to :color': (color) => {
        if (color === 'default') {
            document.body.style.backgroundColor = '#fddfbd';
        }
        document.body.style.backgroundColor = color;
    },
    'navigate to :page': (page) => {
        if (page.toLowerCase() === 'home') {
            page = 'index';
        }
        window.location.href = `${page.toLowerCase()}.html`;
    },
    'Load *breed': (breed) => {
        const breedName = breed.trim().toLowerCase(); // Normalize the breed name
        const breedButtons = document.querySelectorAll(".breedButton");
        let buttonClicked = false;

        breedButtons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === breedName) {
                button.click(); // Simulate a button click
                buttonClicked = true;
            }
        });

        if (!buttonClicked) {
            console.error(`Button for breed not found: ${breed}`);
        }
    }
};


async function fetchRandomDogImages() {
    const randomImages = [];
    try {
        for (let i = 0; i < 10; i++) {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await response.json();
            randomImages.push(data.message);
        }
        console.log("Random Dog Images:", randomImages);
        return randomImages;
    } catch (error) {
        console.error("Failed to fetch random dog images:", error);
        return randomImages;
    }
}

let currentImageIndex = 0;
let slideshowImages = [];


async function initializeSlideshow() {
    try {

        slideshowImages = await fetchRandomDogImages();


        const slideshowElement = document.getElementById("dogSlideshow");
        slideshowElement.src = slideshowImages[currentImageIndex];


        document.getElementById("prevSlide").addEventListener("click", showPreviousImage);
        document.getElementById("nextSlide").addEventListener("click", showNextImage);
    } catch (error) {
        console.error("Failed to initialize slideshow:", error);
    }
}


function showPreviousImage() {
    const slideshowElement = document.getElementById("dogSlideshow");
    currentImageIndex = (currentImageIndex - 1 + slideshowImages.length) % slideshowImages.length;
    slideshowElement.src = slideshowImages[currentImageIndex];
}


function showNextImage() {
    const slideshowElement = document.getElementById("dogSlideshow");
    currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
    slideshowElement.src = slideshowImages[currentImageIndex];
}

currButton = null;
const selectedBreed = [];
async function initializeBreedButtons() {
    descriptionDiv = document.getElementById("dogDescription");
    try {
        for (var i = 0; i < 10; i++) {
            const randomPage = Math.floor(Math.random() * 29) + 1;
            const response = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${randomPage}`);
            const data = await response.json();

            const breeds = data.data;
            console.log("Dog Breeds:", breeds);
            const randomDog = Math.floor(Math.random() * breeds.length);
            selectedBreed.push(breeds[randomDog]);

            const breedContainer = document.querySelector(".dogBreedContainer");

            breedContainer.innerHTML = "";

            selectedBreed.forEach(breed => {
                const breedButton = document.createElement("button");
                breedButton.textContent = breed.attributes.name;
                breedButton.classList.add("breedButton");


                breedButton.addEventListener("click", () => {
                    if (currButton === breedButton) {
                        breedButton.style.border = "0px solid";
                        breedButton.style.backgroundColor = "#ff3a40";
                        breedButton.style.color = "white";
                        currButton = null;
                        descriptionDiv.style.display = "none";
                    } else {
                        if (currButton) {
                            currButton.style.border = "0px solid";
                            currButton.style.backgroundColor = "#ff3a40";
                            currButton.style.color = "white";
                        }
                        breedButton.style.border = "1px solid #ff3a40";
                        breedButton.style.backgroundColor = "transparent";
                        breedButton.style.color = "#ff3a40";
                        currButton = breedButton;
                        descriptionDiv.style.display = "block";
                    }
                    displayBreedDetails(breed.attributes);
                });


                breedContainer.appendChild(breedButton);
            });

            console.log("Breed buttons initialized successfully.");
        }
    } catch (error) {
        console.error("Failed to fetch dog breeds:", error);
    }
}


function displayBreedDetails(breed) {
    console.log("Displaying breed details:", breed);


    const descriptionDiv = document.getElementById("dogDescription");


    document.getElementById("nameVal").textContent = breed.name || "Unknown Breed";


    document.getElementById("descriptionVal").textContent = breed.description || "No description available.";


    document.getElementById("minLifeVal").textContent = breed.life?.min || "N/A";


    document.getElementById("maxLifeVal").textContent = breed.life?.max || "N/A";


    console.log(`Breed Name: ${breed.name}`);
    console.log(`Description: ${breed.description}`);
    console.log(`Life Span: ${breed.life?.min} - ${breed.life?.max}`);
}


function setListening() {
    document.getElementById("stop").style.border = "3px solid #1493f1";
}

window.onload = async () => {
    setListening();

    let slideshowElement = document.getElementById("mainImg");
    let load = document.getElementById("Loading");
    slideshowElement.style.display = "none";
    load.style.display = "block";
    await fetchRandomDogImages();
    await initializeSlideshow();
    slideshowElement.style.display = "block";
    load.style.display = "none";
    if (annyang) {
        annyang.removeCommands();
        annyang.addCommands(dogCommands);
    }
    await initializeBreedButtons();
    await initializeSlideshow();
};