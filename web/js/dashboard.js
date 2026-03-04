document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth check
    if (!api.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Elements
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.content-section');

    // Arrays to hold data to prevent refetches
    let historyLoaded = false;
    let favoritesLoaded = false;
    let historyChartInstance = null;
    let currentFavoritesData = [];

    // UI Elements for Modal & Toast
    const colorModal = document.getElementById('color-modal');
    const modalClose = document.getElementById('modal-close');
    const modalSwatch = document.getElementById('modal-swatch');
    const modalTitle = document.getElementById('modal-title');
    const modalHex = document.getElementById('modal-hex');
    const modalRgb = document.getElementById('modal-rgb');
    const btnCopyHex = document.getElementById('btn-copy-hex');
    const btnCopyRgb = document.getElementById('btn-copy-rgb');
    const btnExport = document.getElementById('btn-export');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ${message}`;
        toastContainer.appendChild(toast);
        setTimeout(() => toastContainer.removeChild(toast), 3000);
    }

    // 2. Setup Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            const targetId = item.getAttribute('data-target');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Load data if needed based on active tab
            if (targetId === 'history-view' && !historyLoaded) {
                loadHistory();
            } else if (targetId === 'favorites-view' && !favoritesLoaded) {
                loadFavorites();
            }
        });
    });

    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        api.logout();
    });

    // 3. Initial Load (Profile + Default Tab)
    try {
        const [profile, historyData, favoritesData] = await Promise.all([
            api.getProfile(),
            api.getHistory(),
            api.getFavorites(),
        ]);

        if (profile) {
            // Sidebar greeting
            userGreeting.textContent = `Hola, ${profile.username || 'Usuario'}`;

            // Profile hero
            const pName = document.getElementById('profile-name');
            const pEmail = document.getElementById('profile-email');
            const pAvatar = document.getElementById('profile-avatar');
            const pMemberSince = document.getElementById('profile-member-since');

            if (pName) pName.textContent = profile.username || 'Sin nombre';
            if (pEmail) pEmail.textContent = profile.email || 'Sin correo';

            // Avatar: show first 2 initials
            if (pAvatar && profile.username) {
                const parts = profile.username.trim().split(/\s+/);
                const initials = parts.length > 1
                    ? (parts[0][0] + parts[1][0]).toUpperCase()
                    : profile.username.slice(0, 2).toUpperCase();
                pAvatar.textContent = initials;
            }

            // Member since date (pulled from profile or fallback)
            if (pMemberSince && profile.createdAt) {
                const joinDate = new Date(profile.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                pMemberSince.innerHTML = pMemberSince.innerHTML.replace('Miembro desde...', `Miembro desde ${joinDate}`);
            }
        }

        // Stats
        const statScans = document.getElementById('stat-total-scans');
        const statFavorites = document.getElementById('stat-total-favorites');
        const statLastSync = document.getElementById('stat-last-sync');

        if (statScans) statScans.textContent = historyData ? historyData.length : 0;
        if (statFavorites) statFavorites.textContent = favoritesData ? favoritesData.length : 0;
        if (statLastSync) {
            const latestScan = historyData && historyData.length > 0 ? historyData[0] : null;
            statLastSync.textContent = latestScan
                ? new Date(latestScan.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Nunca';
        }

        // Top favorites section
        const topColorsContainer = document.getElementById('profile-top-colors');
        if (topColorsContainer) {
            if (!favoritesData || favoritesData.length === 0) {
                topColorsContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.9rem;">Aún no tienes favoritos. ¡Escanea colores con la app!</div>`;
            } else {
                const top = favoritesData.slice(0, 5);
                topColorsContainer.innerHTML = top.map(color => `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer;" title="${color.hex}">
                        <div style="width: 56px; height: 56px; border-radius: 50%; background: ${color.hex}; box-shadow: 0 4px 15px ${color.hex}55; border: 2px solid rgba(255,255,255,0.15); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"></div>
                        <span style="font-size: 0.75rem; font-family: monospace; color: var(--text-muted);">${color.hex}</span>
                        <span style="font-size: 0.7rem; color: var(--text-muted); max-width: 60px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${color.name || ''}</span>
                    </div>
                `).join('');
            }
        }

    } catch (error) {
        userGreeting.textContent = 'Hola, Usuario';
    }

    // Load default tab (History)
    loadHistory();


    // --- Data Fetching & Rendering ---

    async function loadHistory() {
        const grid = document.getElementById('history-grid');
        const loader = document.getElementById('history-loading');

        try {
            const historyData = await api.getHistory();
            historyLoaded = true;
            loader.style.display = 'none';

            if (!historyData || historyData.length === 0) {
                grid.innerHTML = `<div class="empty-state">No tienes escaneos recientes. Abre la app HueX y escanea algún color.</div>`;
                const chartContainer = document.querySelector('.analytics-card');
                if (chartContainer) chartContainer.style.display = 'none';
                return;
            }

            renderColors(historyData, grid, 'historial');
            renderChart(historyData);

        } catch (error) {
            loader.style.display = 'none';
            grid.innerHTML = `<div class="empty-state" style="color: #ef4444;">Error al cargar el historial. Verifica la conexión con el servidor.</div>`;
        }
    }

    async function loadFavorites() {
        const grid = document.getElementById('favorites-grid');
        const loader = document.getElementById('favorites-loading');

        try {
            const favoritesData = await api.getFavorites();
            favoritesLoaded = true;
            loader.style.display = 'none';

            if (!favoritesData || favoritesData.length === 0) {
                grid.innerHTML = `<div class="empty-state">No has guardado ningún color favorito todavía.</div>`;
                return;
            }

            // Favorites endpoint might return data slightly differently depending on the schema
            // Assuming it returns an array of favorite objects
            currentFavoritesData = favoritesData;
            renderColors(favoritesData, grid, 'favorito');

        } catch (error) {
            loader.style.display = 'none';
            grid.innerHTML = `<div class="empty-state" style="color: #ef4444;">Error al cargar los favoritos.</div>`;
        }
    }

    // Generic render function for both arrays
    function renderColors(dataArray, container, type) {
        container.innerHTML = ''; // clear

        // Reverse to show newest first if endpoint doesn't sort it
        const displayData = [...dataArray].reverse();

        displayData.forEach((item, index) => {
            // Unify properties. History uses hexCode, Favorites usually uses hexCode or custom names.
            const hexCode = item.hexCode || item.CODIGO_HEX_ESCANEO || item.hex || '#cccccc';
            const technicalName = item.name || item.NOMBRE_PERSONALIZADO || `Color ${type}`;
            const colorFamily = item.colorFamily || '';
            const displayName = colorFamily ? `${colorFamily} · ${technicalName}` : technicalName;
            const rgb = hexToRgb(hexCode);

            // Stagger animation
            const delayClass = `delay-${(index % 3 + 1) * 100}`;

            const card = document.createElement('div');
            card.className = `color-card animate-fade-in ${delayClass}`;

            card.innerHTML = `
                <div class="color-swatch" style="background-color: ${hexCode};"></div>
                <div class="color-info">
                    <div class="color-name" title="${displayName}">
                        ${colorFamily ? `<span style="font-weight: 700; color: var(--text-primary);">${colorFamily}</span><span style="color: var(--text-muted); font-weight: 400;"> · ${technicalName}</span>` : technicalName}
                    </div>
                    <div class="color-hex">${hexCode}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${rgb}</div>
                </div>
            `;
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => openModal(displayName, hexCode, rgb));
            container.appendChild(card);
        });
    }

    // Helper to format rgb
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    }

    // --- Chart Logic ---
    function renderChart(data) {
        const canvas = document.getElementById('historyChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Count occurrences of color names
        const colorCounts = {};
        data.forEach(item => {
            const name = item.name || 'Desconocido';
            colorCounts[name] = (colorCounts[name] || 0) + 1;
        });

        // Get top 5
        const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const labels = sorted.map(i => i[0]);
        const counts = sorted.map(i => i[1]);

        if (historyChartInstance) {
            historyChartInstance.destroy();
        }

        historyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Escaneos',
                    data: counts,
                    backgroundColor: 'rgba(167, 139, 250, 0.7)',
                    borderColor: '#a78bfa',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0, color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
    }

    // --- Modal Logic ---
    function openModal(name, hexCode, rgb) {
        if (!colorModal) return;
        modalTitle.textContent = name;
        modalHex.textContent = hexCode;
        modalRgb.textContent = rgb;
        modalSwatch.style.backgroundColor = hexCode;
        colorModal.classList.add('active');
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => colorModal.classList.remove('active'));
    }

    if (colorModal) {
        colorModal.addEventListener('click', (e) => {
            if (e.target === colorModal) colorModal.classList.remove('active');
        });
    }

    if (btnCopyHex) {
        btnCopyHex.addEventListener('click', () => {
            navigator.clipboard.writeText(modalHex.textContent);
            showToast('Código HEX copiado al portapapeles');
        });
    }

    if (btnCopyRgb) {
        btnCopyRgb.addEventListener('click', () => {
            navigator.clipboard.writeText(modalRgb.textContent);
            showToast('Código RGB copiado al portapapeles');
        });
    }

    // --- Export Logic ---
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (currentFavoritesData.length === 0) {
                showToast('No hay favoritos para exportar.');
                return;
            }
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentFavoritesData, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "huex_favoritos.json");
            dlAnchorElem.click();
            showToast('Favoritos exportados a JSON');
        });
    }

});
