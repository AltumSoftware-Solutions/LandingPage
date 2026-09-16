/**
 * ALTUM SOFTWARE - PORTFOLIO, TECH STACK & FAQ SCRIPT
 * Manages interactive filtering, project modals, and FAQ accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTechFilters();
  initPortfolioFilters();
  initProjectModals();
  initFaqAccordion();
});

/* ==========================================================================
   1. Tech Stack Category Filtering
   ========================================================================== */
function initTechFilters() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.dataset.filter;

      techCards.forEach(card => {
        if (filterCategory === 'all' || card.dataset.category === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   2. Portfolio Filtering
   ========================================================================== */
function initPortfolioFilters() {
  const portfolioBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Case Study Details Modal
   ========================================================================== */
const projectData = {
  fintech: {
    title: 'Nexus Fintech: Plataforma de Inversión y Analítica en Tiempo Real',
    client: 'Nexus Global Assets (Fintech)',
    image: 'assets/images/case_fintech.jpg',
    overview: 'Desarrollo de una plataforma web y dashboard financiero de grado institucional que permite a usuarios y fondos gestionar carteras de inversión, criptoactivos y transacciones con sincronización en milisegundos.',
    challenge: 'Manejo de alta concurrencia (>100,000 usuarios activos), procesamiento de feeds de datos bursátiles en tiempo real sin latencia, y cumplimiento estricto con normativas bancarias y cifrado de datos de extremo a extremo.',
    solution: 'Arquitectura de microservicios con Node.js, WebSockets de alta velocidad, frontend reactivo en React + TypeScript con WebGL para renderizado de gráficos a 60fps, y base de datos distribuida con PostgreSQL y Redis.',
    metrics: [
      { label: 'Tiempo de respuesta', value: '< 18ms' },
      { label: 'Uptime garantizado', value: '99.99%' },
      { label: 'Volumen transaccionado', value: '+$300M USD' }
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS ECS', 'Docker']
  },
  ai_flow: {
    title: 'Synapse AI: Orquestador y Constructor de Agentes Autónomos',
    client: 'AlphaX Automations (Enterprise SaaS)',
    image: 'assets/images/case_ai_flow.jpg',
    overview: 'Diseño y construcción de una solución SaaS B2B que permite a empresas crear flujos de trabajo autónomos y conectar modelos de lenguaje (LLMs) con bases de datos y APIs corporativas.',
    challenge: 'Construir una interfaz visual intuitiva para drag-and-drop de nodos con ejecución asíncrona tolerante a fallos y límites de consumo de tokens optimizados.',
    solution: 'Desarrollamos un canvas visual ultra-fluido con React Flow y Tailwind, motor de ejecución en Python con FastAPI y Celery, y orquestación con LangChain y vector databases (Pinecone / pgvector).',
    metrics: [
      { label: 'Ahorro operativo', value: '+65%' },
      { label: 'Flujos ejecutados/día', value: '1.2M+' },
      { label: 'Reducción de costos LLM', value: '-40%' }
    ],
    technologies: ['Python', 'FastAPI', 'React', 'LangChain', 'OpenAI API', 'Celery', 'Docker']
  },
  logistics: {
    title: 'Nexus Logistics: Sistema de Rastreo Global y Cadena de Suministro',
    client: 'TransOcean Logistics Corp',
    image: 'assets/images/case_logistics_saas.jpg',
    overview: 'Plataforma empresarial de gestión de flota marítima, terrestre y aérea en tiempo real con predicción de tiempos de entrega asistida por Machine Learning.',
    challenge: 'Monitoreo de miles de contenedores simultáneos en rutas internacionales con señal intermitente y generación de reportes aduaneros automatizados.',
    solution: 'Arquitectura Cloud escalable en AWS con IoT Core, backend en Go (Golang) para máximo rendimiento, mapas geoespaciales interactivos en Mapbox y Progressive Web App offline-ready.',
    metrics: [
      { label: 'Entregas a tiempo (OTD)', value: '96.8%' },
      { label: 'Rutas optimizadas', value: '+35%' },
      { label: 'Emisiones reducidas', value: '-18%' }
    ],
    technologies: ['Go (Golang)', 'Mapbox GL', 'Next.js', 'AWS IoT', 'PostGIS', 'Kubernetes']
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentContainer = document.getElementById('modalContent');
  const openModalButtons = document.querySelectorAll('.open-case-modal');

  if (!modalOverlay || !modalContentContainer) return;

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.dataset.project;
      const data = projectData[projectKey];

      if (data) {
        modalContentContainer.innerHTML = `
          <div class="modal-project-header" style="margin-bottom: 1.5rem;">
            <span class="section-badge">${data.client}</span>
            <h2 style="font-size: 1.75rem; margin-top: 0.5rem; margin-bottom: 1rem;">${data.title}</h2>
          </div>
          
          <div style="border-radius: 12px; overflow: hidden; margin-bottom: 1.75rem; border: 1px solid var(--border-subtle);">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; height: auto; display: block;" />
          </div>

          <div style="margin-bottom: 1.75rem;">
            <h4 style="margin-bottom: 0.5rem; color: var(--primary-light);">Descripción del Proyecto</h4>
            <p style="margin-bottom: 1.25rem;">${data.overview}</p>

            <h4 style="margin-bottom: 0.5rem; color: var(--accent-purple);">El Desafío Técnico</h4>
            <p style="margin-bottom: 1.25rem;">${data.challenge}</p>

            <h4 style="margin-bottom: 0.5rem; color: var(--accent-emerald);">Nuestra Solución</h4>
            <p>${data.solution}</p>
          </div>

          <div class="portfolio-metrics-row" style="margin-bottom: 1.75rem;">
            ${data.metrics.map(m => `
              <div class="p-metric">
                <h5>${m.value}</h5>
                <span>${m.label}</span>
              </div>
            `).join('')}
          </div>

          <div>
            <h5 style="margin-bottom: 0.75rem; font-size: 0.95rem; color: var(--text-muted); font-family: var(--font-mono);">STACK TECNOLÓGICO UTILIZADO:</h5>
            <div class="portfolio-tags">
              ${data.technologies.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}
            </div>
          </div>
        `;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. FAQ Accordion Logic
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isOpen = parentItem.classList.contains('open');

      // Close all other items for clean accordion UX
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
      });

      if (!isOpen) {
        parentItem.classList.add('open');
      }
    });
  });
}
