/* =========================================
   MAIN.JS - BARBER TECH ATUALIZADO- 22/05/2026 -> jor23
   ========================================= */
// --- CONFIGURAÇÃO DA API ---
const API_URL = "http://localhost:5216/api"; // Porta correta do seu Back-end C#

// --- DATA LAYER (Simulação local) ---
const services = [
    { id: 1, name: 'Corte Clássico', description: 'Corte de precisão com consulta, shampoo e finalização', duration: 45, price: 85 },
    { id: 2, name: 'Escultura de Barba', description: 'Modelagem de barba especializada com toalha quente e óleo', duration: 30, price: 55 },
    { id: 3, name: 'Pacote Premium', description: 'Corte + Barba + Tratamento facial', duration: 90, price: 150 },
    { id: 4, name: 'Barba Navalhada Quente', description: 'Barba tradicional com navalha e produtos de luxo', duration: 45, price: 70 },
    { id: 5, name: 'Design de Cabelo', description: 'Cortes criativos com designs e padrões', duration: 60, price: 120 },
    { id: 6, name: 'Corte Infantil', description: 'Experiência de corte suave para crianças sob 12 anos', duration: 30, price: 50 }
];

const barbers = [
    { id: 1, name: 'Marcus Rivera', specialty: 'Cortes de Precisão', experience: 12, rating: 4.9, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { id: 2, name: 'Diego Santos', specialty: 'Design de Barba', experience: 8, rating: 4.8, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    { id: 3, name: 'Lucas Oliveira', specialty: 'Arte no Cabelo', experience: 6, rating: 4.9, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
    { id: 4, name: 'André Costa', specialty: 'Estilos Clássicos', experience: 15, rating: 5.0, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' }
];

const galleryImages = [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80'
];

let bookingState = {
    currentStep: 1, selectedService: null, selectedBarber: null,
    selectedDate: null, selectedTime: null, calendarDate: new Date()
};

// Variável para guardar dados enquanto o usuário faz login
let pendingBooking = null;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Renders
    renderServices(); renderTeam(); renderGallery();
    renderModalServices(); renderModalBarbers();
    renderCalendar(); renderTimeSlots();
    
    // Utils
    initScrollReveal(); initStatCounters(); initStickyNav();
    
    // Custom
    updateStoreStatus();
    checkAuthState(); // Verifica se o usuário já está logado ao carregar a página
});

// --- RENDER FUNCTIONS ---
        
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = services.map(service => `
        <article class="service-card group">
            <div class="flex justify-between items-start mb-4">
                <span class="text-4xl font-display text-accent opacity-40">0${service.id}</span>
                <span class="text-sm text-muted bg-bg px-2 py-1 rounded">${service.duration} min</span>
            </div>
            <h3 class="font-display text-2xl mb-2 text-text">${service.name.toUpperCase()}</h3>
            <p class="text-muted text-sm mb-4">${service.description}</p>
            <div class="flex justify-between items-center pt-4 border-t border-border">
                <span class="font-display text-3xl text-text">R$${service.price}</span>
                <button onclick="selectServiceAndBook(${service.id})" class="text-accent hover:text-accent-light transition-colors flex items-center gap-2 font-medium text-sm">
                    Agendar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
            </div>
        </article>
    `).join('');
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = galleryImages.map((img, index) => `
        <div class="gallery-item ${index === 0 ? 'col-span-2 row-span-2' : ''}">
            <img src="${img}" alt="Trabalho de barbearia ${index + 1}" loading="lazy">
            <div class="overlay"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        </div>
    `).join('');
}

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    grid.innerHTML = barbers.map(barber => `
        <article class="barber-card">
            <div class="aspect-[3/4] overflow-hidden bg-bg"><img src="${barber.image}" alt="${barber.name}" class="w-full h-full object-cover" loading="lazy"></div>
            <div class="overlay">
                <div class="flex items-center gap-2 mb-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-accent"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span class="text-sm text-text font-medium">${barber.rating}</span></div>
                <h3 class="font-display text-xl text-text">${barber.name.toUpperCase()}</h3><p class="text-muted text-sm">${barber.specialty}</p><p class="text-accent text-sm mt-1">${barber.experience} anos exp.</p>
            </div>
        </article>
    `).join('');
}

