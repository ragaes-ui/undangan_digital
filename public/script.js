document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ duration: 1000, once: false, mirror: true, offset: 50 });

    // Efek Bunga Jatuh (Hujan Kelopak)
    function createPetals() {
        const container = document.getElementById('petal-container');
        if (!container) return;
        
        const petalCount = 35; // Tambah jumlah bunga biar lebih rimbun
        
        for (let i = 0; i < petalCount; i++) {
            let petal = document.createElement('div');
            petal.classList.add('petal');
            
            let size = Math.random() * 8 + 6; 
            let left = Math.random() * 100; 
            let fallDuration = Math.random() * 15 + 10; 
            let swayDuration = Math.random() * 3 + 2; 
            let delay = Math.random() * 15; 
            
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${left}vw`;
            petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
            petal.style.animationDelay = `${delay}s, ${delay}s`;
            
            container.appendChild(petal);
        }
    }
    createPetals(); // Panggil fungsi bunganya
});

function bukaUndangan() {
    const cover = document.getElementById('cover-page');
    const body = document.getElementById('body-content');
    const nav = document.getElementById('bottom-nav');
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');

    cover.classList.add('cover-opened');
    body.classList.remove('overflow-hidden');
    nav.classList.remove('hidden', 'translate-y-full'); 
    musicBtn.classList.remove('hidden');

    bgMusic.play().catch(e => console.log("Autoplay diblokir"));
}

document.getElementById('music-btn').addEventListener('click', () => {
    const bgMusic = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    if (bgMusic.paused) {
        bgMusic.play();
        icon.classList.add('spin');
        icon.classList.replace('fa-pause', 'fa-compact-disc');
    } else {
        bgMusic.pause();
        icon.classList.remove('spin');
        icon.classList.replace('fa-compact-disc', 'fa-pause');
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/wedding-info');
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            document.getElementById('hero-nama').innerText = `${data.mempelaiPria} & ${data.mempelaiWanita}`;
            document.getElementById('cover-nama').innerText = `${data.mempelaiPria} & ${data.mempelaiWanita}`;
            document.getElementById('hero-tgl-utama').innerText = data.tanggalAcara;
            document.getElementById('hero-bg').style.backgroundImage = `url('${data.urlFotoHero}')`;
            
            document.getElementById('nama-pria').innerText = data.mempelaiPria;
            document.getElementById('nama-wanita').innerText = data.mempelaiWanita;
            document.getElementById('foto-pria').src = data.urlFotoPria;
            document.getElementById('foto-wanita').src = data.urlFotoWanita;
            document.getElementById('ortu-pria').innerText = data.ortuPria;
            document.getElementById('ortu-wanita').innerText = data.ortuWanita;
            document.getElementById('ig-pria').href = data.igPria;
            document.getElementById('ig-wanita').href = data.igWanita;
            
            document.getElementById('tgl-acara').innerText = data.tanggalAcara;
            document.getElementById('jam-akad').innerText = data.jamAkad;
            document.getElementById('alamat-akad').innerText = data.alamatAkad;
            document.getElementById('maps-akad').href = data.mapsAkad;
            document.getElementById('jam-resepsi').innerText = data.jamResepsi;
            document.getElementById('alamat-resepsi').innerText = data.alamatResepsi;
            document.getElementById('maps-resepsi').href = data.mapsResepsi;
            document.getElementById('nama-bank').innerText = data.namaBank;
            document.getElementById('rekening-number').innerText = data.noRekening;
            document.getElementById('rekening-name').innerText = `a.n. ${data.atasNamaRekening}`;

            const targetDate = new Date("Nov 15, 2026 08:00:00").getTime();
            setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate - now;
                if (distance > 0) {
                    document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
                    document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                }
            }, 1000);

            const galleryGrid = document.getElementById('gallery-grid');
            if (data.urlFotoGaleri && data.urlFotoGaleri.length > 0) {
                galleryGrid.innerHTML = '';
                data.urlFotoGaleri.forEach((url, i) => {
                    const heightClass = i % 2 === 0 ? 'h-48 md:h-64' : 'h-64 md:h-80';
                    galleryGrid.innerHTML += `
                        <div class="overflow-hidden rounded-xl cursor-pointer" data-aos="fade-up" data-aos-delay="${i*100}">
                            <img src="${url}" class="w-full ${heightClass} object-cover hover:scale-105 transition duration-500" onclick="openLightbox('${url}')">
                        </div>`;
                });
            }

            const storyContainer = document.getElementById('lovestory-container');
            if (data.ceritaCinta && data.ceritaCinta.length > 0) {
                storyContainer.innerHTML = '';
                data.ceritaCinta.forEach((cerita, index) => {
                    const isEven = index % 2 === 0;
                    const flexReverse = isEven ? '' : 'md:flex-row-reverse';
                    const alignLeft = isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8';
                    const alignRight = isEven ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8';

                    storyContainer.innerHTML += `
                        <div class="mb-10 ml-6 md:flex md:justify-between md:items-center ${flexReverse} md:ml-0 md:text-center" data-aos="fade-up">
                            <div class="absolute w-3 h-3 bg-gold rounded-full -left-[6px] md:left-1/2 md:-ml-[6px] border-[3px] border-theme box-content"></div>
                            <div class="md:w-[45%] ${alignLeft}">
                                <h3 class="text-xl font-serif text-primary">${cerita.judul}</h3>
                                <span class="text-xs text-gold uppercase tracking-widest">${cerita.tanggal}</span>
                            </div>
                            <div class="md:w-[45%] ${alignRight} text-sm text-gray-500 mt-2 md:mt-0 font-serif italic">
                                "${cerita.deskripsi}"
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (err) { console.error("Error", err); }

    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('nama-tamu-url').innerText = guestName;
        document.getElementById('name').value = guestName;
    }

    document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('name').value,
            attendance: document.getElementById('attendance').value,
            message: document.getElementById('message').value
        };
        const btn = e.target.querySelector('button');
        btn.innerText = "MENGIRIM...";
        try {
            const res = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if ((await res.json()).success) { alert('Terima kasih! RSVP berhasil dikirim.'); e.target.reset(); }
        } catch (err) { alert("Error jaringan."); } finally { btn.innerText = "KIRIM RSVP"; }
    });
});

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src; lb.classList.remove('hidden');
    setTimeout(() => { img.classList.replace('scale-95', 'scale-100'); }, 50);
}
function closeLightbox() { 
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.classList.replace('scale-100', 'scale-95');
    setTimeout(() => { lb.classList.add('hidden'); }, 200);
}
function copyRekening(e) {
    const num = document.getElementById("rekening-number").innerText;
    navigator.clipboard.writeText(num).then(() => {
        const btn = e.currentTarget; const awal = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> Berhasil Disalin`;
        setTimeout(() => { btn.innerHTML = awal; }, 2000);
    });
}