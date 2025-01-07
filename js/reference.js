document.addEventListener('DOMContentLoaded', function() {
    // Filtrování projektů
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.gallery-item');

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

    // Modal funkcionalita
    const modal = document.querySelector('.project-modal');
    const modalClose = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-details');

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

    // Funkce pro otevření modalu s konkrétními daty
    async function openProjectModal(projectId) {
        const projectData = await loadProjectData(projectId);
        
        if (!projectData) {
            alert('Omlouváme se, data projektu se nepodařilo načíst.');
            return;
        }

        // Naplnění modalu daty
        modal.querySelector('.modal-header h2').textContent = projectData.title;
        modal.querySelector('.before-image').src = projectData.beforeImage;
        modal.querySelector('.after-image').src = projectData.afterImage;
        
        // Naplnění seznamu prací
        const scopeList = modal.querySelector('.detail-item ul');
        scopeList.innerHTML = projectData.scope
            .map(item => `<li>${item}</li>`)
            .join('');
        
        // Doba realizace
        modal.querySelector('.detail-item p').textContent = projectData.duration;
        
        // Reference
        modal.querySelector('blockquote').textContent = projectData.testimonial.text;
        modal.querySelector('cite').textContent = `- ${projectData.testimonial.author}`;
        
        modal.style.display = 'block';
    }

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});