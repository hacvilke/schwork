/**
 * Central subject list for the homepage and `/subjects` directory.
 *
 * To activate a subject once its docs folder is ready:
 *   1. Change `status` from `'planned'` to `'live'`
 *   2. Add `docPath: '/docs/<subject-slug>'`
 *
 * Example:
 *   {
 *     id: 'mathematics',
 *     name: 'Mathematics',
 *     shortCode: 'MATH',
 *     cluster: 'Core',
 *     status: 'live',
 *     syllabusSections: 9,
 *     summary: '...',
 *     docPath: '/docs/mathematics',
 *   }
 */

export type SubjectStatus = 'live' | 'planned';

export type SubjectCluster =
  | 'Core'
  | 'Sciences'
  | 'Business & Tech'
  | 'Humanities';

export interface SubjectEntry {
  id: string;
  name: string;
  shortCode: string;
  cluster: SubjectCluster;
  status: SubjectStatus;
  syllabusSections: number;
  summary: string;
  docPath?: string;
}

export const SUBJECTS: SubjectEntry[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    shortCode: 'MATH',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Number Theory, Consumer Arithmetic, Sets, Measurement, Statistics, Algebra, Relations & Graphs, Geometry & Trig, Vectors & Matrices.',
  },
  {
    id: 'english-a',
    name: 'English Language',
    shortCode: 'ENG-A',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Grammar & Mechanics, Summary Writing, Reading Comprehension, Expository, Persuasive, and Narrative Writing for Papers 1 & 2.',
  },
  {
    id: 'poa',
    name: 'Principles of Accounts (POA)',
    shortCode: 'POA',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 11,
    summary:
      'Double-entry bookkeeping, Journals, Ledgers, Trial Balance, Income Statements, Balance Sheets, Partnerships, Companies & Ratios.',
  },
  {
    id: 'edpm',
    name: 'EDPM',
    shortCode: 'EDPM',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Electronic Document Preparation & Management: keyboarding, document formatting, business letters, manuscripts, spreadsheets, and SBA portfolio.',
  },
  {
    id: 'physics',
    name: 'Physics',
    shortCode: 'PHYS',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Mechanics, Thermal Physics & Kinetic Theory, Waves & Optics, Electricity & Magnetism, and The Physics of the Atom.',
  },
  {
    id: 'integrated-science',
    name: 'Integrated Science',
    shortCode: 'ISCI',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'The Organism and Its Environment, The Home and Workplace, and Earth’s Place in the Universe — with clear diagrams and lab notes.',
  },
  {
    id: 'caribbean-history',
    name: 'Caribbean History',
    shortCode: 'HIST',
    cluster: 'Humanities',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Indigenous Peoples, Sugar & Slavery, Emancipation, Adjustment to Emancipation, Caribbean Economy, US Influence, and Decolonisation.',
  },
  {
    id: 'more-subjects',
    name: 'More Subjects Coming',
    shortCode: 'MORE',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 0,
    summary:
      'Chemistry, Biology, Information Technology, Social Studies, Principles of Business, Human & Social Biology, Geography, Spanish, and more.',
  },
];
