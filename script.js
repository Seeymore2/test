// Stromkosten-Rechner - Main JavaScript with Input Validation

/**
 * Convert time value to hours based on unit
 */
function stundenAus(zeitWert, einheit) {
  switch(einheit) {
    case 'min': return zeitWert / 60;
    case 'h': return zeitWert;
    case 'tag': return zeitWert * 24;
    case 'monat': return zeitWert * 24 * 30;
    case 'jahr': return zeitWert * 24 * 365;
    default: return zeitWert;
  }
}

/**
 * Format number as Euro currency
 */
function formatEuro(n) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' €';
}

/**
 * Validate a positive number input
 */
function validatePositiveNumber(value, fieldName) {
  const num = parseFloat(value);
  if (value === '') return { valid: false, message: fieldName + ' darf nicht leer sein' };
  if (isNaN(num)) return { valid: false, message: fieldName + ' muss eine Zahl sein' };
  if (num < 0) return { valid: false, message: fieldName + ' darf nicht negativ sein' };
  if (!Number.isFinite(num)) return { valid: false, message: fieldName + ' ist zu groß' };
  return { valid: true };
}

/**
 * Validate all inputs and show/hide error messages
 */
function validateAllInputs() {
  const leistungInput = document.getElementById('leistung');
  const leistungError = document.getElementById('leistungError');
  const zeitInput = document.getElementById('zeit');
  const zeitError = document.getElementById('zeitError');
  const preisInput = document.getElementById('preis');
  const preisError = document.getElementById('preisError');
  const grundpreisInput = document.getElementById('grundpreis');
  const grundpreisError = document.getElementById('grundpreisError');

  let allValid = true;

  const leistungValidation = validatePositiveNumber(leistungInput.value, 'Leistung');
  if (!leistungValidation.valid) {
    leistungError.textContent = leistungValidation.message;
    leistungError.style.display = 'block';
    leistungInput.classList.add('input-error');
    allValid = false;
  } else {
    leistungError.style.display = 'none';
    leistungInput.classList.remove('input-error');
  }

  const zeitValidation = validatePositiveNumber(zeitInput.value, 'Nutzungsdauer');
  if (!zeitValidation.valid) {
    zeitError.textContent = zeitValidation.message;
    zeitError.style.display = 'block';
    zeitInput.classList.add('input-error');
    allValid = false;
  } else {
    zeitError.style.display = 'none';
    zeitInput.classList.remove('input-error');
  }

  const preisValidation = validatePositiveNumber(preisInput.value, 'Arbeitspreis');
  if (!preisValidation.valid) {
    preisError.textContent = preisValidation.message;
    preisError.style.display = 'block';
    preisInput.classList.add('input-error');
    allValid = false;
  } else {
    preisError.style.display = 'none';
    preisInput.classList.remove('input-error');
  }

  const grundpreisValue = grundpreisInput.value;
  const grundpreisNum = parseFloat(grundpreisValue);
  if (grundpreisValue === '') {
    grundpreisError.textContent = 'Grundpreis darf nicht leer sein';
    grundpreisError.style.display = 'block';
    grundpreisInput.classList.add('input-error');
    allValid = false;
  } else if (isNaN(grundpreisNum)) {
    grundpreisError.textContent = 'Grundpreis muss eine Zahl sein';
    grundpreisError.style.display = 'block';
    grundpreisInput.classList.add('input-error');
    allValid = false;
  } else if (grundpreisNum < 0) {
    grundpreisError.textContent = 'Grundpreis darf nicht negativ sein';
    grundpreisError.style.display = 'block';
    grundpreisInput.classList.add('input-error');
    allValid = false;
  } else if (!Number.isFinite(grundpreisNum)) {
    grundpreisError.textContent = 'Grundpreis ist zu groß';
    grundpreisError.style.display = 'block';
    grundpreisInput.classList.add('input-error');
    allValid = false;
  } else {
    grundpreisError.style.display = 'none';
    grundpreisInput.classList.remove('input-error');
  }

  return allValid;
}

/**
 * Calculate and display all costs
 */
function berechne() {
  if (!validateAllInputs()) {
    return;
  }

  const leistungWert = parseFloat(document.getElementById('leistung').value) || 0;
  const leistungEinheit = document.getElementById('leistungEinheit').value;
  const zeitWert = parseFloat(document.getElementById('zeit').value) || 0;
  const zeitEinheit = document.getElementById('zeitEinheit').value;
  const preisCent = parseFloat(document.getElementById('preis').value) || 0;
  const grundpreisWert = parseFloat(document.getElementById('grundpreis').value) || 0;
  const grundpreisEinheit = document.getElementById('grundpreisEinheit').value;

  const leistungKw = Number.isFinite(leistungWert) 
    ? (leistungEinheit === 'kW' ? leistungWert : leistungWert / 1000)
    : 0;
  
  const stunden = stundenAus(zeitWert, zeitEinheit);
  const kwh = leistungKw * stunden;
  const preisEuroProKwh = preisCent / 100;
  const kosten = kwh * preisEuroProKwh;
  const kostenProStunde = leistungKw * preisEuroProKwh;
  const kostenProTag = kostenProStunde * 24;

  const grundpreisProTag = grundpreisEinheit === 'jahr' ? grundpreisWert / 365 : grundpreisWert / 30;
  const grundpreisAnteil = grundpreisProTag * (stunden / 24);
  const gesamt = kosten + grundpreisAnteil;

  document.getElementById('outKwh').textContent = kwh.toLocaleString('de-DE', { maximumFractionDigits: 4 }) + ' kWh';
  document.getElementById('outKosten').textContent = formatEuro(kosten);
  document.getElementById('outProStunde').textContent = formatEuro(kostenProStunde);
  document.getElementById('outProTag').textContent = formatEuro(kostenProTag);
  document.getElementById('outGrundpreisAnteil').textContent = formatEuro(grundpreisAnteil);
  document.getElementById('outGesamt').textContent = formatEuro(gesamt);
}

document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', berechne);
});

berechne();