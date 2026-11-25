import { CourseModule } from '../../types/course';

export const ch0Intro: CourseModule = {
  id: 'mod-0',
  number: 'Módulo 0',
  title: 'Portada e Introducción',
  pages: 'Págs. 1–14',
  description:
    'Presentación de Tríadas para Muñones (y CAGED), propósito del método, convenciones gráficas y hoja de ruta paso a paso.',
  lessons: [
    {
      id: 'ch0-1',
      moduleId: 'mod-0',
      code: '0.1',
      title: 'Portada, Créditos e Índice General',
      subtitle: 'Tríadas para Muñones (y CAGED) — Desbloquea el diapasón (Ver. 1.2)',
      pages: 'PDF págs. 1–9',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'paragraph',
          text: 'Bienvenido al curso interactivo completo basado en «Tríadas para Muñones (y CAGED): Desbloquea el diapasón», Versión 1.2, escrito por Luis Ángel Rico Tejedor (2026, rockandrollparamunones.com). Esta aplicación recorre el documento de principio a fin, de la página 1 a la 310, transformando cada diagrama, explicación y los 104 ejemplos en lecciones interactivas con audio y metrónomo.',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'Ficha editorial y dedicatoria',
          text: 'Obra creada por Luis Ángel Rico Tejedor en agradecimiento a toda la comunidad de Rock and Roll para Muñones. Todos los diagramas de mástil, posiciones CAGED, inversiones y 104 ejercicios prácticos han sido estructurados secuencialmente para estudiar directamente con la guitarra en mano.',
        },
        {
          type: 'table',
          data: {
            title: 'Mapa completo del libro (Páginas 1 a 310)',
            subtitle: 'Recorrido íntegro por los 6 capítulos y el anexo final',
            headers: ['Sección', 'Contenido principal', 'Páginas', 'Ejemplos'],
            rows: [
              ['Introducción', 'Objetivo, estructura, convenciones y plan de uso', 'Págs. 7–14', '—'],
              ['Capítulo 1', 'La Teoría Imprescindible: cromática, mayor, menor, 4 tríadas, diapasón e inversiones/Drops', 'Págs. 15–52', 'Fundamentos'],
              ['Capítulo 2', 'Las Tríadas en el Mástil: CAGED, 7 posiciones, mayor, menor, dism., aum. y Drop 2/3', 'Págs. 53–114', 'Ej. 1 al 18'],
              ['Capítulo 3', 'Progresiones Básicas: V–I, IV–I, tonos, dominantes secundarios, disminuidos, blues y cuartas', 'Págs. 115–190', 'Ej. 19 al 50'],
              ['Capítulo 4', 'Diferentes Usos: armonización de melodías, double stops, licks y pares modales', 'Págs. 191–224', 'Ej. 51 al 67'],
              ['Capítulo 5', 'Superposición de Tríadas: Upper Structures sobre mayores, menores y dominantes alterados', 'Págs. 225–244', 'Ej. 68 al 78'],
              ['Capítulo 6', 'Expandiendo las Tríadas: aproximaciones, add2/add4, sus, pentatónicas, escala mayor y apoyaturas', 'Págs. 245–296', 'Ej. 79 al 104'],
              ['Anexo', 'Consejos y técnicas de estudio, qué queda fuera y glosario completo (53 términos)', 'Págs. 297–307', 'Glosario'],
            ],
          },
        },
      ],
      practiceTips: [
        'Activa el metrónomo desde la barra superior antes de tocar cualquier ejercicio práctico.',
        'Marca cada lección como completada al finalizarla; tu progreso se guarda automáticamente en el navegador.',
        'Haz clic sobre cualquier nota de los diagramas de mástil o sobre cualquier acorde para escuchar su altura real.',
      ],
      commonMistakes: [
        'Querer leer el curso entero de un tirón sin la guitarra colgada: este método se interioriza tocando.',
        'Saltarse el Capítulo 1 pensando que ya conoces la teoría básica; su enfoque visual en grados sostiene todo el resto del libro.',
      ],
    },
    {
      id: 'ch0-2',
      moduleId: 'mod-0',
      code: '0.2',
      title: 'Objetivo del libro: la «carretera principal» del diapasón',
      subtitle: 'Por qué dominar las tríadas transforma tu forma de acompañar e improvisar',
      pages: 'Libro págs. 8–10',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'Muchos guitarristas memorizan cajas de pentatónica o escalas mayores pero, cuando cambian los acordes de una canción, se pierden y sus solos suenan desconectados de la armonía. Las tríadas son la «carretera principal» o «línea maestra» que recorre todo el diapasón: con solo tres notas (1, 3 y 5) definen la identidad exacta de cada acorde en cualquier punto del mástil.',
        },
        {
          type: 'list',
          title: 'Qué vas a desbloquear dominando las tríadas',
          items: [
            'Acompañamiento profesional: tocar acordes limpios y claros en cualquier registro sin pisar las frecuencias del bajo ni de otros instrumentos.',
            'Improvisación melódica real: aterrizar con intención en las notas objetivo del acorde que suena en ese instante, funcionando como auténtico salvavidas en tus solos.',
            'Comprensión total de escalas y pentatónicas: descubrirás que la pentatónica, la escala mayor y todos los modos griegos nacen añadiendo apenas 2 o 4 notas alrededor de una tríada.',
            'Sonoridades avanzadas sin dolor: mediante la superposición de tríadas (Upper Structures) generarás acordes maj9, m9 o dominantes alterados usando las mismas formas sencillas.',
          ],
        },
        {
          type: 'fretboard',
          config: {
            title: 'Vista previa: la carretera principal de G mayor en todo el mástil',
            subtitle: 'Observa cómo las notas rojas (1) y oscuras (3 y 5) tejen un mapa continuo del traste 0 al 15',
            root: 'G',
            quality: 'major',
            cagedZone: 'full',
            allowTranspose: true,
            showCagedZones: true,
          },
        },
      ],
      practiceTips: [
        'Toca el acorde de G en abierto y luego pulsa varios puntos rojos (tónica G) repartidos por el diapasón interactivo para educar el oído a reconocer la misma nota en distintas octavas.',
        'Adopta desde el día 1 la mentalidad de pensar en grados (1, 3, 5) además del nombre de la nota.',
      ],
      commonMistakes: [
        'Tratar las tríadas únicamente como ejercicios mecánicos de púa alterna en lugar de escucharlas sobre un acorde real.',
        'Creer que las tríadas solo sirven para estilos limpios o jazz: son la base exacta de rock, blues, pop, funk y metal.',
      ],
    },
    {
      id: 'ch0-3',
      moduleId: 'mod-0',
      code: '0.3',
      title: 'Estructuración del contenido y convenciones de lectura',
      subtitle: 'Notación anglosajona y orientación exacta de diagramas y dirección musical',
      pages: 'Libro págs. 11–12',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'Para comunicarnos con claridad universal durante todo el libro utilizamos siempre el cifrado anglosajón (letras C, D, E, F, G, A, B). Si estás acostumbrado a la notación latina (Do, Re, Mi...), consulta esta tabla hasta que la traducción sea instantánea.',
        },
        {
          type: 'interval-strip',
          title: 'Equivalencia de notación latina y anglosajona',
          subtitle: 'Las 7 notas naturales que usaremos en todos los capítulos',
          items: [
            { label: 'C', sublabel: 'Do', highlight: 'root' },
            { label: 'D', sublabel: 'Re', highlight: 'default' },
            { label: 'E', sublabel: 'Mi', highlight: 'chord' },
            { label: 'F', sublabel: 'Fa', highlight: 'default' },
            { label: 'G', sublabel: 'Sol', highlight: 'chord' },
            { label: 'A', sublabel: 'La', highlight: 'default' },
            { label: 'B', sublabel: 'Si', highlight: 'default' },
          ],
        },
        {
          type: 'callout',
          variant: 'rule',
          title: 'Convenciones visuales de los diagramas del libro',
          items: [
            'Cuerda aguda arriba: la 1ª cuerda (Mi agudo, «e») aparece siempre en la línea superior del diapasón y de las tablaturas; la 6ª cuerda (Mi grave, «E») está abajo.',
            'Trastes agudos a la derecha: la cejuela (traste 0) está a la izquierda y los trastes avanzan hacia la derecha igual que cuando miras tu guitarra desde arriba.',
            '«Subir» significa ir hacia sonidos más AGUDOS (hacia el puente o hacia la 1ª cuerda); «bajar» significa ir hacia sonidos más GRAVES (hacia la cejuela o hacia la 6ª cuerda).',
            'Círculos rojos = tónica (grado 1). Así identificarás siempre el ancla de cada forma a primera vista.',
          ],
        },
        {
          type: 'chord-grid',
          title: 'Ejemplo de lectura de diagramas de acorde',
          subtitle: 'Haz clic en cada acorde para escucharlo: × = cuerda muteada, ○ = cuerda al aire, rojo = tónica',
          voicings: [
            {
              name: 'C',
              subtitle: 'Posición abierta',
              frets: [-1, 3, 2, 0, 1, 0],
              labels: ['', '1', '3', '5', '1', '3'],
              rootStrings: [1, 4],
            },
            {
              name: 'G',
              subtitle: 'Posición abierta',
              frets: [3, 2, 0, 0, 0, 3],
              labels: ['1', '3', '5', '1', '3', '1'],
              rootStrings: [0, 3, 5],
            },
            {
              name: 'D',
              subtitle: 'Posición abierta',
              frets: [-1, -1, 0, 2, 3, 2],
              labels: ['', '', '1', '5', '1', '3'],
              rootStrings: [2, 4],
            },
            {
              name: 'Am',
              subtitle: 'Posición abierta',
              frets: [-1, 0, 2, 2, 1, 0],
              labels: ['', '1', '5', '1', '♭3', '5'],
              rootStrings: [1, 3],
            },
          ],
        },
      ],
      practiceTips: [
        'Recuerda siempre: «subir» en música es ir más agudo aunque físicamente tu mano vaya hacia el suelo en las cuerdas.',
        'Acostúmbrate a leer los símbolos de cualidad: sin letra = Mayor (G), «m» = menor (Gm), «º» o «dim» = disminuido (Gº), «+» o «aug» = aumentado (G+).',
      ],
      commonMistakes: [
        'Confundir físicamente «subir de cuerda» (hacia la 6ª, más grave) con «subir musicalmente» (hacia la 1ª, más agudo).',
        'Confundir la letra B (Si) con la B de bemol (♭): Bb o B♭ significa Si bemol.',
      ],
    },
    {
      id: 'ch0-4',
      moduleId: 'mod-0',
      code: '0.4',
      title: 'Cómo usar este libro y ruta de estudio recomendada',
      subtitle: 'Plan inteligente para no saturarte y consolidar cada recurso en tu memoria muscular',
      pages: 'Libro págs. 13–14',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'Este libro contiene material para meses —o años— de práctica productiva. Intentar estudiar a la vez tríadas mayores, menores, disminuidas y aumentadas suele provocar confusión visual en el diapasón. El autor propone un orden claro y progresivo.',
        },
        {
          type: 'list',
          title: 'Orden de estudio recomendado por el autor',
          ordered: true,
          items: [
            'Asienta el Capítulo 1 completo: comprende cómo se construye una tríada, cómo localizar grados y aprende las notas naturales del diapasón.',
            'Trabaja un solo tipo de tríada cada vez en el Capítulo 2: domina primero las TRÍADAS MAYORES en vertical, horizontal y en las 7 posiciones CAGED antes de pasar a las menores.',
            'Salta pronto al Capítulo 3 con las tríadas que ya domines: combina el aprendizaje mecánico con progresiones musicales reales (V–I, IV–I, I–IV–V).',
            'Una vez asentadas mayores y menores, incorpora disminuidas (Gº) y aumentadas (G+), y luego añade las tríadas abiertas (Drop 3 y Drop 2).',
            'Los Capítulos 4 (usos creativos y modos) y 5 (superposición) son independientes: puedes abordarlos cuando ya manejes con soltura las tríadas mayores y menores.',
            'El Capítulo 6 (expandiendo tríadas hacia pentatónicas y escala mayor) une todo el mapa del instrumento en una visión global.',
          ],
        },
        {
          type: 'callout',
          variant: 'memorize',
          title: 'La regla de oro del curso',
          text: 'Es infinitamente mejor dominar 2 o 3 posiciones con musicalidad, buen ritmo y en varias tonalidades que conocer las 7 posiciones de memoria solo en Sol y sin poder aplicarlas a una canción.',
        },
      ],
      practiceTips: [
        'Dedica 15–20 minutos diarios enfocados en un solo objetivo (por ejemplo, una única posición CAGED o un único par de acordes V–I) antes que 2 horas dispersas una vez a la semana.',
        'Practica siempre con metrónomo y, en cuanto domines una posición en G, transpórtala a C, D, A o F usando el selector de tonalidad de nuestros diagramas.',
      ],
      commonMistakes: [
        'Practicar únicamente de arriba a abajo como un robot sin intentar crear pequeñas frases musicales con las tres notas.',
        'Pasar al siguiente tipo de tríada cuando todavía dudas dónde está la 3ª o la tónica en las tríadas mayores.',
      ],
    },
  ],
};
