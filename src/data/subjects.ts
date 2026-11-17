/**
 * Central subject directory for the homepage and `/subjects`.
 * Lists Jamaican high school subjects (Grades 10–11) plus one dedicated University track.
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
  | 'Humanities & Languages'
  | 'Technical & Creative'
  | 'University';

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
  /* ---------- Core ---------- */
  {
    id: 'english-a',
    name: 'English Language (English A)',
    shortCode: 'ENG-A',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Grammar & mechanics, summary writing, reading comprehension, persuasive, argumentative, expository, and narrative essays.',
  },
  {
    id: 'english-b',
    name: 'English Literature (English B)',
    shortCode: 'ENG-B',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Drama, poetry, and prose fiction analysis covering literary devices, character development, themes, and structured literature essays.',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    shortCode: 'MATH',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Number theory, consumer arithmetic, sets, measurement, statistics, algebra, relations & graphs, geometry & trigonometry, vectors, and matrices.',
  },
  {
    id: 'additional-mathematics',
    name: 'Additional Mathematics',
    shortCode: 'ADDMATH',
    cluster: 'Core',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Advanced algebra, sequences & series, coordinate geometry, trigonometry, differentiation, integration, kinematics, and probability.',
  },

  /* ---------- Sciences ---------- */
  {
    id: 'integrated-science',
    name: 'Integrated Science',
    shortCode: 'ISCI',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Living organisms & environment, energy, electricity, matter in the home and workplace, and Earth’s place in the universe.',
  },
  {
    id: 'biology',
    name: 'Biology',
    shortCode: 'BIO',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Living organisms & ecosystems, cells, nutrition, respiration, transport, coordination, genetics, continuity, and lab skills.',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    shortCode: 'CHEM',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Atomic structure, bonding, mole concept, acids, bases & salts, redox, rates, energetics, electrochemistry, and organic chemistry.',
  },
  {
    id: 'physics',
    name: 'Physics',
    shortCode: 'PHYS',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Mechanics, thermal physics & kinetic theory, waves & optics, electricity & magnetism, and atomic & nuclear physics.',
  },
  {
    id: 'human-social-biology',
    name: 'Human & Social Biology',
    shortCode: 'HSB',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Human body systems, nutrition, reproduction, heredity, disease & immunity, and environmental & community health.',
  },
  {
    id: 'agricultural-science',
    name: 'Agricultural Science',
    shortCode: 'AGRI',
    cluster: 'Sciences',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Soil science, crop production, animal husbandry, farm machinery, agribusiness economics, and sustainable Caribbean farming.',
  },

  /* ---------- Business & Tech ---------- */
  {
    id: 'poa',
    name: 'Principles of Accounts (POA)',
    shortCode: 'POA',
    cluster: 'Business & Tech',
    status: 'live',
    syllabusSections: 11,
    summary:
      'Double-entry bookkeeping, books of original entry, ledgers, trial balance, financial statements, partnerships, companies, payroll, and ratios.',
    docPath: '/docs/poa',
  },
  {
    id: 'pob',
    name: 'Principles of Business (POB)',
    shortCode: 'POB',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 10,
    summary:
      'Business organisations, management, contracts, establishing a business, marketing, logistics, finance, and government’s economic role.',
  },
  {
    id: 'economics',
    name: 'Economics',
    shortCode: 'ECON',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 7,
    summary:
      'Scarcity & choice, demand & supply, market structures, money & banking, inflation, international trade, and Caribbean development.',
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    shortCode: 'IT',
    cluster: 'Business & Tech',
    status: 'live',
    syllabusSections: 8,
    summary:
      'Computer fundamentals, networks & web technologies, cybersecurity & ICT impact, word-processing, spreadsheets, databases, problem-solving algorithms, and programming.',
    docPath: '/docs/it',
  },
  {
    id: 'edpm',
    name: 'EDPM',
    shortCode: 'EDPM',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Electronic Document Preparation & Management: keyboarding, business letters, memoranda, manuscripts, tables, mail merge, and filing.',
  },
  {
    id: 'office-administration',
    name: 'Office Administration',
    shortCode: 'OA',
    cluster: 'Business & Tech',
    status: 'planned',
    syllabusSections: 12,
    summary:
      'Office orientation, communication, recruitment, records & information management, reception, travel & meetings, and procurement.',
  },

  /* ---------- Humanities & Languages ---------- */
  {
    id: 'social-studies',
    name: 'Social Studies',
    shortCode: 'SOC',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Individual, family & society, Caribbean institutions & government, sustainable resource use, and regional integration.',
  },
  {
    id: 'caribbean-history',
    name: 'Caribbean History',
    shortCode: 'HIST',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 9,
    summary:
      'Indigenous peoples, European settlement, sugar & slavery, resistance & emancipation, Caribbean economy, US influence, and independence.',
  },
  {
    id: 'geography',
    name: 'Geography',
    shortCode: 'GEO',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Map reading & field skills, plate tectonics, rivers & coasts, weather & climate, population settlement, and Caribbean economic geography.',
  },
  {
    id: 'religious-education',
    name: 'Religious Education',
    shortCode: 'RE',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Major world religions, Caribbean religious traditions, sacred texts, moral decision-making, and community ethics.',
  },
  {
    id: 'spanish',
    name: 'Spanish',
    shortCode: 'SPAN',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 6,
    summary:
      'Listening, reading comprehension, oral responses, directed situations, letter/contextual dialogue writing, and everyday Spanish grammar.',
  },
  {
    id: 'french',
    name: 'French',
    shortCode: 'FREN',
    cluster: 'Humanities & Languages',
    status: 'planned',
    syllabusSections: 6,
    summary:
      'Listening, reading comprehension, oral conversations, directed situations, functional writing, and core French grammar.',
  },

  /* ---------- Technical & Creative ---------- */
  {
    id: 'technical-drawing',
    name: 'Technical Drawing',
    shortCode: 'TD',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Plane & solid geometry, orthographic & isometric projections, sectional views, and building or mechanical engineering drawing.',
  },
  {
    id: 'industrial-technology',
    name: 'Industrial Technology',
    shortCode: 'INDTECH',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Electrical & electronic, mechanical engineering, and building & furniture technology fundamentals, tools, materials, and workshop safety.',
  },
  {
    id: 'food-nutrition-health',
    name: 'Food, Nutrition & Health',
    shortCode: 'FNH',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 7,
    summary:
      'Nutrients & diet planning, food science & preservation, kitchen safety, Caribbean culinary methods, and consumer food awareness.',
  },
  {
    id: 'textiles-clothing-fashion',
    name: 'Textiles, Clothing & Fashion',
    shortCode: 'TCF',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 6,
    summary:
      'Fibres & fabric science, sewing equipment, pattern drafting & alteration, garment construction, and fashion design principles.',
  },
  {
    id: 'family-resource-management',
    name: 'Family & Resource Management',
    shortCode: 'FRM',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 6,
    summary:
      'Family dynamics, budgeting & consumer education, time & energy management, housing design, and household wellbeing.',
  },
  {
    id: 'visual-arts',
    name: 'Visual Arts',
    shortCode: 'ART',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Drawing, painting & mixed media, graphic & communication design, ceramics, textiles, sculpture, and Caribbean art appreciation.',
  },
  {
    id: 'music',
    name: 'Music',
    shortCode: 'MUS',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 3,
    summary:
      'Music theory & notation, listening & appraising, composition, solo/ensemble performance, and Jamaican & Caribbean musical styles.',
  },
  {
    id: 'theatre-arts',
    name: 'Theatre Arts',
    shortCode: 'THEA',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 4,
    summary:
      'Acting & improvisation, playmaking, stagecraft & lighting, Caribbean folk performance forms, and theatre critique.',
  },
  {
    id: 'physical-education',
    name: 'Physical Education & Sport',
    shortCode: 'PE',
    cluster: 'Technical & Creative',
    status: 'planned',
    syllabusSections: 5,
    summary:
      'Anatomy & physiology, fitness & training principles, sports nutrition, rules & tactics, and the role of sport in Jamaican society.',
  },

  /* ---------- University ---------- */
  {
    id: 'university',
    name: 'University',
    shortCode: 'UNI',
    cluster: 'University',
    status: 'planned',
    syllabusSections: 0,
    summary:
      'Higher-education study docs for Jamaican college and university students — calculus, linear algebra, programming, academic writing, financial accounting, microeconomics, and core degree foundations.',
  },
];
