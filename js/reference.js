document.addEventListener('DOMContentLoaded', function() {
    // Získání všech tlačítek a projektů
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.gallery-item');

    // Přidání click event listeneru na každé tlačítko
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Odstranění active class ze všech tlačítek
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Přidání active class na kliknuté tlačítko
            button.classList.add('active');

            // Získání kategorie z data-filter atributu
            const filterValue = button.getAttribute('data-filter');

            // Filtrování projektů
            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // Modal funkcionalita
    const modal = document.querySelector('.project-modal');
    const modalClose = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-details');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Zavření modalu kliknutím mimo něj
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});