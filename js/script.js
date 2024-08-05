document.addEventListener("DOMContentLoaded", () => {
  fetchCities();
});

async function fetchCities() {
  try {
    const response = await fetch("https://desafiov-backend.onrender.com/api/destinations");
    const cities = await response.json();
    displayCities(cities);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
}

function displayCities(cities) {
  const citiesContainer = document.getElementById("cities");
  citiesContainer.innerHTML = "";
  cities.forEach((city) => {
    const cityElement = document.createElement("div");
    cityElement.classList.add("card");
    cityElement.innerHTML = `
          <img src="${city.image_url}" alt="${city.name}">
          <h3>${city.name}</h3>
          <p>${city.description}</p>
          <p>${city.location}</p>
          <button onclick="fetchAttractions(${city.id})">Ver Pontos Turísticos</button>
      `;
    citiesContainer.appendChild(cityElement);
  });
  // Ensure the cities section is displayed
  citiesContainer.style.display = "flex";
}

async function fetchAttractions(cityId) {
  try {
    const response = await fetch(
      `https://desafiov-backend.onrender.com/api/attractions?destination_id=${cityId}`
    );
    const attractions = await response.json();
    displayAttractions(attractions);
  } catch (error) {
    console.error("Erro ao buscar atrações:", error);
  }
}

function displayAttractions(attractions) {
  const citiesContainer = document.getElementById("cities");
  const attractionsContainer = document.getElementById("attractions");
  const attractionsList = document.getElementById("attractions-list");

  // Hide the cities container and show the attractions container
  citiesContainer.style.display = "none";
  attractionsContainer.style.display = "flex";
  attractionsList.innerHTML = "";

  if (attractions.length > 0) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: {
        lat: parseFloat(attractions[0].latitude),
        lng: parseFloat(attractions[0].longitude),
      },
    });

    attractions.forEach((attraction) => {
      const attractionElement = document.createElement("div");
      attractionElement.classList.add("card");
      attractionElement.innerHTML = `
              <img src="${attraction.image_url}" alt="${attraction.name}">
              <h3>${attraction.name}</h3>
              <p>${attraction.type}</p>
              <p>${attraction.description}</p>
          `;
      attractionsList.appendChild(attractionElement);

      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(attraction.latitude),
          lng: parseFloat(attraction.longitude),
        },
        map: map,
        title: attraction.name,
      });
    });
  } else {
    attractionsList.innerHTML =
      "<p>Não há atrações disponíveis para este destino.</p>";
  }
}

function backToCities() {
  const attractionsContainer = document.getElementById("attractions");
  const citiesContainer = document.getElementById("cities");

  // Hide the attractions container and show the cities container
  attractionsContainer.style.display = "none";
  citiesContainer.style.display = "flex";

  // Ensure the attractions list is cleared
  document.getElementById("attractions-list").innerHTML = "";
  document.getElementById("map").innerHTML = "";
}
