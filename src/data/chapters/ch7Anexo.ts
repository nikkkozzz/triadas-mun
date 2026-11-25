import { CourseModule } from '../../types/course';

export const ch7Anexo: CourseModule = {
  id: 'mod-7',
  number: 'Anexo y Glosario',
  title: 'Técnicas de Estudio y Glosario',
  pages: 'Págs. 297–310',
  description:
    'Consejos prácticos de estudio para consolidar todo el libro, horizontes avanzados (qué queda fuera) y el glosario completo interactivo de los 53 términos de la obra.',
  lessons: [
    {
      id: 'ch7-1',
      moduleId: 'mod-7',
      code: 'A.1',
      title: 'Consejos y técnicas de estudio para dominar las tríadas',
      subtitle: 'Los 14 principios del autor para transformar la teoría en instinto musical real',
      pages: 'Libro págs. 298–301',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'paragraph',
          text: 'Al terminar los seis capítulos tienes en tus manos el mapa completo del diapasón. En el Anexo (págs. 298–301), Luis Ángel Rico Tejedor reúne sus consejos definitivos de entrenamiento diario para que este conocimiento pase de la cabeza a los dedos de forma natural y permanente:',
        },
        {
          type: 'table',
          data: {
            title: 'Decálogo ampliado de técnicas de estudio del libro (págs. 298–301)',
            headers: ['Principio', 'Aplicación práctica diaria'],
            rows: [
              ['1. Mecanización consciente', 'Repite un movimiento pequeño (p. ej. cambio V–I en una posición) hasta que no requiera esfuerzo mental, y solo entonces añade el siguiente.'],
              ['2. Metrónomo siempre', 'Practica despacio, con pulso firme, alternando a tiempo y a contratiempo. La velocidad llega sola como consecuencia de la limpieza.'],
              ['3. Foco en 2 o 3 recursos', 'No intentes meter todo el libro en una sola improvisación: elige hoy solo tríadas mayores + aproximaciones, mañana pares modales.'],
              ['4. Grábate en audio/vídeo', 'El móvil es el profesor más honesto: al escucharte detectarás al instante fallos de tiempo, afinación o falta de dinámica.'],
              ['5. Usa un pedal Looper', 'Graba una rueda lenta de 2 o 4 acordes y practica sobre ella 1, 2 y 4 notas por acorde en las 7 posiciones.'],
              ['6. Ponte limitaciones creativas', 'Improvisa durante 3 minutos usando solo 2 cuerdas, o solo una zona de 4 trastes, o empezando todas las frases a contratiempo.'],
              ['7. Transcribe solos reales', 'Saca de oído frases de tus guitarristas favoritos y analiza qué tríadas y aproximaciones están usando sobre los acordes.'],
              ['8. Cuida la dinámica', 'Alterna ataques suaves y fuertes, ligados, slides y vibrato: la misma tríada suena radicalmente distinta según cómo la tocas.'],
              ['9. Apunta a notas objetivo', 'Antes de que cambie el acorde, ten localizada visualmente la 3ª o la 1ª del acorde entrante.'],
              ['10. Práctica mental sin guitarra', 'En el transporte o antes de dormir, visualiza el mástil y recorre las formas CAGED o los intervalos en tu mente.'],
              ['11. Fragmenta las sesiones', 'Tres bloques de 15 minutos con foco total superan de largo a una sesión agotadora de 2 horas sin plan.'],
              ['12. Piensa siempre en grados', 'Decir «1–3–5» en lugar de solo trastes te permite transportar cualquier idea a las 12 tonalidades al vuelo.'],
              ['13. Ritmo y silencios', 'Un silencio bien colocado vale tanto como una nota: deja respirar tus frases como si cantaras.'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'memorize',
          title: 'Plan semanal sugerido de mantenimiento (20 min/día)',
          items: [
            'Minutos 1–5: Calentamiento con metrónomo en una tonalidad nueva del día (localización de notas + 7 posiciones de una tríada).',
            'Minutos 6–12: Una mini-progresión del Capítulo 3 en 1–2–4 notas y contratiempos.',
            'Minutos 13–20: Improvisación libre sobre looper o base aplicando UN recurso creativo (double stops, par modal, upper structure o aproximaciones).',
          ],
        },
      ],
      practiceTips: [
        'Elige una canción que te apasione hoy mismo, escribe su progresión de acordes en grados y acompáñala íntegramente usando tríadas en una sola zona del mástil.',
        'Lleva un pequeño cuaderno (o marca tu avance aquí) anotando el BPM cómodo al que dominas cada progresión.',
      ],
      commonMistakes: [
        'Abandonar el metrónomo en cuanto crees que ya te sabes el ejercicio.',
        'Practicar siempre en las mismas dos tonalidades cómodas (G y A) y evitar F, B♭, E♭ o B.',
      ],
    },
    {
      id: 'ch7-2',
      moduleId: 'mod-7',
      code: 'A.2',
      title: '¿Qué hemos dejado fuera? y Glosario Completo del Libro',
      subtitle: 'Acordes omitidos (shell voicings), sus4♭5, extensiones futuras y buscador de los 53 términos',
      pages: 'Libro págs. 302–310',
      estimatedMinutes: 10,
      blocks: [
        {
          type: 'paragraph',
          text: 'En la página 302 el autor señala con honestidad qué caminos avanzados quedan abiertos como siguientes pasos naturales una vez que hayas interiorizado este curso:',
        },
        {
          type: 'list',
          title: '¿Qué hemos dejado fuera para tu siguiente etapa? (pág. 302)',
          items: [
            'Acordes omitidos / Shell voicings (1–3–7 o 1–♭3–♭7): prescindir de la 5ª justa para tocar tétradas ultra limpias en jazz, neo-soul y funk.',
            'Tríadas híbridas y alteradas especiales: como sus4♭5 (1–4–♭5) o tríadas lidias (1–♯4–5) muy empleadas en fusión moderna.',
            'Tríadas abiertas avanzadas y conducción de voces a 4 voces (Drop 2 y Drop 3 con séptima y tensiones en inversiones completas).',
            'Armonía cuartal (acordes construidos por cuartas en lugar de terceras) y rearmonización avanzada.',
          ],
        },
        {
          type: 'chord-grid',
          title: 'Muestra rápida de los siguientes horizontes (Shell Voicings y sus4♭5)',
          subtitle: 'Haz clic para escuchar cómo suenan estos voicings complementarios',
          voicings: [
            {
              name: 'Cmaj7 (Shell)',
              subtitle: '1 – 3 – 7 (sin 5ª)',
              baseFret: 7,
              frets: [8, -1, 9, 9, -1, -1],
              labels: ['1', '', '7', '3', '', ''],
              rootStrings: [0],
            },
            {
              name: 'Cm7 (Shell)',
              subtitle: '1 – ♭3 – ♭7 (sin 5ª)',
              baseFret: 7,
              frets: [8, -1, 8, 8, -1, -1],
              labels: ['1', '', '♭7', '♭3', '', ''],
              rootStrings: [0],
            },
            {
              name: 'C7 (Shell)',
              subtitle: '1 – 3 – ♭7 (tritono)',
              baseFret: 7,
              frets: [8, -1, 8, 9, -1, -1],
              labels: ['1', '', '♭7', '3', '', ''],
              rootStrings: [0],
            },
            {
              name: 'Csus4♭5',
              subtitle: '1 – 4 – ♭5 (tensión moderna)',
              baseFret: 8,
              frets: [-1, -1, 10, 10, 7, -1],
              labels: ['', '', '1', '4', '♭5', ''],
              rootStrings: [2],
            },
          ],
        },
        {
          type: 'lab',
          labType: 'glossary',
        },
        {
          type: 'callout',
          variant: 'summary',
          title: '¡Enhorabuena! Has recorrido las 310 páginas de Tríadas para Muñones (y CAGED)',
          text: 'Vuelve periódicamente a cualquier capítulo, transpone los diagramas a nuevas tonalidades y utiliza el glosario superior como enciclopedia rápida de consulta mientras compones o practicas.',
        },
      ],
      practiceTips: [
        'Usa el buscador del glosario cada vez que encuentres un término armónico que quieras refrescar y salta directamente a su lección correspondiente.',
        'Repasa tu progreso general en el menú lateral para comprobar si te queda alguna lección pendiente por marcar como completada.',
      ],
      commonMistakes: [
        'Dar el curso por «terminado» tras la primera lectura: un buen método de guitarra se relee y se re-practica en nuevas tonalidades durante toda la vida musical.',
      ],
    },
  ],
};
