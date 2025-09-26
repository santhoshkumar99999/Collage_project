

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

export let users: User[] = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    email: 'student@example.com',
    password: 'password',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    level: 5,
    xp: 450,
    xpToNextLevel: 500,
    badges: [badges[0]],
    completedLessons: ['algebra-basics'],
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    level: 8,
    xp: 720,
    xpToNextLevel: 800,
    badges: [badges[0], badges[1], badges[2]],
    completedLessons: ['algebra-basics', 'geometry-intro', 'photosynthesis'],
  },
    {
    id: 'user-3',
    name: 'Rohan Singh',
    email: 'rohan@example.com',
    password: 'password',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    level: 3,
    xp: 210,
    xpToNextLevel: 300,
    badges: [badges[0]],
    completedLessons: [],
  },
  { id: 'user-4', name: 'Saanvi Gupta', email: 'saanvi@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/user4/100/100', level: 7, xp: 650, xpToNextLevel: 700, badges: [badges[0], badges[1]], completedLessons: ['newtons-laws', 'cell-structure'] },
  { id: 'user-5', name: 'Arjun Reddy', email: 'arjun@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/user5/100/100', level: 6, xp: 550, xpToNextLevel: 600, badges: [badges[0]], completedLessons: ['ml-intro'] },
  { id: 'user-teacher', name: 'Teacher', email: 'teacher@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/teacher/100/100', level: 99, xp: 9999, xpToNextLevel: 10000, badges: badges, completedLessons: [] },
];

const CURRENT_USER_ID_KEY = 'currentUser_id';

function rehydrateUserBadges(user: User): User {
    return {
        ...user,
        badges: user.badges.map(badge => {
            if (typeof badge === 'string') return badges.find(b => b.id === badge) || badge;
            const fullBadge = badges.find(b => b.id === (badge as any).id);
            return fullBadge || badge;
        }).filter(Boolean) as Badge[],
        completedLessons: user.completedLessons || [],
    };
}

function getUsers(): User[] {
    if (typeof window === 'undefined') {
        return users.map(rehydrateUserBadges);
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            const parsedUsers: User[] = JSON.parse(storedUsers);
            // Ensure the returned users have full badge objects
            return parsedUsers.map(rehydrateUserBadges);
        } catch (e) {
            console.error("Failed to parse users from localStorage", e);
             // If parsing fails, fallback to initial data
            localStorage.setItem('users', JSON.stringify(users));
            return users.map(rehydrateUserBadges);
        }
    } else {
        localStorage.setItem('users', JSON.stringify(users));
        return users.map(rehydrateUserBadges);
    }
}


export function getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!currentUserId) return null;
    return getUsers().find(u => u.id === currentUserId) || null;
}

export function updateUser(updatedUser: User) {
  if (typeof window !== 'undefined') {
    const allUsers = getUsers();
    const index = allUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      allUsers[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(allUsers));
      // Dispatch a storage event to notify other components (like the leaderboard)
      window.dispatchEvent(new Event("storage"));
    }
  }
}

export function addUser({ name, email, password }: { name: string; email: string; password?: string }) {
    if (typeof window === 'undefined') {
        throw new Error('This function can only be called on the client-side.');
    }
      const allUsers = getUsers();
      
      // Check if user already exists, ensuring user object and email property exist
      if (allUsers.some(u => u && u.email && u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('A user with this email already exists.');
      }
      
      const userId = `user-${Date.now()}`;
      const newUser: User = {
        id: userId,
        name,
        email,
        password,
        avatarUrl: `https://picsum.photos/seed/${userId}/100/100`,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        badges: [],
        completedLessons: [],
      };
      
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event("storage"));
      
      return newUser;
}

export function loginUser({ email, password }: { email: string, password?: string }) {
    if (typeof window === 'undefined') {
        throw new Error('Login can only be performed on the client-side.');
    }
        const allUsers = getUsers();
        const userToLogin = allUsers.find(u => u && u.email && u.email.toLowerCase() === email.toLowerCase());

        if (!userToLogin) {
            throw new Error('No user found with this email.');
        }

        if (userToLogin.password !== password) {
            throw new Error('Incorrect password.');
        }
        
        localStorage.setItem(CURRENT_USER_ID_KEY, userToLogin.id);
        window.dispatchEvent(new Event("storage")); // Notify components of user change
        return userToLogin;
}

