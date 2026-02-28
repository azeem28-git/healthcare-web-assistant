// Enhanced AI Chatbot with healthcare information focus
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const minimizeChat = document.getElementById('minimizeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessageBtn = document.getElementById('sendMessage');
const consultationForm = document.getElementById('consultationForm');

// Enhanced bot responses with healthcare information
const botResponses = {
    greetings: [
        "Hello! I'm your HealthCare Pro AI Assistant. I can provide medical information, symptom analysis, and health guidance. How can I help you today?",
        "Hi there! I'm here to help with your health questions. I can provide information about symptoms, medicines, and general wellness topics.",
        "Welcome! I'm your healthcare assistant. I can share medical information, help with symptom analysis, and guide you on when to seek professional care."
    ],
    help: [
        "I can help you with:\n• Medical information and symptom analysis\n• General health and wellness advice\n• Medicine information and guidance\n• When to see a doctor\n• Emergency triage guidance\n\n**Medical Disclaimer**: This is not a substitute for professional medical advice.",
        "My capabilities include:\n• Symptom analysis and general guidance\n• Health information and wellness tips\n• Medicine information and safety guidance\n• Appointment timing suggestions\n• Emergency guidance\n\nAlways consult healthcare professionals for medical decisions."
    ],
    fever: [
        "For fever: Common causes include viral/bacterial infections and heat exhaustion. Recommendations: Rest, stay hydrated, use fever reducers. **Medical Disclaimer**: This is not a substitute for professional medical advice. Please consult a doctor if temperature is above 103°F (39.4°C) or lasts more than 3 days.",
        "Fever guidance: Monitor temperature regularly, stay hydrated, rest in cool environment. Over-the-counter medications like acetaminophen or ibuprofen may help. **Important**: Seek immediate medical care for high fever or if accompanied by other severe symptoms."
    ],
    headache: [
        "For headaches: Common causes include stress, dehydration, migraines, and sinus pressure. Recommendations: Rest in quiet dark room, apply cold compress, stay hydrated. **Medical Disclaimer**: This is not a substitute for professional medical advice. Seek immediate care for severe headaches or vision changes.",
        "Headache relief: Try resting in a dark, quiet room, apply cold compress to forehead, stay hydrated. Over-the-counter pain relievers may help. **Safety Note**: Consult doctor if headaches are severe, sudden, or accompanied by other symptoms."
    ],
    cold: [
        "For cold/flu: Common causes include viral infections. Recommendations: Rest, drink plenty of fluids, use humidifier, consider over-the-counter cold medications. **Medical Disclaimer**: This is not a substitute for professional medical advice. See doctor if symptoms last more than 10 days or worsen.",
        "Cold and flu care: Stay hydrated, get plenty of rest, use saline nasal spray, consider honey and lemon for sore throat. **Important**: Seek medical attention if breathing becomes difficult or fever is high."
    ],
    stomachache: [
        "For stomach pain: Common causes include indigestion, food poisoning, gastritis. Recommendations: BRAT diet (bananas, rice, applesauce, toast), stay hydrated, avoid spicy foods. **Medical Disclaimer**: This is not a substitute for professional medical advice. Seek immediate care for severe pain or fever.",
        "Stomach discomfort: Try clear liquids, bland foods, and rest. Avoid dairy, caffeine, and spicy foods. **Safety Note**: Seek emergency care if pain is severe, persistent, or accompanied by fever."
    ],
    medicine: [
        "I can provide general information about medicines including common uses, side effects, and safety precautions. **Medical Disclaimer**: Always consult with healthcare providers before taking any medication. Never share prescription medications.",
        "Medicine information: I can share general information about common medications, their typical uses, and important safety considerations. **Important**: This information is educational - always follow your doctor's specific instructions."
    ],
    appointment: [
        "I can help you understand when to schedule appointments and what type of specialist might be appropriate for your symptoms. **Medical Disclaimer**: This is guidance only - always consult with healthcare providers for proper diagnosis and treatment.",
        "Appointment guidance: Based on your symptoms, I can suggest when to seek routine care vs urgent care. I can help you understand what information to prepare for your doctor visit. **Important**: This is not a substitute for professional medical advice."
    ],
    emergency: [
        "🚨 **EMERGENCY GUIDANCE** 🚨\n\nFor life-threatening emergencies (chest pain, difficulty breathing, severe bleeding, loss of consciousness):\n• Call 108 immediately (India Emergency)\n• Don't wait - every second counts\n• Follow emergency operator instructions\n\n**Medical Disclaimer**: This is not a substitute for emergency medical services.",
        "⚠️ **URGENT MEDICAL ADVICE** ⚠️\n\nIf you're experiencing severe symptoms or medical emergency:\n• Call 108 for immediate emergency assistance\n• Call 102 for ambulance services\n• Go to nearest emergency room\n\n**If in doubt, always seek immediate emergency care.**"
    ],
    default: [
        "I'm your HealthCare Pro AI Assistant. I can provide medical information, symptom analysis, and health guidance. Could you please tell me more about your health concern?",
        "I'm here to help with your healthcare questions. I can share general medical information, help with symptom analysis, and provide wellness guidance. What specific health topic would you like to know about?",
        "As your health assistant, I can provide information about symptoms, medicines, general health topics, and when to seek professional care. Please describe your health concern and I'll do my best to help."
    ]
};

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    if (!chatMessages) return; // safely ignore if chatbot is not present on this page
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced bot response detection
function getBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for emergency keywords first
    if (lowerCaseMessage.includes('emergency') || lowerCaseMessage.includes('help emergency') || 
        lowerCaseMessage.includes('chest pain') || lowerCaseMessage.includes('difficulty breathing') ||
        lowerCaseMessage.includes('severe bleeding') || lowerCaseMessage.includes('unconscious')) {
        return botResponses.emergency[Math.floor(Math.random() * botResponses.emergency.length)];
    }
    
    // Check for medicine-related queries
    if (lowerCaseMessage.includes('medicine') || lowerCaseMessage.includes('drug') || 
        lowerCaseMessage.includes('medication') || lowerCaseMessage.includes('pharmacy')) {
        return botResponses.medicine[Math.floor(Math.random() * botResponses.medicine.length)];
    }
    
    // Check for appointment-related queries
    if (lowerCaseMessage.includes('appointment') || lowerCaseMessage.includes('book') || 
        lowerCaseMessage.includes('schedule') || lowerCaseMessage.includes('doctor visit')) {
        return botResponses.appointment[Math.floor(Math.random() * botResponses.appointment.length)];
    }
    
    // Standard symptom checks
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
        return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('what can you do')) {
        return botResponses.help[Math.floor(Math.random() * botResponses.help.length)];
    } else if (lowerCaseMessage.includes('fever') || lowerCaseMessage.includes('temperature')) {
        return botResponses.fever[0];
    } else if (lowerCaseMessage.includes('headache') || lowerCaseMessage.includes('head hurts')) {
        return botResponses.headache[0];
    } else if (lowerCaseMessage.includes('cold') || lowerCaseMessage.includes('flu') || lowerCaseMessage.includes('cough')) {
        return botResponses.cold[0];
    } else if (lowerCaseMessage.includes('stomach') || lowerCaseMessage.includes('belly') || lowerCaseMessage.includes('nausea')) {
        return botResponses.stomachache[0];
    } else {
        return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
}

