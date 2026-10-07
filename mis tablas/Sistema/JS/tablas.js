/**
 * ==========================================================================
 * MultiAventura 4° - Módulo Didáctico de Aprendizaje de Tablas (2 al 10)
 * Visualización concreta de grupos, matrices, patrones, trucos y práctica guiada
 * ==========================================================================
 */

const ModuloTablas = (() => {
    let tablaActual = 2;
    let factorActual = 3;
    let preguntaTallerActual = 0;
    let aciertosTaller = 0;
    let preguntasTaller = [];

    // Colección de Trucos y Patrones Pedagógicos para 4° Básico
    const TRUCOS_TABLAS = {
        2: {
            nombre: 'El Poder de los Dobles',
            icono: '✌️',
            explicacion: 'Multiplicar por 2 es exactamente sumar un número consigo mismo (su doble). ¡Todos los resultados siempre terminan en número par: 0, 2, 4, 6 u 8!'
        },
        3: {
            nombre: 'La Regla Mágica del 3, 6 y 9',
            icono: '✨',
            explicacion: 'Si sumas los dígitos del resultado de cualquier múltiplo de 3, siempre obtendrás 3, 6 o 9. Ejemplo: 3 × 7 = 21 (2 + 1 = 3), 3 × 8 = 24 (2 + 4 = 6).'
        },
        4: {
            nombre: '¡El Doble del Doble!',
            icono: '⚡',
            explicacion: 'Para multiplicar por 4, simplemente duplica el número dos veces. Por ejemplo, para 4 × 7: el doble de 7 es 14, y el doble de 14 es ¡28!'
        },
        5: {
            nombre: 'El Baile del Reloj (0 o 5)',
            icono: '⏰',
            explicacion: '¡Todos los resultados de la tabla del 5 terminan obligatoriamente en 0 o en 5! Son exactamente los minutos marcados en un reloj de pared.'
        },
        6: {
            nombre: 'El Espejo de los Números Pares',
            icono: '🪞',
            explicacion: 'Es el doble de la tabla del 3. Además, si multiplicas 6 por un número par, el resultado termina en ese mismo número: 6 × 2 = 12, 6 × 4 = 24, 6 × 6 = 36, 6 × 8 = 48.'
        },
        7: {
            nombre: 'El Calendario de Semanas',
            icono: '📅',
            explicacion: 'Cada semana tiene exactamente 7 días. Así que 2 semanas son 14 días, 3 semanas son 21 días, y 4 semanas son 28 días. ¡Usa las semanas como guía!'
        },
        8: {
            nombre: 'El Triple Doble (2 × 2 × 2)',
            icono: '🚀',
            explicacion: 'Multiplicar por 8 es duplicar tres veces consecutivas. Para 8 × 5: doble de 5 es 10, doble de 10 es 20, y doble de 20 es ¡40!'
        },
        9: {
            nombre: 'La Escalera de Decenas y el 9',
            icono: '🪜',
            explicacion: 'Al mirar los resultados del 9, las decenas suben (0,1,2,3...) y las unidades bajan (9,8,7,6...). ¡Y ambos dígitos siempre suman 9! Ejemplo: 9 × 6 = 54 (5 + 4 = 9).'
        },
        10: {
            nombre: 'La Magia del Cero Decimal',
            icono: '🎯',
            explicacion: 'Multiplicar por 10 es lo más rápido: solo debes escribir el número y agregarle un cero a la derecha. Ejemplo: 10 × 7 = 70, 10 × 9 = 90.'
        }
    };

    // Íconos visuales de objetos para representar grupos
    const ICONOS_OBJETOS = ['🍎', '⭐', '🎈', '⚽', '🚗', '📚', '🍪', '💎', '🚀', '🐱'];

    function inicializar() {
        renderizarSelectorTablas();
        cargarTabla(2);
    }

    // Renderizar los botones de selección de tabla (2 al 10)
    function renderizarSelectorTablas() {
        const contenedor = document.getElementById('carruselTablas');
        if (!contenedor) return;

        const estudiante = ModuloStorage.obtenerEstudiante();
        const dominadas = (estudiante && estudiante.tablasDominadas) ? estudiante.tablasDominadas : [];

        contenedor.innerHTML = '';
        for (let i = 2; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.className = `btn-pildora-tabla ${i === tablaActual ? 'activa' : ''}`;
            btn.setAttribute('data-tabla', i);

            const registro = dominadas.find(t => t.tabla === i);
            let estrellasHtml = '☆☆☆';
            if (registro) {
                if (registro.porcentaje === 100) estrellasHtml = '⭐⭐⭐';
                else if (registro.porcentaje >= 60) estrellasHtml = '⭐⭐☆';
                else estrellasHtml = '⭐☆☆';
            }

            btn.innerHTML = `
                <span>Tabla del ${i}</span>
                <span class="estrellas-mini">${estrellasHtml}</span>
            `;

            btn.addEventListener('click', () => {
                ModuloAudio.reproducirClic();
                cargarTabla(i);
            });

            contenedor.appendChild(btn);
        }
    }

    // Cargar información de la tabla seleccionada
    function cargarTabla(num) {
        tablaActual = num;
        factorActual = 4; // Factor inicial sugerido

        // Actualizar botón activo en carrusel
        document.querySelectorAll('.btn-pildora-tabla').forEach(b => {
            const t = parseInt(b.getAttribute('data-tabla'), 10);
            b.classList.toggle('activa', t === num);
        });

        // Actualizar título y datos de la tabla
        document.getElementById('lblNumeroTabla').textContent = tablaActual;
        
        // Actualizar Truco / Patrón
        const truco = TRUCOS_TABLAS[tablaActual];
        if (truco) {
            document.getElementById('iconoPatron').textContent = truco.icono;
            document.getElementById('tituloPatron').textContent = truco.nombre;
            document.getElementById('descPatron').textContent = truco.explicacion;
        }

        // Configurar Slider de factores (1 al 10)
        const slider = document.getElementById('sliderFactor');
        if (slider) {
            slider.value = factorActual;
            slider.oninput = (e) => {
                factorActual = parseInt(e.target.value, 10);
                actualizarVisualizadorMultiplicacion();
            };
        }

        actualizarVisualizadorMultiplicacion();
        iniciarTallerPractica();
    }

    // Actualiza la visualización de grupos y ecuaciones
    function actualizarVisualizadorMultiplicacion() {
        const resultado = tablaActual * factorActual;
        const iconoElegido = ICONOS_OBJETOS[(tablaActual + factorActual) % ICONOS_OBJETOS.length];

        // Ecuación central
        document.getElementById('factorTablaA').textContent = tablaActual;
        document.getElementById('factorTablaB').textContent = factorActual;
        document.getElementById('resultadoMultiplicacion').textContent = resultado;

        // Suma Iterada (Repetida)
        const terminosSuma = Array(tablaActual).fill(factorActual).join(' + ');
        document.getElementById('textoExplicacionSuma').innerHTML = `
            <strong>Suma repetida:</strong> ${terminosSuma} = <span style="color:var(--color-dorado-acento); font-weight:900;">${resultado}</span>
        `;

        // Propiedad conmutativa
        document.getElementById('textoConmutativa').innerHTML = `
            💡 <strong>Propiedad Conmutativa:</strong> ${tablaActual} × ${factorActual} da exactamente lo mismo que ${factorActual} × ${tablaActual} = ${resultado}.
        `;

        // Renderizar Grupos Concretos (tablaActual grupos de factorActual elementos)
        const areaGrupos = document.getElementById('areaGruposObjetos');
        areaGrupos.innerHTML = '';

        for (let g = 1; g <= tablaActual; g++) {
            const grupoBox = document.createElement('div');
            grupoBox.className = 'caja-grupo-objeto';
            grupoBox.title = `Grupo #${g} con ${factorActual} elementos`;

            let elementosHtml = '';
            for (let el = 1; el <= factorActual; el++) {
                elementosHtml += `<span class="icono-elemento-grupo">${iconoElegido}</span>`;
            }

            grupoBox.innerHTML = elementosHtml;
            areaGrupos.appendChild(grupoBox);
        }

        // Renderizar Matriz / Arreglo Rectangular (Filas x Columnas)
        const areaMatriz = document.getElementById('areaMatrizCuadricula');
        if (areaMatriz) {
            areaMatriz.style.gridTemplateColumns = `repeat(${factorActual}, 22px)`;
            areaMatriz.innerHTML = '';
            for (let i = 0; i < resultado; i++) {
                const celda = document.createElement('div');
                celda.className = 'celda-matriz';
                areaMatriz.appendChild(celda);
            }
        }
    }

    // =========================================================================
    // Mini-Taller de Práctica Guiada de la Tabla
    // =========================================================================
    function iniciarTallerPractica() {
        preguntaTallerActual = 0;
        aciertosTaller = 0;

        // Generar 5 preguntas aleatorias de la tabla actual
        const factoresPosibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => 0.5 - Math.random());
        preguntasTaller = factoresPosibles.slice(0, 5).map(f => {
            const correcta = tablaActual * f;
            // Generar 3 distractores plausibles
            const distractores = new Set();
            while (distractores.size < 3) {
                const delta = [-4, -3, -2, -1, 1, 2, 3, 4, tablaActual, -tablaActual][Math.floor(Math.random() * 10)];
                const distractor = correcta + delta;
                if (distractor > 0 && distractor !== correcta) {
                    distractores.add(distractor);
                }
            }
            const opciones = [correcta, ...Array.from(distractores)].sort(() => 0.5 - Math.random());
            return {
                factor: f,
                correcta: correcta,
                opciones: opciones
            };
        });

        mostrarPreguntaTaller();
    }

    function mostrarPreguntaTaller() {
        const retro = document.getElementById('retroTaller');
        retro.style.display = 'none';

        if (preguntaTallerActual >= preguntasTaller.length) {
            finalizarTaller();
            return;
        }

        const q = preguntasTaller[preguntaTallerActual];
        document.getElementById('lblContadorPreguntaTaller').textContent = `Pregunta ${preguntaTallerActual + 1} de 5`;
        document.getElementById('textoPreguntaTaller').textContent = `${tablaActual} × ${q.factor} = ?`;

        const contenedorOpciones = document.getElementById('opcionesTallerGrid');
        contenedorOpciones.innerHTML = '';

        q.opciones.forEach(opc => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcion-taller';
            btn.textContent = opc;

            btn.addEventListener('click', () => {
                validarRespuestaTaller(btn, opc, q.correcta, q.factor);
            });

            contenedorOpciones.appendChild(btn);
        });
    }

    function validarRespuestaTaller(botonPulsado, respuestaElegida, correcta, factor) {
        // Deshabilitar temporalmente las opciones
        const botones = document.querySelectorAll('.btn-opcion-taller');
        botones.forEach(b => b.disabled = true);

        const retro = document.getElementById('retroTaller');
        retro.style.display = 'block';

        if (respuestaElegida === correcta) {
            botonPulsado.classList.add('acierto');
            ModuloAudio.reproducirAcierto();
            aciertosTaller++;
            retro.className = 'retroalimentacion-inmediata' ;
            retro.style.backgroundColor = 'var(--color-verde-suave)';
            retro.style.color = 'var(--color-verde-exito)';
            retro.innerHTML = `🎉 ¡Excelente! ${tablaActual} × ${factor} es exactamente ${correcta}. ¡Suma repetida de ${tablaActual} veces ${factor}!`;
            
            // Sumar puntos inmediatos
            ModuloStorage.sumarPuntos(15, 1);
            if (typeof App !== 'undefined') App.actualizarDatosHeader();
        } else {
            botonPulsado.classList.add('error');
            ModuloAudio.reproducirError();
            // Marcar cuál era la correcta
            botones.forEach(b => {
                if (parseInt(b.textContent, 10) === correcta) {
                    b.classList.add('acierto');
                }
            });

            retro.className = 'retroalimentacion-inmediata';
            retro.style.backgroundColor = 'var(--color-rojo-suave)';
            retro.style.color = 'var(--color-rojo-alerta)';
            retro.innerHTML = `💡 Casi lo tienes. ${tablaActual} × ${factor} = ${correcta}. Recuerda: ${tablaActual} grupos de ${factor} suman ${correcta}. ¡Ánimo!`;
        }

        setTimeout(() => {
            preguntaTallerActual++;
            mostrarPreguntaTaller();
        }, 2200);
    }

    function finalizarTaller() {
        const contenedor = document.getElementById('tallerPreguntaContenedor');
        const retro = document.getElementById('retroTaller');
        retro.style.display = 'none';

        const porcentaje = Math.round((aciertosTaller / preguntasTaller.length) * 100);
        ModuloStorage.registrarTablaCompletada(tablaActual, aciertosTaller, preguntasTaller.length);

        ModuloAudio.reproducirVictoria();

        contenedor.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <div style="font-size: 3.5rem; margin-bottom: 10px;">
                    ${porcentaje >= 80 ? '🌟🥇' : porcentaje >= 60 ? '👍🥈' : '💪🥉'}
                </div>
                <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                    ¡Taller de la Tabla del ${tablaActual} Terminado!
                </h3>
                <p style="font-size: 1.15rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 18px;">
                    Obtuviste <strong>${aciertosTaller} de 5 correctas</strong> (${porcentaje}% de dominio).
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button id="btnReintentarTaller" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Repetir para mejorar resultado
                    </button>
                    <button id="btnSiguienteTabla" class="btn-volver" style="border-color: var(--color-dorado-acento);">
                        ➡️ Explorar siguiente tabla
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btnReintentarTaller').addEventListener('click', () => {
            ModuloAudio.reproducirClic();
            iniciarTallerPractica();
        });

        document.getElementById('btnSiguienteTabla').addEventListener('click', () => {
            ModuloAudio.reproducirClic();
            const prox = tablaActual < 10 ? tablaActual + 1 : 2;
            cargarTabla(prox);
        });

        renderizarSelectorTablas();
        if (typeof App !== 'undefined') App.actualizarDatosHeader();
    }

    return {
        inicializar,
        cargarTabla,
        renderizarSelectorTablas
    };
})();
