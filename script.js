class WeatherApp {
    constructor() {
        this.API_key = "03cb70cb15536e729210c0069772c51e";
    }
    
    // Metode untuk mengambil koordinat berdasarkan nama kota
    geocoding(city) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.API_key}`;
        
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let lat = data[0].lat;
            let lon = data[0].lon;
            
            // Memanggil metode untuk mendapatkan cuaca saat ini
            this.getCurrentWeather(lat, lon);
        });
    }
    
    // Metode untuk mendapatkan data cuaca saat ini
    getCurrentWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_key}&units=metric`;
        
        fetch(url)
        .then(response => response.json())
        .then(data => {
            let city = data.name;
            let country = data.sys.country;
            let icon = data.weather[0].icon;
            let status = data.weather[0].description;
            let temperature = parseInt(data.main.temp);
            let date = new Date(data.dt*1000 + data.timezone);
            let time = date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit'});
            let day = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            // Menyusun data cuaca dalam objek
            const weatherdata = {
                city: city, 
                country: country, 
                icon: icon, 
                status: status, 
                temperature: temperature, 
                time: time, 
                day: day
            };
            
            // Memanggil metode untuk memperbarui tampilan cuaca
            this.updateCurrentWeather(weatherdata);
        });
    }
    
    // Metode untuk memperbarui tampilan cuaca
    updateCurrentWeather(weatherdata) {
        const {city, country, icon, status, temperature, time, day} = weatherdata;
        
        const currentWeather = document.getElementById('current_weather');
        currentWeather.innerHTML = `
            <div class="container bg-dark text-center col-auto rounded-4 overflow-hidden text-white font-monospace" style="font-size: 12px;">
                <div class="row">
                    <div class="col-12 bg-info" id="bg_icon">
                        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather_icon">
                    </div>
                </div>
                <div class="row">
                    <div class="col-9 bg-dark d-flex align-items-center justify-content-around p-2">
                        <h1 class="display-3 mb-0">${temperature}°</h1>
                        <div class="d-flex flex-column align-content-center">
                            <h6 class="mb-0">${status}</h6>
                            <small class="mt-0 ">${city}, ${country}</small>
                        </div>
                    </div>
                    <div class="col-3 bg-success d-flex align-items-center">
                        <small class="mb-0">${time} ${day}</small>
                    </div>
                </div>
            </div> `;
        
        // Mengubah latar belakang jika cuaca sedang malam (berdasarkan ikon)
        if (icon[2] == 'n') {
            const bg = document.getElementById('bg_icon');
            bg.classList.remove('bg-info');
            bg.classList.add('bg-primary', 'bg-opacity-75');
        }
    }
}

// Membuat instance dari WeatherApp
const weatherApp = new WeatherApp();

// Menambahkan event listener untuk tombol pencarian
const searchButton = document.getElementById('btn_search_city');
searchButton.addEventListener('click', () => {
    const city = document.getElementById('city_name').value;
    if (city) {
        weatherApp.geocoding(city);
    } else {
        alert('invalid input!');
    }
});