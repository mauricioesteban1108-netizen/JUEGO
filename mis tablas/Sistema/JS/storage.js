/**
 * ==========================================================================
 * MultiAventura 4° - Módulo de Almacenamiento, Progreso y Logros
 * Gestiona el perfil del estudiante, persistencia en localStorage y recompensas
 * ==========================================================================
 */

const ModuloStorage = (() => {
    const CLAVE_STORAGE = 'estudiante_multiaventura';

    // Lista de Logros Oficiales
    const LOGROS_SISTEMA = [
        {
            id: 'primer_paso',
            titulo: 'Primer Paso',
            descripcion: 'Completa tu primer taller interactivo de una tabla.',
            icono: '🌱',
            puntosRecompensa: 50
        },
        {
            id: 'memoria_pro',
            titulo: 'Memoria de Elefante',
            descripcion: 'Encuentra todas las parejas en el juego de Memoria Matemática.',
            icono: '🧠',
            puntosRecompensa: 75
        },
        {
            id: 'reflejos_rayo',
            titulo: 'Reflejos de Rayo',
            descripcion: 'Atrapa 5 resultados seguidos sin fallar.',
            icono: '⚡',
            puntosRecompensa: 80
        },
        {
            id: 'arquitecto_multiplo',
            titulo: 'Constructor Experto',
            descripcion: 'Agrupa objetos correctamente en Construye la Multiplicación.',
            icono: '🧱',
            puntosRecompensa: 70
        },
        {
            id: 'detective_oro',
            titulo: 'Detective Numérico',
            descripcion: 'Descubre el número oculto resolviendo todas las pistas.',
            icono: '🔍',
            puntosRecompensa: 90
        },
        {
            id: 'carrera_reloj',
            titulo: 'Contra el Tiempo',
            descripcion: 'Consigue más de 6 respuestas correctas en 60 segundos.',
            icono: '⏱️',
            puntosRecompensa: 100
        },
        {
            id: 'tres_tablas',
            titulo: 'Trío Dorado',
            descripcion: 'Domina satisfactoriamente al menos 3 tablas de multiplicar.',
            icono: '⭐',
            puntosRecompensa: 120
        },
        {
            id: 'campeon_simce',
            titulo: 'Estrella SIMCE 4°',
            descripcion: 'Obtén Nivel Adecuado en el Ensayo Matemático SIMCE.',
            icono: '🏆',
            puntosRecompensa: 200
        }
    ];

    // Obtener datos del estudiante actual
    function obtenerEstudiante() {
        const raw = localStorage.getItem(CLAVE_STORAGE);
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            // Asegurar integridad de propiedades
            if (!Array.isArray(data.tablasDominadas)) data.tablasDominadas = [];
            if (!data.desafiosCompletados) data.desafiosCompletados = {};
            if (!Array.isArray(data.logros)) data.logros = [];
            if (!Array.isArray(data.ensayosSimce)) data.ensayosSimce = [];
            if (typeof data.puntos !== 'number') data.puntos = 0;
            if (typeof data.estrellas !== 'number') data.estrellas = 0;
            return data;
        } catch (e) {
            console.error('Error al leer datos de estudiante:', e);
            return null;
        }
    }

    // Guardar estudiante
    function guardarEstudiante(datos) {
        if (!datos) return;
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
    }

    // Sumar puntos y recalcular nivel
    function sumarPuntos(cantidad, estrellasExtra = 0) {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return null;

        estudiante.puntos += cantidad;
        estudiante.estrellas += estrellasExtra;

        // Calcular nivel
        const nivelAnterior = estudiante.nivel || 1;
        estudiante.nivel = calcularNivel(estudiante.puntos);

        guardarEstudiante(estudiante);

        const subioNivel = estudiante.nivel > nivelAnterior;
        return {
            puntosTotales: estudiante.puntos,
            estrellasTotales: estudiante.estrellas,
            nivel: estudiante.nivel,
            subioNivel: subioNivel
        };
    }

    // Cálculo del nivel según puntos acumulados
    function calcularNivel(puntos) {
        if (puntos >= 1200) return 5;
        if (puntos >= 750) return 4;
        if (puntos >= 400) return 3;
        if (puntos >= 150) return 2;
        return 1;
    }

    function obtenerNombreNivel(nivel) {
        switch (nivel) {
            case 5: return 'Genio SIMCE 4° Básico';
            case 4: return 'Maestro de las Tablas';
            case 3: return 'Estratega Matemático';
            case 2: return 'Explorador Numérico';
            default: return 'Aprendiz Matemático';
        }
    }

    // Registrar progreso en una tabla específica (2 al 10)
    function registrarTablaCompletada(numeroTabla, aciertos, total) {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return;

        const porcentaje = Math.round((aciertos / total) * 100);
        
        // Buscar si ya existía registro
        const index = estudiante.tablasDominadas.findIndex(t => t.tabla === numeroTabla);
        const infoTabla = {
            tabla: numeroTabla,
            porcentaje: porcentaje,
            aciertos: aciertos,
            fecha: new Date().toLocaleDateString()
        };

        if (index >= 0) {
            // Guardar el mejor resultado
            if (porcentaje >= estudiante.tablasDominadas[index].porcentaje) {
                estudiante.tablasDominadas[index] = infoTabla;
            }
        } else {
            estudiante.tablasDominadas.push(infoTabla);
        }

        guardarEstudiante(estudiante);

        // Desbloquear logro 'Primer Paso'
        desbloquearLogro('primer_paso');

        // Si ya dominó 3 tablas con 80% o más
        const tablasAprobadas = estudiante.tablasDominadas.filter(t => t.porcentaje >= 80).length;
        if (tablasAprobadas >= 3) {
            desbloquearLogro('tres_tablas');
        }
    }

    // Registrar juego completado
    function registrarJuego(nombreJuego, resultado) {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return;

        if (!estudiante.desafiosCompletados[nombreJuego]) {
            estudiante.desafiosCompletados[nombreJuego] = [];
        }

        estudiante.desafiosCompletados[nombreJuego].push({
            fecha: new Date().toLocaleDateString(),
            resultado: resultado
        });

        guardarEstudiante(estudiante);
    }

    // Desbloquear un logro
    function desbloquearLogro(idLogro) {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return false;

        if (!estudiante.logros.includes(idLogro)) {
            estudiante.logros.push(idLogro);

            const metaLogro = LOGROS_SISTEMA.find(l => l.id === idLogro);
            if (metaLogro) {
                estudiante.puntos += metaLogro.puntosRecompensa;
                estudiante.nivel = calcularNivel(estudiante.puntos);
            }

            guardarEstudiante(estudiante);

            if (typeof ModuloAudio !== 'undefined') {
                ModuloAudio.reproducirLogro();
            }

            if (typeof App !== 'undefined' && App.mostrarNotificacion) {
                App.mostrarNotificacion(`🏆 ¡Nuevo Logro Desbloqueado! "${metaLogro ? metaLogro.titulo : idLogro}"`);
            }

            return true;
        }
        return false;
    }

    // Verificar si el Ensayo SIMCE está desbloqueado
    function estaSimceHabilitado() {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return false;

        // Condición: tener al menos 120 puntos O completar 2 talleres de tablas.
        const tablasPracticadas = estudiante.tablasDominadas.length;
        return (estudiante.puntos >= 120 || tablasPracticadas >= 2);
    }

    // Guardar resultado de ensayo SIMCE
    function guardarEnsayoSimce(puntaje, totalPreguntas, respuestasDetalle) {
        const estudiante = obtenerEstudiante();
        if (!estudiante) return;

        const porcentaje = Math.round((puntaje / totalPreguntas) * 100);
        let nivelSimce = 'Insuficiente';
        if (puntaje >= 8) nivelSimce = 'Adecuado';
        else if (puntaje >= 5) nivelSimce = 'Elemental';

        const registro = {
            fecha: new Date().toLocaleString(),
            puntaje: puntaje,
            total: totalPreguntas,
            porcentaje: porcentaje,
            nivel: nivelSimce,
            respuestas: respuestasDetalle
        };

        estudiante.ensayosSimce.unshift(registro);

        // Bonificación de puntos por SIMCE
        const puntosGanados = puntaje * 25;
        estudiante.puntos += puntosGanados;
        estudiante.estrellas += (puntaje >= 8 ? 5 : puntaje >= 5 ? 3 : 1);
        estudiante.nivel = calcularNivel(estudiante.puntos);

        guardarEstudiante(estudiante);

        if (nivelSimce === 'Adecuado') {
            desbloquearLogro('campeon_simce');
        }

        return registro;
    }

    return {
        obtenerEstudiante,
        guardarEstudiante,
        sumarPuntos,
        calcularNivel,
        obtenerNombreNivel,
        registrarTablaCompletada,
        registrarJuego,
        desbloquearLogro,
        estaSimceHabilitado,
        guardarEnsayoSimce,
        LOGROS_SISTEMA
    };
})();
