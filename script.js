document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. SET CURRENT YEAR IN FOOTER
    ========================================= */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* =========================================
       2. STICKY HEADER & ACTIVE LINKS ON SCROLL
    ========================================= */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* =========================================
       3. MOBILE MENU TOGGLE
    ========================================= */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const mobileIcon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            mobileIcon.classList.replace('ph-list', 'ph-x');
        } else {
            mobileIcon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileIcon.classList.replace('ph-x', 'ph-list');
        });
    });

    /* =========================================
       4. PORTFOLIO FILTERING
    ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                } else if (!item.getAttribute('data-category').includes(filterValue)) {
                    item.classList.add('hide');
                } else {
                    item.classList.remove('hide');
                }
            });
        });
    });

    /* =========================================
       5. CONTACT FORM VALIDATION
    ========================================= */
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput);
                isValid = false;
            } else {
                hideError(nameInput);
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput);
                isValid = false;
            } else {
                hideError(emailInput);
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                showError(messageInput);
                isValid = false;
            } else {
                hideError(messageInput);
            }

            // If form is valid
            if (isValid) {
                // IMPORTANTE: Debemos reemplazar esta URL con la que Google Apps Script te genere
                const scriptURL = 'https://script.google.com/macros/s/AKfycbw2UMkmoP8X7lA2anY3fRBQldpL83VPzqHZsGe7FP8AeolIBIMzRkxDluDilkKlfQXa/exec';

                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Enviando... <i class="ph ph-spinner ph-spin"></i>';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';

                const formData = new FormData(form);

                // Solicitud POST al Web App de Google (agregamos 'mode: no-cors' para evitar errores de CORS)
                fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
                    .then(response => {
                        form.reset();
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.pointerEvents = 'all';

                        successMessage.style.display = 'block';
                        successMessage.style.backgroundColor = 'rgba(46, 213, 115, 0.1)';
                        successMessage.style.color = '#2ed573';
                        successMessage.innerText = '¡Mensaje enviado con éxito! Nos comunicaremos pronto.';

                        // Ocultar el mensaje después de 5 segundos
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 5000);
                    })
                    .catch(error => {
                        console.error('Error al enviar:', error.message);
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.pointerEvents = 'all';

                        successMessage.style.display = 'block';
                        successMessage.style.backgroundColor = 'rgba(255, 94, 94, 0.1)';
                        successMessage.style.color = '#FF5E5E';
                        successMessage.innerText = 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.';

                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 5000);
                    });
            }
        });
    }

    function showError(inputElement) {
        inputElement.style.borderColor = '#FF5E5E';
        const errorMsg = inputElement.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-msg')) {
            errorMsg.style.display = 'block';
        }
    }

    function hideError(inputElement) {
        inputElement.style.borderColor = 'rgba(255,255,255,0.1)';
        const errorMsg = inputElement.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-msg')) {
            errorMsg.style.display = 'none';
        }
    }

    /* =========================================
       6. VIRTUAL ASSISTANT CHAT
    ========================================= */
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggleBtn && chatWindow) {
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // Añadir mensaje del usuario
            addMessage(userText, 'user-message');
            chatInput.value = '';

            // Lógica de respuesta automática (simulando que está escribiendo)
            setTimeout(() => {
                const responseText = getBotResponse(userText.toLowerCase());
                addMessage(responseText, 'bot-message');
            }, 600);
        });

        function addMessage(text, className) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${className}`;
            const p = document.createElement('p');
            p.textContent = text;
            msgDiv.appendChild(p);
            chatMessages.appendChild(msgDiv);

            // Hacer scroll hasta el fondo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function getBotResponse(input) {
            if (input.includes('hola') || input.includes('buenos dias') || input.includes('buenas tardes')) {
                return "¡Hola! 👋 Somos IMAR, ¿en qué podemos ayudarte?";
            }
            if (input.includes('servicio') || input.includes('servicios') || input.includes('ofrecen')) {
                return "Ofrecemos manejo de redes sociales, branding y creación de contenido.";
            }
            if (input.includes('precio') || input.includes('costo') || input.includes('cotizacion')) {
                return "Nuestros precios se adaptan a cada proyecto. Puedes dejarnos tus datos en el formulario y te contactamos.";
            }
            if (input.includes('tiempo') || input.includes('tardan') || input.includes('duracion')) {
                return "Los tiempos dependen del tipo de proyecto, pero siempre trabajamos con planificación estratégica.";
            }

            return "Gracias por tu mensaje. Puedes dejarnos tus datos en el formulario de contacto y te responderemos pronto.";
        }
    }

    /* =========================================
       7. INTERACTIVE QUIZ
    ========================================= */
    const quizModal = document.getElementById('quiz-interactivo');
    const openQuizBtn = document.getElementById('open-quiz-btn');
    const closeQuizBtn = document.getElementById('close-quiz-btn');

    if (quizModal && openQuizBtn && closeQuizBtn) {
        // Open/Close modal logic
        openQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quizModal.classList.add('open');
        });

        closeQuizBtn.addEventListener('click', () => {
            quizModal.classList.remove('open');
        });

        // Optional: close when clicking on overlay background
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                quizModal.classList.remove('open');
            }
        });
    }

    const quizSteps = document.querySelectorAll('.quiz-step:not(.result-step)');
    const resultStep = document.getElementById('quiz-result-container');
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const quizActions = document.getElementById('quiz-actions');
    const restartBtn = document.getElementById('quiz-restart-btn');
    
    let currentStep = 0;
    const totalSteps = quizSteps.length;

    if (quizSteps.length > 0) {
        // Validation check when next is clicked
        nextBtn.addEventListener('click', () => {
            const currentActiveStep = quizSteps[currentStep];
            const checkedOption = currentActiveStep.querySelector('input[type="radio"]:checked');
            
            if (!checkedOption) {
                // If not selected, animate to bring attention
                currentActiveStep.style.transform = 'translateX(10px)';
                setTimeout(() => currentActiveStep.style.transform = 'translateX(-10px)', 100);
                setTimeout(() => currentActiveStep.style.transform = 'translateX(0)', 200);
                return;
            }

            // Move to next step or result
            currentActiveStep.classList.remove('active');
            currentStep++;

            if (currentStep < totalSteps) {
                quizSteps[currentStep].classList.add('active');
                prevBtn.disabled = false;
                
                if (currentStep === totalSteps - 1) {
                    nextBtn.textContent = 'Ver resultado';
                }
            } else {
                showQuizResult();
            }
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                quizSteps[currentStep].classList.remove('active');
                currentStep--;
                quizSteps[currentStep].classList.add('active');
                
                nextBtn.textContent = 'Siguiente';
                if (currentStep === 0) {
                    prevBtn.disabled = true;
                }
            }
        });

        // Restart button
        if(restartBtn) {
            restartBtn.addEventListener('click', () => {
                // reset selections
                const allRadios = document.querySelectorAll('.quiz-option input[type="radio"]');
                allRadios.forEach(radio => radio.checked = false);
                
                resultStep.classList.remove('active');
                quizActions.style.display = 'flex';
                
                currentStep = 0;
                quizSteps[0].classList.add('active');
                prevBtn.disabled = true;
                nextBtn.textContent = 'Siguiente';
            });
        }

        // Logic to calculate profile
        function showQuizResult() {
            quizActions.style.display = 'none';
            resultStep.classList.add('active');

            const q1 = document.querySelector('input[name="q1"]:checked') ? document.querySelector('input[name="q1"]:checked').value : 'nada';
            const q2 = document.querySelector('input[name="q2"]:checked') ? document.querySelector('input[name="q2"]:checked').value : 'nada';
            const q3 = document.querySelector('input[name="q3"]:checked') ? document.querySelector('input[name="q3"]:checked').value : 'nada';

            let score = 0;
            
            if (q1 === 'venta') score += 3;
            else if (q1 === 'solida') score += 2;
            else score += 1;

            if (q2 === 'constante') score += 3;
            else if (q2 === 'ocasional') score += 2;
            else score += 1;

            if (q3 === 'conversion') score += 3;
            else if (q3 === 'imagen') score += 2;
            else score += 1;

            const profileTitle = document.getElementById('quiz-result-profile');
            const profileText = document.getElementById('quiz-result-text');

            if (score <= 4) {
                profileTitle.textContent = "Marca en Crecimiento";
                profileText.textContent = "Necesitas fortalecer tu presencia digital con contenido constante y estrategia.";
            } else if (score <= 7) {
                profileTitle.textContent = "Marca Estratégica";
                profileText.textContent = "Tu marca ya tiene bases, ahora es momento de optimizar y escalar resultados.";
            } else {
                profileTitle.textContent = "Marca lista para escalar";
                profileText.textContent = "Tu enfoque debe estar en campañas, conversión y posicionamiento avanzado.";
            }
        }
    }
});