export function logoutUser() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CURRENT_USER_ID_KEY);
        window.dispatchEvent(new Event("storage"));
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
      { id: 'q1', question: 'What is x if x + 5 = 12?', options: ['5', '7', '10', '12'], correctAnswer: '7', hint: 'To find x, you need to isolate it. Subtract 5 from both sides of the equation.' },
      { id: 'q2', question: 'What is 2y if y = 4?', options: ['2', '4', '6', '8'], correctAnswer: '8', hint: 'Substitute the value of y (which is 4) into the expression 2y.' },
      { id: 'q3', question: 'Which of these is a variable?', options: ['5', 'x', '+', '='], correctAnswer: 'x', hint: 'A variable is a symbol, usually a letter, that represents an unknown number.' },
      { id: 'q4', question: 'Solve for z: 3z = 15', options: ['3', '5', '12', '45'], correctAnswer: '5', hint: 'To solve for z, you need to perform the opposite operation. Divide both sides by 3.' },
    ],
  },
  {
    id: 'geometry-quiz',
    lessonId: 'geometry-intro',
    title: 'Geometry Intro Quiz',
    questions: [
      { id: 'q1', question: 'How many degrees are in a right angle?', options: ['45', '90', '180', '360'], correctAnswer: '90', hint: 'A right angle looks like the corner of a square or a book.' },
      { id: 'q2', question: 'What is the sum of angles in a triangle?', options: ['90', '180', '270', '360'], correctAnswer: '180', hint: 'No matter the shape of the triangle, the sum of its three angles is always the same.' },
      { id: 'q3', question: 'A flat surface that extends infinitely in all directions is called a...?', options: ['Line', 'Point', 'Plane', 'Angle'], correctAnswer: 'Plane', hint: 'Think of it as a perfectly flat sheet of paper that goes on forever.' },
      { id: 'q4', question: 'What is the name for a polygon with 5 sides?', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'], correctAnswer: 'Pentagon', hint: 'A famous five-sided building in the United States shares this name.'},
    ],
  },
   {
    id: 'photosynthesis-quiz',
    lessonId: 'photosynthesis',
    title: 'Photosynthesis Quiz',
    questions: [
      { id: 'q1', question: 'What is the primary pigment used in photosynthesis?', options: ['Melanin', 'Hemoglobin', 'Chlorophyll', 'Carotene'], correctAnswer: 'Chlorophyll', hint: 'This pigment is what gives plants their green color.' },
      { id: 'q2', question: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide', hint: 'This is the gas that humans and animals breathe out.' },
      { id: 'q3', 'question': 'What is a byproduct of photosynthesis that is released into the air?', options: ['Water', 'Oxygen', 'Carbon', 'Sunlight'], correctAnswer: 'Oxygen', hint: 'This gas is essential for most animals, including humans, to breathe.' },
      { id: 'q4', question: 'Where does photosynthesis primarily occur in a plant cell?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'], correctAnswer: 'Chloroplast', hint: 'This organelle contains the green pigment from the first question.' },
    ],
  },
  {
    id: 'newtons-laws-quiz',
    lessonId: 'newtons-laws',
    title: 'Newton\'s Laws Quiz',
    questions: [
        { id: 'q1', question: 'Which law is also known as the law of inertia?', options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'], correctAnswer: 'First Law', hint: 'This law states that an object in motion will stay in motion unless a force acts upon it.' },
        { id: 'q2', question: 'F = ma is the formula for which law?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravity'], correctAnswer: 'Second Law', hint: 'The formula relates Force (F), mass (m), and acceleration (a).' },
        { id: 'q3', question: 'For every action, there is an equal and opposite reaction. This is Newton\'s...?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Universal Gravitation'], correctAnswer: 'Third Law', hint: 'Think about how a rocket launches into space by pushing gas downwards.' },
        { id: 'q4', question: 'An object at rest stays at rest unless acted upon by a...', options: ['Force', 'Mass', 'Inertia', 'Velocity'], correctAnswer: 'Force', hint: 'Something needs to push or pull the object to make it move.'},
    ],
  },
  {
    id: 'cell-structure-quiz',
    lessonId: 'cell-structure',
    title: 'Cell Structure Quiz',
    questions: [
        { id: 'q1', question: 'What is known as the "powerhouse" of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell Membrane'], correctAnswer: 'Mitochondrion', hint: 'This organelle generates the energy (ATP) that the cell needs to function.' },
        { id: 'q2', question: 'Which organelle contains the cell\'s genetic material?', options: ['Cytoplasm', 'Nucleus', 'Vacuole', 'Lysosome'], correctAnswer: 'Nucleus', hint: 'This is often called the "control center" or "brain" of the cell.' },
        { id: 'q3', question: 'What is the jelly-like substance that fills the cell?', options: ['Chlorophyll', 'Cytoplasm', 'DNA', 'Membrane'], correctAnswer: 'Cytoplasm', hint: 'All the other cell parts are suspended within this substance.' },
    ],
  },
  {
    id: 'genetics-basics-quiz',
    lessonId: 'genetics-basics',
    title: 'Genetics 101 Quiz',
    questions: [
      { id: 'q1', question: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Deoxyribonuclear Acid', 'Denatured Nucleic Acid', 'Dynamic Nucleic Acid'], correctAnswer: 'Deoxyribonucleic Acid', hint: 'The name describes its chemical components: a sugar (deoxyribose), a phosphate, and nucleic acids.' },
      { id: 'q2', question: 'A specific sequence of DNA that codes for a protein is called a...?', options: ['Allele', 'Chromosome', 'Gene', 'Nucleotide'], correctAnswer: 'Gene', hint: 'These are the fundamental units of heredity, passed from parent to child.' },
      { id: 'q3', question: 'Which of these is a dominant allele?', options: ['a', 'b', 'C', 'd'], correctAnswer: 'C', hint: 'In genetics, dominant traits are typically represented by uppercase letters.' },
    ],
  },
  {
    id: 'ml-intro-quiz',
    lessonId: 'ml-intro',
    title: 'Intro to Machine Learning Quiz',
    questions: [
        { id: 'q1', question: 'Which type of machine learning uses labeled data to train a model?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Deep Learning'], correctAnswer: 'Supervised Learning', hint: 'Think of a "supervisor" or "teacher" providing the correct answers for the model to learn from.' },
        { id: 'q2', question: 'Clustering data points into groups is an example of...?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Classification'], correctAnswer: 'Unsupervised Learning', hint: 'In this type of learning, the model has to find patterns on its own without any pre-labeled examples.' },
        { id: 'q3', question: 'What is the goal of reinforcement learning?', options: ['To label data', 'To find hidden patterns', 'To maximize a cumulative reward', 'To classify data'], correctAnswer: 'To maximize a cumulative reward', hint: 'This type of learning is about trial and error, like teaching a dog a new trick with treats.' },
    ],
  },
  {
    id: 'neural-networks-quiz',
    lessonId: 'neural-networks',
    title: 'Neural Networks Quiz',
    questions: [
      { id: 'q1', question: 'What are the three main types of layers in a neural network?', options: ['Input, Hidden, Output', 'Start, Middle, End', 'Data, Processing, Result', 'First, Second, Third'], correctAnswer: 'Input, Hidden, Output', hint: 'Data flows in one side, is processed in the middle, and the result comes out the other side.' },
      { id: 'q2', question: 'The process of adjusting a neural network\'s parameters is called...?', options: ['Running', 'Training', 'Thinking', 'Computing'], correctAnswer: 'Training', hint: 'This is how the network "learns" from data to make better predictions.' },
      { id: 'q3', question: 'What is the name for the individual nodes within a neural network layer?', options: ['Points', 'Cells', 'Neurons', 'Units'], correctAnswer: 'Neurons', hint: 'These are named after the cells in the human brain that they are designed to mimic.' },
    ],
  },
];


function getLeaderboard(): LeaderboardEntry[] {
    const allUsers = getUsers();
    const sortedUsers = [...allUsers].sort((a, b) => b.xp - a.xp);
    return sortedUsers.map((user, index) => ({
        rank: index + 1,
        user: user,
        xp: user.xp,
    }));
}

export const initialLeaderboard: LeaderboardEntry[] = getLeaderboard();

    

    