// Handle user message (AI via backend with fallback)
async function handleUserMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = '<p>HealthCare AI is thinking...</p>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Try backend AI first with enhanced features
        const base = await resolveApiBase();
        const res = await fetch(`${base}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are HealthCare Pro AI Assistant, a helpful medical information provider.' },
                    { role: 'user', content: message }
                ]
            })
        });
        
        let botText = '';
        if (res.ok) {
            const data = await res.json();
            botText = data?.content || '';
        } else {
            // Fallback to local responses
            botText = getBotResponse(message);
        }
        
        document.getElementById('typing-indicator')?.remove();
        addMessage(botText || getBotResponse(message));
    } catch (e) {
        // Network/resolve failure -> fallback to local rules
        document.getElementById('typing-indicator')?.remove();
        addMessage(getBotResponse(message));
    }
}

// Event listeners
if (sendMessageBtn && userInput) {
    sendMessageBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
}

// Toggle Chatbot (guard for pages without chatbot)
if (chatbotToggle && chatbotContainer) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });
}

// Minimize Chat
if (minimizeChat && chatbotContainer) {
    minimizeChat.addEventListener('click', (e) => {
        e.stopPropagation();
        chatbotContainer.classList.remove('active');
    });
}

// Handle consultation form submission
// Backend API (dynamic base: tries 3000/3001/3002)
async function resolveApiBase() {
    const cached = localStorage.getItem('api_base');
    if (cached) return cached;
    const ports = [3000, 3001, 3002];
    for (const p of ports) {
        try {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 1200);
            const res = await fetch(`http://localhost:${p}/api/health`, { signal: ctrl.signal });
            clearTimeout(t);
            if (res.ok) {
                const base = `http://localhost:${p}`;
                localStorage.setItem('api_base', base);
                return base;
            }
        } catch (e) { /* try next */ }
    }
    throw new Error('API not reachable');
}

