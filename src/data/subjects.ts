/**
 * Central subject list for `/subjects` and per-subject docs sidebars.
 * Every subject links directly to its documentation page at `/docs/<id>`.
 */

export interface SubjectEntry {
  id: string;
  name: string;
  docPath: string;
  summary: string;
}

export const SUBJECTS: SubjectEntry[] = [
  {
    id: 'additional-mathematics',
    name: 'Additional Mathematics',
    docPath: '/docs/additional-mathematics',
    summary:
      'Advanced algebra, sequences & series, coordinate geometry, trigonometry, differentiation, integration, kinematics, and probability.',
  },
  {
    id: 'agricultural-science',
    name: 'Agricultural Science',
    docPath: '/docs/agricultural-science',
    summary:
      'Soil science, crop production, animal husbandry, farm machinery, agribusiness economics, and sustainable farming.',
  },
  {
    id: 'biology',
    name: 'Biology',
    docPath: '/docs/biology',
    summary:
      'Living organisms & ecosystems, cells, nutrition, respiration, transport, coordination, genetics, continuity, and lab skills.',
  },
  {
    id: 'caribbean-history',
    name: 'Caribbean History',
    docPath: '/docs/caribbean-history',
    summary:
      'Indigenous peoples, European settlement, sugar & slavery, resistance & emancipation, regional economy, and independence.',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    docPath: '/docs/chemistry',
    summary:
      'Atomic structure, bonding, mole concept, acids, bases & salts, redox, rates, energetics, electrochemistry, and organic chemistry.',
  },
  {
    id: 'economics',
    name: 'Economics',
    docPath: '/docs/economics',
    summary:
      'Scarcity & choice, demand & supply, market structures, money & banking, inflation, international trade, and economic development.',
  },
  {
    id: 'edpm',
    name: 'EDPM',
    docPath: '/docs/edpm',
    summary:
      'Electronic Document Preparation & Management: keyboarding, business letters, memoranda, manuscripts, tables, mail merge, and filing.',
  },
  {
    id: 'english-a',
    name: 'English Language (English A)',
    docPath: '/docs/english-a',
    summary:
      'Grammar & mechanics, summary writing, reading comprehension, persuasive, argumentative, expository, and narrative essays.',
  },
  {
    id: 'english-b',
    name: 'English Literature (English B)',
    docPath: '/docs/english-b',
    summary:
      'Drama, poetry, and prose fiction analysis covering literary devices, character development, themes, and structured literature essays.',
  },
  {
    id: 'family-resource-management',
    name: 'Family & Resource Management',
    docPath: '/docs/family-resource-management',
    summary:
      'Family dynamics, budgeting & consumer education, time & energy management, housing design, and household wellbeing.',
  },
  {
    id: 'food-nutrition-health',
    name: 'Food, Nutrition & Health',
    docPath: '/docs/food-nutrition-health',
    summary:
      'Nutrients & diet planning, food science & preservation, kitchen safety, culinary methods, and consumer food awareness.',
  },
  {
    id: 'french',
    name: 'French',
    docPath: '/docs/french',
    summary:
      'Listening, reading comprehension, oral conversations, directed situations, functional writing, and core French grammar.',
  },
  {
    id: 'geography',
    name: 'Geography',
    docPath: '/docs/geography',
    summary:
      'Map reading & field skills, plate tectonics, rivers & coasts, weather & climate, population settlement, and economic geography.',
  },
  {
    id: 'human-social-biology',
    name: 'Human & Social Biology',
    docPath: '/docs/human-social-biology',
    summary:
      'Human body systems, nutrition, reproduction, heredity, disease & immunity, and environmental & community health.',
  },
  {
    id: 'industrial-technology',
    name: 'Industrial Technology',
    docPath: '/docs/industrial-technology',
    summary:
      'Electrical & electronic, mechanical engineering, and building & furniture technology fundamentals, tools, materials, and workshop safety.',
  },
  {
    id: 'integrated-science',
    name: 'Integrated Science',
    docPath: '/docs/integrated-science',
    summary:
      'Living organisms & environment, energy, electricity, matter in the home and workplace, and Earth’s place in the universe.',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    docPath: '/docs/mathematics',
    summary:
      'Number theory, consumer arithmetic, sets, measurement, statistics, algebra, relations & graphs, geometry & trigonometry, vectors, and matrices.',
  },
  {
    id: 'music',
    name: 'Music',
    docPath: '/docs/music',
    summary:
      'Music theory & notation, listening & appraising, composition, solo/ensemble performance, and Caribbean & global musical styles.',
  },
  {
    id: 'office-administration',
    name: 'Office Administration',
    docPath: '/docs/office-administration',
    summary:
      'Office orientation, communication, recruitment, records & information management, reception, travel & meetings, and procurement.',
  },
  {
    id: 'physical-education',
    name: 'Physical Education & Sport',
    docPath: '/docs/physical-education',
    summary:
      'Anatomy & physiology, fitness & training principles, sports nutrition, rules & tactics, and the role of sport in society.',
  },
  {
    id: 'physics',
    name: 'Physics',
    docPath: '/docs/physics',
    summary:
      'Mechanics, thermal physics & kinetic theory, waves & optics, electricity & magnetism, and atomic & nuclear physics.',
  },
  {
    id: 'pob',
    name: 'Principles of Business (POB)',
    docPath: '/docs/pob',
    summary:
      'Business organisations, management, contracts, establishing a business, marketing, logistics, finance, and government’s economic role.',
  },
  {
    id: 'religious-education',
    name: 'Religious Education',
    docPath: '/docs/religious-education',
    summary:
      'Major world religions, regional religious traditions, sacred texts, moral decision-making, and community ethics.',
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    docPath: '/docs/social-studies',
    summary:
      'Individual, family & society, institutions & government, sustainable resource use, and regional integration.',
  },
  {
    id: 'spanish',
    name: 'Spanish',
    docPath: '/docs/spanish',
    summary:
      'Listening, reading comprehension, oral responses, directed situations, functional writing, and everyday Spanish grammar.',
  },
  {
    id: 'technical-drawing',
    name: 'Technical Drawing',
    docPath: '/docs/technical-drawing',
    summary:
      'Plane & solid geometry, orthographic & isometric projections, sectional views, and building or mechanical engineering drawing.',
  },
  {
    id: 'textiles-clothing-fashion',
    name: 'Textiles, Clothing & Fashion',
    docPath: '/docs/textiles-clothing-fashion',
    summary:
      'Fibres & fabric science, sewing equipment, pattern drafting & alteration, garment construction, and fashion design principles.',
  },
  {
    id: 'theatre-arts',
    name: 'Theatre Arts',
    docPath: '/docs/theatre-arts',
    summary:
      'Acting & improvisation, playmaking, stagecraft & lighting, folk & contemporary performance forms, and theatre critique.',
  },
  {
    id: 'university',
    name: 'University',
    docPath: '/docs/university',
    summary:
      'Higher-education study docs for college and university students — calculus, linear algebra, programming, academic writing, microeconomics, and core degree foundations.',
  },
  {
    id: 'visual-arts',
    name: 'Visual Arts',
    docPath: '/docs/visual-arts',
    summary:
      'Drawing, painting & mixed media, graphic & communication design, ceramics, textiles, sculpture, and art appreciation.',
  },
];
