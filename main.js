import './style.css'

const lightModeSwitch = document.querySelector('.light-mode');
const darkModeSwitch = document.querySelector('.dark-mode');
const lightImg = document.getElementById('light-img');
const darkImg = document.getElementById('dark-img');
const darkLogo = document.querySelector('.logo-darkmode');
const lightLogo = document.querySelector('.logo-light-mode');
const header = document.querySelector('.body');
const h1 = document.querySelector('.country-app');
const countryList = document.getElementById('country-list');

const detailsModal = document.querySelector('.country-details-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalContent = document.querySelector('.modal-content');


// Klik na light mode ikonicu
lightImg.addEventListener('click', function() {
    lightModeSwitch.classList.add('hidden');   
    darkModeSwitch.classList.remove('hidden'); 
    darkModeSwitch.classList.add('visible');   
    darkLogo.classList.remove('hidden');
    lightModeSwitch.classList.add('hidden');
    header.classList.add('color');
    h1.classList.add('countryappcolor');

});

// Klik na dark mode ikonicu
darkImg.addEventListener('click', function() {
    darkModeSwitch.classList.add('hidden');    
    darkModeSwitch.classList.remove('visible'); 
    lightModeSwitch.classList.remove('hidden'); 
    darkLogo.classList.add('hidden');
    lightLogo.classList.remove('hidden');
    header.classList.remove('color');
    h1.classList.remove('countryappcolor');
});



// Funkcija za chunkovanje niza
function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

class CountryManager {
    constructor() {
        this.Countries = [];  // Svi podaci o zemljama
        this.filteredCountries = []; // Filtrirane zemlje na osnovu regiona ili pretrage
        this.itemsPerPage = 20;  // Koliko zemalja po stranici
        this.currentPage = 1;  // Trenutna stranica
        this.totalPages = 0;  // Ukupan broj stranica
    }

    // Funkcija za prikaz zemalja po stranici
    displayCountries() {
        const countryList = document.getElementById('country-list');
        countryList.innerHTML = '';  

        // Podeli niz filtriranih zemalja u chunk-ove
        const paginatedCountries = chunkArray(this.filteredCountries, this.itemsPerPage);

        // Prikaži zemlje samo sa trenutne stranice
        const countriesToDisplay = paginatedCountries[this.currentPage - 1] || [];

        countriesToDisplay.forEach(country => {
            const li = document.createElement('li');
            li.classList.add('country-item');
            li.innerHTML = `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="50" class = "flag">
                <span>${country.name.common}</span>
            `;
            countryList.appendChild(li);
        });
    }

    // Kreiraj paginaciju
    createPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';  

        for (let i = 1; i <= this.totalPages; i++) {
            const pageItem = document.createElement('li');
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            pageLink.href = "#";
            pageLink.dataset.page = i;

            if (i === this.currentPage) {
                pageLink.classList.add('active');
            }

            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentPage = parseInt(e.target.dataset.page);
                this.updatePagination();
            });

            pageItem.appendChild(pageLink);
            pagination.appendChild(pageItem);
        }
    }

    // Ažuriraj paginaciju i prikaz zemalja
    updatePagination() {
        this.displayCountries();
        this.createPagination();
    }

    // Filtriraj zemlje na osnovu regiona
    filterByRegion(region) {
        if (region === 'all') {
            this.filteredCountries = this.Countries;
        } else {
            this.filteredCountries = this.Countries.filter(country => country.region.toLowerCase() === region.toLowerCase());
        }
        this.totalPages = Math.ceil(this.filteredCountries.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePagination();
    }

    // Filtriraj zemlje na osnovu pretrage
    filterBySearch(query) {
        const lowercasedQuery = query.toLowerCase();
        this.filteredCountries = this.Countries.filter(country => 
            country.name.common.toLowerCase().includes(lowercasedQuery)
        );
        this.totalPages = Math.ceil(this.filteredCountries.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePagination();
    }


    // Funkcija za prikaz detalja zemlje
    showCountryDetails(country) {
        modalContent.innerHTML = `
            <h2>${country.name.official}</h2>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${country.subregion}</p>
            <p><strong>Currency:</strong> ${country.currencies}</p>
            <p><strong>Languages:</strong> ${country.languages }</p>
        `;
        detailsModal.classList.add('visible');  // Pokaži modal sa informacijama
    }
}

const countryManager = new CountryManager();

// Funkcija za preuzimanje podataka
async function fetchData(url) {
    try {
        let response = await fetch(url);  
        let countries = await response.json();  
        
        countryManager.Countries = countries; 
        countryManager.filteredCountries = countries;  // Inicijalno prikaži sve zemlje
        countryManager.totalPages = Math.ceil(countries.length / countryManager.itemsPerPage);  // Izračunaj broj stranica
    } catch (error) {
        console.log('Greška prilikom preuzimanja podataka:', error);
    }
}

// Poziv funkcije za preuzimanje podataka
fetchData('https://restcountries.com/v3.1/all?fields=name,flags,region');