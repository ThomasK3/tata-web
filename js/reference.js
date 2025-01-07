document.addEventListener('DOMContentLoaded', function() {
    // Filtrování projektů
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.project-modal');
    const modalClose = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-details');

    // Stav carouselu
    let currentSlide = 0;
    let totalSlides = 0;

    // Event listenery pro filtrování
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // Funkce pro načtení dat projektu
    async function loadProjectData(projectId) {
        try {
            const response = await fetch(`../data/project${projectId}.json`);
            if (!response.ok) {
                throw new Error('Projekt nenalezen');
            }
            return await response.json();
        } catch (error) {
            console.error('Chyba při načítání dat projektu:', error);
            return null;
        }
    }

    // Funkce pro aktualizaci carouselu
    function updateCarousel() {
        const container = modal.querySelector('.carousel-container');
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Aktualizace teček
        const dots = modal.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Funkce pro přechod na konkrétní slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    // Funkce pro přechod na další slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Funkce pro přechod na předchozí slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Funkce pro otevření modalu s konkrétními daty
    async function openProjectModal(projectId) {
        const projectData = await loadProjectData(projectId);
        
        if (!projectData) {
            alert('Omlouváme se, data projektu se nepodařilo načíst.');
            return;
        }

        // Naplnění modalu základními daty
        modal.querySelector('.modal-header h2').textContent = projectData.title;
        
        // Vytvoření carousel
        const carouselContainer = modal.querySelector('.carousel-container');
        const dotsContainer = modal.querySelector('.carousel-dots');
        
        // Vyčištění předchozího obsahu
        carouselContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        // Přidání obrázků do carouselu
        projectData.images.forEach((image, index) => {
            // Přidání obrázku
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            carouselContainer.appendChild(img);
            
            // Přidání tečky pro navigaci
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        totalSlides = projectData.images.length;
        currentSlide = 0;
        updateCarousel();
        
        // Naplnění detailů projektu
        const scopeList = modal.querySelector('.detail-item ul');
        scopeList.innerHTML = projectData.scope
            .map(item => `<li>${item}</li>`)
            .join('');
        
        modal.querySelector('.detail-item p').textContent = projectData.duration;
        modal.querySelector('blockquote').textContent = projectData.testimonial.text;
        modal.querySelector('cite').textContent = `- ${projectData.testimonial.author}`;
        
        modal.style.display = 'block';
    }

    // Event listenery pro tlačítka v modalu
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    // Event listener pro zavření modalu
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Event listener pro kliknutí mimo modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener pro ovládání carouselu pomocí šipek
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'Escape') modal.style.display = 'none';
        }
    });

    // Event listenery pro tlačítka carouselu
    const prevButton = modal.querySelector('.carousel-btn.prev');
    const nextButton = modal.querySelector('.carousel-btn.next');
    
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
});