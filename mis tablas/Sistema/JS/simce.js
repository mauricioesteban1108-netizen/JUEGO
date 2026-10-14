/**
 * ==========================================================================
 * MultiAventura 4° - Módulo de Ensayo Matemático Tipo SIMCE
 * Situaciones contextualizadas para estudiantes de 4° Básico (Mineduc)
 * Panel lateral interactivo (preguntas 1 al 10), registro, puntaje y retroalimentación
 * ==========================================================================
 */

const ModuloSimce = (() => {
    let preguntaActivaIndex = 0;
    let respuestasEstudiante = {}; // { 0: 'C', 1: 'B', ... }

    // 10 Preguntas oficiales contextualizadas para 4° básico
    const PREGUNTAS_SIMCE = [
        {
            numero: 1,
            contexto: '🛒 Compras y Precios en la Kermesse',
            icono: '🧃',
            enunciado: 'Para el puesto de comida de la kermesse escolar, Martina compró 6 paquetes de jugos en caja. Si cada paquete contiene exactamente 4 jugos, ¿cuántos jugos en caja compró Martina en total?',
            opciones: [
                { letra: 'A', texto: '10 jugos en caja' },
                { letra: 'B', texto: '20 jugos en caja' },
                { letra: 'C', texto: '24 jugos en caja' },
                { letra: 'D', texto: '28 jugos en caja' }
            ],
            correcta: 'C',
            operacionTexto: '6 × 4 = 24',
            explicacion: 'Para calcular el total, multiplicamos la cantidad de paquetes (6) por los jugos que contiene cada uno (4): 6 × 4 = 24 jugos.'
        },
        {
            numero: 2,
            contexto: '🏫 Organización de Grupos en el Patio',
            icono: '🧑‍🤝‍🧑',
            enunciado: 'En el acto escolar de los días lunes, los profesores organizaron a los alumnos de 4° básico en 8 filas iguales. En cada fila se ubicaron 7 estudiantes. ¿Cuántos estudiantes hay formados en total en el patio?',
            opciones: [
                { letra: 'A', texto: '15 estudiantes' },
                { letra: 'B', texto: '54 estudiantes' },
                { letra: 'C', texto: '56 estudiantes' },
                { letra: 'D', texto: '64 estudiantes' }
            ],
            correcta: 'C',
            operacionTexto: '8 × 7 = 56',
            explicacion: 'En un arreglo rectangular o de filas, se multiplican las 8 filas por los 7 estudiantes de cada una: 8 × 7 = 56 estudiantes.'
        },
        {
            numero: 3,
            contexto: '🎨 Distribución de Materiales Escolares',
            icono: '🖍️',
            enunciado: 'El profesor de Artes Plásticas repartió cajas con témperas a 9 equipos de trabajo en la sala. Si a cada equipo le entregó una caja con 8 témperas de colores, ¿cuántas témperas repartió en total el profesor?',
            opciones: [
                { letra: 'A', texto: '64 témperas' },
                { letra: 'B', texto: '72 témperas' },
                { letra: 'C', texto: '81 témperas' },
                { letra: 'D', texto: '88 témperas' }
            ],
            correcta: 'B',
            operacionTexto: '9 × 8 = 72',
            explicacion: 'Multiplicamos los 9 equipos por las 8 témperas de cada caja: 9 × 8 = 72 témperas repartidas.'
        },
        {
            numero: 4,
            contexto: '🌱 Huerto Escolar y Siembra',
            icono: '🥬',
            enunciado: 'En el taller de ciencias de la escuela, los estudiantes prepararon un huerto escolar y plantaron 5 hileras de lechugas. Si en cada hilera plantaron 9 lechugas, ¿cuántas lechugas plantaron en total?',
            opciones: [
                { letra: 'A', texto: '40 lechugas' },
                { letra: 'B', texto: '45 lechugas' },
                { letra: 'C', texto: '54 lechugas' },
                { letra: 'D', texto: '59 lechugas' }
            ],
            correcta: 'B',
            operacionTexto: '5 × 9 = 45',
            explicacion: 'Multiplicamos las 5 hileras por las 9 lechugas de cada hilera: 5 × 9 = 45 lechugas en total.'
        },
        {
            numero: 5,
            contexto: '🏀 Juegos y Puntajes en Educación Física',
            icono: '🏆',
            enunciado: 'En un campeonato deportivo del colegio, el equipo de 4° básico anotó 7 lanzamientos especiales en el segundo tiempo. Si cada uno de esos lanzamientos otorgaba 3 puntos, ¿cuántos puntos sumaron en esa etapa?',
            opciones: [
                { letra: 'A', texto: '10 puntos' },
                { letra: 'B', texto: '21 puntos' },
                { letra: 'C', texto: '24 puntos' },
                { letra: 'D', texto: '27 puntos' }
            ],
            correcta: 'B',
            operacionTexto: '7 × 3 = 21',
            explicacion: 'Multiplicamos los 7 lanzamientos por el valor de cada uno (3 puntos): 7 × 3 = 21 puntos.'
        },
        {
            numero: 6,
            contexto: '📚 Biblioteca y Cantidad de Objetos',
            icono: '📖',
            enunciado: 'A la biblioteca del colegio llegaron 4 cajas grandes con libros de cuentos para fomentar la lectura. Si cada caja contiene 9 libros, ¿cuántos libros de cuentos llegaron en total a la biblioteca?',
            opciones: [
                { letra: 'A', texto: '13 libros' },
                { letra: 'B', texto: '32 libros' },
                { letra: 'C', texto: '36 libros' },
                { letra: 'D', texto: '45 libros' }
            ],
            correcta: 'C',
            operacionTexto: '4 × 9 = 36',
            explicacion: 'Multiplicamos las 4 cajas por los 9 libros que contiene cada una: 4 × 9 = 36 libros.'
        },
        {
            numero: 7,
            contexto: '🥧 Repostería y Situaciones Escolares',
            icono: '🥟',
            enunciado: 'Para celebrar el aniversario del colegio, los apoderados hornearon empanaditas y las acomodaron en 7 bandejas grandes. Si colocaron 6 empanaditas en cada bandeja, ¿cuántas empanaditas tienen en total?',
            opciones: [
                { letra: 'A', texto: '36 empanaditas' },
                { letra: 'B', texto: '40 empanaditas' },
                { letra: 'C', texto: '42 empanaditas' },
                { letra: 'D', texto: '48 empanaditas' }
            ],
            correcta: 'C',
            operacionTexto: '7 × 6 = 42',
            explicacion: 'Multiplicamos las 7 bandejas por las 6 empanaditas de cada una: 7 × 6 = 42 empanaditas.'
        },
        {
            numero: 8,
            contexto: '🌟 Álbum de Láminas y Colección',
            icono: '✨',
            enunciado: 'Tomás completó 8 páginas de su álbum del sistema solar. Si en cada una de esas páginas pegó 6 láminas espaciales, ¿cuántas láminas pegó en total en esas 8 páginas?',
            opciones: [
                { letra: 'A', texto: '14 láminas' },
                { letra: 'B', texto: '42 láminas' },
                { letra: 'C', texto: '48 láminas' },
                { letra: 'D', texto: '54 láminas' }
            ],
            correcta: 'C',
            operacionTexto: '8 × 6 = 48',
            explicacion: 'Multiplicamos las 8 páginas por las 6 láminas pegadas en cada una: 8 × 6 = 48 láminas.'
        },
        {
            numero: 9,
            contexto: '🚌 Transporte para el Paseo Escolar',
            icono: '🚐',
            enunciado: 'Para ir al museo de historia natural, los cursos viajaron en 6 furgones escolares. Si en cada furgón viajaban exactamente 8 estudiantes con cinturón de seguridad, ¿cuántos estudiantes viajaron al museo?',
            opciones: [
                { letra: 'A', texto: '44 estudiantes' },
                { letra: 'B', texto: '48 estudiantes' },
                { letra: 'C', texto: '52 estudiantes' },
                { letra: 'D', texto: '56 estudiantes' }
            ],
            correcta: 'B',
            operacionTexto: '6 × 8 = 48',
            explicacion: 'Multiplicamos los 6 furgones por los 8 estudiantes en cada uno: 6 × 8 = 48 estudiantes.'
        },
        {
            numero: 10,
            contexto: '💰 Ahorro Semanal para el Regalo',
            icono: '🪙',
            enunciado: 'Francisca ahorró durante 5 semanas para comprar un libro infantil. Si cada semana guardó 10 monedas de \$100 en su alcancía, ¿cuántas monedas reunió Francisca al terminar las 5 semanas?',
            opciones: [
                { letra: 'A', texto: '15 monedas' },
                { letra: 'B', texto: '45 monedas' },
                { letra: 'C', texto: '50 monedas' },
                { letra: 'D', texto: '100 monedas' }
            ],
            correcta: 'C',
            operacionTexto: '5 × 10 = 50',
            explicacion: 'Multiplicamos las 5 semanas por las 10 monedas guardadas por semana: 5 × 10 = 50 monedas en total.'
        }
    ];

    function inicializar() {
        respuestasEstudiante = {};
        preguntaActivaIndex = 0;
        renderizarPanelLateral();
        cargarPregunta(0);
        configurarBotonFinalizar();
    }

    // Renderizar los 10 botones del panel lateral
    function renderizarPanelLateral() {
        const contenedor = document.getElementById('grillaNavegadorSimce');
        if (!contenedor) return;

        contenedor.innerHTML = '';
        PREGUNTAS_SIMCE.forEach((p, idx) => {
            const btn = document.createElement('button');
            btn.className = `btn-navegacion-pregunta ${idx === preguntaActivaIndex ? 'activa' : ''} ${respuestasEstudiante[idx] ? 'respondida' : ''}`;
            btn.textContent = idx + 1;
            btn.title = `Pregunta #${idx + 1}`;

            btn.onclick = () => {
                ModuloAudio.reproducirClic();
                cargarPregunta(idx);
            };

            contenedor.appendChild(btn);
        });

        // Actualizar contador de respondidas
        const respondidasCount = Object.keys(respuestasEstudiante).length;
        const textoResumen = document.getElementById('textoResumenRespuestasSimce');
        if (textoResumen) {
            textoResumen.textContent = `Respondidas: ${respondidasCount} de ${PREGUNTAS_SIMCE.length}`;
        }
    }

    // Cargar la pregunta activa en el área principal
    function cargarPregunta(index) {
        preguntaActivaIndex = index;
        const p = PREGUNTAS_SIMCE[index];

        // Actualizar estado en panel lateral
        renderizarPanelLateral();

        // Actualizar UI
        document.getElementById('etiquetaContextoSimce').textContent = p.contexto;
        document.getElementById('iconoContextoSimce').textContent = p.icono;
        document.getElementById('enunciadoPreguntaSimce').textContent = `${p.numero}. ${p.enunciado}`;

        // Renderizar alternativas
        const contenedorOpciones = document.getElementById('grillaAlternativasSimce');
        contenedorOpciones.innerHTML = '';

        p.opciones.forEach(op => {
            const esSeleccionada = respuestasEstudiante[index] === op.letra;

            const btn = document.createElement('div');
            btn.className = `opcion-alternativa-btn ${esSeleccionada ? 'seleccionada' : ''}`;
            btn.innerHTML = `
                <div class="letra-alternativa">${op.letra}</div>
                <div class="texto-alternativa">${op.texto}</div>
            `;

            btn.onclick = () => {
                ModuloAudio.reproducirClic();
                respuestasEstudiante[index] = op.letra;
                cargarPregunta(index); // Re-renderizar con la selección activa
            };

            contenedorOpciones.appendChild(btn);
        });

        // Botones de navegación Anterior / Siguiente
        const btnAnt = document.getElementById('btnSimceAnterior');
        const btnSig = document.getElementById('btnSimceSiguiente');

        if (btnAnt) {
            btnAnt.disabled = (index === 0);
            btnAnt.onclick = () => {
                if (index > 0) {
                    ModuloAudio.reproducirClic();
                    cargarPregunta(index - 1);
                }
            };
        }

        if (btnSig) {
            btnSig.disabled = (index === PREGUNTAS_SIMCE.length - 1);
            btnSig.onclick = () => {
                if (index < PREGUNTAS_SIMCE.length - 1) {
                    ModuloAudio.reproducirClic();
                    cargarPregunta(index + 1);
                }
            };
        }
    }

    // Configurar el botón "Finalizar y Evaluar Ensayo"
    function configurarBotonFinalizar() {
        const btnFinalizar = document.getElementById('btnFinalizarEnsayoSimce');
        if (!btnFinalizar) return;

        btnFinalizar.onclick = () => {
            const total = PREGUNTAS_SIMCE.length;
            const respondidas = Object.keys(respuestasEstudiante).length;

            if (respondidas < total) {
                const faltantes = [];
                for (let i = 0; i < total; i++) {
                    if (!respuestasEstudiante[i]) faltantes.push(i + 1);
                }

                alert(`Aún faltan ${total - respondidas} preguntas por responder (preguntas: ${faltantes.join(', ')}). Completa todas para evaluar el ensayo.`);
                cargarPregunta(faltantes[0] - 1);
                return;
            }

            evaluarEnsayo();
        };
    }

    // Evaluar y mostrar la pantalla de resultados y retroalimentación pedagógica
    function evaluarEnsayo() {
        let puntaje = 0;
        const desglose = [];

        PREGUNTAS_SIMCE.forEach((p, idx) => {
            const resp = respuestasEstudiante[idx] || 'Sin responder';
            const esCorrecta = (resp === p.correcta);
            if (esCorrecta) puntaje++;

            desglose.push({
                numero: p.numero,
                contexto: p.contexto,
                enunciado: p.enunciado,
                elegida: resp,
                correcta: p.correcta,
                esCorrecta: esCorrecta,
                operacionTexto: p.operacionTexto,
                explicacion: p.explicacion
            });
        });

        // Guardar en Storage
        const registro = ModuloStorage.guardarEnsayoSimce(puntaje, PREGUNTAS_SIMCE.length, desglose);

        // Sonido de fanfarria
        ModuloAudio.reproducirVictoria();

        // Mostrar pantalla de resultados
        mostrarPantallaResultados(registro, desglose);
    }

    function mostrarPantallaResultados(registro, desglose) {
        const contenedorSimce = document.getElementById('contenedorModuloSimce');
        if (!contenedorSimce) return;

        let claseNivel = 'nivel-insuficiente';
        let mensajeNivel = 'Nivel Insuficiente: Necesitas repasar las tablas en los módulos interactivos para consolidar el aprendizaje.';
        if (registro.nivel === 'Adecuado') {
            claseNivel = 'nivel-adecuado';
            mensajeNivel = '¡Nivel Adecuado! Sobresaliente dominio en situaciones matemáticas de 4° básico.';
        } else if (registro.nivel === 'Elemental') {
            claseNivel = 'nivel-elemental';
            mensajeNivel = '¡Nivel Elemental! Buen desempeño general; continúa practicando para llegar al máximo nivel.';
        }

        contenedorSimce.innerHTML = `
            <div class="pantalla-resultados-simce">
                <div style="font-size: 3.5rem; margin-bottom: 8px;">📊📑🏆</div>
                <h2 style="font-size: 2.2rem; color: var(--color-azul-oscuro); margin-bottom: 6px;">
                    Resultados del Ensayo Matemático SIMCE 4°
                </h2>
                <p style="font-size: 1.05rem; color: var(--color-texto-secundario); font-weight: 600;">
                    Evaluación de tablas de multiplicar aplicadas a situaciones de la vida cotidiana.
                </p>

                <div class="tarjeta-puntaje-simce">
                    <div style="font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                        Puntaje Obtenido
                    </div>
                    <div class="valor-puntaje-grande">
                        ${registro.puntaje} / ${registro.total}
                    </div>
                    <div style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">
                        ${registro.porcentaje}% de Aciertos
                    </div>
                    <div class="insignia-nivel-desempeno ${claseNivel}">
                        ${registro.nivel.toUpperCase()}
                    </div>
                    <p style="margin-top: 14px; font-size: 0.95rem; font-weight: 600; max-width: 550px; margin-left: auto; margin-right: auto;">
                        ${mensajeNivel}
                    </p>
                </div>

                <!-- Botones de Acción -->
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 35px;">
                    <button id="btnReintentarSimce" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema); padding: 12px 24px;">
                        🔄 Reintentar Ensayo SIMCE
                    </button>
                    <button id="btnVolverMenuDesdeSimce" class="btn-volver" style="padding: 12px 24px;">
                        🏠 Volver al Menú Principal
                    </button>
                </div>

                <!-- Desglose y Retroalimentación Detallada -->
                <div class="desglose-respuestas-simce">
                    <h3 style="font-size: 1.5rem; color: var(--color-azul-oscuro); margin-bottom: 18px; border-bottom: 2px solid var(--color-crema-oscuro); padding-bottom: 8px;">
                        Retroalimentación Pregunta por Pregunta:
                    </h3>
                    ${desglose.map(item => `
                        <div class="item-revision-pregunta ${item.esCorrecta ? 'correcta' : 'incorrecta'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <strong style="color: var(--color-azul-oscuro); font-size: 1.05rem;">
                                    Pregunta ${item.numero}: ${item.contexto}
                                </strong>
                                <span style="font-weight: 800; color: ${item.esCorrecta ? 'var(--color-verde-exito)' : 'var(--color-rojo-alerta)'};">
                                    ${item.esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
                                </span>
                            </div>
                            <p style="font-size: 0.95rem; color: var(--color-texto-secundario); margin-bottom: 8px;">
                                ${item.enunciado}
                            </p>
                            <div style="font-size: 0.9rem; font-weight: 700;">
                                Tu respuesta: <strong style="color: ${item.esCorrecta ? 'var(--color-verde-exito)' : 'var(--color-rojo-alerta)'};">${item.elegida}</strong> |
                                Respuesta Correcta: <strong style="color: var(--color-verde-exito);">${item.correcta}</strong>
                            </div>
                            <div class="explicacion-pedagogica">
                                💡 <strong>Justificación Matemática (${item.operacionTexto}):</strong> ${item.explicacion}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('btnReintentarSimce').onclick = () => {
            ModuloAudio.reproducirClic();
            inicializar();
        };

        document.getElementById('btnVolverMenuDesdeSimce').onclick = () => {
            ModuloAudio.reproducirClic();
            if (typeof App !== 'undefined') App.navegarA('menu');
        };

        if (typeof App !== 'undefined') App.actualizarDatosHeader();
    }

    return {
        inicializar,
        cargarPregunta
    };
})();
