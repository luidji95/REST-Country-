
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
const paginationContainer = document.querySelector('.pagination-container');

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

        
        const paginatedCountries = chunkArray(this.filteredCountries, this.itemsPerPage);

        
        const countriesToDisplay = paginatedCountries[this.currentPage - 1] || [];

        countriesToDisplay.forEach(country => {
            const li = document.createElement('li');
            li.classList.add('country-item');
            li.innerHTML = `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="50" class="flag">
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
        const url = region === 'all' ? 'https://restcountries.com/v3.1/all' :
            `https://restcountries.com/v3.1/region/${region}`;
        fetchData(url);
    }

    // Filtriraj zemlje na osnovu pretrage
      ClickSearchFilter(query) {
        try{
            let response = await fetch(`https://restcountries.com/v3.1/region/${query}`);
            
            if(response.ok){
                const {name, id } = await response.json();
                    
                
            }
        }
    }

    
}

const countryManager = new CountryManager();

// Funkcija za preuzimanje podataka
async function fetchData(url) {
    try {
        let response = await fetch(url);
        let countries = await response.json();

        countryManager.Countries = countries;
        countryManager.filteredCountries = countries;  
        countryManager.totalPages = Math.ceil(countries.length / countryManager.itemsPerPage);  
        countryManager.updatePagination();  
    } catch (error) {
        console.log('Greška prilikom preuzimanja podataka:', error);
    }
}

// Poziv funkcije za preuzimanje podataka
fetchData('https://restcountries.com/v3.1/all?fields=name,flags,region');

// Event listener za prev i next dugmad
document.getElementById('prevPage').addEventListener('click', () => {
    if (countryManager.currentPage > 1) {
        countryManager.currentPage--;
        countryManager.updatePagination();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (countryManager.currentPage < countryManager.totalPages) {
        countryManager.currentPage++;
        countryManager.updatePagination();
    }
});

// Event listener za promenu regiona iz dropdown menija
const regionDropdown = document.querySelector('.continent-dropdown');
regionDropdown.addEventListener('change', (e) => {
    const selectedRegion = e.target.value;
    countryManager.filterByRegion(selectedRegion);
});


const searchBar = document.querySelector('.countries-input');
searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const countryName = event.target.value;
        
        if (countryName) {
            countryManager.ClickSearchFilter(countryName);
            
        }
    }
});

// Klik na dugme za zatvaranje modala
closeModalBtn.addEventListener('click', function() {
    detailsModal.classList.remove('visible');
    countryList.classList.remove('hidden');
});

// Klik na zemlju iz liste
countryList.addEventListener('click', function(event) {
    if (event.target.classList.contains('flag')) {
        const countryName = event.target.nextElementSibling.textContent; // Preuzmi ime zemlje
        countryManager.ClickSearchFilter(countryName);
       
    }
});