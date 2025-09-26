
import type { Subject, Lesson, Quiz, User, LeaderboardEntry, Badge } from './types';
import { Calculator, FlaskConical, Atom, Dna, Bot, BookOpen, BrainCircuit, Rocket, Star, Target, Zap } from 'lucide-react';

export const badges: Badge[] = [
  { id: 'rookie', name: 'Rookie', icon: Star, color: 'text-yellow-400' },
  { id: 'scholar', name: 'Scholar', icon: BookOpen, color: 'text-blue-400' },
  { id: 'genius', name: 'Genius', icon: BrainCircuit, color: 'text-purple-400' },
  { id: 'explorer', name: 'Explorer', icon: Rocket, color: 'text-red-400' },
  { id: 'master', name: 'Master', icon: Target, color: 'text-green-400' },
  { id: 'legend', name: 'Legend', icon: Zap, color: 'text-indigo-400' },
];

let users: User[] = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    level: 5,
    xp: 450,
    xpToNextLevel: 500,
    badges: [badges[0]],
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    level: 8,
    xp: 720,
    xpToNextLevel: 800,
    badges: [badges[0], badges[1], badges[2]],
  },
    {
    id: 'user-3',
    name: 'Rohan Singh',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    level: 3,
    xp: 210,
    xpToNextLevel: 300,
    badges: [badges[0]],
  },
];

// In a real app, this would be a proper user management system.
// For this prototype, we'll use localStorage to persist user data.
const CURRENT_USER_ID = 'user-1';

export function getUser(): User {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
  }
  return users.find(u => u.id === CURRENT_USER_ID)!;
}

