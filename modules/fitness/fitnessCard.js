// modules/fitness/fitnessCard.js

/**
 * Componente atómico para renderizar los detalles de la solución campeona (Best Match)
 * @param {Object} candidate - Datos del candidato (priv_key_range, pub_address, bit_match, etc.)
 * @returns {string} Fragmento HTML estructurado con clases para fitness.css
 */
export const fitnessCardComponent = {
  render(candidate) {
    const c = candidate || {};
    
    // Extraemos los datos reales del backend
    const privRange = c.priv_key_range || '0x00000000000000000000000000000000';
    const pubAddress = c.pub_address || '1UnknownAddressxxxxxxxxxxxxxxxxxxx';
    const bitMatch = c.bit_match || 0;
    
    // Activamos la animación neón del CSS si la coincidencia de bits es crítica (ej. más de 35 bits)
    const isHighMatch = bitMatch >= 35;
    const cardClass = isHighMatch ? 'fitness-card high-match' : 'fitness-card';

    return `
      <div class="${cardClass}">
        
        <div class="fitness-row">
          <span class="fitness-label">🔑 Candidate Key</span>
          <span class="fitness-value hex-key font-mono">${this.shortenHex(privRange, 10)}</span>
        </div>

        <div class="fitness-row">
          <span class="fitness-label">🎯 Target Address</span>
          <span class="fitness-value font-mono" style="color: var(--text2); font-size: 0.8rem;">
            ${this.shortenHex(pubAddress, 8)}
          </span>
        </div>

        <div class="fitness-row" style="margin-top: 4px; border-top: 1px dashed var(--border); padding-top: 8px;">
          <span class="fitness-label" style="font-weight: bold;">🧬 Collision Level</span>
          <span class="bit-match-badge">${bitMatch} BITS</span>
        </div>

        <button id="copy-candidate-btn" class="btn-terminal" title="Copiar rango hexadecimal completo al portapapeles">
          DUMP CANDIDATE RANGE
        </button>

      </div>
    `.trim();
  },

  /**
   * Helper visual para recortar hashes y direcciones Bitcoin muy largas sin romper el layout
   */
  shortenHex(str, chars = 6) {
    if (!str || str.length <= chars * 2) return str;
    return `${str.substring(0, chars)}...${str.substring(str.length - chars)}`;
  }
};