async function postJSON(url, payload) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('bad_status');
        return await res.json();
    } catch (e) {
        throw e;
    }
}

async function postApi(path, payload) {
    const base = await resolveApiBase();
    return postJSON(`${base}${path}`, payload);
}

// Helpers for localStorage
function lsGet(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const specialty = document.getElementById('specialty').value;
        const symptoms = document.getElementById('symptoms').value.trim();
        // Try backend first, fallback to localStorage
        const payload = { name, email, phone, specialty, symptoms };
        postApi('/api/consults', payload)
            .then(() => {
                alert('Consultation request submitted! We will contact you shortly.');
                consultationForm.reset();
            })
            .catch(() => {
                const consults = lsGet('consults');
                consults.push({ ...payload, date: new Date().toISOString() });
                lsSet('consults', consults);
                alert('Consultation saved (offline). It will appear on the dashboard.');
                consultationForm.reset();
            });
    });
}

// Offline Appointment form handling
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    // Set min date to today for better UX
    const dateInput = document.getElementById('ap_date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('ap_name').value.trim();
        const email = document.getElementById('ap_email').value.trim();
        const phone = document.getElementById('ap_phone').value.trim();
        const doctor = document.getElementById('ap_doctor').value;
        const date = document.getElementById('ap_date').value;
        const time = document.getElementById('ap_time').value;
        const payload = { name, email, phone, doctor, date, time };
        postApi('/api/appointments', payload)
            .then(() => {
                alert('Appointment booked successfully! We look forward to seeing you.');
                appointmentForm.reset();
            })
            .catch(() => {
                const appointments = lsGet('appointments');
                appointments.push({ ...payload, createdAt: new Date().toISOString() });
                lsSet('appointments', appointments);
                alert('Appointment saved (offline). It will appear on the dashboard.');
                appointmentForm.reset();
            });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.card, .section-title, .form-container');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize elements with animation
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.card, .section-title, .form-container');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
    });
    
    // Trigger the animation
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// Medicine Store Functionality
// Fallback medicines (used if server is unavailable)
const fallbackMedicines = [
    { id: 1, name: 'Paracetamol 500mg', price: 15.99, category: 'Pain Relief', stock: 50, image: '💊' },
    { id: 2, name: 'Ibuprofen 400mg', price: 18.50, category: 'Pain Relief', stock: 45, image: '💊' },
    { id: 3, name: 'Aspirin 100mg', price: 12.99, category: 'Pain Relief', stock: 60, image: '💊' },
    { id: 4, name: 'Amoxicillin 500mg', price: 25.99, category: 'Antibiotic', stock: 30, image: '💉' },
    { id: 5, name: 'Azithromycin 250mg', price: 28.50, category: 'Antibiotic', stock: 25, image: '💉' },
    { id: 6, name: 'Cetirizine 10mg', price: 8.99, category: 'Allergy', stock: 70, image: '💊' },
    { id: 7, name: 'Loratadine 10mg', price: 9.50, category: 'Allergy', stock: 65, image: '💊' },
    { id: 8, name: 'Omeprazole 20mg', price: 22.99, category: 'Digestive', stock: 40, image: '💊' },
    { id: 9, name: 'Metformin 500mg', price: 19.99, category: 'Diabetes', stock: 35, image: '💊' },
    { id: 10, name: 'Atorvastatin 20mg', price: 24.99, category: 'Cardiac', stock: 30, image: '💊' },
    { id: 11, name: 'Vitamin D3 1000IU', price: 14.99, category: 'Vitamins', stock: 80, image: '💊' },
    { id: 12, name: 'Vitamin C 1000mg', price: 11.99, category: 'Vitamins', stock: 75, image: '💊' }
];

let medicines = [];
let cart = lsGet('medicine_cart', []);

