// Events page functionality
class EventsManager {
    constructor() {
        this.currentDate = new Date();
        this.events = [
            {
                id: 'Loukáda',
                title: 'Loukáda,
                titleEn: 'Loukáda,
                date: new Date(2025, 10, 15), // October 15, 2025
                time: '10:00 - 16:00',
                description: 'Přijďte se podívat na naši Louky, poznat zvířata a dozvědět se více o našem způsobu života.',
                descriptionEn: 'Come visit our Meadow, meet the animals and learn more about our way of life.',
                capacity: 20,
                registered: 8
            },
            {
                id: 'workshop-pece',
                title: 'Workshop péče o zvířata',
                titleEn: 'Animal Care Workshop',
                date: new Date(2025, 2, 22), // March 22, 2025
                time: '14:00 - 17:00',
                description: 'Naučte se základy péče o hospodářská zvířata - krmení, ošetřování a každodenní rutina.',
                descriptionEn: 'Learn the basics of caring for farm animals - feeding, treatment and daily routine.',
                capacity: 15,
                registered: 10
            },
            {
                id: 'jarni-uklid',
                title: 'Jarní úklid Louky',
                titleEn: 'Spring Meadow Cleanup',
                date: new Date(2025, 3, 5), // April 5, 2025
                time: '9:00 - 15:00',
                description: 'Pomozte nám připravit Louky na jarní sezónu. Společný úklid, opravy a příprava pastvin.',
                descriptionEn: 'Help us prepare the Meadow for the spring season. Joint cleanup, repairs and pasture preparation.',
                capacity: 25,
                registered: 7
            },
            {
                id: 'velikonocni-slavnost',
                title: 'Velikonoční slavnost',
                titleEn: 'Easter Celebration',
                date: new Date(2025, 3, 20), // April 20, 2025
                time: '11:00 - 18:00',
                description: 'Tradiční velikonoční slavnost s ukázkami řemesel, domácími produkty a programem pro celou rodinu.',
                descriptionEn: 'Traditional Easter celebration with craft demonstrations, homemade products and programs for the whole family.',
                capacity: 50,
                registered: 15
            }
        ];
        
        this.monthNames = {
            cs: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 
                 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
            en: ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        };
        
        this.init();
    }
    
    init() {
        this.renderCalendar();
        this.bindEvents();
    }
    
    bindEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }
        
        // Registration form submission
        const form = document.getElementById('registration-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(e);
            });
        }
    }
    
    renderCalendar() {
        const currentMonthEl = document.getElementById('current-month');
        const calendarDaysEl = document.getElementById('calendar-days');
        
        if (!currentMonthEl || !calendarDaysEl) return;
        
        const currentLang = document.documentElement.lang || 'cs';
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month title
        currentMonthEl.textContent = `${this.monthNames[currentLang][month]} ${year}`;
        
        // Clear previous days
        calendarDaysEl.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get first day of week (Monday = 0)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;
        
        // Add empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            const prevMonthDay = new Date(year, month, -startDay + i + 1).getDate();
            dayEl.innerHTML = `<div class="calendar-day-number">${prevMonthDay}</div>`;
            calendarDaysEl.appendChild(dayEl);
        }
        
        // Add days of current month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            const currentDay = new Date(year, month, day);
            
            dayEl.className = 'calendar-day';
            
            // Check if it's today
            if (currentDay.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Check if there's an event on this day
            const hasEvent = this.events.some(event => 
                event.date.toDateString() === currentDay.toDateString()
            );
            
            if (hasEvent) {
                dayEl.classList.add('has-event');
            }
            
            dayEl.innerHTML = `<div class="calendar-day-number">${day}</div>`;
            
            // Add click handler for days with events
            if (hasEvent) {
                dayEl.style.cursor = 'pointer';
                dayEl.addEventListener('click', () => {
                    this.showDayEvents(currentDay);
                });
            }
            
            calendarDaysEl.appendChild(dayEl);
        }
        
        // Fill remaining cells
        const totalCells = calendarDaysEl.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.innerHTML = `<div class="calendar-day-number">${i}</div>`;
            calendarDaysEl.appendChild(dayEl);
        }
    }
    
    showDayEvents(date) {
        const dayEvents = this.events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
        
        if (dayEvents.length > 0) {
            const event = dayEvents[0]; // Show first event for simplicity
            this.openRegistrationModal(event.id);
        }
    }
    
    handleRegistration(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || !data.email || !data.terms) {
            this.showMessage('Prosím vyplňte všechna povinná pole.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Prosím zadejte platnou emailovou adresu.', 'error');
            return;
        }
        
        // Simulate registration process
        this.showMessage('Registrace probíhá...', 'info');
        
        setTimeout(() => {
            // Create email content
            const eventId = data['event-id'];
            const event = this.events.find(e => e.id === eventId);
            const currentLang = document.documentElement.lang || 'cs';
            
            const subject = encodeURIComponent(`Registrace na událost: ${event ? (currentLang === 'en' ? event.titleEn : event.title) : 'Neznámá událost'}`);
            const body = encodeURIComponent(`
Dobrý den,

chtěl(a) bych se registrovat na následující událost:

Událost: ${event ? (currentLang === 'en' ? event.titleEn : event.title) : 'Neznámá událost'}
Datum: ${event ? event.date.toLocaleDateString('cs-CZ') : 'Neznámé datum'}
Čas: ${event ? event.time : 'Neznámý čas'}

Kontaktní údaje:
Jméno: ${data.name}
Email: ${data.email}
Telefon: ${data.phone || 'Neuvedeno'}
Počet účastníků: ${data.participants || '1'}

Dietní omezení: ${data.dietary || 'Žádná'}

Zpráva: ${data.message || 'Žádná zpráva'}

Newsletter: ${data.newsletter ? 'Ano' : 'Ne'}

S pozdravem,
${data.name}
            `);
            
            // Open email client
            window.location.href = `mailto:info@nechmerust.org?subject=${subject}&body=${body}`;
            
            this.showMessage('Registrace byla odeslána! Otevřel se váš emailový klient.', 'success');
            
            // Close modal after a delay
            setTimeout(() => {
                this.closeRegistrationModal();
            }, 2000);
            
        }, 1000);
    }
    
    showMessage(message, type) {
        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) return;
        
        // Remove existing messages
        const existingMessages = modalBody.querySelectorAll('.success-message, .error-message, .info-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `${type}-message`;
        messageEl.textContent = message;
        
        // Insert at the beginning of modal body
        modalBody.insertBefore(messageEl, modalBody.firstChild);
        
        // Auto-remove after 5 seconds for non-success messages
        if (type !== 'success') {
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    }
    
    openRegistrationModal(eventId) {
        const modal = document.getElementById('registration-modal');
        const eventIdInput = document.getElementById('event-id');
        const modalTitle = document.getElementById('modal-title');
        
        if (!modal || !eventIdInput) return;
        
        const event = this.events.find(e => e.id === eventId);
        const currentLang = document.documentElement.lang || 'cs';
        
        if (event && modalTitle) {
            const eventTitle = currentLang === 'en' ? event.titleEn : event.title;
            modalTitle.textContent = `${modalTitle.getAttribute('data-' + currentLang)} - ${eventTitle}`;
        }
        
        eventIdInput.value = eventId;
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // Focus on first input
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    closeRegistrationModal() {
        const modal = document.getElementById('registration-modal');
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Reset form
        const form = document.getElementById('registration-form');
        if (form) {
            form.reset();
        }
        
        // Remove messages
        const messages = modal.querySelectorAll('.success-message, .error-message, .info-message');
        messages.forEach(msg => msg.remove());
    }
}

// Global functions for modal control
function openRegistrationModal(eventId) {
    if (window.eventsManager) {
        window.eventsManager.openRegistrationModal(eventId);
    }
}

function closeRegistrationModal() {
    if (window.eventsManager) {
        window.eventsManager.closeRegistrationModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on events page
    if (document.getElementById('calendar-days')) {
        window.eventsManager = new EventsManager();
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('registration-modal');
        if (e.target === modal) {
            closeRegistrationModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeRegistrationModal();
        }
    });
});

// Google Calendar Integration (placeholder for real implementation)
class GoogleCalendarIntegration {
    constructor(calendarId) {
        this.calendarId = calendarId;
        this.apiKey = 'YOUR_GOOGLE_CALENDAR_API_KEY'; // Replace with actual API key
    }
    
    async loadEvents() {
        // In a real implementation, this would fetch from Google Calendar API
        // For now, we'll use the static events from EventsManager
        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?key=${this.apiKey}&timeMin=${new Date().toISOString()}&maxResults=10&singleEvents=true&orderBy=startTime`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.items || [];
            }
        } catch (error) {
            console.log('Google Calendar API not configured, using static events');
        }
        
        return [];
    }
    
    async syncEvents() {
        const events = await this.loadEvents();
        
        if (events.length > 0 && window.eventsManager) {
            // Update events manager with real Google Calendar events
            window.eventsManager.events = events.map(event => ({
                id: event.id,
                title: event.summary,
                titleEn: event.summary, // Would need translation
                date: new Date(event.start.dateTime || event.start.date),
                time: event.start.dateTime ? 
                    `${new Date(event.start.dateTime).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})} - ${new Date(event.end.dateTime).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})}` :
                    'Celý den',
                description: event.description || '',
                descriptionEn: event.description || '',
                capacity: 20, // Default capacity
                registered: 0 // Would need to track separately
            }));
            
            window.eventsManager.renderCalendar();
        }
    }
}

// Initialize Google Calendar integration (commented out until API key is provided)
// document.addEventListener('DOMContentLoaded', () => {
//     const googleCalendar = new GoogleCalendarIntegration('your-calendar-id@group.calendar.google.com');
//     googleCalendar.syncEvents();
// });