function renderModalServices() {
    const container = document.getElementById('modalServices');
    container.innerHTML = services.map(service => `
        <button onclick="selectService(${service.id})" class="service-option w-full text-left p-4 rounded-lg border border-border hover:border-accent transition-all ${bookingState.selectedService === service.id ? 'border-accent bg-accent-bg' : 'bg-bg'}">
            <div class="flex justify-between items-start"><div><span class="font-semibold text-text">${service.name}</span><p class="text-sm text-muted">${service.duration} min</p></div><span class="font-display text-xl text-accent">R$${service.price}</span></div>
        </button>
    `).join('');
}

function renderModalBarbers() {
    const container = document.getElementById('modalBarbers');
    container.innerHTML = barbers.map(barber => `
        <button onclick="selectBarber(${barber.id})" class="barber-option p-4 rounded-lg border border-border hover:border-accent transition-all text-center ${bookingState.selectedBarber === barber.id ? 'border-accent bg-accent-bg' : 'bg-bg'}">
            <img src="${barber.image}" alt="${barber.name}" class="w-16 h-16 rounded-full mx-auto mb-2 object-cover"><p class="font-semibold text-sm text-text">${barber.name}</p><p class="text-xs text-muted">${barber.specialty}</p>
        </button>
    `).join('');
}

function renderCalendar() {
    const container = document.getElementById('calendarDays'); 
    const monthLabel = document.getElementById('calendarMonth'); 
    const year = bookingState.calendarDate.getFullYear(); 
    const month = bookingState.calendarDate.getMonth(); 
    const today = new Date();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; 
    monthLabel.textContent = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 
    let days = '';
    for (let i = 0; i < firstDay; i++) { days += '<div class="calendar-day disabled"></div>'; }
    for (let day = 1; day <= daysInMonth; day++) { 
        const date = new Date(year, month, day); 
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
        const isToday = date.toDateString() === today.toDateString(); 
        const isSelected = bookingState.selectedDate && date.toDateString() === bookingState.selectedDate.toDateString(); 
        days += `<button onclick="selectDate(${year}, ${month}, ${day})" class="calendar-day ${isPast ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" ${isPast ? 'disabled' : ''}>${day}</button>`; 
    }
    container.innerHTML = days;
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots'); 
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']; 
    const now = new Date(); 
    const isToday = bookingState.selectedDate && bookingState.selectedDate.toDateString() === now.toDateString();
    container.innerHTML = times.map(time => { 
        const [hours, minutes] = time.split(':').map(Number); 
        const slotTime = new Date(bookingState.selectedDate || now); 
        slotTime.setHours(hours, minutes, 0, 0); 
        const isPast = isToday && slotTime <= new Date(now.getTime() + 60 * 60 * 1000); 
        const isSelected = bookingState.selectedTime === time; 
        return `<button onclick="selectTime('${time}')" class="time-slot ${isPast ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}" ${isPast ? 'disabled' : ''}>${time}</button>`; 
    }).join('');
}

function renderBookingSummary() {
    const container = document.getElementById('bookingSummary'); 
    const service = services.find(s => s.id === bookingState.selectedService); 
    const barber = barbers.find(b => b.id === bookingState.selectedBarber); 
    const date = bookingState.selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' });
    container.innerHTML = `<div class="flex justify-between"><span class="text-muted">Serviço</span><span class="font-semibold text-text">${service?.name}</span></div><div class="flex justify-between"><span class="text-muted">Barbeiro</span><span class="font-semibold text-text">${barber?.name}</span></div><div class="flex justify-between"><span class="text-muted">Data</span><span class="font-semibold text-text capitalize">${date}</span></div><div class="flex justify-between"><span class="text-muted">Hora</span><span class="font-semibold text-text">${bookingState.selectedTime}</span></div><div class="flex justify-between pt-3 border-t border-border"><span class="text-muted font-medium">Total</span><span class="font-display text-2xl text-accent">R$${service?.price}</span></div>`;
}

// --- LOGIC FUNCTIONS ---

function selectService(id) { bookingState.selectedService = id; renderModalServices(); }
function selectBarber(id) { bookingState.selectedBarber = id; renderModalBarbers(); }
function selectDate(year, month, day) { bookingState.selectedDate = new Date(year, month, day); renderCalendar(); renderTimeSlots(); }
function selectTime(time) { bookingState.selectedTime = time; renderTimeSlots(); }
function selectServiceAndBook(serviceId) { bookingState.selectedService = serviceId; openBookingModal(); }
function prevMonth() { bookingState.calendarDate.setMonth(bookingState.calendarDate.getMonth() - 1); renderCalendar(); }
function nextMonth() { bookingState.calendarDate.setMonth(bookingState.calendarDate.getMonth() + 1); renderCalendar(); }