// Load medicines from server
async function loadMedicines() {
    try {
        const base = await resolveApiBase();
        const res = await fetch(`${base}/api/medicines`);
        if (res.ok) {
            const data = await res.json();
            medicines = data.items || [];
            if (medicines.length === 0) {
                medicines = [...fallbackMedicines];
            }
        } else {
            medicines = [...fallbackMedicines];
        }
    } catch (e) {
        console.warn('Failed to load medicines from server, using fallback:', e);
        medicines = [...fallbackMedicines];
    }
    return medicines;
}

// Initialize Medicine Store
async function initMedicineStore() {
    const medicineGrid = document.getElementById('medicineGrid');
    if (!medicineGrid) return;

    try {
        // Show loading state
        medicineGrid.innerHTML = '<div class="col-12 text-center"><p><i class="fas fa-spinner fa-spin"></i> Loading medicines...</p></div>';

        // Load medicines from server
        await loadMedicines();
        
        if (medicines.length === 0) {
            medicineGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">No medicines available</p></div>';
            return;
        }
        
        renderMedicines(medicines);
        updateCartCount();
    } catch (error) {
        console.error('Error initializing medicine store:', error);
        medicineGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading medicines. Please refresh the page.</p></div>';
        // Try to use fallback
        medicines = [...fallbackMedicines];
        renderMedicines(medicines);
        updateCartCount();
    }

    
    // Search functionality
    const searchInput = document.getElementById('searchMedicine');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                const filtered = medicines.filter(m => 
                    m.name.toLowerCase().includes(query) || 
                    m.category.toLowerCase().includes(query)
                );
                renderMedicines(filtered);
            }, 300);
        });
    }

    // View cart button
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            renderCart();
            cartModal.show();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            cartModal.hide();
            const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
            document.getElementById('paymentTotal').textContent = `₹${getCartTotal().toFixed(2)}`;
            paymentModal.show();
        });
    }

    // Payment method change
    const paymentMethod = document.getElementById('paymentMethod');
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', (e) => {
            const cardDetails = document.getElementById('cardDetails');
            const method = e.target.value;
            
            if (['credit_card', 'debit_card'].includes(method)) {
                cardDetails.style.display = 'block';
                if (processPaymentBtn) {
                    processPaymentBtn.textContent = 'Pay Now';
                }
            } else {
                cardDetails.style.display = 'none';
                if (processPaymentBtn) {
                    if (method === 'cash_on_delivery') {
                        processPaymentBtn.textContent = 'Place Order';
                    } else {
                        processPaymentBtn.textContent = 'Pay Now';
                    }
                }
            }
        });
    }

       
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processPayment);
    }
}


