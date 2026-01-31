import { Member } from './types';

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Tú (Líder)', role: 'Líder' },
  { id: '2', name: 'Daniel Hernandez', role: 'Sin Asignar' },
  { id: '3', name: 'Miguel Osuna', role: 'Sin Asignar' },
  { id: '4', name: 'David Wilmer', role: 'Sin Asignar' },
  { id: '5', name: 'Daniel Garcia', role: 'Sin Asignar' },
  { id: '6', name: 'Abraham Toscano', role: 'Sin Asignar' },
];

export const AVAILABLE_ROLES = [
  'Líder',
  'Productor',
  'Editor Audio',
  'Investigador Bíblico',
  'Invitado Especial',
  'Promotor YT'
] as const;

export const BIBLE_SUMMARIES = [
  "Proverbios 17:17 - En todo tiempo ama el amigo, y es como un hermano en tiempo de angustia.",
  "Eclesiastés 4:9-10 - Mejores son dos que uno... si cayeren, el uno levantará a su compañero.",
  "1 Timoteo 4:12 - Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes.",
  "Salmos 119:9 - ¿Con qué limpiará el joven su camino? Con guardar tu palabra.",
  "Jeremías 29:11 - Planes de bienestar y no de calamidad, para daros un futuro y una esperanza."
];