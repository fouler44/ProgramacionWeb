document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://backend-segundoparcial-hbyd.onrender.com/api/matches';

    async function loadNextMatch() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            const matches = data.matches;
            const container = document.getElementById('matches-container');
            container.innerHTML = '';

            if (matches.length === 0) {
                container.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-12 text-center py-4">
                            <p>No hay partidos disponibles.</p>
                        </div>
                    </div>`;
                return;
            }

            const now = new Date();
            
            const nextMatch = matches.find(match => new Date(match.fechaHora) > now);

            if (!nextMatch) {
                container.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-12 text-center py-4">
                            <p>No hay próximos partidos programados.</p>
                        </div>
                    </div>`;
                return;
            }

            const fechaHora = new Date(nextMatch.fechaHora);

            const fechaStr = fechaHora.toLocaleDateString('es-MX', {day: '2-digit', month: '2-digit'});
            
            const horaStr = fechaHora.getUTCHours().toString().padStart(2, '0') + ":" + 
                          fechaHora.getUTCMinutes().toString().padStart(2, '0') + " MX";

            let gameLogo = 'assets/img/lol-logo.svg';
            let torneoLogo = 'assets/img/lck.webp'; 
            let torneoLogoColumn = `
                <div class="col-12 col-md-4 p-3 text-center text-md-start">
                    <img src="${torneoLogo}" alt="${nextMatch.torneo || 'Torneo'}" width="65">
                </div>`;

            if (nextMatch.juego) {
                if (nextMatch.juego.toLowerCase().includes('valorant')) {
                    gameLogo = 'assets/img/V_Lockup_Horizontal_Neg_Red.png';
                    torneoLogoColumn = `
                        <div class="col-12 col-md-4 p-3 text-center text-md-start">
                            <div class="invisible" style="width: 65px; height: 65px;"></div>
                        </div>`;
                } else if (nextMatch.juego.toLowerCase().includes('rocket')) {
                    gameLogo = 'assets/img/Rocket League.svg'
                    torneoLogoColumn = `
                        <div class="col-12 col-md-4 p-3 text-center text-md-start">
                            <div class="invisible" style="width: 65px; height: 65px;"></div>
                        </div>`;
                } else if (nextMatch.juego.toLowerCase().includes('counter')) {
                    gameLogo = 'assets/img/Counter-Strike_2.webp';
                    torneoLogoColumn = `
                        <div class="col-12 col-md-4 p-3 text-center text-md-start">
                            <div class="invisible" style="width: 65px; height: 65px;"></div>
                        </div>`;
                }
            }

            const partidoHTML = `
                <div class="row align-items-center">
                    <div class="col-12 col-md-2 py-3 text-center border-end border-dark">
                        <img class="img-fluid" src="${gameLogo}" alt="${nextMatch.juego || 'Game'}" width="140">
                    </div> 
                    ${torneoLogoColumn}
                    <div class="col-12 col-md-6 pt-3 pb-0 text-center text-md-end">
                        <p class="text-dark">${nextMatch.torneo || ''} ${nextMatch.jornada ? '| Jornada ' + nextMatch.jornada : ''} <br> ${fechaStr} ${horaStr}</p>
                    </div>
                </div>`;

            container.innerHTML = partidoHTML;

        } catch (error) {
            console.error('Error al cargar el próximo partido:', error);
            document.getElementById('matches-container').innerHTML = `
                <div class="row align-items-center">
                    <div class="col-12 text-center py-4">
                        <p>Error al cargar el próximo partido. Intenta de nuevo más tarde.</p>
                    </div>
                </div>`;
        }
    }

    loadNextMatch();
});