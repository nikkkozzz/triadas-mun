import { CourseModule, Lesson } from '../types/course';
import { ch0Intro } from './chapters/ch0Intro';
import { ch1Theory } from './chapters/ch1Theory';
import { ch2Fretboard } from './chapters/ch2Fretboard';
import { ch3Progressions } from './chapters/ch3Progressions';
import { ch4Uses } from './chapters/ch4Uses';
import { ch5Superposition } from './chapters/ch5Superposition';
import { ch6Expanding } from './chapters/ch6Expanding';
import { ch7Anexo } from './chapters/ch7Anexo';

export const COURSE_MODULES: CourseModule[] = [
  ch0Intro,
  ch1Theory,
  ch2Fretboard,
  ch3Progressions,
  ch4Uses,
  ch5Superposition,
  ch6Expanding,
  ch7Anexo,
];

export const ALL_LESSONS: Lesson[] = COURSE_MODULES.flatMap((m) => m.lessons);

export function getModuleForLesson(lessonId: string): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}
