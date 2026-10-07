# MultiAventura 4° - Plataforma Educativa de Tablas & Ensayo SIMCE

Plataforma web educativa e interactiva desarrollada para estudiantes de **4° Básico**, orientada al aprendizaje significativo de las tablas de multiplicar del 2 al 10 y preparación matemática para el examen oficial **SIMCE**.

---

## 🎨 Paleta de Colores Oficial
El diseño sigue una estética moderna, limpia y estimulante respetando la combinación requerida:
- **Blanco Puro (`#FFFFFF`)**: Tarjetas de contenido, áreas de preguntas y elementos de contraste nítido.
- **Azul Oscuro (`#0B1B3D`, `#132D63`, `#1E4E8C`)**: Encabezados, barras superiores, botones primarios y tipografías destacadas.
- **Crema Cálido (`#FFFDF7`, `#F8F1DF`, `#EADCB9`, con acentos dorados `#D4AF37`)**: Fondos generales, contenedores secundarios, bordes elegantes y detalles de recompensa.

---

## 📁 Estructura del Proyecto en tu Carpeta
La carpeta de trabajo es: `C:\xampp\htdocs\codigos\mis tablas\`

```text
c:\xampp\htdocs\codigos\mis tablas\
├── index.html                   (Etapa 1: Ingreso, validación y selección de avatar)
├── README.md                    (Documentación del proyecto)
├── Sistema\
│   ├── index.html               (Etapa 2, 3 y 4: Menú principal y todos los módulos)
│   ├── CSS\
│   │   └── estilos.css          (Diseño moderno responsivo con paleta Blanco, Azul Oscuro y Crema)
│   ├── IMAGEN\
│   │   ├── logo.svg             (Logotipo oficial de la plataforma)
│   │   ├── trofeo.svg           (Insignia de logros)
│   │   └── simce_badge.svg      (Escudo SIMCE)
│   └── JS\
│       ├── audio.js             (Efectos de sonido autónomos mediante Web Audio API)
│       ├── storage.js           (Gestión de progreso, puntos, niveles y localStorage)
│       ├── tablas.js            (Taller didáctico de tablas 2 al 10, grupos y patrones)
│       ├── juegos.js            (7 juegos interactivos y desafíos dinámicos)
│       ├── simce.js             (Ensayo SIMCE con 10 problemas contextualizados)
│       └── app.js               (Controlador de navegación SPA y perfil)
└── misTablas\                   (Compatibilidad de acceso)
    ├── index.html
    └── Sistema\
        └── index.html
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Con XAMPP (Apache)
1. Abre el panel de control de **XAMPP**.
2. Haz clic en **Start** en el módulo **Apache**.
3. Abre tu navegador web e ingresa a:
   `http://localhost/codigos/mis%20tablas/`

### Opción 2: Con Visual Studio Code (Live Server)
1. Abre la carpeta `C:\xampp\htdocs\codigos\mis tablas` en **Visual Studio Code**.
2. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.

---

## 🌟 Módulos y Etapas Implementadas

### 1. Etapa 1: Ingreso del Estudiante (`index.html`)
- Nombre de la plataforma y logotipo vectorial animado.
- Campo de texto para nombre y apellido.
- Galería de 6 avatares interactivos (Leo el León, Tito el Búho, Alex el Robot, Maya la Astronauta, Luna la Detective, Sam el Mago).
- Validación de datos (mínimo 2 letras y selección obligatoria de avatar).
- Detección de sesión previa para continuar progreso acumulado.

### 2. Etapa 2: Menú Principal (`Sistema/index.html`)
- Barra superior con perfil en tiempo real: Avatar, nombre, nivel honorífico, puntos acumulados y estrellas.
- Barra de progreso global del dominio de tablas (0% a 100%).
- 5 Tarjetas interactivas con microanimaciones:
  - **Aprender Tablas**
  - **Juegos y Desafíos**
  - **Mi Progreso y Puntaje**
  - **Logros y Recompensas**
  - **Ensayo Matemático SIMCE**

