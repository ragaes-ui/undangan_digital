document.addEventListener("DOMContentLoaded", () => {
    const loginPanel = document.getElementById('login-panel');
    const dashboardPanel = document.getElementById('dashboard-panel');

    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') { showDashboard(); }

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else { alert(data.message); }
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.reload();
    });

    function showDashboard() {
        loginPanel.classList.add('hidden');
        dashboardPanel.classList.remove('hidden');
        loadDataTamu();
        loadConfigAwal();
    }

    async function loadDataTamu() {
        const res = await fetch('/api/admin/guests');
        const result = await res.json();
        if (result.success) {
            const body = document.getElementById('guestTableBody');
            body.innerHTML = '';
            result.data.forEach(g => {
                body.innerHTML += `
                    <tr class="border-b text-sm">
                        <td class="p-2 font-medium">${g.name}</td>
                        <td class="p-2">${g.attendance}</td>
                        <td class="p-2 text-gray-600">${g.message}</td>
                    </tr>`;
            });
        }
    }

    async function loadConfigAwal() {
        const res = await fetch('/api/wedding-info');
        const result = await res.json();
        if (result.success) {
            const d = result.data;
            document.getElementById('pria').value = d.mempelaiPria;
            document.getElementById('wanita').value = d.mempelaiWanita;
            document.getElementById('tgl').value = d.tanggalAcara;
            document.getElementById('akd').value = d.jamAkad;
            document.getElementById('altAkd').value = d.alamatAkad;
            document.getElementById('altRsp').value = d.alamatResepsi;
            document.getElementById('bnk').value = d.namaBank;
            document.getElementById('rek').value = d.noRekening;
            document.getElementById('an').value = d.atasNamaRekening;
            document.getElementById('hero').value = d.urlFotoHero;
            document.getElementById('galeri').value = d.urlFotoGaleri.join(', ');
        }
    }

    document.getElementById('configForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            mempelaiPria: document.getElementById('pria').value,
            mempelaiWanita: document.getElementById('wanita').value,
            tanggalAcara: document.getElementById('tgl').value,
            jamAkad: document.getElementById('akd').value,
            alamatAkad: document.getElementById('altAkd').value,
            alamatResepsi: document.getElementById('altRsp').value,
            namaBank: document.getElementById('bnk').value,
            noRekening: document.getElementById('rek').value,
            atasNamaRekening: document.getElementById('an').value,
            urlFotoHero: document.getElementById('hero').value,
            urlFotoGaleri: document.getElementById('galeri').value
        };

        const res = await fetch('/api/admin/update-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(data.success) { alert('Konten Undangan berhasil diperbarui!'); window.location.reload(); }
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
        const tName = document.getElementById('targetName').value.trim();
        if (!tName) return alert('Ketik nama tamu dulu!');
        const inviteUrl = `${window.location.origin}/?to=${encodeURIComponent(tName)}`;
        const textWA = `Tanpa mengurangi rasa hormat, kami mengundang *${tName}* ke acara pernikahan kami.\n\nDetail lengkap: ${inviteUrl}`;
        navigator.clipboard.writeText(textWA).then(() => {
            alert('Teks undangan khusus otomatis tersalin! Tinggal paste (Ctrl+V) di WhatsApp target.');
            document.getElementById('targetName').value = '';
        });
    });
});