export function updateUser(updatedUser: User) {
  if (typeof window !== 'undefined') {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Explore the world of numbers, shapes, and patterns.',
    icon: Calculator,
    imageId: 'mathematics',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discover the wonders of the natural world.',
    icon: FlaskConical,
    imageId: 'science',
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental principles of the universe.',
    icon: Atom,
    imageId: 'physics',
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Learn about living organisms and their vital processes.',
    icon: Dna,
    imageId: 'biology',
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Dive into the basics of AI and machine learning.',
    icon: Bot,
    imageId: 'ai',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'algebra-basics',
    subjectId: 'mathematics',
    title: 'Algebra Basics',
    description: 'An introduction to variables and equations.',
    content: 'Algebra is a branch of mathematics that substitutes letters for numbers. An algebraic equation represents a scale, what is done on one side of the scale with a number is also done to the other side of the scale. The numbers are the constants. The letters are the variables. This lesson covers basic operations, variables, and simple equations.',
  },
  {
    id: 'geometry-intro',
    subjectId: 'mathematics',
    title: 'Introduction to Geometry',
    description: 'Learn about shapes, lines, and angles.',
    content: 'Geometry is the branch of mathematics concerned with properties of space such as the distance, shape, size, and relative position of figures. This lesson introduces fundamental concepts like points, lines, planes, angles, and basic shapes like triangles and circles.',
  },
  {
    id: 'photosynthesis',
    subjectId: 'science',
    title: 'Photosynthesis',
    description: 'How plants make their own food.',
    content: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (sugar) and oxygen. This lesson explains the chemical reaction, the role of chlorophyll, and why it is essential for life on Earth.',
  },
  {
    id: 'newtons-laws',
    subjectId: 'physics',
    title: 'Newton\'s Laws of Motion',
    description: 'The fundamental principles of motion.',
    content: 'Newton\'s laws of motion are three basic laws of classical mechanics that describe the relationship between the motion of an object and the forces acting on it. This lesson explores inertia (First Law), force and acceleration (Second Law), and action-reaction (Third Law).',
  },
  {
    id: 'cell-structure',
    subjectId: 'biology',
    title: 'Cell Structure',
    description: 'Understand the basic components of a cell.',
    content: 'A cell is the basic structural and functional unit of all known organisms. All cells have a cell membrane, cytoplasm, and genetic material. This lesson explores the different organelles within a cell, such as the nucleus, mitochondria, and ribosomes, and their functions.',
  },
  {
    id: 'genetics-basics',
    subjectId: 'biology',
    title: 'Genetics 101',
    description: 'An introduction to DNA, genes, and heredity.',
    content: 'Genetics is the study of genes, genetic variation, and heredity in living organisms. This lesson covers the structure of DNA, what genes are, and how traits are passed from parents to offspring through dominant and recessive alleles.',
  },
  {
    id: 'ml-intro',
    subjectId: 'ai',
    title: 'Introduction to Machine Learning',
    description: 'Learn what machine learning is and its common types.',
    content: 'Machine learning is a type of artificial intelligence (AI) that allows computer systems to learn from data, without being explicitly programmed. This lesson introduces the core concepts of machine learning and explores its main types: supervised, unsupervised, and reinforcement learning.',
  },
  {
    id: 'neural-networks',
    subjectId: 'ai',
    title: 'Neural Networks Explained',
    description: 'A simple overview of how neural networks work.',
    content: 'A neural network is a series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates. This lesson simplifies the concept of neurons, layers, and how a neural network "learns" through training.',
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'algebra-quiz',
    lessonId: 'algebra-basics',
    title: 'Algebra Basics Quiz',
    questions: [
      { id: 'q1', question: 'What is x if x + 5 = 12?', options: ['5', '7', '10', '12'], correctAnswer: '7', hint: 'Subtract 5 from both sides.' },
      { id: 'q2', question: 'What is 2y if y = 4?', options: ['2', '4', '6', '8'], correctAnswer: '8' },
      { id: 'q3', question: 'Which of these is a variable?', options: ['5', 'x', '+', '='], correctAnswer: 'x', hint: 'A variable is a letter representing an unknown value.' },
      { id: 'q4', question: 'Solve for z: 3z = 15', options: ['3', '5', '12', '45'], correctAnswer: '5' },
    ],
  },
  {
    id: 'geometry-quiz',
    lessonId: 'geometry-intro',
    title: 'Geometry Intro Quiz',
    questions: [
      { id: 'q1', question: 'How many degrees are in a right angle?', options: ['45', '90', '180', '360'], correctAnswer: '90' },
      { id: 'q2', question: 'What is the sum of angles in a triangle?', options: ['90', '180', '270', '360'], correctAnswer: '180', hint: 'Think about a square cut in half.' },
      { id: 'q3', question: 'A flat surface that extends infinitely in all directions is called a...?', options: ['Line', 'Point', 'Plane', 'Angle'], correctAnswer: 'Plane' },
      { id: 'q4', question: 'What is the name for a polygon with 5 sides?', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'], correctAnswer: 'Pentagon'},
    ],
  },
   {
    id: 'photosynthesis-quiz',
    lessonId: 'photosynthesis',
    title: 'Photosynthesis Quiz',
    questions: [
      { id: 'q1', question: 'What is the primary pigment used in photosynthesis?', options: ['Melanin', 'Hemoglobin', 'Chlorophyll', 'Carotene'], correctAnswer: 'Chlorophyll' },
      { id: 'q2', question: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide' },
      { id: 'q3', question: 'What is a byproduct of photosynthesis that is released into the air?', options: ['Water', 'Oxygen', 'Carbon', 'Sunlight'], correctAnswer: 'Oxygen', hint: 'It\'s what we breathe.' },
      { id: 'q4', question: 'Where does photosynthesis primarily occur in a plant cell?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'], correctAnswer: 'Chloroplast' },
    ],
  },
  {
    id: 'newtons-laws-quiz',
    lessonId: 'newtons-laws',
    title: 'Newton\'s Laws Quiz',
    questions: [
        { id: 'q1', question: 'Which law is also known as the law of inertia?', options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'], correctAnswer: 'First Law' },
        { id: 'q2', question: 'F = ma is the formula for which law?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravity'], correctAnswer: 'Second Law', hint: 'Force equals mass times acceleration.' },
        { id: 'q3', question: 'For every action, there is an equal and opposite reaction. This is Newton\'s...?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Universal Gravitation'], correctAnswer: 'Third Law' },
        { id: 'q4', question: 'An object at rest stays at rest unless acted upon by a...', options: ['Force', 'Mass', 'Inertia', 'Velocity'], correctAnswer: 'Force'},
    ],
  },
  {
    id: 'cell-structure-quiz',
    lessonId: 'cell-structure',
    title: 'Cell Structure Quiz',
    questions: [
        { id: 'q1', question: 'What is known as the "powerhouse" of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell Membrane'], correctAnswer: 'Mitochondrion', hint: 'It generates most of the cell\'s supply of adenosine triphosphate (ATP).' },
        { id: 'q2', question: 'Which organelle contains the cell\'s genetic material?', options: ['Cytoplasm', 'Nucleus', 'Vacuole', 'Lysosome'], correctAnswer: 'Nucleus' },
        { id: 'q3', question: 'What is the jelly-like substance that fills the cell?', options: ['Chlorophyll', 'Cytoplasm', 'DNA', 'Membrane'], correctAnswer: 'Cytoplasm' },
    ],
  },
  {
    id: 'genetics-basics-quiz',
    lessonId: 'genetics-basics',
    title: 'Genetics 101 Quiz',
    questions: [
      { id: 'q1', question: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Deoxyribonuclear Acid', 'Denatured Nucleic Acid', 'Dynamic Nucleic Acid'], correctAnswer: 'Deoxyribonucleic Acid' },
      { id: 'q2', question: 'A specific sequence of DNA that codes for a protein is called a...?', options: ['Allele', 'Chromosome', 'Gene', 'Nucleotide'], correctAnswer: 'Gene' },
      { id: 'q3', question: 'Which of these is a dominant allele?', options: ['a', 'b', 'C', 'd'], correctAnswer: 'C', hint: 'Dominant alleles are usually represented by capital letters.' },
    ],
  },
  {
    id: 'ml-intro-quiz',
    lessonId: 'ml-intro',
    title: 'Intro to Machine Learning Quiz',
    questions: [
        { id: 'q1', question: 'Which type of machine learning uses labeled data to train a model?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Deep Learning'], correctAnswer: 'Supervised Learning', hint: 'The "teacher" provides the correct answers.' },
        { id: 'q2', question: 'Clustering data points into groups is an example of...?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Classification'], correctAnswer: 'Unsupervised Learning' },
        { id: 'q3', question: 'What is the goal of reinforcement learning?', options: ['To label data', 'To find hidden patterns', 'To maximize a cumulative reward', 'To classify data'], correctAnswer: 'To maximize a cumulative reward' },
    ],
  },
  {
    id: 'neural-networks-quiz',
    lessonId: 'neural-networks',
    title: 'Neural Networks Quiz',
    questions: [
      { id: 'q1', question: 'What are the three main types of layers in a neural network?', options: ['Input, Hidden, Output', 'Start, Middle, End', 'Data, Processing, Result', 'First, Second, Third'], correctAnswer: 'Input, Hidden, Output' },
      { id: 'q2', question: 'The process of adjusting a neural network\'s parameters is called...?', options: ['Running', 'Training', 'Thinking', 'Computing'], correctAnswer: 'Training', hint: 'It\'s how the network learns.' },
      { id: 'q3', question: 'What is the name for the individual nodes within a neural network layer?', options: ['Points', 'Cells', 'Neurons', 'Units'], correctAnswer: 'Neurons' },
    ],
  },
];


export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[1], score: 9850 },
  { rank: 2, user: users[0], score: 8700 },
  { rank: 3, user: users[2], score: 7600 },
  { rank: 4, user: { id: 'user-4', name: 'Saanvi Gupta', avatarUrl: 'https://picsum.photos/seed/user4/100/100', level: 7, xp: 650, xpToNextLevel: 700, badges: [badges[0], badges[1]] }, score: 7550 },
  { rank: 5, user: { id: 'user-5', name: 'Arjun Reddy', avatarUrl: 'https://picsum.photos/seed/user5/100/100', level: 6, xp: 550, xpToNextLevel: 600, badges: [badges[0]] }, score: 6400 },
];