### 3. Etapa 3: Aprendizaje Didáctico de Tablas (2 al 10)
- **Representación Concreta de Grupos**: Visualización dinámica de canastas y elementos repetidos.
- **Arreglos Rectangulares (Matriz)**: Cuadrícula interactiva de filas × columnas.
- **Suma Iterada y Propiedades**: Demostración paso a paso de $a \times b$ y propiedad conmutativa.
- **Descubridor de Patrones y Trucos Secretos**:
  - *Tabla del 2*: El poder de los números pares y dobles.
  - *Tabla del 3*: La regla mágica del 3-6-9 (suma de dígitos).
  - *Tabla del 4*: El doble del doble.
  - *Tabla del 5*: El baile del reloj (terminaciones en 0 o 5).
  - *Tabla del 6*: El espejo de los números pares y duplo del 3.
  - *Tabla del 7*: El calendario de las semanas.
  - *Tabla del 8*: El triple doble ($2 \times 2 \times 2$).
  - *Tabla del 9*: Escalera de decenas y unidades (ambos dígitos suman 9).
  - *Tabla del 10*: La magia del cero decimal.
- **Mini-Taller Guiado**: 5 preguntas rápidas con retroalimentación inmediata y opción de repetición.

### 4. 7 Juegos y Desafíos No Monótonos (`juegos.js`)
1. **Memoria Matemática**: Encuentra parejas volteadas (operación $\leftrightarrow$ resultado).
2. **Atrapa el Resultado**: Burbujas flotantes en movimiento con selección veloz.
3. **Construye la Multiplicación**: Manipula grupos y elementos para modelar multiplicaciones concretas.
4. **¿Quién tiene la respuesta?**: Tres personajes sostienen pizarras con valores posibles.
5. **Desafío Contra el Tiempo**: 60 segundos de velocidad mental con contador de récord.
6. **Arrastra y Completa**: Fichas numéricas para rellenar igualdades matemáticas incompletas.
7. **Detective Matemático**: Acertijos deductivos con pistas escalonadas para encontrar el número secreto.

### 5. Etapa 4: Ensayo Matemático Oficial tipo SIMCE (`simce.js`)
- **10 Situaciones Contextualizadas para 4° Básico**:
  1. Compras y precios en la kermesse ($6 \times 4 = 24$).
  2. Organización de grupos en el patio ($8 \times 7 = 56$).
  3. Distribución de materiales escolares ($9 \times 8 = 72$).
  4. Huerto escolar y siembra ($5 \times 9 = 45$).
  5. Juegos y puntajes en educación física ($7 \times 3 = 21$).
  6. Biblioteca y cajas de cuentos ($4 \times 9 = 36$).
  7. Repostería y empanaditas de aniversario ($7 \times 6 = 42$).
  8. Álbum de láminas espaciales ($8 \times 6 = 48$).
  9. Transporte escolar para el paseo ($6 \times 8 = 48$).
  10. Ahorro semanal con alcancía ($5 \times 10 = 50$).
- **Panel lateral interactivo**: Marcadores de preguntas 1 al 10 con estado respondida/pendiente.
- **Evaluación Oficial SIMCE**:
  - **Nivel Adecuado** (8 a 10 puntos)
  - **Nivel Elemental** (5 a 7 puntos)
  - **Nivel Insuficiente** (0 a 4 puntos)
- **Retroalimentación Pedagógica**: Desglose con la respuesta del alumno, la correcta y la justificación formativa paso a paso.

---

## 🔊 Sonido y Persistencia
- **Audio Nativo Web Audio API**: Sin descargas externas de audio (funciona 100% offline).
- **LocalStorage**: Todo el avance, puntos, estrellas, ensayos y logros quedan guardados permanentemente en el navegador.