function nextStep() {
    if (bookingState.currentStep === 1 && !bookingState.selectedService) { alert('Por favor, selecione um serviço'); return; }
    if (bookingState.currentStep === 2 && !bookingState.selectedBarber) { alert('Por favor, selecione um barbeiro'); return; }
    if (bookingState.currentStep === 3 && (!bookingState.selectedDate || !bookingState.selectedTime)) { alert('Por favor, selecione data e hora'); return; }
    if (bookingState.currentStep < 4) { 
        bookingState.currentStep++; 
        updateStepUI(); 
        if (bookingState.currentStep === 4) renderBookingSummary(); 
    } else { 
        confirmBooking(); 
    }
}

function prevStep() { if (bookingState.currentStep > 1) { bookingState.currentStep--; updateStepUI(); } }

function updateStepUI() {
    document.querySelectorAll('.step-dot').forEach((dot, index) => { 
        dot.classList.remove('active', 'completed'); 
        if (index + 1 < bookingState.currentStep) { 
            dot.classList.add('completed'); 
            dot.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'; 
        } else if (index + 1 === bookingState.currentStep) { 
            dot.classList.add('active'); 
            dot.textContent = index + 1; 
        } else { 
            dot.textContent = index + 1; 
        } 
    });
    document.querySelectorAll('.step-line').forEach((line, index) => { 
        line.classList.toggle('completed', index < bookingState.currentStep - 1); 
        line.style.background = index < bookingState.currentStep - 1 ? 'var(--accent)' : 'var(--border)'; 
    });
    document.querySelectorAll('.booking-step').forEach(step => step.classList.toggle('hidden', parseInt(step.dataset.step) !== bookingState.currentStep));
    document.getElementById('prevBtn').classList.toggle('hidden', bookingState.currentStep === 1); 
    document.getElementById('nextBtn').textContent = bookingState.currentStep === 4 ? 'Confirmar Agendamento' : 'Continuar';
}

function openBookingModal() { 
    document.getElementById('bookingModal').classList.add('active'); 
    document.getElementById('bookingModal').querySelector('.modal-content').classList.add('active'); 
    document.body.style.overflow = 'hidden'; 
    updateStepUI(); 
}

function closeBookingModal(event) { 
    if (event && event.target !== event.currentTarget) return; 
    document.getElementById('bookingModal').classList.remove('active'); 
    document.getElementById('bookingModal').querySelector('.modal-content').classList.remove('active'); 
    document.body.style.overflow = ''; 
}

function showConfirmationToast() { 
    const toast = document.getElementById('confirmationToast'); 
    toast.style.opacity = '1'; 
    toast.style.visibility = 'visible'; 
    setTimeout(() => { toast.style.opacity = '0'; toast.style.visibility = 'hidden'; }, 4000); 
}

function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('hidden'); }

// --- UTILITIES ---

function initScrollReveal() { const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }); document.querySelectorAll('.reveal, .stagger-children').forEach(el => observer.observe(el)); }
function initStatCounters() { const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { const target = parseInt(entry.target.dataset.target); animateCounter(entry.target, target); observer.unobserve(entry.target); } }); }, { threshold: 0.5 }); document.querySelectorAll('.stat-number').forEach(el => observer.observe(el)); }
function animateCounter(element, target) { const duration = 2000; const startTime = performance.now(); function update(currentTime) { const elapsed = currentTime - startTime; const progress = Math.min(elapsed / duration, 1); const easeOutQuart = 1 - Math.pow(1 - progress, 4); const current = Math.floor(target * easeOutQuart); element.textContent = current.toLocaleString('pt-BR'); if (progress < 1) requestAnimationFrame(update); } requestAnimationFrame(update); }
function initStickyNav() { window.addEventListener('scroll', () => { const nav = document.getElementById('mainNav'); if (window.scrollY > 50) nav.classList.add('nav-scrolled'); else nav.classList.remove('nav-scrolled'); }); }

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeBookingModal(); closeAuthModal(); } });

