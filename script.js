// Mock Products Data (Stalin Store Catalog)
const products = [
    {
        id: 1,
        name: "Laptop Stalin Slim Pro i7",
        category: "laptop",
        price: 13500000,
        spec: "Intel Core i7 Gen 13, 16GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
        stock: true
    },
    {
        id: 2,
        name: "Laptop Stalin Beast Gaming RTX4060",
        category: "laptop",
        price: 18900000,
        spec: "AMD Ryzen 7, RTX 4060 8GB, 16GB DDR5, 1TB NVMe",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80",
        stock: true
    },
    {
        id: 3,
        name: "PC Gaming Stalin Titan Core",
        category: "desktop",
        price: 24500000,
        spec: "Intel i9-13900K, RTX 4070Ti, 32GB RAM, Liquid Cooling",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
        stock: true
    },
    {
        id: 4,
        name: "Custom PC Workstation Creator",
        category: "desktop",
        price: 16800000,
        spec: "Ryzen 9 5900X, RTX 3060 12GB, 32GB RAM",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=500&q=80",
        stock: false 
    },
    {
        id: 5,
        name: "Ambient Light Strip RGB Stalin Glow",
        category: "aksesoris",
        price: 350000,
        spec: "Smart App Control, Sync Audio & Game Mode",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80",
        stock: true
    },
    {
        id: 6,
        name: "Keyboard Mechanical RGB Stalin Tactical",
        category: "aksesoris",
        price: 850000,
        spec: "Hot-swappable Switch Blue/Red, Braided Cable",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
        stock: true
    }
];

let cart = [];
let currentFilter = 'all';

// Initial Render
window.onload = () => {
    renderProducts();
    initChatbotGreeting();
};