function renderMedicines(meds) {
    const medicineGrid = document.getElementById('medicineGrid');
    if (!medicineGrid) return;

    if (!meds || meds.length === 0) {
        medicineGrid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No medicines found</p></div>';
        return;
    }

    try {
        medicineGrid.innerHTML = meds.map(med => {
            if (!med || !med.id) return '';
            const stock = parseInt(med.stock) || 0;
            const price = parseFloat(med.price) || 0;
            return `
                <div class="col-md-4 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="mb-3" style="font-size: 3rem;">${med.image || '💊'}</div>
                            <h5 class="card-title">${med.name || 'Unknown'}</h5>
                            <p class="text-muted small mb-2">${med.category || 'Uncategorized'}</p>
                            <p class="text-primary fw-bold mb-2">₹${price.toFixed(2)}</p>
                            <p class="text-muted small mb-3">Stock: ${stock}</p>
                            <button class="btn btn-primary btn-sm w-100" onclick="window.addToCart(${med.id})" ${stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).filter(html => html).join('');
    } catch (error) {
        console.error('Error rendering medicines:', error);
        medicineGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error displaying medicines</p></div>';
    }
}


window.addToCart = function(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) {
        alert('Medicine not found!');
        return;
    }

    if (medicine.stock === 0) {
        alert('This medicine is out of stock!');
        return;
    }

    const existingItem = cart.find(item => item.id === medicineId);
    if (existingItem) {
        if (existingItem.quantity >= medicine.stock) {
            alert('Maximum stock reached for this item!');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({ ...medicine, quantity: 1 });
    }

    lsSet('medicine_cart', cart);
    updateCartCount();
    
    // Show success message with  notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${medicine.name} added to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
};

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 20);
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '₹0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div>
                <h6 class="mb-1">${item.name || 'Unknown'}</h6>
                <small class="text-muted">₹${(parseFloat(item.price) || 0).toFixed(2)} each</small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity || 0}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.updateCartQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="text-end">
                    <strong>₹${((parseFloat(item.price) || 0) * (item.quantity || 0)).toFixed(2)}</strong>
                </div>
                
                <button class="btn btn-sm btn-danger" onclick="window.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.textContent = `₹${getCartTotal().toFixed(2)}`;
    }
}

window.updateCartQuantity = function(medicineId, change) {
    const item = cart.find(i => i.id === medicineId);
    if (!item) return;

    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        window.removeFromCart(medicineId);
        return;
    }
    if (item.quantity > medicine.stock) {
        item.quantity = medicine.stock;
        alert('Maximum stock reached!');
    }

    lsSet('medicine_cart', cart);
    updateCartCount();
    renderCart();
};

window.removeFromCart = function(medicineId) {
    cart = cart.filter(item => item.id !== medicineId);
    lsSet('medicine_cart', cart);
    updateCartCount();
    renderCart();
};

async function processPayment() {
    const form = document.getElementById('paymentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const paymentData = {
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        deliveryAddress: document.getElementById('deliveryAddress').value.trim(),
        paymentMethod: document.getElementById('paymentMethod').value,
        cardNumber: document.getElementById('cardNumber')?.value.trim() || '',
        expiryDate: document.getElementById('expiryDate')?.value.trim() || '',
        cvv: document.getElementById('cvv')?.value.trim() || '',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        totalAmount: getCartTotal()
    };

    // Disable button during processing
    const processBtn = document.getElementById('processPaymentBtn');
    if (!processBtn) {
        alert('Payment button not found!');
        return;
    }
    const originalText = processBtn.textContent;
    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';

    try {
        // Try to save to backend
        const result = await postApi('/api/payments', paymentData);
        
        // Reload medicines to update stock
        await loadMedicines();
        renderMedicines(medicines);
        
        // Different messages for different payment methods
        const isCashOnDelivery = paymentData.paymentMethod === 'cash_on_delivery';
        const successMessage = isCashOnDelivery 
            ? `Order placed successfully! Transaction ID: ${result.item?.transactionId || 'N/A'}\n\nYou will pay cash when the order is delivered.\nYour order will be delivered soon.`
            : `Payment successful! Transaction ID: ${result.item?.transactionId || 'N/A'}\nYour order will be delivered soon.`;
        
        alert(successMessage);
        
        // Clear cart
        cart = [];
        lsSet('medicine_cart', cart);
        updateCartCount();

        // Close modal and reset form
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
        form.reset();
        document.getElementById('cardDetails').style.display = 'none';
        if (processBtn) {
            processBtn.textContent = 'Pay Now';
        }
    } catch (e) {
        console.error('Payment processing error:', e);
        // Fallback to localStorage
        const paymentDataWithMeta = {
            ...paymentData,
            date: new Date().toISOString(),
            status: paymentData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
            transactionId: 'TXN' + Date.now()
        };
        const payments = lsGet('payments', []);
        payments.push(paymentDataWithMeta);
        lsSet('payments', payments);
        
        const isCashOnDelivery = paymentData.paymentMethod === 'cash_on_delivery';
        const successMessage = isCashOnDelivery 
            ? `Order placed successfully! Transaction ID: ${paymentDataWithMeta.transactionId}\n\nYou will pay cash when the order is delivered.\nYour order will be delivered soon.`
            : `Payment successful! Transaction ID: ${paymentDataWithMeta.transactionId}\nYour order will be delivered soon.`;
        
        alert(successMessage);
        
        // Clear cart
        cart = [];
        lsSet('medicine_cart', cart);
        updateCartCount();

        // Close modal and reset form
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
        form.reset();
        document.getElementById('cardDetails').style.display = 'none';
        if (processBtn) {
            processBtn.textContent = 'Pay Now';
        }
    } finally {
        if (processBtn) {
            processBtn.disabled = false;
            processBtn.textContent = originalText;
        }
    }
}

// Initialize medicine store when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMedicineStore();
        // Initialize chatbot welcome message
        if (chatMessages && chatMessages.children.length <= 1) {
            setTimeout(() => {
                addMessage(botResponses.greetings[0], false);
            }, 500);
        }
    });
} else {
    initMedicineStore();
    // Initialize chatbot welcome message
    if (chatMessages && chatMessages.children.length <= 1) {
        setTimeout(() => {
            addMessage(botResponses.greetings[0], false);
        }, 500);
    }
}