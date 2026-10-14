/**
 * ==========================================================================
 * MultiAventura 4° - Módulo de Juegos y Desafíos No Monótonos
 * Implementa 7 modalidades dinámicas:
 * 1. Memoria Matemática
 * 2. Atrapa el Resultado
 * 3. Construye la Multiplicación
 * 4. ¿Quién tiene la respuesta?
 * 5. Desafío contra el Tiempo
 * 6. Arrastra y Completa
 * 7. Detective Matemático
 * ==========================================================================
 */

const ModuloJuegos = (() => {
    let juegoActivo = 'memoria';

    // =========================================================================
    // INICIALIZACIÓN Y SELECTOR DE JUEGOS
    // =========================================================================
    function inicializar() {
        configurarNavegacionSubmenu();
        cargarJuego('memoria');
    }

    function configurarNavegacionSubmenu() {
        const tarjetas = document.querySelectorAll('.tarjeta-juego-item');
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                const tipo = tarjeta.getAttribute('data-juego');
                ModuloAudio.reproducirClic();
                cargarJuego(tipo);
            });
        });
    }

    function cargarJuego(tipo) {
        juegoActivo = tipo;
        document.querySelectorAll('.tarjeta-juego-item').forEach(t => {
            t.classList.toggle('activo', t.getAttribute('data-juego') === tipo);
        });

        const arena = document.getElementById('arenaJuegoContenedor');
        if (!arena) return;

        switch (tipo) {
            case 'memoria':
                iniciarMemoriaMatematica(arena);
                break;
            case 'atrapa':
                iniciarAtrapaResultado(arena);
                break;
            case 'construye':
                iniciarConstruyeMultiplicacion(arena);
                break;
            case 'quien_tiene':
                iniciarQuienTieneLaRespuesta(arena);
                break;
            case 'tiempo':
                iniciarDesafioContraElTiempo(arena);
                break;
            case 'arrastra':
                iniciarArrastraYCompleta(arena);
                break;
            case 'detective':
                iniciarDetectiveMatematico(arena);
                break;
        }
    }

    // =========================================================================
    // 1. MEMORIA MATEMÁTICA
    // =========================================================================
    function iniciarMemoriaMatematica(arena) {
        const paresBase = [
            { operacion: '6 × 7', valor: 42 },
            { operacion: '8 × 4', valor: 32 },
            { operacion: '9 × 5', valor: 45 },
            { operacion: '7 × 3', valor: 21 },
            { operacion: '4 × 6', valor: 24 },
            { operacion: '8 × 8', valor: 64 }
        ];

        let cartas = [];
        paresBase.forEach((p, idx) => {
            cartas.push({ id: idx, tipo: 'op', texto: p.operacion, valor: p.valor });
            cartas.push({ id: idx, tipo: 'res', texto: `${p.valor}`, valor: p.valor });
        });

        cartas.sort(() => 0.5 - Math.random());

        arena.innerHTML = `
            <div class="barra-estado-juego">
                <div><strong>🧠 Memoria Matemática:</strong> Encuentra las parejas que relacionan la operación con su producto.</div>
                <div>Movimientos: <strong id="memoriaMovimientos">0</strong> | Parejas: <strong id="memoriaParejas">0 / 6</strong></div>
            </div>
            <div class="tablero-memoria" id="tableroMemoria"></div>
        `;

        const tablero = document.getElementById('tableroMemoria');
        let primeraCarta = null;
        let segundaCarta = null;
        let bloqueado = false;
        let movimientos = 0;
        let parejasEncontradas = 0;

        cartas.forEach((c, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'carta-memoria';
            cardEl.dataset.index = index;
            cardEl.dataset.valor = c.valor;
            cardEl.dataset.id = c.id;
            cardEl.innerHTML = '<span>?</span>';

            cardEl.addEventListener('click', () => {
                if (bloqueado || cardEl.classList.contains('volteada') || cardEl.classList.contains('emparejada')) return;

                ModuloAudio.reproducirClic();
                cardEl.classList.add('volteada');
                cardEl.innerHTML = `<span>${c.texto}</span>`;

                if (!primeraCarta) {
                    primeraCarta = { el: cardEl, data: c };
                } else {
                    segundaCarta = { el: cardEl, data: c };
                    bloqueado = true;
                    movimientos++;
                    document.getElementById('memoriaMovimientos').textContent = movimientos;

                    if (primeraCarta.data.id === segundaCarta.data.id && primeraCarta.data.tipo !== segundaCarta.data.tipo) {
                        // Pareja correcta
                        setTimeout(() => {
                            primeraCarta.el.classList.add('emparejada');
                            segundaCarta.el.classList.add('emparejada');
                            ModuloAudio.reproducirAcierto();
                            parejasEncontradas++;
                            document.getElementById('memoriaParejas').textContent = `${parejasEncontradas} / 6`;
                            primeraCarta = null;
                            segundaCarta = null;
                            bloqueado = false;

                            if (parejasEncontradas === 6) {
                                finalizarMemoria(movimientos);
                            }
                        }, 500);
                    } else {
                        // Pareja incorrecta
                        setTimeout(() => {
                            ModuloAudio.reproducirError();
                            primeraCarta.el.classList.remove('volteada');
                            segundaCarta.el.classList.remove('volteada');
                            primeraCarta.el.innerHTML = '<span>?</span>';
                            segundaCarta.el.innerHTML = '<span>?</span>';
                            primeraCarta = null;
                            segundaCarta = null;
                            bloqueado = false;
                        }, 1000);
                    }
                }
            });

            tablero.appendChild(cardEl);
        });

        function finalizarMemoria(movs) {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.sumarPuntos(70, 3);
            ModuloStorage.desbloquearLogro('memoria_pro');
            ModuloStorage.registrarJuego('Memoria Matemática', `${movs} movimientos`);
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            setTimeout(() => {
                arena.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 3.5rem; margin-bottom: 12px;">🎉🧠⭐</div>
                        <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                            ¡Gran Memoria Matemática!
                        </h3>
                        <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                            Encontraste todas las 6 parejas en <strong>${movs} movimientos</strong>. ¡Ganaste +70 puntos y 3 estrellas!
                        </p>
                        <button id="btnReiniciarMemoria" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                            🔄 Jugar otra partida
                        </button>
                    </div>
                `;
                document.getElementById('btnReiniciarMemoria').addEventListener('click', () => {
                    cargarJuego('memoria');
                });
            }, 600);
        }
    }

    // =========================================================================
    // 2. ATRAPA EL RESULTADO (Reflejos y Burbujas)
    // =========================================================================
    let temporizadorAtrapa = null;
    function iniciarAtrapaResultado(arena) {
        clearInterval(temporizadorAtrapa);
        let puntosJuego = 0;
        let ronda = 1;
        const totalRondas = 5;
        let aciertosSeguidos = 0;

        function cargarRonda() {
            if (ronda > totalRondas) {
                finalizarAtrapa();
                return;
            }

            const factorA = Math.floor(Math.random() * 8) + 2; // 2 al 9
            const factorB = Math.floor(Math.random() * 9) + 2; // 2 al 10
            const correcta = factorA * factorB;

            const opciones = new Set([correcta]);
            while (opciones.size < 4) {
                const falso = correcta + (Math.floor(Math.random() * 9) - 4) * 2;
                if (falso > 0 && falso !== correcta) opciones.add(falso);
            }
            const opcionesArray = Array.from(opciones).sort(() => 0.5 - Math.random());

            arena.innerHTML = `
                <div class="barra-estado-juego">
                    <div><strong>⚡ Atrapa el Resultado:</strong> ¡Selecciona velozmente la burbuja con el producto exacto!</div>
                    <div>Ronda: <strong>${ronda} / ${totalRondas}</strong> | Puntos: <strong style="color:var(--color-dorado-acento);">${puntosJuego}</strong></div>
                </div>
                <div class="pantalla-atrapa">
                    <div style="font-family:'Outfit'; font-size: 2.8rem; font-weight: 900; color: var(--color-azul-oscuro); margin-bottom: 10px;">
                        ${factorA} × ${factorB} = ?
                    </div>
                    <p style="font-size: 1rem; color: var(--color-texto-secundario); font-weight: 700;">
                        ¡Toca la burbuja correcta antes de que escape!
                    </p>
                    <div class="burbujas-contenedor" id="contenedorBurbujas"></div>
                    <div id="retroAtrapa" class="retroalimentacion-inmediata" style="max-width: 420px; margin: 20px auto 0;"></div>
                </div>
            `;

            const contenedor = document.getElementById('contenedorBurbujas');
            opcionesArray.forEach(val => {
                const burbuja = document.createElement('div');
                burbuja.className = 'burbuja-resultado';
                burbuja.textContent = val;

                burbuja.addEventListener('click', () => {
                    const retro = document.getElementById('retroAtrapa');
                    retro.style.display = 'block';

                    // Deshabilitar burbujas
                    document.querySelectorAll('.burbuja-resultado').forEach(b => b.style.pointerEvents = 'none');

                    if (val === correcta) {
                        burbuja.style.background = 'var(--color-verde-suave)';
                        burbuja.style.borderColor = 'var(--color-verde-exito)';
                        ModuloAudio.reproducirAcierto();
                        puntosJuego += 20;
                        aciertosSeguidos++;
                        retro.style.backgroundColor = 'var(--color-verde-suave)';
                        retro.style.color = 'var(--color-verde-exito)';
                        retro.innerHTML = `🎯 ¡Muy bien! ${factorA} × ${factorB} = ${correcta}.`;

                        if (aciertosSeguidos >= 5) {
                            ModuloStorage.desbloquearLogro('reflejos_rayo');
                        }
                    } else {
                        burbuja.style.background = 'var(--color-rojo-suave)';
                        burbuja.style.borderColor = 'var(--color-rojo-alerta)';
                        ModuloAudio.reproducirError();
                        aciertosSeguidos = 0;
                        retro.style.backgroundColor = 'var(--color-rojo-suave)';
                        retro.style.color = 'var(--color-rojo-alerta)';
                        retro.innerHTML = `💥 ¡Ups! ${factorA} × ${factorB} = ${correcta}. ¡Sigue intentando!`;
                    }

                    setTimeout(() => {
                        ronda++;
                        cargarRonda();
                    }, 1400);
                });

                contenedor.appendChild(burbuja);
            });
        }

        function finalizarAtrapa() {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.sumarPuntos(puntosJuego, 2);
            ModuloStorage.registrarJuego('Atrapa el Resultado', `${puntosJuego} pts`);
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆⚡🎈</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Misión de Reflejos Superada!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                        Acumulaste <strong>${puntosJuego} puntos</strong> por atrapar las respuestas exactas.
                    </p>
                    <button id="btnReiniciarAtrapa" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Jugar de nuevo
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarAtrapa').addEventListener('click', () => {
                cargarJuego('atrapa');
            });
        }

        cargarRonda();
    }

    // =========================================================================
    // 3. CONSTRUYE LA MULTIPLICACIÓN (Manipulativo Concreto)
    // =========================================================================
    function iniciarConstruyeMultiplicacion(arena) {
        const desafios = [
            { grupos: 4, elementos: 5, fruta: '🍎' },
            { grupos: 3, elementos: 7, fruta: '⭐' },
            { grupos: 6, elementos: 4, fruta: '🍪' },
            { grupos: 5, elementos: 6, fruta: '💎' }
        ];

        let indexDesafio = 0;

        function cargarDesafio() {
            if (indexDesafio >= desafios.length) {
                finalizarConstruye();
                return;
            }

            const target = desafios[indexDesafio];
            const productoTarget = target.grupos * target.elementos;

            let usuarioGrupos = 2;
            let usuarioElementos = 2;

            arena.innerHTML = `
                <div class="barra-estado-juego">
                    <div><strong>🧱 Construye la Multiplicación:</strong> Modela la operación agrupando objetos.</div>
                    <div>Desafío: <strong>${indexDesafio + 1} / ${desafios.length}</strong></div>
                </div>
                <div class="area-construye">
                    <div style="background: var(--color-azul-suave); border: 2px solid var(--color-azul-brillante); border-radius: 14px; padding: 14px 20px; margin-bottom: 15px;">
                        <h4 style="font-size: 1.3rem; color: var(--color-azul-oscuro);">
                            Misión: Modela exactamente <span style="color: var(--color-dorado-acento); font-size: 1.5rem;">${target.grupos} × ${target.elementos}</span>
                        </h4>
                        <p style="font-size: 0.95rem; color: var(--color-texto-secundario); font-weight: 600;">
                            Ajusta la cantidad de canastas (grupos) y cuántos elementos poner en cada una para obtener ${productoTarget}.
                        </p>
                    </div>

                    <div class="panel-controles-construye">
                        <div class="control-contador">
                            <span style="font-weight: 800; font-size: 0.95rem; color: var(--color-azul-oscuro);">Grupos / Canastas:</span>
                            <div class="controles-btn-grupo">
                                <button type="button" class="btn-sumar-restar" id="btnRestarGrupos">-</button>
                                <span class="valor-contador" id="valGrupos">${usuarioGrupos}</span>
                                <button type="button" class="btn-sumar-restar" id="btnSumarGrupos">+</button>
                            </div>
                        </div>

                        <div class="control-contador">
                            <span style="font-weight: 800; font-size: 0.95rem; color: var(--color-azul-oscuro);">Elementos por grupo:</span>
                            <div class="controles-btn-grupo">
                                <button type="button" class="btn-sumar-restar" id="btnRestarElem">-</button>
                                <span class="valor-contador" id="valElem">${usuarioElementos}</span>
                                <button type="button" class="btn-sumar-restar" id="btnSumarElem">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="area-visual-grupos" id="visualizadorConstruye" style="min-height: 160px; margin-bottom: 20px;"></div>

                    <div id="retroConstruye" class="retroalimentacion-inmediata" style="margin-bottom: 18px;"></div>

                    <button type="button" id="btnComprobarConstruccion" class="btn-ingresar" style="max-width: 380px; margin: 0 auto; padding: 14px;">
                        <span>Comprobar mi Construcción</span> 🔍
                    </button>
                </div>
            `;

            function actualizarVista() {
                document.getElementById('valGrupos').textContent = usuarioGrupos;
                document.getElementById('valElem').textContent = usuarioElementos;

                const contenedor = document.getElementById('visualizadorConstruye');
                contenedor.innerHTML = '';

                for (let g = 1; g <= usuarioGrupos; g++) {
                    const caja = document.createElement('div');
                    caja.className = 'caja-grupo-objeto';
                    let itemsHtml = '';
                    for (let e = 1; e <= usuarioElementos; e++) {
                        itemsHtml += `<span class="icono-elemento-grupo">${target.fruta}</span>`;
                    }
                    caja.innerHTML = itemsHtml;
                    contenedor.appendChild(caja);
                }
            }

            document.getElementById('btnRestarGrupos').onclick = () => {
                if (usuarioGrupos > 1) { usuarioGrupos--; ModuloAudio.reproducirClic(); actualizarVista(); }
            };
            document.getElementById('btnSumarGrupos').onclick = () => {
                if (usuarioGrupos < 9) { usuarioGrupos++; ModuloAudio.reproducirClic(); actualizarVista(); }
            };
            document.getElementById('btnRestarElem').onclick = () => {
                if (usuarioElementos > 1) { usuarioElementos--; ModuloAudio.reproducirClic(); actualizarVista(); }
            };
            document.getElementById('btnSumarElem').onclick = () => {
                if (usuarioElementos < 10) { usuarioElementos++; ModuloAudio.reproducirClic(); actualizarVista(); }
            };

            actualizarVista();

            document.getElementById('btnComprobarConstruccion').onclick = () => {
                const retro = document.getElementById('retroConstruye');
                retro.style.display = 'block';

                const totalUsuario = usuarioGrupos * usuarioElementos;

                if (usuarioGrupos === target.grupos && usuarioElementos === target.elementos) {
                    ModuloAudio.reproducirAcierto();
                    retro.style.backgroundColor = 'var(--color-verde-suave)';
                    retro.style.color = 'var(--color-verde-exito)';
                    retro.innerHTML = `🎉 ¡Perfecto! Construiste ${usuarioGrupos} grupos de ${usuarioElementos} = ${totalUsuario}. ¡Esa es la representación exacta!`;
                    ModuloStorage.sumarPuntos(25, 1);
                    ModuloStorage.desbloquearLogro('arquitecto_multiplo');

                    setTimeout(() => {
                        indexDesafio++;
                        cargarDesafio();
                    }, 1800);
                } else if (totalUsuario === productoTarget) {
                    // Propiedad conmutativa u otra combinación
                    ModuloAudio.reproducirAcierto();
                    retro.style.backgroundColor = 'var(--color-azul-suave)';
                    retro.style.color = 'var(--color-azul-oscuro)';
                    retro.innerHTML = `👏 ¡El resultado total es correcto (${totalUsuario})! Pero buscábamos específicamente ${target.grupos} grupos de ${target.elementos}. ¡Muy buen pensamiento matemático!`;

                    setTimeout(() => {
                        indexDesafio++;
                        cargarDesafio();
                    }, 2200);
                } else {
                    ModuloAudio.reproducirError();
                    retro.style.backgroundColor = 'var(--color-rojo-suave)';
                    retro.style.color = 'var(--color-rojo-alerta)';
                    retro.innerHTML = `💡 Tienes ${usuarioGrupos} grupos de ${usuarioElementos} (${totalUsuario} objetos en total). Necesitas armar ${target.grupos} grupos de ${target.elementos}. ¡Ajusta los botones y prueba de nuevo!`;
                }
            };
        }

        function finalizarConstruye() {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.registrarJuego('Construye la Multiplicación', 'Completado');
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🧱🌟📐</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Arquitecto de Multiplicaciones!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                        Modelaste exitosamente todas las multiplicaciones mediante grupos concretos.
                    </p>
                    <button id="btnReiniciarConstruye" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Armar de nuevo
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarConstruye').onclick = () => cargarJuego('construye');
        }

        cargarDesafio();
    }

    // =========================================================================
    // 4. ¿QUIÉN TIENE LA RESPUESTA? (Personajes con Pizarras)
    // =========================================================================
    function iniciarQuienTieneLaRespuesta(arena) {
        const preguntas = [
            { operacion: '9 × 7', correcta: 63, f1: 56, f2: 72 },
            { operacion: '6 × 8', correcta: 48, f1: 42, f2: 54 },
            { operacion: '7 × 7', correcta: 49, f1: 42, f2: 56 },
            { operacion: '8 × 9', correcta: 72, f1: 81, f2: 64 },
            { operacion: '5 × 9', correcta: 45, f1: 40, f2: 50 }
        ];

        let indexQ = 0;
        let aciertos = 0;

        function cargarPregunta() {
            if (indexQ >= preguntas.length) {
                finalizarQuienTiene();
                return;
            }

            const item = preguntas[indexQ];
            const personajes = [
                { nombre: 'Leo el León', icono: '🦁', valor: item.correcta, esCorrecto: true },
                { nombre: 'Tito el Búho', icono: '🦉', valor: item.f1, esCorrecto: false },
                { nombre: 'Alex Robot', icono: '🤖', valor: item.f2, esCorrecto: false }
            ].sort(() => 0.5 - Math.random());

            arena.innerHTML = `
                <div class="barra-estado-juego">
                    <div><strong>👥 ¿Quién tiene la respuesta?:</strong> Elige al personaje que muestra la pizarra correcta.</div>
                    <div>Pregunta: <strong>${indexQ + 1} / ${preguntas.length}</strong></div>
                </div>
                <div style="text-align: center; padding: 15px 0;">
                    <h3 style="font-family:'Outfit'; font-size: 2.5rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¿Quién tiene el resultado de ${item.operacion}?
                    </h3>
                    <p style="font-size: 1.05rem; color: var(--color-texto-secundario); font-weight: 700;">
                        Mira las pizarras de los personajes y haz clic en el que tenga la respuesta exacta:
                    </p>

                    <div class="personajes-fila" id="filaPersonajes"></div>
                    <div id="retroQuien" class="retroalimentacion-inmediata" style="max-width: 480px; margin: 24px auto 0;"></div>
                </div>
            `;

            const contenedor = document.getElementById('filaPersonajes');
            personajes.forEach(p => {
                const card = document.createElement('div');
                card.className = 'tarjeta-personaje-pregunta';
                card.innerHTML = `
                    <div style="font-size: 3.5rem; margin-bottom: 6px;">${p.icono}</div>
                    <div style="font-weight: 800; font-size: 1rem; color: var(--color-azul-oscuro);">${p.nombre}</div>
                    <div class="pizarra-personaje">${p.valor}</div>
                `;

                card.onclick = () => {
                    const retro = document.getElementById('retroQuien');
                    retro.style.display = 'block';

                    document.querySelectorAll('.tarjeta-personaje-pregunta').forEach(c => c.style.pointerEvents = 'none');

                    if (p.esCorrecto) {
                        card.style.borderColor = 'var(--color-verde-exito)';
                        card.style.backgroundColor = 'var(--color-verde-suave)';
                        ModuloAudio.reproducirAcierto();
                        aciertos++;
                        retro.style.backgroundColor = 'var(--color-verde-suave)';
                        retro.style.color = 'var(--color-verde-exito)';
                        retro.innerHTML = `🎉 ¡Correcto! ${p.nombre} tenía la pizarra con ${item.correcta}. ¡Gran cálculo!`;
                        ModuloStorage.sumarPuntos(20, 1);
                    } else {
                        card.style.borderColor = 'var(--color-rojo-alerta)';
                        card.style.backgroundColor = 'var(--color-rojo-suave)';
                        ModuloAudio.reproducirError();
                        retro.style.backgroundColor = 'var(--color-rojo-suave)';
                        retro.style.color = 'var(--color-rojo-alerta)';
                        retro.innerHTML = `💡 ${p.nombre} tenía ${p.valor}. La respuesta correcta para ${item.operacion} es ${item.correcta}.`;
                    }

                    setTimeout(() => {
                        indexQ++;
                        cargarPregunta();
                    }, 1800);
                };

                contenedor.appendChild(card);
            });
        }

        function finalizarQuienTiene() {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.registrarJuego('¿Quién tiene la respuesta?', `${aciertos} de ${preguntas.length}`);
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🌟🦁🤖🦉</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Desafío de Personajes Completado!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                        Acertaste <strong>${aciertos} de ${preguntas.length}</strong> pizarras.
                    </p>
                    <button id="btnReiniciarQuien" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Jugar otra vez
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarQuien').onclick = () => cargarJuego('quien_tiene');
        }

        cargarPregunta();
    }

    // =========================================================================
    // 5. DESAFÍO CONTRA EL TIEMPO (60 Segundos de Velocidad)
    // =========================================================================
    let temporizadorReloj = null;
    function iniciarDesafioContraElTiempo(arena) {
        clearInterval(temporizadorReloj);
        let tiempoRestante = 60;
        let aciertos = 0;
        let operacionActual = null;

        arena.innerHTML = `
            <div class="barra-estado-juego">
                <div><strong>⏱️ Desafío Contra el Tiempo:</strong> Tienes 60 segundos para resolver la mayor cantidad de tablas posibles.</div>
                <div>Aciertos: <strong id="relojAciertos" style="color:var(--color-verde-exito); font-size:1.2rem;">0</strong></div>
            </div>
            <div style="text-align: center; padding: 25px 0;">
                <div class="cronometro-grande" id="marcadorCronometro">
                    ⏱️ <span id="segundosReloj">60</span>s
                </div>
                <div style="font-family:'Outfit'; font-size: 3rem; font-weight: 900; color: var(--color-azul-oscuro); margin: 20px 0;" id="textoOpReloj">
                    -- × -- = ?
                </div>
                <div class="opciones-taller-grid" id="opcionesRelojGrid"></div>
            </div>
        `;

        function generarPregunta() {
            const f1 = Math.floor(Math.random() * 8) + 2; // 2 al 9
            const f2 = Math.floor(Math.random() * 9) + 2; // 2 al 10
            const correcta = f1 * f2;

            operacionActual = { f1, f2, correcta };
            document.getElementById('textoOpReloj').textContent = `${f1} × ${f2} = ?`;

            const opciones = new Set([correcta]);
            while (opciones.size < 4) {
                const falso = correcta + (Math.floor(Math.random() * 9) - 4) * 2;
                if (falso > 0 && falso !== correcta) opciones.add(falso);
            }
            const opcionesArr = Array.from(opciones).sort(() => 0.5 - Math.random());

            const grid = document.getElementById('opcionesRelojGrid');
            grid.innerHTML = '';
            opcionesArr.forEach(val => {
                const btn = document.createElement('button');
                btn.className = 'btn-opcion-taller';
                btn.textContent = val;

                btn.onclick = () => {
                    if (val === operacionActual.correcta) {
                        ModuloAudio.reproducirAcierto();
                        aciertos++;
                        document.getElementById('relojAciertos').textContent = aciertos;
                        btn.classList.add('acierto');
                        setTimeout(generarPregunta, 200);
                    } else {
                        ModuloAudio.reproducirError();
                        btn.classList.add('error');
                        setTimeout(generarPregunta, 350);
                    }
                };

                grid.appendChild(btn);
            });
        }

        generarPregunta();

        temporizadorReloj = setInterval(() => {
            tiempoRestante--;
            const segEl = document.getElementById('segundosReloj');
            if (segEl) segEl.textContent = tiempoRestante;

            if (tiempoRestante <= 10) {
                const crono = document.getElementById('marcadorCronometro');
                if (crono) crono.classList.add('alerta');
                ModuloAudio.reproducirTick();
            }

            if (tiempoRestante <= 0) {
                clearInterval(temporizadorReloj);
                finalizarContraTiempo(aciertos);
            }
        }, 1000);

        function finalizarContraTiempo(totalAciertos) {
            ModuloAudio.reproducirVictoria();
            const puntosGanados = totalAciertos * 15;
            ModuloStorage.sumarPuntos(puntosGanados, totalAciertos >= 8 ? 4 : 2);
            ModuloStorage.registrarJuego('Contra el Tiempo', `${totalAciertos} aciertos en 60s`);

            if (totalAciertos >= 6) {
                ModuloStorage.desbloquearLogro('carrera_reloj');
            }

            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏁⏱️⚡</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Tiempo Agotado!
                    </h3>
                    <p style="font-size: 1.15rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 8px;">
                        Lograste responder correctamente <strong>${totalAciertos} multiplicaciones</strong> en 60 segundos.
                    </p>
                    <p style="font-size: 1.25rem; color: var(--color-dorado-acento); font-weight: 900; margin-bottom: 24px;">
                        +${puntosGanados} Puntos ganados
                    </p>
                    <button id="btnReiniciarTiempo" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Intentar romper récord
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarTiempo').onclick = () => cargarJuego('tiempo');
        }
    }

    // =========================================================================
    // 6. ARRASTRA Y COMPLETA (Drag & Drop / Tap & Slot)
    // =========================================================================
    function iniciarArrastraYCompleta(arena) {
        const desafios = [
            { textoAntes: '7 × ', faltante: 6, textoDespues: ' = 42', opciones: [4, 6, 8, 9] },
            { textoAntes: ' ', faltante: 8, textoDespues: ' × 5 = 40', opciones: [6, 7, 8, 9] },
            { textoAntes: '9 × 4 = ', faltante: 36, textoDespues: '', opciones: [32, 36, 40, 45] },
            { textoAntes: '6 × ', faltante: 7, textoDespues: ' = 42', opciones: [5, 6, 7, 8] }
        ];

        let indexDesafio = 0;

        function cargarDesafio() {
            if (indexDesafio >= desafios.length) {
                finalizarArrastra();
                return;
            }

            const item = desafios[indexDesafio];

            arena.innerHTML = `
                <div class="barra-estado-juego">
                    <div><strong>🧩 Arrastra y Completa:</strong> Selecciona o toca la ficha correcta para completar la operación.</div>
                    <div>Desafío: <strong>${indexDesafio + 1} / ${desafios.length}</strong></div>
                </div>
                <div class="zona-arrastra">
                    <p style="font-size: 1.05rem; color: var(--color-texto-secundario); font-weight: 700;">
                        ¿Qué número falta para que la igualdad sea correcta?
                    </p>

                    <div class="ecuacion-incompleta">
                        <span>${item.textoAntes}</span>
                        <div class="casilla-destino" id="casillaDestino" aria-label="Suelta aquí el número que falta">?</div>
                        <span>${item.textoDespues}</span>
                    </div>

                    <div style="font-weight: 800; font-size: 0.95rem; color: var(--color-azul-oscuro); margin-bottom: 12px;">
                        Fichas disponibles (arrástralas a la casilla o haz clic):
                    </div>
                    <div class="fichas-disponibles" id="fichasDisponibles"></div>

                    <div id="retroArrastra" class="retroalimentacion-inmediata" style="max-width: 440px; margin: 24px auto 0;"></div>
                </div>
            `;

            const contenedorFichas = document.getElementById('fichasDisponibles');
            const casilla = document.getElementById('casillaDestino');
            let respondido = false;

            function responder(op, ficha) {
                if (respondido) return;
                respondido = true;

                const retro = document.getElementById('retroArrastra');
                retro.style.display = 'block';
                casilla.textContent = op;
                document.querySelectorAll('.ficha-numero').forEach(elemento => elemento.draggable = false);

                if (op === item.faltante) {
                    casilla.style.borderColor = 'var(--color-verde-exito)';
                    casilla.style.color = 'var(--color-verde-exito)';
                    ficha.style.background = 'var(--color-verde-exito)';
                    ModuloAudio.reproducirAcierto();
                    retro.style.backgroundColor = 'var(--color-verde-suave)';
                    retro.style.color = 'var(--color-verde-exito)';
                    retro.innerHTML = `🎉 ¡Perfecto! La igualdad queda completa y correcta.`;
                    ModuloStorage.sumarPuntos(20, 1);

                    setTimeout(() => {
                        indexDesafio++;
                        cargarDesafio();
                    }, 1600);
                } else {
                    casilla.style.borderColor = 'var(--color-rojo-alerta)';
                    casilla.style.color = 'var(--color-rojo-alerta)';
                    ficha.style.background = 'var(--color-rojo-alerta)';
                    ModuloAudio.reproducirError();
                    retro.style.backgroundColor = 'var(--color-rojo-suave)';
                    retro.style.color = 'var(--color-rojo-alerta)';
                    retro.innerHTML = `💡 Con ${op} la operación no calza. El número correcto era ${item.faltante}.`;

                    setTimeout(() => {
                        indexDesafio++;
                        cargarDesafio();
                    }, 2000);
                }
            }

            casilla.addEventListener('dragover', event => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
            });

            casilla.addEventListener('dragenter', event => {
                event.preventDefault();
                casilla.classList.add('recibiendo-ficha');
            });

            casilla.addEventListener('dragleave', event => {
                if (!casilla.contains(event.relatedTarget)) {
                    casilla.classList.remove('recibiendo-ficha');
                }
            });

            casilla.addEventListener('drop', event => {
                event.preventDefault();
                casilla.classList.remove('recibiendo-ficha');
                const numero = Number(event.dataTransfer.getData('text/plain'));
                const ficha = Array.from(contenedorFichas.children).find(elemento => Number(elemento.textContent) === numero);
                if (ficha) responder(numero, ficha);
            });

            item.opciones.forEach(op => {
                const ficha = document.createElement('div');
                ficha.className = 'ficha-numero';
                ficha.textContent = op;
                ficha.draggable = true;
                ficha.setAttribute('role', 'button');
                ficha.setAttribute('aria-label', `Arrastrar el número ${op}`);

                ficha.addEventListener('dragstart', event => {
                    event.dataTransfer.setData('text/plain', String(op));
                    event.dataTransfer.effectAllowed = 'move';
                    ficha.classList.add('arrastrando');
                });

                ficha.addEventListener('dragend', () => {
                    ficha.classList.remove('arrastrando');
                });

                ficha.onclick = () => {
                    ModuloAudio.reproducirClic();
                    responder(op, ficha);
                };

                contenedorFichas.appendChild(ficha);
            });
        }

        function finalizarArrastra() {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.registrarJuego('Arrastra y Completa', 'Completado');
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🧩⭐🎯</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Operaciones Completadas!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                        Completaste todas las igualdades matemáticas con éxito.
                    </p>
                    <button id="btnReiniciarArrastra" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Jugar de nuevo
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarArrastra').onclick = () => cargarJuego('arrastra');
        }

        cargarDesafio();
    }

    // =========================================================================
    // 7. DETECTIVE MATEMÁTICO (Razonamiento Lógico y Pistas)
    // =========================================================================
    function iniciarDetectiveMatematico(arena) {
        const casos = [
            {
                titulo: 'Caso #1: El Número Misterioso del Huerto',
                pistas: [
                    'Soy un número par de dos dígitos.',
                    'Estoy en la tabla del 7 y en la tabla del 4.',
                    'Soy menor que 35.'
                ],
                respuestaCorrecta: 28,
                opciones: [14, 21, 28, 32],
                explicacion: '28 está en la tabla del 7 (7 × 4 = 28) y en la tabla del 4 (4 × 7 = 28) y es menor que 35.'
            },
            {
                titulo: 'Caso #2: La Caja Fuerte de la Escuela',
                pistas: [
                    'Soy múltiplo de 6 y también de 8.',
                    'Soy mayor que 40 pero menor que 55.',
                    'Termino en el número 8.'
                ],
                respuestaCorrecta: 48,
                opciones: [40, 48, 54, 56],
                explicacion: '6 × 8 = 48 y 8 × 6 = 48. Es par, termina en 8 y está entre 40 y 55.'
            },
            {
                titulo: 'Caso #3: El Código de la Biblioteca',
                pistas: [
                    'Termino en 5.',
                    'Estoy en la tabla del 9.',
                    'La suma de mis dos dígitos da 9.'
                ],
                respuestaCorrecta: 45,
                opciones: [35, 45, 55, 65],
                explicacion: '9 × 5 = 45. Termina en 5 y 4 + 5 = 9.'
            }
        ];

        let indexCaso = 0;

        function cargarCaso() {
            if (indexCaso >= casos.length) {
                finalizarDetective();
                return;
            }

            const c = casos[indexCaso];

            arena.innerHTML = `
                <div class="barra-estado-juego">
                    <div><strong>🔍 Detective Matemático:</strong> Lee con atención las pistas y deduce el número oculto.</div>
                    <div>Caso: <strong>${indexCaso + 1} / ${casos.length}</strong></div>
                </div>
                <div class="panel-detective">
                    <h3 style="font-family:'Outfit'; font-size: 1.45rem; color: var(--color-azul-oscuro); margin-bottom: 6px;">
                        ${c.titulo}
                    </h3>
                    <p style="font-size: 0.95rem; color: var(--color-texto-secundario); font-weight: 600;">
                        Analiza cada una de las siguientes pistas deductoras:
                    </p>

                    <ul class="pistas-lista">
                        ${c.pistas.map((p, i) => `
                            <li class="item-pista">
                                <span>🔎</span>
                                <span><strong>Pista ${i + 1}:</strong> ${p}</span>
                            </li>
                        `).join('')}
                    </ul>

                    <p style="font-size: 1.05rem; font-weight: 800; color: var(--color-azul-oscuro); text-align: center; margin: 18px 0 12px;">
                        ¿Quién es el número secreto?
                    </p>

                    <div class="opciones-taller-grid" id="opcionesDetectiveGrid"></div>

                    <div id="retroDetective" class="retroalimentacion-inmediata" style="margin-top: 20px;"></div>
                </div>
            `;

            const grid = document.getElementById('opcionesDetectiveGrid');
            c.opciones.forEach(num => {
                const btn = document.createElement('button');
                btn.className = 'btn-opcion-taller';
                btn.textContent = num;

                btn.onclick = () => {
                    const retro = document.getElementById('retroDetective');
                    retro.style.display = 'block';

                    document.querySelectorAll('.btn-opcion-taller').forEach(b => b.disabled = true);

                    if (num === c.respuestaCorrecta) {
                        btn.classList.add('acierto');
                        ModuloAudio.reproducirAcierto();
                        retro.style.backgroundColor = 'var(--color-verde-suave)';
                        retro.style.color = 'var(--color-verde-exito)';
                        retro.innerHTML = `🕵️‍♂️ ¡Caso Resuelto! El número secreto es exactamente ${c.respuestaCorrecta}. ${c.explicacion}`;
                        ModuloStorage.sumarPuntos(30, 2);
                        ModuloStorage.desbloquearLogro('detective_oro');

                        setTimeout(() => {
                            indexCaso++;
                            cargarCaso();
                        }, 2200);
                    } else {
                        btn.classList.add('error');
                        ModuloAudio.reproducirError();
                        retro.style.backgroundColor = 'var(--color-rojo-suave)';
                        retro.style.color = 'var(--color-rojo-alerta)';
                        retro.innerHTML = `💡 El número ${num} no cumple todas las pistas. La respuesta correcta era ${c.respuestaCorrecta}. ${c.explicacion}`;

                        setTimeout(() => {
                            indexCaso++;
                            cargarCaso();
                        }, 2500);
                    }
                };

                grid.appendChild(btn);
            });
        }

        function finalizarDetective() {
            ModuloAudio.reproducirVictoria();
            ModuloStorage.registrarJuego('Detective Matemático', 'Casos Resueltos');
            if (typeof App !== 'undefined') App.actualizarDatosHeader();

            arena.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🔍🕵️‍♂️🏆</div>
                    <h3 style="font-size: 1.8rem; color: var(--color-azul-oscuro); margin-bottom: 8px;">
                        ¡Detective Maestro Graduado!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--color-texto-secundario); font-weight: 700; margin-bottom: 24px;">
                        Resolviste con éxito todos los acertijos numéricos utilizando deducción y tablas.
                    </p>
                    <button id="btnReiniciarDetective" class="btn-volver" style="background: var(--color-azul-oscuro); color: var(--color-crema);">
                        🔄 Resolver más casos
                    </button>
                </div>
            `;
            document.getElementById('btnReiniciarDetective').onclick = () => cargarJuego('detective');
        }

        cargarCaso();
    }

    return {
        inicializar,
        cargarJuego
    };
})();