// Render Products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    const filtered = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    filtered.forEach(p => {
        // Menggunakan tag <article> untuk semantik yang lebih baik
        const card = document.createElement('article');
        card.className = "bg-cardBg border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between group";
        card.innerHTML = `
            <div>
                <div class="h-48 overflow-hidden relative">
                    <img src="${p.image}" alt="Gambar Produk ${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 right-3 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md ${p.stock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}">
                        ${p.stock ? 'Tersedia' : 'Stok Habis'}
                    </span>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-white text-base group-hover:text-cyan-400 transition">${p.name}</h3>
                    <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">${p.spec}</p>
                    <p class="text-amber-400 font-extrabold text-lg mt-3">Rp ${p.price.toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex gap-2">
                <button aria-label="Tambah ${p.name} ke keranjang" onclick="addToCart(${p.id})" class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-cart-plus text-cyan-400"></i> + Keranjang
                </button>
                <button aria-label="Tanya AI tentang ${p.name}" onclick="askChatbotAboutProduct('${p.name}')" class="px-3 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-800/60 text-xs font-semibold transition" title="Tanya AI">
                    <i class="fa-solid fa-robot"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Category Filter Function
function filterCategory(cat) {
    currentFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-cyan-500', 'text-slate-950');
        btn.classList.add('bg-slate-800', 'text-slate-300');
    });
    event.target.classList.remove('bg-slate-800', 'text-slate-300');
    event.target.classList.add('bg-cyan-500', 'text-slate-950');
    renderProducts();
}

// Cart Actions
function addToCart(id) {
    const item = products.find(p => p.id === id);
    if(!item.stock) {
        openChatWithQuery(`Apakah produk ${item.name} stoknya ready?`);
        return;
    }
    cart.push(item);
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    badge.innerText = cart.length;
    if(cart.length > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');

    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-center py-4 text-xs">Keranjang Anda masih kosong.</p>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div class="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                        <p class="text-xs font-bold text-white">${item.name}</p>
                        <p class="text-[11px] text-amber-400">Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button aria-label="Hapus ${item.name} dari keranjang" onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 text-xs px-2"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }
    document.getElementById('cart-total').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCartModal() {
    document.getElementById('cart-modal').classList.toggle('hidden');
}

function checkoutCart() {
    if(cart.length === 0) return;
    alert("Pesanan berhasil dibuat! Anda dapat mengonfirmasi data pengiriman ke Stalin Assistant.");
    cart = [];
    updateCartUI();
    toggleCartModal();
    openChatWithQuery("Halo, saya ingin mengonfirmasi pesanan yang baru saja checkout.");
}

// Chatbot Visibility
function toggleChatWindow() {
    const win = document.getElementById('chat-window');
    win.classList.toggle('hidden');
    if(!win.classList.contains('hidden')) {
        document.getElementById('chat-input').focus();
    }
}

function openChatWithQuery(msg) {
    const win = document.getElementById('chat-window');
    if(win.classList.contains('hidden')) win.classList.remove('hidden');
    sendUserMessage(msg);
}

function askChatbotAboutProduct(pName) {
    openChatWithQuery(`Apakah ${pName} direkomendasikan untuk kebutuhan saya?`);
}

// Initial Greeting
function initChatbotGreeting() {
    const msgs = document.getElementById('chat-messages');
    msgs.innerHTML = `
        <div class="bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-800 text-slate-200 space-y-1 max-w-[85%]">
            <p class="text-cyan-400 text-[10px] font-bold">🤖 Stalin Assistant</p>
            <p class="text-xs">Halo! Selamat datang di <b>Stalin Store</b>. Ada yang bisa saya bantu hari ini?</p>
            <p class="text-[10px] text-slate-400 pt-1">Anda bisa bertanya tentang laptop, rekomendasi PC, atau panduan merakit komputer!</p>
        </div>
    `;
}

function sendQuickMessage(text) {
    sendUserMessage(text);
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const val = input.value.trim();
    if(!val) return;
    sendUserMessage(val);
    input.value = '';
}

function sendUserMessage(text) {
    const msgs = document.getElementById('chat-messages');
    
    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.className = "flex justify-end";
    userBubble.innerHTML = `
        <div class="bg-cyan-950/80 text-cyan-100 p-3 rounded-2xl rounded-tr-none border border-cyan-800/60 text-xs max-w-[85%]">
            ${text}
        </div>
    `;
    msgs.appendChild(userBubble);
    msgs.scrollTop = msgs.scrollHeight;

    // Show Typing Indicator
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = "bg-slate-900 p-2.5 rounded-2xl rounded-tl-none border border-slate-800 text-slate-400 text-xs w-20 flex items-center justify-center gap-1";
    typing.innerHTML = `<span class="animate-pulse">●</span><span class="animate-pulse delay-100">●</span><span class="animate-pulse delay-200">●</span>`;
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    // Generate AI Response based on Document Testing Matrix (Table 1 Black Box Testing)
    setTimeout(() => {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();

        const responseText = processWatsonRules(text);
        const botBubble = document.createElement('div');
        botBubble.className = "bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-800 text-slate-200 space-y-1 max-w-[85%]";
        botBubble.innerHTML = `
            <p class="text-cyan-400 text-[10px] font-bold">🤖 Stalin Assistant</p>
            <div class="text-xs leading-relaxed space-y-2">${responseText}</div>
        `;
        msgs.appendChild(botBubble);
        msgs.scrollTop = msgs.scrollHeight;
    }, 800);
}

// Logic processing according to Table 1 in PDF Jurnal
function processWatsonRules(input) {
    const query = input.toLowerCase();

    // Skenario 1: Halo / Menyapa / Tanya Laptop
    if(query.includes('halo') || query.includes('hai') || query.includes('laptop') || query.includes('rekomendasi laptop')) {
        return `
            <p>Halo! Terima kasih telah menghubungi Stalin Store.</p>
            <p>Untuk laptop, kami merekomendasikan dua pilihan populer:</p>
            <ul class="list-disc pl-4 space-y-1 text-slate-300">
                <li><b>Laptop Stalin Slim Pro i7</b> (Rp 13.500.000) - Cocok untuk produktivitas & kuliah/kantor.</li>
                <li><b>Stalin Beast Gaming RTX4060</b> (Rp 18.900.000) - Performa mumpuni untuk gaming & render video.</li>
            </ul>
            <p class="text-[11px] text-cyan-300 mt-1">Ketik nama laptop untuk info lebih mendalam!</p>
        `;
    }

    // Skenario 2: Pertanyaan Produk Tidak Tersedia / Stok Kosong
    if(query.includes('workstation') || query.includes('creator') || query.includes('kosong') || query.includes('stok')) {
        return `
            <p>Mohon maaf, untuk produk <b>Custom PC Workstation Creator</b> saat ini stok sedang kosong karena permintaan tinggi.</p>
            <p><b>Alternatif Rekomendasi:</b> Anda dapat memilih <b>PC Gaming Stalin Titan Core</b> yang memiliki performa komputasi setara dengan garansi resmi 2 tahun.</p>
        `;
    }

    // Skenario 8: Cara Merakit Komputer (PC Building Guide)
    if(query.includes('rakit') || query.includes('merakit') || query.includes('tutorial')) {
        return `
            <p><b>Panduan Singkat Merakit PC oleh Stalin Assistant:</b></p>
            <ol class="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Pasang Processor & RAM pada Slot Motherboard.</li>
                <li>Pasang CPU Cooler dengan Thermal Paste secukupnya.</li>
                <li>Pasang Power Supply (PSU) ke dalam Casing PC.</li>
                <li>Posisikan Motherboard ke Casing dan kencangkan baut.</li>
                <li>Pasang Kartu Grafis (GPU/RTX) pada Slot PCIe.</li>
                <li>Hubungkan Kabel Power & Manajemen Kabel rapi.</li>
            </ol>
            <p class="text-amber-400 font-semibold mt-1">Gunakan gelang anti-statis saat proses perakitan!</p>
        `;
    }

    // Skenario 5 & 6: Informasi Pribadi / Alamat / Keamanan
    if(query.includes('email') || query.includes('alamat') || query.includes('checkout') || query.includes('pesanan')) {
        return `
            <p>Sistem Stalin Assistant melindungi informasi pribadi Anda menggunakan enkripsi protokol keamanan.</p>
            <p>Silahkan masukkan detail alamat Anda untuk konfirmasi pengiriman pesanan secara aman.</p>
        `;
    }

    // Skenario 3 & General Fallback
    return `
        <p>Saya mengerti pertanyaan Anda mengenai <i>"${input}"</i>.</p>
        <p>Di Stalin Store kami menyediakan garansi resmi pada semua komponen hardware. Apakah Anda ingin dibantu memilih spek PC, mengecek garansi, atau rekomendasi harga tertentu?</p>
    `;
}