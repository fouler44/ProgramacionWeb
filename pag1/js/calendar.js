document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'https://backend-segundoparcial-hbyd.onrender.com/api/matches';

  async function loadMatches() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      const matches = data.matches;
      const container = document.getElementById('matches-container');
      container.innerHTML = '';

      if (matches.length === 0) {
        container.innerHTML = `<div class="col-12 text-center"><p>No hay partidos disponibles.</p></div>`;
        return;
      }

      const now = new Date();

      matches.forEach(match => {
        const fechaHora = new Date(match.fechaHora);
        const yaPaso = fechaHora < now;

        const fechaStr = fechaHora.toLocaleDateString('es-ES');
        const horaStr = fechaHora.getUTCHours() + ":" + fechaHora.getUTCMinutes().toString().padStart(2, '0');

        const partidoHTML = `
          <div class="col-12 mx-auto mb-4 pt-4">
            <div class="card shadow-sm" style="max-width: 600px; margin: 0 auto;">
              <div class="card-body">
                <!-- Encabezado con torneo y jornada -->
                <div class="text-center mb-3">
                  <h5 class="mb-1">${match.torneo}</h5>
                  <p class="text-muted small">Jornada ${match.jornada}</p>
                </div>

                <!-- Estructura mejorada para equipos y marcador usando grid -->
                <div class="match-display">
                  <!-- Equipo Local -->
                  <div class="team team-home text-center">
                    <img src="assets/img/g2-logo-clear.avif" alt="Nosotros" width="50" height="50">
                    <p class="mt-1 mb-0 small">VaporTeam</p>
                  </div>
                  
                  <!-- VS o Marcador siempre centrado -->
                  <div class="match-score text-center">
                    ${yaPaso ? 
                      `<div class="score-display">
                        <strong>${match.resultado.marcadorLocal}</strong>
                        <span class="mx-2">|</span>
                        <strong>${match.resultado.marcadorOponente}</strong>
                      </div>` 
                      : 
                      '<strong>VS</strong>'
                    }
                  </div>
                  
                  <!-- Equipo Visitante -->
                  <div class="team team-away text-center">
                    <img src="${match.imagenRival}" alt="${match.oponente}" width="50" height="50">
                    <p class="mt-1 mb-0 small">${match.oponente}</p>
                  </div>
                </div>

                <!-- Fecha, ubicación y resultado -->
                <div class="mt-3 text-center">
                  <p class="mb-1">${fechaStr}</p>
                  <p class="mb-1">${horaStr}</p>
                  <p class="mb-1">Ubicación: ${match.ubicacion}</p>
                  <p class="mb-1">${match.juego}</p>
                </div>
              </div>
            </div>
          </div>
        `;

        container.innerHTML += partidoHTML;
      });

      if (!document.getElementById('match-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'match-styles';
        styleEl.textContent = `
          .match-display {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .match-score {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 80px; /* Ancho fijo para el centro */
          }
          
          .team {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `;
        document.head.appendChild(styleEl);
      }

    } catch (error) {
      console.error('Error al cargar los partidos:', error);
      document.getElementById('matches-container').innerHTML = `
        <div class="col-12 text-center">
          <p>Error al cargar los partidos. Intenta de nuevo más tarde.</p>
        </div>
      `;
    }
  }

  loadMatches();
});