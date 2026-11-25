import { CourseModule } from '../../types/course';

export const ch5Superposition: CourseModule = {
  id: 'mod-5',
  number: 'Capítulo 5',
  title: 'Superposición de Tríadas',
  pages: 'Págs. 225–244',
  description:
    'Upper Structures: conseguir tétradas, novenas, trecenas y dominantes alterados o disminuidos superponiendo tríadas simples sobre el acorde base (Ejemplos 68 al 78).',
  lessons: [
    {
      id: 'ch5-1',
      moduleId: 'mod-5',
      code: '5.1',
      title: 'Upper Structures: tríadas en lugar de tétradas — Ejemplos 68 a 70',
      subtitle: 'Tocar la tríada desde el 3er grado para obtener maj7/m7/7 y desde el 5º grado para maj9',
      pages: 'Libro págs. 226–229',
      examples: 'Ejemplos 68–70',
      estimatedMinutes: 11,
      blocks: [
        {
          type: 'paragraph',
          text: '¿Cómo lograr el sonido rico y sofisticado de los acordes de séptima (maj7, m7, 7) y novena (maj9) usando únicamente las tríadas que ya conoces? La respuesta es la superposición de tríadas (Upper Structures). Si el bajista o el guitarrista rítmico sostiene la tónica C, y tú tocas la tríada del 3er grado (Em = E–G–B), el oído suma C + E–G–B = Cmaj7.',
        },
        {
          type: 'table',
          data: {
            title: 'Tríada desde el 3er grado sobre cada acorde diatónico de C mayor (pág. 227)',
            headers: ['Acorde deseado (Tétrada)', 'Bajo / Base', 'Tríada a tocar (3er grado)', 'Notas resultantes'],
            rows: [
              ['Cmaj7', 'C', 'Em (menor)', 'C + E – G – B'],
              ['Dm7', 'D', 'F (mayor)', 'D + F – A – C'],
              ['Em7', 'E', 'G (mayor)', 'E + G – B – D'],
              ['Fmaj7', 'F', 'Am (menor)', 'F + A – C – E'],
              ['G7', 'G', 'Bº (disminuida)', 'G + B – D – F'],
              ['Am7', 'A', 'C (mayor)', 'A + C – E – G'],
              ['Bm7♭5', 'B', 'Dm (menor)', 'B + D – F – A'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'memorize',
          title: 'Truco para sonoridad maj9 (Ejemplo 70)',
          text: 'Si en lugar de empezar en el 3er grado tocas la tríada mayor desde el 5º grado del acorde (G sobre bajo C = C + G–B–D, o C sobre bajo F = F + C–E–G), obtienes un color Cmaj9 / Fmaj9 luminoso, abierto y sin notas a evitar.',
        },
        {
          type: 'tab',
          config: {
            exampleNumber: 'Ejemplos 68, 69 y 70',
            title: 'Acordes y arpegios con superposición: Em/C (Cmaj7), F/D (Dm7) y G/C (Cmaj9)',
            subtitle: 'Escucha cómo el sonido se vuelve instantáneamente moderno y lleno de color',
            bpm: 84,
            steps: [
              { chord: 'Em/C (Cmaj7)', strum: 'down', beats: 2, annotation: 'Ej. 68', notes: [{ string: 5, fret: 3, highlight: 'root' }, { string: 3, fret: 4 }, { string: 2, fret: 5 }, { string: 1, fret: 3 }] },
              { chord: 'F/D (Dm7)', strum: 'down', beats: 2, notes: [{ string: 4, fret: 0, highlight: 'root' }, { string: 3, fret: 2 }, { string: 2, fret: 1 }, { string: 1, fret: 1 }], barAfter: true },
              { chord: 'Ej. 69 Em (s/C)', beats: 0.5, notes: [{ string: 3, fret: 9 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 8 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 7 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 12 }] },
              { chord: 'Ej. 70 G/C (maj9)', strum: 'down', beats: 2, notes: [{ string: 5, fret: 3, highlight: 'root' }, { string: 3, fret: 4 }, { string: 2, fret: 3 }, { string: 1, fret: 3 }], barAfter: true },
              { chord: 'C/F (Fmaj9)', strum: 'down', beats: 2, notes: [{ string: 4, fret: 3, highlight: 'root' }, { string: 3, fret: 5 }, { string: 2, fret: 5 }, { string: 1, fret: 3 }] },
            ],
          },
        },
      ],
      practiceTips: [
        'Practica tocar una rueda Dm7 – G7 – Cmaj7 haciendo simplemente los arpegios de F mayor → Bº → Em en la misma zona del mástil.',
        'Cuando improvises sobre una base de C mayor, alterna frases de C mayor con frases de Em (Cmaj7) y G mayor (Cmaj9).',
      ],
      commonMistakes: [
        'Tocar la tríada superpuesta en las cuerdas graves pisando el registro del bajo: las Upper Structures funcionan mejor en las cuerdas 1–2–3 y 2–3–4.',
      ],
    },
    {
      id: 'ch5-2',
      moduleId: 'mod-5',
      code: '5.2',
      title: 'Tensiones, notas a evitar y superposiciones sobre mayores y menores — Ejemplo 71',
      subtitle: 'Tensiones 9, 11, 13, alteraciones y aplicación sobre la progresión IIm – V – I en C',
      pages: 'Libro págs. 230–234',
      examples: 'Ejemplo 71',
      estimatedMinutes: 12,
      blocks: [
        {
          type: 'paragraph',
          text: 'Al superponer tríadas estamos introduciendo tensiones armónicas (9, 11, 13 y sus alteraciones ♭9, ♯9, ♯11, ♭13). Para elegir tríadas que suenen bien debemos evitar las «notas a evitar» (notas situadas exactamente un semitono por encima de una nota del acorde base, como la 4ª justa F sobre un acorde de C mayor, que choca ásperamente contra la 3ª mayor E).',
        },
        {
          type: 'table',
          data: {
            title: 'Superposiciones principales sobre C Mayor y C Menor (págs. 232–233)',
            headers: ['Acorde base', 'Tríada superpuesta', 'Grados que aporta', 'Sonoridad resultante'],
            rows: [
              ['C Mayor', 'Em', '3 – 5 – 7', 'Cmaj7'],
              ['C Mayor', 'G', '5 – 7 – 9', 'Cmaj9'],
              ['C Mayor', 'D (tríada del II)', '2(9) – ♯4(♯11) – 6(13)', 'Cmaj13(♯11) · Lidio'],
              ['C Dominante (C7)', 'Eº', '3 – 5 – ♭7', 'C7 puro'],
              ['C Dominante (C7)', 'Gm', '5 – ♭7 – 9', 'C9 (Mixolidio)'],
              ['C Menor (Cm)', 'E♭', '♭3 – 5 – ♭7', 'Cm7'],
              ['C Menor (Cm)', 'Gm', '5 – ♭7 – 9', 'Cm9'],
              ['C Menor (Cm)', 'Dm', '2(9) – 4(11) – 6(13)', 'Cm13 (Dórico)'],
            ],
          },
        },
        {
          type: 'lab',
          labType: 'upper-structures',
        },
        {
          type: 'tab',
          config: {
            exampleNumber: 'Ejemplo 71',
            title: 'Superposición de tríadas sobre IIm – V – I en C (Dm7 – G7 – Cmaj7)',
            subtitle: 'Sobre Dm7 tocamos Am (Dm9); sobre G7 tocamos Dm (G9sus/13); sobre Cmaj7 tocamos G (Cmaj9)',
            bpm: 84,
            steps: [
              { chord: 'Am (s/Dm7)', beats: 0.5, notes: [{ string: 4, fret: 7 }] },
              { beats: 0.5, notes: [{ string: 3, fret: 5 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 5 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 5 }] },
              { chord: 'Dm (s/G7)', beats: 0.5, notes: [{ string: 1, fret: 5 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 6 }] },
              { beats: 0.5, notes: [{ string: 3, fret: 7 }] },
              { beats: 0.5, notes: [{ string: 4, fret: 7 }], barAfter: true },
              { chord: 'G (s/Cmaj7)', beats: 0.5, notes: [{ string: 4, fret: 5 }] },
              { beats: 0.5, notes: [{ string: 3, fret: 4 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 3 }] },
              { beats: 2.5, notes: [{ string: 1, fret: 3 }] },
            ],
          },
        },
      ],
      practiceTips: [
        'Utiliza el Laboratorio de Superposición superior para escuchar cada acorde antes de tocarlo en la guitarra: educar el oído a las novenas y oncenás es clave.',
        'Fíjate en lo económico que es el Ejemplo 71: solo usas las tríadas de Am, Dm y G para sonar como un guitarrista de jazz/fusión sobre Dm7–G7–Cmaj7.',
      ],
      commonMistakes: [
        'Tocar la tríada de F mayor sobre C mayor esperando que suene como Cmaj7: al incluir F (4ª justa), choca con la 3ª (E) y suena más a acorde suspendido.',
      ],
    },
    {
      id: 'ch5-3',
      moduleId: 'mod-5',
      code: '5.3',
      title: 'Funciones armónicas y superposición sobre dominantes (♭9♭13, alterado, disminuido y semitono) — Ejemplos 72 a 78',
      subtitle: 'Tensión máxima en el V7 antes de resolver e Ideas Fundamentales del Capítulo 5',
      pages: 'Libro págs. 235–244',
      examples: 'Ejemplos 72–78',
      estimatedMinutes: 15,
      blocks: [
        {
          type: 'paragraph',
          text: 'En la armonía funcional existen tres grandes familias: Tónica (reposo: I, VIm, IIIm), Subdominante (alejamiento suave: IV, IIm) y Dominante (máxima tensión por el tritono 3–♭7: V7, VIIº). Es precisamente sobre el acorde Dominante (V7) donde las superposiciones de tríadas desatan toda su magia, generando tensiones alteradas que resuelven gloriosamente en la tónica.',
        },
        {
          type: 'table',
          data: {
            title: 'Recetario maestro de superposiciones sobre el acorde Dominante (Ejemplo sobre G7 → C/Cm)',
            subtitle: 'Cuadro resumen de las páginas 236–243 del libro',
            headers: ['Color dominante', 'Fórmula práctica de tríada', 'Tríada sobre G7', 'Ejemplos del libro'],
            rows: [
              ['Dominante ♭9♭13 (resuelve en menor)', 'Tríada MENOR ½ tono arriba del V', 'A♭m sobre G7 (o B♭m sobre A7)', 'Ej. 72 (Edim – B♭m/A7 – Dm)'],
              ['Dominante Alterado (opción menor)', 'Tríadas MENORES sobre ♭9 y ♯9', 'A♭m (♭9) y B♭m (♯9) sobre G7', 'Ej. 73 y Ej. 75'],
              ['Dominante Alterado (opción mayor)', 'Tríadas MAYORES sobre ♭5 y ♯5', 'D♭ (♭5) y E♭ (♯5) sobre G7', 'Ej. 74'],
              ['Dominante Disminuido (H–W)', 'Tríadas MAYORES ½ tono debajo de 3, 5 o ♭7', 'B♭, D♭ y E mayor sobre G7', 'Ej. 76 y Ej. 77'],
              ['Deslizamiento cromático ½ tono', 'Tríada ½ tono arriba o abajo de la tónica', 'A♭ o F♯ resolviendo en G/C', 'Ej. 78'],
            ],
          },
        },
        {
          type: 'tab',
          config: {
            exampleNumber: 'Ejemplos 72, 74, 76 y 78',
            title: 'Frases de tensión y resolución sobre dominantes: ♭9♭13, Alterado (E♭/G7) y Disminuido (E/G7)',
            subtitle: 'Escucha cómo la tensión «fuera de la escala» cobra sentido absoluto en cuanto resuelve en Dm o C',
            bpm: 84,
            steps: [
              { chord: 'Ej. 72 B♭m (s/A7)', beats: 0.5, annotation: '♭9♭13', notes: [{ string: 4, fret: 8 }] },
              { beats: 0.5, notes: [{ string: 3, fret: 6 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 6 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 6 }] },
              { chord: '→ Dm', beats: 2, notes: [{ string: 1, fret: 5, highlight: 'root' }, { string: 2, fret: 6 }, { string: 3, fret: 7 }], barAfter: true },
              { chord: 'Ej. 74 E♭ (s/G7)', beats: 0.5, annotation: 'Alt.', notes: [{ string: 3, fret: 8 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 8 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 6 }] },
              { chord: 'D♭ (s/G7)', beats: 0.5, notes: [{ string: 1, fret: 4 }] },
              { chord: '→ Cmaj7', beats: 2, notes: [{ string: 1, fret: 3 }, { string: 2, fret: 5 }, { string: 3, fret: 4 }], barAfter: true },
              { chord: 'Ej. 76 E (s/G7)', beats: 0.5, annotation: 'Dim H-W', notes: [{ string: 3, fret: 9 }] },
              { beats: 0.5, notes: [{ string: 2, fret: 9 }] },
              { beats: 0.5, notes: [{ string: 1, fret: 7 }] },
              { chord: '→ C', beats: 2.5, notes: [{ string: 1, fret: 8, highlight: 'root' }] },
            ],
          },
        },
        {
          type: 'callout',
          variant: 'summary',
          title: 'Ideas Fundamentales del Capítulo 5 (pág. 244)',
          items: [
            'Superponer una tríada del 3er grado sobre el bajo convierte cualquier tríada en tétrada (maj7, m7, 7); desde el 5º grado añade la 9ª.',
            'Respeta las notas a evitar (evita un semitono encima de notas estructurales en acordes de reposo).',
            'En los acordes dominantes (V7) casi cualquier tensión alterada funciona maravillosamente si resuelve con decisión sobre la tónica.',
            'Memoriza tres atajos rápidos para V7: menor ½ tono arriba (♭9♭13), mayor sobre ♭5/♯5 (alterado) y mayor ½ tono abajo de 3, 5 o ♭7 (sonido disminuido).',
          ],
        },
      ],
      practiceTips: [
        'Empieza dominando UN solo truco del recetario: la tríada menor ½ tono por encima del dominante (p. ej. B♭m sobre A7 antes de resolver a Dm). Es extremadamente fácil de recordar y suena de inmediato a jazz/fusión profesional.',
        'Resuelve siempre la última nota del arpegio alterado moviéndola solo 1 traste hacia una nota segura del acorde I.',
      ],
      commonMistakes: [
        'Usar superposiciones alteradas y quedarse colgado sin resolver en el acorde de tónica: sin resolución, la tensión suena a nota falsa.',
      ],
    },
  ],
};
