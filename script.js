function initMRAlquileres() {
    // Efecto de Header al hacer scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // ScrollSpy: Resaltar menú según la sección activa (Solo en páginas con secciones internas)
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('nav a');

    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 220)) {
                    current = section.getAttribute('id');
                }
            });

            if (current) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    if (href.startsWith('#') || href.includes('#')) {
                        link.classList.remove('active');
                        if (href === `#${current}` || href.endsWith(`#${current}`)) {
                            link.classList.add('active');
                        }
                    }
                });
            }
        });
    }

    // Intersection Observer para las animaciones reveal
    const observerOptions = {
        threshold: 0.1, // Esperar un poco más para que el efecto se vea completo
        rootMargin: "0px 0px -50px 0px" // Disparar la animación un poco antes de llegar al borde
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => observer.observe(el));

    // Lógica para el Infinite Loop Scroll (Carrusel)
    const scrollers = document.querySelectorAll('.scroller');

    // Comprobar si el usuario tiene activado "reducir movimiento" en su sistema
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // Añadir atributo para indicar que está animado
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector(".scroller-inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // Clonar cada elemento y añadirlo al final para crear el bucle
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

    // Registro del Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('ServiceWorker registrado con éxito:', registration.scope))
                .catch(err => console.log('Fallo el registro del ServiceWorker:', err));
        });
    }

    // --- DATOS DEL CATÁLOGO DINÁMICO ---
    const catalogData = [
        {
            id: 'p1', category: 'sillas', name: 'Sillas Plásticas', 
            desc: 'Económicas y resistentes para cualquier tipo de evento.', price: 0.50, img: 'img/sillas-plasticas.jpg', wspMsg: 'Hola, me interesan las Sillas Plásticas', featured: true
        },
        {
            id: 'p2', category: 'sillas', name: 'Sillas Plegables', 
            desc: 'Prácticas, cómodas y fáciles de acomodar.', price: 1.00, img: 'img/sillas-plegables.jpg', wspMsg: 'Hola, me interesan las Sillas Plegables', featured: true
        },
        {
            id: 'p3', category: 'mesas', name: 'Mesas Cuadradas', 
            desc: 'Perfectas para 4 personas y reuniones familiares.', price: 3.00, img: 'img/mesas-cuadradas.jpg', wspMsg: 'Hola, me interesan las Mesas Cuadradas', featured: false
        },
        {
            id: 'p4', category: 'mesas', name: 'Mesas Rectangulares 6"', 
            desc: 'Amplias y elegantes para banquetes de 6 personas.', price: 6.00, img: 'img/mesas-rectangular.jpg', wspMsg: 'Hola, me interesan las Mesas Rectangulares', featured: true
        },
        {
            id: 'p5', category: 'manteles', name: 'Manteles de Colores', 
            desc: 'Variedad de colores para vestir tus mesas cuadradas.', price: 1.50, img: 'img/manteles.jpg', wspMsg: 'Hola, me interesan los Manteles', featured: false
        },
        {
            id: 'p6', category: 'toldas', name: 'Tolda 3x6 metros', 
            desc: 'Estructura resistente para fiestas y exteriores.', price: 40.00, img: 'img/tolda-3x6.jpg', wspMsg: 'Hola, me interesa la Tolda 3x6 metros', featured: true
        },
        {
            id: 'p7', category: 'toldas', name: 'Tolda Premium 6x6 metros', 
            desc: 'Pico elevado que brinda mayor frescura y elegancia.', price: 200.00, img: 'img/tolda-6x6metros.jpg', wspMsg: 'Hola, me interesa la Tolda Premium', featured: false
        },
        {
            id: 'p8', category: 'catering', name: 'Chafing Dish Rectangular (Sin Calentador)', 
            desc: 'Bufetera de acero inoxidable para mantener la comida caliente.', price: 12.00, img: 'img/chafing dish.png', wspMsg: 'Hola, me interesa el Chafing Dish Rectangular', featured: false
        },
        {
            id: 'p9', category: 'catering', name: 'Calentador (Sterno)', 
            desc: 'Lata de gel combustible para bufeteras y chafing dishes.', price: 2.50, img: 'img/calentador sterno.png', wspMsg: 'Hola, me interesa el Calentador Sterno', featured: false
        }
    ];

    const listaProductos = document.getElementById('lista-productos');
    const inputBuscar = document.getElementById('input-buscar-catalogo');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const contadorProductos = document.getElementById('contador-productos');
    const btnFiltros = document.querySelectorAll('.btn-filtro');

    // Carrito con persistencia en localStorage
    let carrito = [];
    try {
        const storedCart = localStorage.getItem('mr_carrito');
        if (storedCart) {
            carrito = JSON.parse(storedCart);
        }
    } catch (e) {
        carrito = [];
    }

    const carritoCount = document.getElementById('carrito-count');

    function renderCatalog(customList) {
        if (!listaProductos) return;
        listaProductos.innerHTML = '';

        const isFeaturedMode = listaProductos.getAttribute('data-mode') === 'featured';
        let itemsToRender = customList || (isFeaturedMode ? catalogData.filter(p => p.featured) : catalogData);

        if (itemsToRender.length === 0) {
            listaProductos.innerHTML = `
                <div class="catalogo-sin-resultados">
                    <i class="fa-solid fa-box-open"></i>
                    <h4>No encontramos productos con ese término</h4>
                    <p>Intenta con otra palabra clave como "silla", "mesa", "tolda" o "chafing".</p>
                </div>
            `;
            return;
        }

        itemsToRender.forEach((prod, index) => {
            const delay = (index % 6 + 1) * 0.1;

            const card = document.createElement('div');
            card.className = `tarjeta reveal producto-item`;
            card.setAttribute('data-category', prod.category);
            card.style.transitionDelay = `${delay}s`;

            card.innerHTML = `
                <img src="${prod.img}" alt="${prod.name.replace(/"/g, '&quot;')}" class="foto-producto" loading="lazy" width="280" height="220">
                <h4>${prod.name}</h4>
                <p style="color: #ccc;">${prod.desc}</p>
                <span class="precio">$${prod.price.toFixed(2)} / unidad</span>

                <div class="acciones-producto">
                    <div class="selector-cantidad">
                        <button type="button" class="btn-qty btn-restar" aria-label="Restar">-</button>
                        <input type="number" class="input-qty" value="1" min="1" max="500" aria-label="Cantidad">
                        <button type="button" class="btn-qty btn-sumar" aria-label="Sumar">+</button>
                    </div>
                    <button class="btn-wsp btn-add-cart" data-id="${prod.id}" data-name="${prod.name.replace(/"/g, '&quot;')}" data-price="${prod.price}">
                        <i class="fa-solid fa-cart-plus"></i> Añadir
                    </button>
                    <a href="https://wa.me/50761130277?text=${encodeURIComponent(prod.wspMsg)}" class="btn-wsp-directo" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i> Consulta Directa
                    </a>
                </div>
            `;
            listaProductos.appendChild(card);
        });

        attachProductEventListeners();

        // Re-init reveal animations
        const newElements = document.querySelectorAll('#lista-productos .reveal');
        newElements.forEach(el => observer.observe(el));
    }

    function filtrarCatalogo() {
        if (!listaProductos || listaProductos.getAttribute('data-mode') === 'featured') return;

        const currentActiveBtn = document.querySelector('.btn-filtro.active');
        const activeCategory = currentActiveBtn ? currentActiveBtn.getAttribute('data-filter') : 'todos';
        const searchTerm = inputBuscar ? inputBuscar.value.trim().toLowerCase() : '';

        if (btnClearSearch) {
            btnClearSearch.style.display = searchTerm ? 'block' : 'none';
        }

        const filtered = catalogData.filter(prod => {
            const matchesCategory = activeCategory === 'todos' || prod.category === activeCategory;
            const matchesSearch = !searchTerm || 
                prod.name.toLowerCase().includes(searchTerm) || 
                prod.desc.toLowerCase().includes(searchTerm) ||
                prod.category.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        renderCatalog(filtered);

        if (contadorProductos) {
            contadorProductos.textContent = `Mostrando ${filtered.length} de ${catalogData.length} productos`;
        }
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('input', filtrarCatalogo);
    }
    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            inputBuscar.value = '';
            filtrarCatalogo();
            inputBuscar.focus();
        });
    }

    btnFiltros.forEach(btn => {
        btn.addEventListener('click', () => {
            btnFiltros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarCatalogo();
        });
    });

    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Trigger reflow to ensure animation runs
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for transition
        }, 3000);
    }

    function attachProductEventListeners() {
        const btnSumar = document.querySelectorAll('.btn-sumar');
        const btnRestar = document.querySelectorAll('.btn-restar');
        const btnAddCart = document.querySelectorAll('.btn-add-cart');

        btnSumar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('.input-qty');
                input.value = parseInt(input.value) + 1;
            });
        });

        btnRestar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('.input-qty');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        });

        btnAddCart.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                const qtyInput = btn.parentElement.querySelector('.input-qty');
                const quantity = parseInt(qtyInput.value);

                const existingItem = carrito.find(item => item.id === id);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    carrito.push({ id, name, price, quantity });
                }

                qtyInput.value = 1;
                actualizarCarritoUI();

                showToast(`<b>${name}</b> añadida a la cotización`);

                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
                btn.style.backgroundColor = '#25D366';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 1500);
            });
        });
    }

    // Modal UI y elementos del carrito
    const modalCarrito = document.getElementById('modal-carrito');
    const btnCarritoFlotante = document.getElementById('btn-carrito-flotante');
    const closeModal = document.getElementById('close-modal');
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalPrecio = document.getElementById('carrito-total-precio');
    const btnEnviarWsp = document.getElementById('btn-enviar-wsp');

    if (btnCarritoFlotante && modalCarrito) {
        btnCarritoFlotante.addEventListener('click', () => {
            modalCarrito.classList.add('show');
        });
    }

    if (closeModal && modalCarrito) {
        closeModal.addEventListener('click', () => {
            modalCarrito.classList.remove('show');
        });
    }

    // Cerrar al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modalCarrito) {
            modalCarrito.classList.remove('show');
        }
    });

    renderCatalog();
    actualizarCarritoUI();

    function actualizarCarritoUI() {
        try {
            localStorage.setItem('mr_carrito', JSON.stringify(carrito));
        } catch (e) {}

        // Actualizar contador badge
        const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
        if (carritoCount) {
            carritoCount.textContent = totalItems;
        }

        if (!carritoItemsContainer || !carritoTotalPrecio) return;

        if (carrito.length === 0) {
            carritoItemsContainer.innerHTML = '<p class="carrito-vacio">No has añadido productos aún.</p>';
            carritoTotalPrecio.textContent = '$0.00';
            if (btnEnviarWsp) btnEnviarWsp.disabled = true;
            return;
        }

        if (btnEnviarWsp) btnEnviarWsp.disabled = false;
        carritoItemsContainer.innerHTML = '';
        let totalPrecio = 0;

        carrito.forEach((item, index) => {
            const subtotalItem = item.price * item.quantity;
            totalPrecio += subtotalItem;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrito-item';
            itemDiv.innerHTML = `
                <div class="carrito-item-info">
                    <div class="carrito-item-title">${item.name}</div>
                    <div class="carrito-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${subtotalItem.toFixed(2)}</div>
                </div>
                <div class="carrito-item-actions">
                    <button class="btn-remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            carritoItemsContainer.appendChild(itemDiv);
        });

        carritoTotalPrecio.textContent = '$' + totalPrecio.toFixed(2);

        // Añadir listeners a los botones de borrar
        const btnRemove = document.querySelectorAll('.btn-remove-item');
        btnRemove.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = btn.closest('.btn-remove-item').getAttribute('data-index');
                carrito.splice(index, 1);
                actualizarCarritoUI();
            });
        });
    }

    // Enviar a WhatsApp
    if (btnEnviarWsp) {
        btnEnviarWsp.addEventListener('click', () => {
            if (carrito.length === 0) return;

            let mensaje = "Hola MR Alquileres, deseo solicitar la siguiente cotización:%0A%0A";
            let total = 0;

            carrito.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                mensaje += `- ${item.quantity}x ${item.name} ($${subtotal.toFixed(2)})%0A`;
            });

            mensaje += `%0A*Subtotal (Solo Mobiliario): $${total.toFixed(2)}*%0A`;
            mensaje += `_Nota: Pendiente calcular costo de transporte y depósito de garantía._%0A%0A`;
            mensaje += `Quedo atento a la disponibilidad, gracias.`;

            const url = `https://wa.me/50761130277?text=${mensaje}`;
            window.open(url, '_blank');
        });
    }

    // --- LÓGICA DE PREGUNTAS FRECUENTES (FAQ) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                // Cerrar todos los demás
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Alternar el actual
                item.classList.toggle('active');
            });
        }
    });

    // --- LÓGICA DE LIGHTBOX PARA LA GALERÍA ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galeriaItems = Array.from(document.querySelectorAll('.galeria-img'));
    let currentImageIndex = 0;

    function updateLightboxImage(index) {
        if (!lightboxImg || galeriaItems.length === 0) return;
        if (index < 0) {
            currentImageIndex = galeriaItems.length - 1;
        } else if (index >= galeriaItems.length) {
            currentImageIndex = 0;
        } else {
            currentImageIndex = index;
        }
        lightboxImg.src = galeriaItems[currentImageIndex].src;
    }

    if (lightbox && lightboxImg) {
        galeriaItems.forEach((img, index) => {
            if (img.parentElement) {
                img.parentElement.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateLightboxImage(currentImageIndex);
                    lightbox.classList.add('show');
                });
            }
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('show');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => {
                updateLightboxImage(currentImageIndex - 1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => {
                updateLightboxImage(currentImageIndex + 1);
            });
        }

        // Soporte para teclado (Flechas y Escape)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'ArrowLeft') {
                updateLightboxImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateLightboxImage(currentImageIndex + 1);
            } else if (e.key === 'Escape') {
                lightbox.classList.remove('show');
            }
        });
    }

    // --- ENVÍO DEL FORMULARIO DE CONTACTO VÍA AJAX (Sin salir de la página) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const btnSubmit = contactForm ? contactForm.querySelector('.btn-submit') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
            }
            if (formStatus) {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formsubmit.co/ajax/mralquileres29@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = '¡Tu solicitud fue enviada con éxito! Te responderemos muy pronto.';
                        formStatus.className = 'form-status success';
                        formStatus.style.display = 'block';
                    }
                    showToast('¡Solicitud de cotización enviada!');
                    contactForm.reset();
                } else {
                    throw new Error('Error en el envío');
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = 'Hubo un inconveniente al enviar el formulario. Por favor contáctanos por WhatsApp.';
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                }
                showToast('Error al enviar el formulario');
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = 'Enviar Solicitud <i class="fa-regular fa-paper-plane"></i>';
                }
            }
        });
    }

    // --- LÓGICA DE LA CALCULADORA DE EVENTOS ---
    const rangeInvitados = document.getElementById('calc-range-invitados');
    const badgePersonas = document.getElementById('calc-badge-personas');
    const btnPresets = document.querySelectorAll('.btn-preset');
    const radioCards = document.querySelectorAll('.calc-radio-card');
    const checkManteles = document.getElementById('calc-check-manteles');
    const cardManteles = document.getElementById('calc-card-manteles');
    const mantelesSubtext = document.getElementById('calc-manteles-subtext');
    const checkToldas = document.getElementById('calc-check-toldas');
    const calcItemsList = document.getElementById('calc-items-list');
    const calcTotalPrecio = document.getElementById('calc-total-precio');
    const btnCalcAddCart = document.getElementById('btn-calc-add-cart');
    const btnCalcWsp = document.getElementById('btn-calc-wsp');

    let paqueteActual = [];

    function recalcularEvento() {
        const range = document.getElementById('calc-range-invitados');
        if (!range) return;

        const numInvitados = parseInt(range.value) || 50;
        const badge = document.getElementById('calc-badge-personas');
        if (badge) {
            badge.textContent = `${numInvitados} invitados`;
        }

        // 1. Sillas
        const sillaChecked = document.querySelector('input[name="calc-silla"]:checked');
        const sillaId = sillaChecked ? sillaChecked.value : 'p1';
        const sillaInfo = catalogData.find(p => p.id === sillaId) || { id: 'p1', name: 'Sillas Plásticas', price: 0.50 };
        const cantSillas = numInvitados;
        const subtotalSillas = cantSillas * sillaInfo.price;

        // 2. Mesas
        const mesaChecked = document.querySelector('input[name="calc-mesa"]:checked');
        const mesaId = mesaChecked ? mesaChecked.value : 'p4';
        const mesaInfo = catalogData.find(p => p.id === mesaId) || { id: 'p4', name: 'Mesas Rectangulares 6"', price: 6.00 };
        // Rectangulares (p4) caben 6 personas, Cuadradas (p3) caben 4 personas
        const capacidadMesa = mesaId === 'p4' ? 6 : 4;
        const cantMesas = Math.ceil(numInvitados / capacidadMesa);
        const subtotalMesas = cantMesas * mesaInfo.price;

        paqueteActual = [
            {
                id: sillaInfo.id,
                name: sillaInfo.name,
                price: sillaInfo.price,
                quantity: cantSillas,
                subtotal: subtotalSillas,
                icon: 'fa-chair'
            },
            {
                id: mesaInfo.id,
                name: mesaInfo.name,
                price: mesaInfo.price,
                quantity: cantMesas,
                subtotal: subtotalMesas,
                icon: 'fa-table'
            }
        ];

        // 3. Manteles (Solo para mesas cuadradas p3)
        const checkM = document.getElementById('calc-check-manteles');
        const cardM = document.getElementById('calc-card-manteles');
        const textM = document.getElementById('calc-manteles-subtext');

        if (mesaId === 'p4') {
            // Mesas rectangulares: deshabilitar manteles
            if (checkM) {
                checkM.disabled = true;
                checkM.checked = false;
            }
            if (cardM) {
                cardM.style.opacity = '0.45';
                cardM.style.pointerEvents = 'none';
                cardM.classList.remove('active');
            }
            if (textM) {
                textM.textContent = 'No disponible para mesas rectangulares';
            }
        } else {
            // Mesas cuadradas: habilitar manteles
            if (checkM) {
                checkM.disabled = false;
            }
            if (cardM) {
                cardM.style.opacity = '1';
                cardM.style.pointerEvents = 'auto';
                if (checkM && checkM.checked) {
                    cardM.classList.add('active');
                } else {
                    cardM.classList.remove('active');
                }
            }
            if (textM) {
                textM.textContent = 'Variedad de colores ($1.50 c/u)';
            }

            if (checkM && checkM.checked) {
                const mantelInfo = catalogData.find(p => p.id === 'p5') || { id: 'p5', name: 'Manteles de Colores', price: 1.50 };
                const cantManteles = cantMesas;
                const subtotalManteles = cantManteles * mantelInfo.price;
                paqueteActual.push({
                    id: mantelInfo.id,
                    name: mantelInfo.name,
                    price: mantelInfo.price,
                    quantity: cantManteles,
                    subtotal: subtotalManteles,
                    icon: 'fa-rug'
                });
            }
        }

        // 4. Toldas
        const checkT = document.getElementById('calc-check-toldas');
        if (checkT) {
            const cardT = checkT.closest('.calc-checkbox-card');
            if (cardT) {
                cardT.classList.toggle('active', checkT.checked);
            }
            if (checkT.checked) {
                if (numInvitados <= 35) {
                    const toldaInfo = catalogData.find(p => p.id === 'p6') || { id: 'p6', name: 'Tolda 3x6 metros', price: 40.00 };
                    paqueteActual.push({
                        id: toldaInfo.id,
                        name: toldaInfo.name,
                        price: toldaInfo.price,
                        quantity: 1,
                        subtotal: toldaInfo.price * 1,
                        icon: 'fa-campground'
                    });
                } else if (numInvitados <= 70) {
                    const toldaInfo = catalogData.find(p => p.id === 'p6') || { id: 'p6', name: 'Tolda 3x6 metros', price: 40.00 };
                    paqueteActual.push({
                        id: toldaInfo.id,
                        name: toldaInfo.name,
                        price: toldaInfo.price,
                        quantity: 2,
                        subtotal: toldaInfo.price * 2,
                        icon: 'fa-campground'
                    });
                } else {
                    const toldaInfo = catalogData.find(p => p.id === 'p7') || { id: 'p7', name: 'Tolda Premium 6x6 metros', price: 200.00 };
                    const cantToldasGrandes = Math.max(1, Math.ceil(numInvitados / 60));
                    paqueteActual.push({
                        id: toldaInfo.id,
                        name: toldaInfo.name,
                        price: toldaInfo.price,
                        quantity: cantToldasGrandes,
                        subtotal: toldaInfo.price * cantToldasGrandes,
                        icon: 'fa-campground'
                    });
                }
            }
        }

        // Renderizar lista de items recomendados
        const itemsList = document.getElementById('calc-items-list');
        const totalPrecioElem = document.getElementById('calc-total-precio');

        if (itemsList) {
            itemsList.innerHTML = '';
            let totalEstimado = 0;

            paqueteActual.forEach(item => {
                totalEstimado += item.subtotal;
                const row = document.createElement('div');
                row.className = 'calc-item-row';
                row.innerHTML = `
                    <div class="calc-item-left">
                        <i class="fa-solid ${item.icon}"></i>
                        <span><strong>${item.quantity}x</strong> ${item.name}</span>
                    </div>
                    <span class="calc-item-price">$${item.subtotal.toFixed(2)}</span>
                `;
                itemsList.appendChild(row);
            });

            if (totalPrecioElem) {
                totalPrecioElem.textContent = `$${totalEstimado.toFixed(2)}`;
            }
        }
    }

    function selectSilla(id) {
        document.querySelectorAll('input[name="calc-silla"]').forEach(input => {
            const isMatch = input.value === id;
            input.checked = isMatch;
            const parent = input.closest('.calc-radio-card');
            if (parent) parent.classList.toggle('active', isMatch);
        });
        recalcularEvento();
    }

    function selectMesa(id) {
        document.querySelectorAll('input[name="calc-mesa"]').forEach(input => {
            const isMatch = input.value === id;
            input.checked = isMatch;
            const parent = input.closest('.calc-radio-card');
            if (parent) parent.classList.toggle('active', isMatch);
        });
        recalcularEvento();
    }

    function setNumeroInvitados(val) {
        const num = parseInt(val) || 50;
        const range = document.getElementById('calc-range-invitados');
        const badge = document.getElementById('calc-badge-personas');
        const presets = document.querySelectorAll('.btn-preset');

        if (range) {
            range.value = num;
        }
        if (badge) {
            badge.textContent = `${num} invitados`;
        }
        presets.forEach(b => {
            if (parseInt(b.getAttribute('data-val')) === num) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
        recalcularEvento();
    }

    // Exponer funciones en window para invocación directa desde HTML
    window.setNumeroInvitados = setNumeroInvitados;
    window.recalcularEvento = recalcularEvento;
    window.selectSilla = selectSilla;
    window.selectMesa = selectMesa;

    if (rangeInvitados) {
        rangeInvitados.addEventListener('input', (e) => {
            setNumeroInvitados(e.target.value);
        });
        rangeInvitados.addEventListener('change', (e) => {
            setNumeroInvitados(e.target.value);
        });

        btnPresets.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = btn.getAttribute('data-val');
                setNumeroInvitados(val);
            });
        });

        // Eventos para radio cards (Sillas y Mesas)
        radioCards.forEach(card => {
            card.addEventListener('click', () => {
                const input = card.querySelector('input[type="radio"]');
                if (input) {
                    if (input.name === 'calc-silla') {
                        selectSilla(input.value);
                    } else if (input.name === 'calc-mesa') {
                        selectMesa(input.value);
                    }
                }
            });
        });

        if (checkManteles) {
            checkManteles.addEventListener('change', () => {
                if (cardManteles) cardManteles.classList.toggle('active', checkManteles.checked && !checkManteles.disabled);
                recalcularEvento();
            });
        }
        if (cardManteles) {
            cardManteles.addEventListener('click', (e) => {
                if (e.target !== checkManteles && checkManteles && !checkManteles.disabled) {
                    checkManteles.checked = !checkManteles.checked;
                    cardManteles.classList.toggle('active', checkManteles.checked);
                    recalcularEvento();
                }
            });
        }

        if (checkToldas) {
            checkToldas.addEventListener('change', () => {
                const cardToldas = checkToldas.closest('.calc-checkbox-card');
                if (cardToldas) cardToldas.classList.toggle('active', checkToldas.checked);
                recalcularEvento();
            });
            const cardToldas = checkToldas.closest('.calc-checkbox-card');
            if (cardToldas) {
                cardToldas.addEventListener('click', (e) => {
                    if (e.target !== checkToldas) {
                        checkToldas.checked = !checkToldas.checked;
                        cardToldas.classList.toggle('active', checkToldas.checked);
                        recalcularEvento();
                    }
                });
            }
        }

        // Añadir paquete calculado al carrito
        if (btnCalcAddCart) {
            btnCalcAddCart.addEventListener('click', () => {
                paqueteActual.forEach(item => {
                    const existingItem = carrito.find(c => c.id === item.id);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        carrito.push({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        });
                    }
                });

                actualizarCarritoUI();
                showToast(`¡Paquete para ${rangeInvitados.value} invitados añadido al carrito!`);
                
                // Abrir el carrito para ver el resultado
                if (modalCarrito) {
                    modalCarrito.classList.add('show');
                }
            });
        }

        // Enviar paquete calculado directo a WhatsApp
        if (btnCalcWsp) {
            btnCalcWsp.addEventListener('click', () => {
                const numInvitados = rangeInvitados.value;
                let mensaje = `Hola MR Alquileres, coticé en su web un paquete para un evento de *${numInvitados} personas*:%0A%0A`;
                let total = 0;

                paqueteActual.forEach(item => {
                    total += item.subtotal;
                    mensaje += `- ${item.quantity}x ${item.name} ($${item.subtotal.toFixed(2)})%0A`;
                });

                mensaje += `%0A*Subtotal Estimado: $${total.toFixed(2)}*%0A`;
                mensaje += `_Nota: Deseo consultar costo de flete y disponibilidad de fecha._`;

                const url = `https://wa.me/50761130277?text=${mensaje}`;
                window.open(url, '_blank');
            });
        }

        // Ejecutar cálculo inicial
        recalcularEvento();
    }

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMRAlquileres);
} else {
    initMRAlquileres();
}