// --- LÓGICA DE STATUS DA LOJA ---
function updateStoreStatus() {
    const indicator = document.getElementById('status-indicator');
    const text = document.getElementById('status-text');
    if (!indicator || !text) return;

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + (minutes / 60);
    let isOpen = false;

    if (day >= 2 && day <= 6) { 
        if (currentTime >= 9 && currentTime < 20) isOpen = true;
    } else if (day === 0) { 
        if (currentTime >= 9 && currentTime < 18) isOpen = true;
    }

    if (isOpen) {
        indicator.classList.add('status-open');
        indicator.classList.remove('status-closed');
        text.textContent = "Aberto Agora";
        text.style.color = "#22C55E";
    } else {
        indicator.classList.remove('status-open');
        indicator.classList.add('status-closed');
        text.textContent = "Fechado Agora";
        text.style.color = "#EF4444";
    }
}

// =========================================
// AUTHENTICATION & API INTEGRATION
// =========================================

// 1. Verificar Estado de Login (Chamado no DOMContentLoaded)
function checkAuthState() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userArea = document.getElementById('userArea');
    
    if (!userArea) return; // Segurança caso o elemento não exista

    if (token && userName) {
        // Usuário Logado
        userArea.innerHTML = `
            <span class="text-sm text-muted hidden sm:inline">Olá, <strong class="text-text">${userName}</strong></span>
            <button onclick="logoutUser()" class="btn-outline text-xs">Sair</button>
        `;
    } else {
        // Usuário Deslogado
        userArea.innerHTML = `
            <button onclick="openAuthModal()" class="btn-outline text-sm">Entrar</button>
        `;
    }
}

// 2. Modal de Autenticação (Login/Cadastro)
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) { alert("Erro: Modal de login não encontrado no HTML."); return; }
    modal.classList.add('active');
    modal.querySelector('.modal-content').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.querySelector('.modal-content').classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    
    if(tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('text-accent', 'border-accent');
        tabLogin.classList.remove('text-muted', 'border-transparent');
        tabRegister.classList.remove('text-accent', 'border-accent');
        tabRegister.classList.add('text-muted', 'border-transparent');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabRegister.classList.add('text-accent', 'border-accent');
        tabRegister.classList.remove('text-muted', 'border-transparent');
        tabLogin.classList.remove('text-accent', 'border-accent');
        tabLogin.classList.add('text-muted', 'border-transparent');
    }
}

// 3. Ações de Login e Cadastro
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao fazer login");

        // Sucesso
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.nome);
        localStorage.setItem('userId', data.id);

        closeAuthModal();
        checkAuthState();
        
        // Se tentou agendar antes, continua o processo
        if (pendingBooking) {
            sendBookingToAPI();
        }

    } catch (error) {
        alert(error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const nome = document.getElementById('regName').value;
    const telefone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email, senha })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao cadastrar");

        alert("Cadastro realizado! Faça o login.");
        switchAuthTab('login');

    } catch (error) {
        alert(error.message);
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    checkAuthState();
    alert("Você saiu da conta.");
    // Opcional: Recarregar página para limpar estados
    // window.location.reload(); 
}

// 4. Confirmação de Agendamento (Atualizado)
function confirmBooking() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    
    if (!name || !phone) { alert('Por favor, preencha seu nome e telefone'); return; }

    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Você precisa estar logado para finalizar o agendamento.");
        pendingBooking = { clientName: name, clientPhone: phone }; // Salva contexto
        openAuthModal();
        return;
    }

    sendBookingToAPI();
}

async function sendBookingToAPI() {
    const token = localStorage.getItem('token');
    
    // Formatar data e hora para o C# (ISO 8601)
    const dateObj = new Date(bookingState.selectedDate);
    const timeParts = bookingState.selectedTime.split(':');
    dateObj.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

    const payload = {
        servicoId: bookingState.selectedService,
        barbeiroId: bookingState.selectedBarber,
        dataHora: dateObj.toISOString() // Formato padrão que C# entende
    };

    try {
        const response = await fetch(`${API_URL}/agendamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            closeBookingModal();
            showConfirmationToast();
            pendingBooking = null; // Limpa pendência
            
            // Resetar Estado
            bookingState = { currentStep: 1, selectedService: null, selectedBarber: null, selectedDate: null, selectedTime: null, calendarDate: new Date() };
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Erro ao salvar agendamento.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    }
}