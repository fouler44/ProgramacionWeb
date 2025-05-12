document.addEventListener('DOMContentLoaded', function() {
    
    const API_URL = 'https://backend-segundoparcial-hbyd.onrender.com/api/players?juego=League of Legends';
    
    async function loadPlayers() {
        try {

            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            const players = data.players;
            
            const playersContainer = document.getElementById('players-container');
            playersContainer.innerHTML = '';
            
            if (players.length === 0) {
                playersContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p>No hay jugadores disponibles en este momento.</p>
                    </div>
                `;
                return;
            }
            
            players.forEach(player => {

                const imageSrc = player.imagen || 'assets/img/default-player.png';
                
                const playerElement = document.createElement('div');
                playerElement.className = 'col';
                playerElement.innerHTML = `
                    <div class="card">
                        <img src="${imageSrc}" class="card-img-top bg-dark p-2" alt="${player.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${player.nombre}</h5>
                            <p class="card-text">${player.posicion}</p>
                        </div>
                    </div>
                `;
                
                playersContainer.appendChild(playerElement);
            });
            
        } catch (error) {
            console.error('Error al cargar los jugadores:', error);
            document.getElementById('players-container').innerHTML = `
                <div class="col-12 text-center">
                    <p>Error al cargar los jugadores. Por favor, intenta de nuevo más tarde.</p>
                </div>
            `;
        }
    }
    
    loadPlayers();
});