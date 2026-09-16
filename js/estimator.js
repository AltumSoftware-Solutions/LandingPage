/**
 * ALTUM SOFTWARE - INTERACTIVE PROJECT ESTIMATOR
 * Real-time budget and timeline calculation with instant WhatsApp & Contact Form integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectEstimator();
});

function initProjectEstimator() {
  const estimatorForm = document.getElementById('estimatorForm');
  if (!estimatorForm) return;

  const projectTypeCards = document.querySelectorAll('.project-type-option');
  const featureCheckboxes = document.querySelectorAll('.feature-checkbox');
  const speedRadios = document.querySelectorAll('input[name="projectSpeed"]');
  const sendWhatsAppBtn = document.getElementById('estimatorSendWhatsApp');
  const transferFormBtn = document.getElementById('estimatorTransferForm');

  // State
  const estimatorState = {
    type: 'web_app',
    typeName: 'Plataforma Web / SaaS (MVP)',
    basePrice: 550,
    baseWeeks: 2,
    features: [],
    featureCost: 0,
    featureWeeks: 0,
    speedMultiplier: 1.0,
    speedName: 'Estándar',
    totalPriceMin: 550,
    totalPriceMax: 750,
    totalWeeks: 2
  };

  // 1. Project Type Selection
  projectTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      projectTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const typeKey = card.dataset.type;
      const typeName = card.dataset.name;
      const baseCost = parseInt(card.dataset.cost, 10) || 550;
      const baseTime = parseInt(card.dataset.weeks, 10) || 2;

      estimatorState.type = typeKey;
      estimatorState.typeName = typeName;
      estimatorState.basePrice = baseCost;
      estimatorState.baseWeeks = baseTime;

      recalculateEstimate();
    });
  });

  // 2. Feature Checkbox Selection
  featureCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      const parentLabel = chk.closest('.checkbox-label');
      if (chk.checked) {
        parentLabel?.classList.add('checked');
      } else {
        parentLabel?.classList.remove('checked');
      }

      recalculateEstimate();
    });
  });

  // 3. Project Speed Selection
  speedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const multiplier = parseFloat(radio.value) || 1.0;
      const speedName = radio.dataset.speedName || 'Estándar';

      estimatorState.speedMultiplier = multiplier;
      estimatorState.speedName = speedName;

      // Sync .checked active class across all speed radio options
      speedRadios.forEach(r => {
        const parent = r.closest('.checkbox-label');
        if (r.checked) {
          parent?.classList.add('checked');
        } else {
          parent?.classList.remove('checked');
        }
      });

      recalculateEstimate();
    });
  });

  function recalculateEstimate() {
    let totalFeaturesCost = 0;
    let totalFeaturesWeeks = 0;
    const selectedFeaturesList = [];

    featureCheckboxes.forEach(chk => {
      if (chk.checked) {
        const cost = parseInt(chk.dataset.cost, 10) || 0;
        const weeks = parseFloat(chk.dataset.weeks) || 0;
        const name = chk.dataset.name || chk.value;

        totalFeaturesCost += cost;
        totalFeaturesWeeks += weeks;
        selectedFeaturesList.push(name);
      }
    });

    estimatorState.features = selectedFeaturesList;
    estimatorState.featureCost = totalFeaturesCost;
    estimatorState.featureWeeks = totalFeaturesWeeks;

    const baseSum = (estimatorState.basePrice + totalFeaturesCost) * estimatorState.speedMultiplier;
    // Round to nearest 10 for clean, professional figures
    estimatorState.totalPriceMin = Math.round((baseSum * 0.95) / 10) * 10;
    estimatorState.totalPriceMax = Math.round((baseSum * 1.25) / 10) * 10;
    
    // Calculate total weeks adjusted for speed
    let weeksSum = Math.max(1, estimatorState.baseWeeks + Math.round(totalFeaturesWeeks));
    if (estimatorState.speedMultiplier > 1.2) {
      weeksSum = Math.max(1, Math.round(weeksSum * 0.75)); // Faster delivery
    }
    estimatorState.totalWeeks = weeksSum;

    updateSummaryUI();
  }

  function updateSummaryUI() {
    const summaryType = document.getElementById('summaryProjectType');
    const summaryFeaturesCount = document.getElementById('summaryFeaturesCount');
    const summaryTimeline = document.getElementById('summaryTimeline');
    const summaryPriceDisplay = document.getElementById('summaryPriceDisplay');
    const summaryWeeksDisplay = document.getElementById('summaryWeeksDisplay');

    if (summaryType) summaryType.textContent = estimatorState.typeName;
    if (summaryFeaturesCount) summaryFeaturesCount.textContent = `${estimatorState.features.length} módulos seleccionados`;
    if (summaryTimeline) summaryTimeline.textContent = `${estimatorState.speedName} (~${estimatorState.totalWeeks} semanas)`;

    if (summaryPriceDisplay) {
      const newPriceText = `$${estimatorState.totalPriceMin.toLocaleString()} - $${estimatorState.totalPriceMax.toLocaleString()} USD`;
      if (summaryPriceDisplay.textContent !== newPriceText) {
        summaryPriceDisplay.textContent = newPriceText;
        summaryPriceDisplay.classList.remove('price-bump');
        // Trigger CSS reflow to re-run animation
        void summaryPriceDisplay.offsetWidth;
        summaryPriceDisplay.classList.add('price-bump');
      }
    }
    if (summaryWeeksDisplay) {
      summaryWeeksDisplay.textContent = `Tiempo Estimado de Entrega: ~${estimatorState.totalWeeks} semanas`;
    }
  }

  // 4. WhatsApp Direct Share Button
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const phone = '5215500000000'; // Default business line (customizable)
      const featuresStr = estimatorState.features.length > 0 
        ? estimatorState.features.join(', ') 
        : 'Requerimientos base';
      
      const message = `¡Hola Altum Software! 👋\n\nHe realizado una cotización en su plataforma web:\n\n📌 *Tipo de Proyecto:* ${estimatorState.typeName}\n🧩 *Módulos:* ${featuresStr}\n⚡ *Prioridad:* ${estimatorState.speedName}\n⏱️ *Plazo Estimado:* ~${estimatorState.totalWeeks} semanas\n💰 *Presupuesto Estimado:* $${estimatorState.totalPriceMin.toLocaleString()} - $${estimatorState.totalPriceMax.toLocaleString()} USD\n\nMe gustaría agendar una reunión o recibir una propuesta formal.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Transfer to Contact Form
  if (transferFormBtn) {
    transferFormBtn.addEventListener('click', () => {
      const contactService = document.getElementById('contactService');
      const contactMessage = document.getElementById('contactMessage');
      const contactSection = document.getElementById('contacto');

      if (contactService) {
        contactService.value = estimatorState.type;
      }

      if (contactMessage) {
        const featuresStr = estimatorState.features.length > 0 
          ? estimatorState.features.join(', ') 
          : 'Requerimientos base';

        contactMessage.value = `Hola equipo de Altum,\n\nMe interesa desarrollar un proyecto de tipo "${estimatorState.typeName}".\nRequerimientos y módulos clave: ${featuresStr}.\nTiempo estimado: ~${estimatorState.totalWeeks} semanas.\nPresupuesto estimado: $${estimatorState.totalPriceMin.toLocaleString()} - $${estimatorState.totalPriceMax.toLocaleString()} USD.\n\nQuedo atento a su respuesta.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial calculation trigger
  recalculateEstimate();
}
