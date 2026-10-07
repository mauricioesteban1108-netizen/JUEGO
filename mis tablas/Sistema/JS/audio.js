/**
 * ==========================================================================
 * MultiAventura 4° - Módulo de Audio y Efectos Sonoros
 * Utiliza Web Audio API nativo (100% autónomo, sin archivos externos ni 404s)
 * ==========================================================================
 */

const ModuloAudio = (() => {
    let audioCtx = null;
    let sonidoHabilitado = true;

    // Cargar preferencia del usuario
    const prefGuardada = localStorage.getItem('multiaventura_sonido');
    if (prefGuardada !== null) {
        sonidoHabilitado = prefGuardada === 'true';
    }

    // Inicializar AudioContext tras la primera interacción del usuario
    function obtenerContexto() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function alternarSonido() {
        sonidoHabilitado = !sonidoHabilitado;
        localStorage.setItem('multiaventura_sonido', sonidoHabilitado);
        return sonidoHabilitado;
    }

    function estaHabilitado() {
        return sonidoHabilitado;
    }

    // Tono simple programático
    function reproducirTono(frecuencia, tipoOnda, duracion, retardo = 0, volumenMax = 0.2) {
        if (!sonidoHabilitado) return;
        const ctx = obtenerContexto();
        if (!ctx) return;

        setTimeout(() => {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = tipoOnda;
                osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(volumenMax, ctx.currentTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duracion);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + duracion);
            } catch (e) {
                console.warn('Audio no disponible:', e);
            }
        }, retardo * 1000);
    }

    // Efecto 1: Clic Suave en botones
    function reproducirClic() {
        reproducirTono(520, 'sine', 0.06, 0, 0.12);
    }

    // Efecto 2: Respuesta Correcta (Acorde Mayor Ascendente Do-Mi-Sol)
    function reproducirAcierto() {
        reproducirTono(523.25, 'triangle', 0.12, 0, 0.18);      // C5
        reproducirTono(659.25, 'triangle', 0.14, 0.09, 0.2);   // E5
        reproducirTono(783.99, 'triangle', 0.22, 0.18, 0.22);  // G5
        reproducirTono(1046.50, 'triangle', 0.35, 0.26, 0.22); // C6
    }

    // Efecto 3: Respuesta Incorrecta (Tono pedagógico descendente, amable)
    function reproducirError() {
        reproducirTono(330, 'sawtooth', 0.15, 0, 0.12);
        reproducirTono(260, 'sine', 0.25, 0.12, 0.15);
    }

    // Efecto 4: Victoria / Nivel Completado (Fanfarria alegre)
    function reproducirVictoria() {
        const notas = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        const tiempos = [0, 0.12, 0.24, 0.36, 0.52, 0.68];
        notas.forEach((nota, i) => {
            reproducirTono(nota, 'triangle', 0.22, tiempos[i], 0.22);
        });
    }

    // Efecto 5: Desbloqueo de Logro
    function reproducirLogro() {
        reproducirTono(587.33, 'sine', 0.1, 0, 0.18);
        reproducirTono(880.00, 'sine', 0.12, 0.1, 0.2);
        reproducirTono(1174.66, 'triangle', 0.4, 0.22, 0.25);
    }

    // Efecto 6: Tic-tac de reloj
    function reproducirTick() {
        reproducirTono(800, 'sine', 0.04, 0, 0.08);
    }

    return {
        alternarSonido,
        estaHabilitado,
        reproducirClic,
        reproducirAcierto,
        reproducirError,
        reproducirVictoria,
        reproducirLogro,
        reproducirTick
    };
})();
