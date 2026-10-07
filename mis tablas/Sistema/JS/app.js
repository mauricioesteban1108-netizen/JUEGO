/**
 * ==========================================================================
 * MultiAventura 4° - Controlador General de la Aplicación (App)
 * Control de navegación SPA, interfaz del menú principal, estadísticas y perfil
 * ==========================================================================
 */

const App = (() => {
    let vistaActual = 'menu';

    // Diccionario de SVGs de avatares para inyección dinámica
    const AVATARES_SVG = {
        leon: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#F8F1DF" stroke="#D4AF37" stroke-width="4"/>
                <circle cx="50" cy="50" r="34" fill="#F5B041"/>
                <circle cx="50" cy="22" r="10" fill="#D35400"/>
                <circle cx="28" cy="30" r="10" fill="#D35400"/>
                <circle cx="72" cy="30" r="10" fill="#D35400"/>
                <circle cx="20" cy="50" r="10" fill="#D35400"/>
                <circle cx="80" cy="50" r="10" fill="#D35400"/>
                <circle cx="30" cy="70" r="10" fill="#D35400"/>
                <circle cx="70" cy="70" r="10" fill="#D35400"/>
                <circle cx="50" cy="50" r="28" fill="#FAD7A0"/>
                <circle cx="41" cy="46" r="4" fill="#0B1B3D"/>
                <circle cx="59" cy="46" r="4" fill="#0B1B3D"/>
                <polygon points="50,53 45,59 55,59" fill="#0B1B3D"/>
                <path d="M45 61Q50 66 55 61" stroke="#0B1B3D" stroke-width="2" fill="none"/>
            </svg>
        `,
        buho: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#E9F0FA" stroke="#132D63" stroke-width="4"/>
                <ellipse cx="50" cy="54" rx="30" ry="32" fill="#5D6D7E"/>
                <ellipse cx="50" cy="58" rx="20" ry="22" fill="#FFFDF7"/>
                <polygon points="28,26 38,38 24,42" fill="#34495E"/>
                <polygon points="72,26 62,38 76,42" fill="#34495E"/>
                <circle cx="38" cy="46" r="12" fill="#FFFDF7" stroke="#0B1B3D" stroke-width="3"/>
                <circle cx="62" cy="46" r="12" fill="#FFFDF7" stroke="#0B1B3D" stroke-width="3"/>
                <line x1="50" y1="46" x2="50" y2="46" stroke="#0B1B3D" stroke-width="3"/>
                <circle cx="38" cy="46" r="5" fill="#0B1B3D"/>
                <circle cx="62" cy="46" r="5" fill="#0B1B3D"/>
                <polygon points="50,52 46,59 54,59" fill="#E67E22"/>
            </svg>
        `,
        robot: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#F8F1DF" stroke="#D4AF37" stroke-width="4"/>
                <line x1="50" y1="18" x2="50" y2="28" stroke="#132D63" stroke-width="4"/>
                <circle cx="50" cy="16" r="5" fill="#E74C3C"/>
                <rect x="25" y="28" width="50" height="44" rx="10" fill="#0B1B3D" stroke="#D4AF37" stroke-width="3"/>
                <rect x="33" y="38" width="34" height="15" rx="5" fill="#132D63"/>
                <circle cx="42" cy="45" r="4" fill="#2ECC71"/>
                <circle cx="58" cy="45" r="4" fill="#2ECC71"/>
                <line x1="36" y1="60" x2="64" y2="60" stroke="#FFFDF7" stroke-width="3" stroke-dasharray="3,3"/>
            </svg>
        `,
        astronauta: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#E9F0FA" stroke="#132D63" stroke-width="4"/>
                <circle cx="50" cy="48" r="32" fill="#FFFDF7" stroke="#0B1B3D" stroke-width="3"/>
                <rect x="26" y="34" width="48" height="28" rx="14" fill="#132D63" stroke="#D4AF37" stroke-width="2.5"/>
                <ellipse cx="38" cy="42" rx="6" ry="3" fill="#FFFDF7" transform="rotate(-20 38 42)"/>
                <path d="M30 76C30 70 40 68 50 68C60 68 70 70 70 76V82H30V76Z" fill="#1E4E8C"/>
            </svg>
        `,
        zorra: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#F8F1DF" stroke="#D4AF37" stroke-width="4"/>
                <polygon points="26,18 42,34 20,40" fill="#E67E22"/>
                <polygon points="74,18 58,34 80,40" fill="#E67E22"/>
                <polygon points="28,24 38,34 24,38" fill="#FFFDF7"/>
                <polygon points="72,24 62,34 76,38" fill="#FFFDF7"/>
                <polygon points="50,75 22,44 78,44" fill="#E67E22"/>
                <polygon points="50,75 32,50 68,50" fill="#FFFDF7"/>
                <circle cx="38" cy="46" r="4" fill="#0B1B3D"/>
                <circle cx="62" cy="46" r="4" fill="#0B1B3D"/>
                <circle cx="50" cy="72" r="4" fill="#0B1B3D"/>
            </svg>
        `,
        mago: `
            <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#E9F0FA" stroke="#132D63" stroke-width="4"/>
                <circle cx="50" cy="56" r="22" fill="#FAD7A0"/>
                <polygon points="50,14 26,46 74,46" fill="#0B1B3D"/>
                <ellipse cx="50" cy="46" rx="32" ry="7" fill="#132D63" stroke="#D4AF37" stroke-width="2"/>
                <polygon points="50,28 52,32 56,33 53,36 54,40 50,38 46,40 47,36 44,33 48,32" fill="#D4AF37"/>
                <circle cx="43" cy="57" r="3" fill="#0B1B3D"/>
                <circle cx="57" cy="57" r="3" fill="#0B1B3D"/>
                <path d="M46 66Q50 70 54 66" stroke="#0B1B3D" stroke-width="2" fill="none"/>
            </svg>
        `
    };

    function inicializar() {
        // Verificar que exista un estudiante registrado
        const estudiante = ModuloStorage.obtenerEstudiante();
        if (!estudiante || !estudiante.nombre) {
            window.location.href = '../index.html';
            return;
        }

        configurarEventosGlobales();
        actualizarDatosHeader();
        actualizarDashboard();
        navegarA('menu');
    }

    // Configuración de listeners globales
    function configurarEventosGlobales() {
        // Clic en logo -> ir al menú principal
        const logo = document.getElementById('logoHeader');
        if (logo) {
            logo.onclick = () => {
                ModuloAudio.reproducirClic();
                navegarA('menu');
            };
        }

        // Botón cambiar estudiante
        const btnCambiar = document.getElementById('btnCambiarEstudiante');
        if (btnCambiar) {
            btnCambiar.onclick = () => {
                ModuloAudio.reproducirClic();
                mostrarModalCambiarEstudiante();
            };
        }

        // Botón sonido
        const btnSonido = document.getElementById('btnAlternarSonido');
        if (btnSonido) {
            actualizarIconoSonido();
            btnSonido.onclick = () => {
                const activo = ModuloAudio.alternarSonido();
                actualizarIconoSonido();
                if (activo) ModuloAudio.reproducirClic();
            };
        }

        // Botones "Volver al Menú"
        document.querySelectorAll('.btn-volver-menu').forEach(btn => {
            btn.onclick = () => {
                ModuloAudio.reproducirClic();
                navegarA('menu');
            };
        });

        // Clics en tarjetas del Menú Principal
        configurarTarjetasMenuPrincipal();
    }

    function actualizarIconoSonido() {
        const btnSonido = document.getElementById('btnAlternarSonido');
        if (btnSonido) {
            btnSonido.textContent = ModuloAudio.estaHabilitado() ? '🔊' : '🔇';
            btnSonido.title = ModuloAudio.estaHabilitado() ? 'Silenciar Sonido' : 'Activar Sonido';
        }
    }

    // Navegación entre vistas SPA
    function navegarA(idVista) {
        vistaActual = idVista;

        // Ocultar todas las vistas
        document.querySelectorAll('.vista-modulo').forEach(v => {
            v.classList.remove('activa');
        });

        // Mostrar la solicitada
        const vistaDestino = document.getElementById(`vista-${idVista}`);
        if (vistaDestino) {
            vistaDestino.classList.add('activa');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Inicializar lógica específica según la vista
        if (idVista === 'tablas') {
            ModuloTablas.inicializar();
        } else if (idVista === 'juegos') {
            ModuloJuegos.inicializar();
        } else if (idVista === 'simce') {
            // Verificar si el SIMCE está desbloqueado
            if (ModuloStorage.estaSimceHabilitado()) {
                ModuloSimce.inicializar();
            } else {
                mostrarDialogoBloqueoSimce();
            }
        } else if (idVista === 'progreso') {
            renderizarVistaProgreso();
        } else if (idVista === 'logros') {
            renderizarVistaLogros();
        } else if (idVista === 'menu') {
            actualizarDashboard();
        }

        actualizarDatosHeader();
    }

    // Actualiza los datos de cabecera en tiempo real
    function actualizarDatosHeader() {
        const estudiante = ModuloStorage.obtenerEstudiante();
        if (!estudiante) return;

        // Nombre
        const elNombre = document.getElementById('headerNombreEstudiante');
        if (elNombre) elNombre.textContent = estudiante.nombre;

        // Nivel
        const elNivel = document.getElementById('headerNivelEstudiante');
        if (elNivel) elNivel.textContent = `Nivel ${estudiante.nivel}: ${ModuloStorage.obtenerNombreNivel(estudiante.nivel)}`;

        // Puntos
        const elPuntos = document.getElementById('headerPuntosEstudiante');
        if (elPuntos) elPuntos.textContent = `${estudiante.puntos} pts`;

        // Estrellas
        const elEstrellas = document.getElementById('headerEstrellasEstudiante');
        if (elEstrellas) elEstrellas.textContent = `⭐ ${estudiante.estrellas}`;

        // Avatar SVG
        const contAvatar = document.getElementById('headerAvatarMini');
        if (contAvatar) {
            const svgCode = AVATARES_SVG[estudiante.avatarId] || AVATARES_SVG['leon'];
            contAvatar.innerHTML = svgCode;
        }
    }

    // Actualizar elementos del Dashboard
    function actualizarDashboard() {
        const estudiante = ModuloStorage.obtenerEstudiante();
        if (!estudiante) return;

        // Saludo personalizado
        const saludo = document.getElementById('saludoNombreDashboard');
        if (saludo) saludo.textContent = estudiante.nombre;

        // Porcentaje global
        const tablasTotal = 9; // tablas del 2 al 10
        const dominadasCount = (estudiante.tablasDominadas || []).filter(t => t.porcentaje >= 80).length;
        const porcentajeGlobal = Math.round((dominadasCount / tablasTotal) * 100);

        const barra = document.getElementById('barraProgresoGlobal');
        if (barra) barra.style.width = `${porcentajeGlobal}%`;

        const textoPorcentaje = document.getElementById('textoPorcentajeGlobal');
        if (textoPorcentaje) textoPorcentaje.textContent = `${porcentajeGlobal}% Dominado`;

        // Actualizar estado del botón SIMCE en la grilla
        const tarjetaSimce = document.getElementById('tarjetaMenuSimce');
        const badgeSimce = document.getElementById('badgeEstadoSimce');
        if (tarjetaSimce && badgeSimce) {
            const desbloqueado = ModuloStorage.estaSimceHabilitado();
            if (desbloqueado) {
                tarjetaSimce.classList.remove('bloqueada');
                badgeSimce.className = 'tag-tarjeta';
                badgeSimce.style.background = 'var(--color-dorado-acento)';
                badgeSimce.style.color = 'var(--color-azul-oscuro)';
                badgeSimce.textContent = '¡DISPONIBLE!';
            } else {
                tarjetaSimce.classList.add('bloqueada');
                badgeSimce.className = 'badge-candado';
                badgeSimce.innerHTML = '🔒 Practica 2 tablas o 120 pts';
            }
        }
    }

    // Configurar clics en las tarjetas del Menú Principal
    function configurarTarjetasMenuPrincipal() {
        const tarjetas = [
            { id: 'tarjetaMenuAprender', destino: 'tablas' },
            { id: 'tarjetaMenuJuegos', destino: 'juegos' },
            { id: 'tarjetaMenuProgreso', destino: 'progreso' },
            { id: 'tarjetaMenuLogros', destino: 'logros' },
            { id: 'tarjetaMenuSimce', destino: 'simce' }
        ];

        tarjetas.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) {
                el.onclick = () => {
                    ModuloAudio.reproducirClic();
                    navegarA(t.destino);
                };
            }
        });
    }

    // Modal de bloqueo de SIMCE si aún no cumple requisitos
    function mostrarDialogoBloqueoSimce() {
        const modal = document.getElementById('modalGenerico');
        const cuerpo = document.getElementById('cuerpoModalGenerico');
        if (!modal || !cuerpo) return;

        cuerpo.innerHTML = `
            <div style="font-size: 3.5rem; margin-bottom: 12px;">🔒🌟</div>
            <h3 style="font-size: 1.7rem; color: var(--color-azul-oscuro); margin-bottom: 10px;">
                Ensayo SIMCE en Preparación
            </h3>
            <p style="font-size: 1rem; color: var(--color-texto-secundario); font-weight: 600; line-height: 1.5; margin-bottom: 20px;">
                Para asegurar un excelente resultado en el SIMCE oficial, se recomienda primero practicar al menos <strong>2 tablas de multiplicar</strong> o acumular <strong>120 puntos</strong> en los juegos.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button id="btnIrAprenderDesdeModal" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                    📘 Ir a Aprender Tablas
                </button>
                <button id="btnDesbloquearForzado" class="btn-volver" style="border-color: var(--color-dorado-acento); font-size: 0.88rem;">
                    🔓 Ingresar en Modo Entrenamiento
                </button>
            </div>
        `;

        modal.classList.add('abierto');

        document.getElementById('btnIrAprenderDesdeModal').onclick = () => {
            modal.classList.remove('abierto');
            navegarA('tablas');
        };

        // Opción pedagógica para docentes o alumnos que quieran ensayar de inmediato
        document.getElementById('btnDesbloquearForzado').onclick = () => {
            const estudiante = ModuloStorage.obtenerEstudiante();
            if (estudiante) {
                estudiante.simceForzadoHabilitado = true;
                ModuloStorage.guardarEstudiante(estudiante);
            }
            modal.classList.remove('abierto');
            ModuloSimce.inicializar();
            actualizarDashboard();
        };
    }

    // Renderizar Vista Progreso
    function renderizarVistaProgreso() {
        const contenedor = document.getElementById('contenedorDetalleProgreso');
        if (!contenedor) return;

        const estudiante = ModuloStorage.obtenerEstudiante();
        if (!estudiante) return;

        const dominadas = estudiante.tablasDominadas || [];
        const ensayos = estudiante.ensayosSimce || [];

        let htmlTablas = '';
        for (let i = 2; i <= 10; i++) {
            const reg = dominadas.find(t => t.tabla === i);
            const porc = reg ? reg.porcentaje : 0;
            const aciertos = reg ? reg.aciertos : 0;

            htmlTablas += `
                <div class="tarjeta-progreso-tabla">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="font-family:'Outfit'; font-size: 1.25rem; color: var(--color-azul-oscuro);">
                            Tabla del ${i}
                        </strong>
                        <span style="font-weight: 800; color: ${porc >= 80 ? 'var(--color-verde-exito)' : 'var(--color-azul-brillante)'};">
                            ${porc}%
                        </span>
                    </div>
                    <div class="barra-progreso-fondo" style="height: 10px; margin-bottom: 10px;">
                        <div class="barra-progreso-relleno" style="width: ${porc}%;"></div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--color-texto-secundario); font-weight: 700;">
                        ${reg ? `✓ Mejor intento: ${aciertos} de 5 aciertos` : '⚠️ Aún no practicada'}
                    </div>
                </div>
            `;
        }

        let htmlEnsayos = '';
        if (ensayos.length === 0) {
            htmlEnsayos = `
                <p style="color: var(--color-texto-secundario); font-weight: 600; font-style: italic;">
                    Aún no has rendido ningún ensayo SIMCE. ¡Ponte a prueba cuando estés listo!
                </p>
            `;
        } else {
            htmlEnsayos = `
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
                    ${ensayos.map((e, idx) => `
                        <div style="background: var(--color-crema); border: 2px solid var(--color-crema-oscuro); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>Ensayo #${ensayos.length - idx}</strong> (${e.fecha})
                                <div style="font-size: 0.85rem; color: var(--color-texto-secundario);">Nivel alcanzado: <strong>${e.nivel}</strong></div>
                            </div>
                            <div style="font-family:'Outfit'; font-size: 1.3rem; font-weight: 900; color: var(--color-azul-oscuro);">
                                ${e.puntaje} / ${e.total} (${e.porcentaje}%)
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        contenedor.innerHTML = `
            <div style="display: grid; gap: 30px;">
                <div>
                    <h3 style="font-size: 1.5rem; color: var(--color-azul-oscuro); margin-bottom: 12px;">
                        📊 Dominio de Tablas de Multiplicar (2 al 10)
                    </h3>
                    <div class="grilla-tablas-progreso">${htmlTablas}</div>
                </div>

                <div style="background: var(--color-blanco); border: 3px solid var(--color-crema-oscuro); border-radius: var(--radio-tarjeta); padding: 24px;">
                    <h3 style="font-size: 1.5rem; color: var(--color-azul-oscuro); margin-bottom: 10px;">
                        📑 Historial de Ensayos SIMCE Rendidos
                    </h3>
                    ${htmlEnsayos}
                </div>
            </div>
        `;
    }

    // Renderizar Vista Logros y Recompensas
    function renderizarVistaLogros() {
        const contenedor = document.getElementById('contenedorListaLogros');
        if (!contenedor) return;

        const estudiante = ModuloStorage.obtenerEstudiante();
        if (!estudiante) return;

        const misLogrosIds = estudiante.logros || [];

        contenedor.innerHTML = `
            <div class="grilla-logros">
                ${ModuloStorage.LOGROS_SISTEMA.map(logro => {
                    const desbloqueado = misLogrosIds.includes(logro.id);
                    return `
                        <div class="tarjeta-logro ${desbloqueado ? 'desbloqueado' : 'bloqueado'}">
                            <div class="icono-trofeo-logro">${logro.icono}</div>
                            <h4 style="font-size: 1.25rem; color: var(--color-azul-oscuro); margin-bottom: 6px;">
                                ${logro.titulo}
                            </h4>
                            <p style="font-size: 0.9rem; color: var(--color-texto-secundario); font-weight: 600; line-height: 1.4; margin-bottom: 12px;">
                                ${logro.descripcion}
                            </p>
                            <div style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; background: ${desbloqueado ? 'var(--color-dorado-acento)' : 'var(--color-crema-oscuro)'}; color: var(--color-azul-oscuro);">
                                ${desbloqueado ? '✓ DESBLOQUEADO' : '🔒 BLOQUEADO'} (+${logro.puntosRecompensa} pts)
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Modal para Cambiar de Estudiante
    function mostrarModalCambiarEstudiante() {
        const modal = document.getElementById('modalGenerico');
        const cuerpo = document.getElementById('cuerpoModalGenerico');
        if (!modal || !cuerpo) return;

        cuerpo.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🔄👤</div>
            <h3 style="font-size: 1.6rem; color: var(--color-azul-oscuro); margin-bottom: 10px;">
                ¿Cambiar o Salir de la Sesión?
            </h3>
            <p style="font-size: 0.95rem; color: var(--color-texto-secundario); font-weight: 600; margin-bottom: 22px;">
                Tu progreso y puntaje se mantendrán guardados en este equipo. Podrás ingresar con otro nombre o volver más tarde.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="btnConfirmarSalida" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                    Ir a Pantalla de Ingreso
                </button>
                <button id="btnCancelarSalida" class="btn-volver">
                    Cancelar
                </button>
            </div>
        `;

        modal.classList.add('abierto');

        document.getElementById('btnConfirmarSalida').onclick = () => {
            window.location.href = '../index.html';
        };

        document.getElementById('btnCancelarSalida').onclick = () => {
            modal.classList.remove('abierto');
        };
    }

    // Notificación Toast flotante
    function mostrarNotificacion(mensaje) {
        let toast = document.getElementById('toastFlotante');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toastFlotante';
            toast.className = 'toast-flotante';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<span>✨</span> <span>${mensaje}</span>`;
        toast.classList.add('mostrar');

        setTimeout(() => {
            toast.classList.remove('mostrar');
        }, 3600);
    }

    return {
        inicializar,
        navegarA,
        actualizarDatosHeader,
        mostrarNotificacion,
        mostrarModalCambiarEstudiante
    };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.inicializar();
});
