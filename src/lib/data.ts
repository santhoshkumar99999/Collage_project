
import type { Subject, Lesson, Quiz, User, LeaderboardEntry, Badge } from './types';
import { Calculator, FlaskConical, Atom, Dna, Bot, BookOpen, Star, BrainCircuit, Rocket, Target, Zap } from 'lucide-react';

const iconMap = {
    Calculator,
    FlaskConical,
    Atom,
    Dna,
    Bot,
    BookOpen,
    Star,
    BrainCircuit,
    Rocket,
    Target,
    Zap,
};

let subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Explore the world of numbers, shapes, and patterns.',
    icon: 'Calculator',
    imageId: 'mathematics',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discover the wonders of the natural world.',
    icon: 'FlaskConical',
    imageId: 'science',
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental principles of the universe.',
    icon: 'Atom',
    imageId: 'physics',
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Learn about living organisms and their vital processes.',
    icon: 'Dna',
    imageId: 'biology',
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Dive into the basics of AI and machine learning.',
    icon: 'Bot',
    imageId: 'ai',
  },
];

const lessons: Lesson[] = [
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

const quizzes: Quiz[] = [
  {
    id: 'algebra-quiz',
    lessonId: 'algebra-basics',
    title: 'Algebra in Daily Life',
    questions: [
      { id: 'q1', question: 'You buy 3 pens that cost \'p\' rupees each. The total cost is 30 rupees. What is the cost of one pen?', options: ['5 rupees', '10 rupees', '15 rupees', '20 rupees'], correctAnswer: '10 rupees', hint: 'Set up the equation: 3p = 30. To find p, divide both sides by 3.' },
      { id: 'q2', question: 'A mobile plan costs 100 rupees per month plus 2 rupees per minute of calls (m). If your bill is 150 rupees, how many minutes did you use?', options: ['20 minutes', '25 minutes', '50 minutes', '75 minutes'], correctAnswer: '25 minutes', hint: 'The equation is 100 + 2m = 150. Isolate the variable \'m\' to find the answer.' },
      { id: 'q3', question: 'Your age is \'a\'. Your father is 3 times your age. The sum of your ages is 48. How old are you?', options: ['10', '12', '14', '16'], correctAnswer: '12', hint: 'The equation is a + 3a = 48. Combine the \'a\' terms first.' },
      { id: 'q4', question: 'A recipe for 4 people requires 2 cups of flour. You need to cook for 10 people. If one cup of flour costs 5 rupees, what is the total cost of flour?', options: ['20 rupees', '25 rupees', '30 rupees', '50 rupees'], correctAnswer: '25 rupees', hint: 'First, find how many cups are needed for 10 people (5 cups). Then multiply the number of cups by the cost per cup.' },
      { id: 'q5', question: 'You are saving for a bicycle that costs 2000 rupees. You have 500 rupees. You get 50 rupees pocket money per week. How many weeks will it take to save enough?', options: ['20 weeks', '25 weeks', '30 weeks', '35 weeks'], correctAnswer: '30 weeks', hint: 'You need to save 2000 - 500 = 1500 rupees. Divide the amount needed by your weekly savings.' },
      { id: 'q6', question: 'The temperature in Celsius is C. To convert to Fahrenheit (F), the formula is F = (9/5)C + 32. If it is 25°C, what is the temperature in Fahrenheit?', options: ['68°F', '77°F', '82°F', '95°F'], correctAnswer: '77°F', hint: 'Substitute C with 25 in the formula and solve for F.' },
      { id: 'q7', question: 'A train travels at a speed of 60 km/h. How long will it take to cover a distance of 180 km?', options: ['2 hours', '2.5 hours', '3 hours', '4 hours'], correctAnswer: '3 hours', hint: 'Time = Distance / Speed. Divide 180 by 60.' },
      { id: 'q8', question: 'You get a 20% discount on a shirt that originally costs 500 rupees. How much do you pay?', options: ['400 rupees', '420 rupees', '450 rupees', '480 rupees'], correctAnswer: '400 rupees', hint: 'The discount is 20% of 500, which is 100 rupees. Subtract this from the original price.' },
      { id: 'q9', question: 'A rectangular field is (x+5) meters long and 10 meters wide. Its perimeter is 50 meters. What is the value of x?', options: ['5', '10', '15', '20'], correctAnswer: '10', hint: 'The perimeter is 2 * (length + width). So, 2 * ((x+5) + 10) = 50. Solve for x.' },
      { id: 'q10', question: 'You have two numbers. The second number is 5 more than the first number (x). Their sum is 21. What are the two numbers?', options: ['7 and 12', '8 and 13', '9 and 14', '10 and 15'], correctAnswer: '8 and 13', hint: 'The equation is x + (x + 5) = 21. Solve for x to find the first number, then add 5 to get the second.' },
    ],
  },
  {
    id: 'geometry-quiz',
    lessonId: 'geometry-intro',
    title: 'Geometry in the Real World',
    questions: [
      { id: 'q1', question: 'You want to put a fence around your rectangular garden. It is 10 meters long and 5 meters wide. How much fencing do you need?', options: ['15 meters', '25 meters', '30 meters', '50 meters'], correctAnswer: '30 meters', hint: 'Perimeter of a rectangle is 2 * (length + width).' },
      { id: 'q2', question: 'You need to buy tiles for a square room. One side of the room is 4 meters. What is the total area you need to cover with tiles?', options: ['8 sq meters', '12 sq meters', '16 sq meters', '20 sq meters'], correctAnswer: '16 sq meters', hint: 'Area of a square is side * side.' },
      { id: 'q3', question: 'A circular pizza is cut into 8 equal slices. What is the angle of each slice at the center?', options: ['30 degrees', '45 degrees', '60 degrees', '90 degrees'], correctAnswer: '45 degrees', hint: 'A full circle has 360 degrees. Divide that by the number of slices.' },
      { id: 'q4', question: 'A ladder leaning against a wall forms a right-angled triangle. The base is 3 meters from the wall, and it reaches 4 meters up the wall. What is the length of the ladder?', options: ['4 meters', '5 meters', '6 meters', '7 meters'], correctAnswer: '5 meters', hint: 'Use the Pythagorean theorem: a² + b² = c², where c is the ladder\'s length.' },
      { id: 'q5', question: 'You want to paint a cylindrical water tank. Its radius is 1 meter and height is 2 meters. What is the surface area you need to paint (top, bottom, and side)? (Use π ≈ 3.14)', options: ['12.56 m²', '15.70 m²', '18.84 m²', '6.28 m²'], correctAnswer: '18.84 m²', hint: 'Area = 2 * (πr²) (for top/bottom) + 2πrh (for the side). Calculate both parts and add them together.' },
      { id: 'q6', question: 'A car wheel has a diameter of 70 cm. How far does the car travel in one full rotation of the wheel? (Use π ≈ 22/7)', options: ['110 cm', '140 cm', '220 cm', '4900 cm'], correctAnswer: '220 cm', hint: 'The distance is the circumference of the wheel. Circumference = π * diameter.' },
      { id: 'q7', question: 'A map has a scale of 1 cm = 5 km. The distance between two cities on the map is 6 cm. What is the actual distance?', options: ['6 km', '11 km', '25 km', '30 km'], correctAnswer: '30 km', hint: 'Multiply the map distance by the scale factor: 6 cm * 5 km/cm.' },
      { id: 'q8', question: 'How much water can a rectangular fish tank hold if it is 50 cm long, 30 cm wide, and 40 cm high?', options: ['6,000 cm³ (6 L)', '60,000 cm³ (60 L)', '120 cm³', '1200 cm³ (1.2 L)'], correctAnswer: '60,000 cm³ (60 L)', hint: 'Volume of a rectangular prism is length * width * height. 1000 cm³ = 1 Liter.' },
      { id: 'q9', question: 'You are standing 20 meters away from a tall tree. The angle of elevation from your eyes to the top of the tree is 45 degrees. How tall is the tree (above your eye level)?', options: ['10 meters', '20 meters', '30 meters', '40 meters'], correctAnswer: '20 meters', hint: 'In a right triangle with a 45-degree angle, the opposite side (height) is equal to the adjacent side (distance).' },
      { id: 'q10', question: 'A conical tent has a base radius of 3 meters and a height of 4 meters. What is the volume of air inside the tent? (Use π ≈ 3.14)', options: ['12.56 m³', '28.26 m³', '37.68 m³', '113.04 m³'], correctAnswer: '37.68 m³', hint: 'The volume of a cone is (1/3) * π * r² * h.' },
    ],
  },
   {
    id: 'photosynthesis-quiz',
    lessonId: 'photosynthesis',
    title: 'Photosynthesis and Our World',
    questions: [
      { id: 'q1', question: 'Why is it a good idea to have plants in your house to improve air quality?', options: ['They consume oxygen', 'They release Carbon Dioxide', 'They consume Carbon Dioxide and release Oxygen', 'They look nice'], correctAnswer: 'They consume Carbon Dioxide and release Oxygen', hint: 'Think about what humans breathe in and what plants release as a waste product.' },
      { id: 'q2', question: 'A farmer wants to grow crops faster. Which of these would be most important to provide for photosynthesis?', options: ['More soil', 'Plenty of light', 'Strong wind', 'More nitrogen'], correctAnswer: 'Plenty of light', hint: 'The process is called PHOTO-synthesis. What does "photo" mean?' },
      { id: 'q3', question: 'Fruits and vegetables are a source of energy for us. Where did this energy originally come from?', options: ['The soil', 'The rain', 'The sun', 'The air'], correctAnswer: 'The sun', hint: 'Plants store energy from the sun as sugars through photosynthesis, which we then eat.' },
      { id: 'q4', question: 'If a large forest is cut down, what is a likely effect on the global climate?', options: ['Oxygen levels will increase globally', 'Global Carbon Dioxide levels will increase', 'It will get colder everywhere', 'It has no effect on climate'], correctAnswer: 'Global Carbon Dioxide levels will increase', hint: 'Fewer trees mean less CO2 is being removed from the atmosphere, which contributes to the greenhouse effect.' },
      { id: 'q5', question: 'A greenhouse owner wants to grow tomatoes in winter. How could they use knowledge of photosynthesis to increase their crop yield?', options: ['By cooling the greenhouse', 'By adding extra CO2 and using artificial lights', 'By watering the plants less', 'By playing music to the plants'], correctAnswer: 'By adding extra CO2 and using artificial lights', hint: 'Photosynthesis needs light and CO2 as inputs. By providing more of these, the plants can produce more energy and grow faster.' },
      { id: 'q6', question: 'Why do leaves on many trees change color in autumn?', options: ['The tree is dying', 'The tree produces new color pigments', 'The chlorophyll breaks down, revealing other pigments', 'It is a reaction to the cold'], correctAnswer: 'The chlorophyll breaks down, revealing other pigments', hint: 'The green chlorophyll masks other colors. When it disappears, the yellow and orange colors can be seen.' },
      { id: 'q7', question: 'Some sea slugs can eat algae and then use the algae\'s chloroplasts to photosynthesize for themselves. This makes them...', options: ['A new species of plant', 'Part plant, part animal', 'A very efficient herbivore', 'Solar-powered animals'], correctAnswer: 'Solar-powered animals', hint: 'This is a real phenomenon called kleptoplasty, where an animal steals the photosynthetic machinery from another organism.' },
      { id: 'q8', question: 'Which product of photosynthesis is the primary source of energy for almost all life on Earth?', options: ['Oxygen', 'Water', 'Glucose (sugar)', 'Chlorophyll'], correctAnswer: 'Glucose (sugar)', hint: 'This is the energy-rich molecule that plants create and that animals eat (either by eating plants or eating other animals).' },
      { id: 'q9', question: 'If you put a plastic bag over a plant leaf on a sunny day, you will see water droplets inside. Why?', options: ['The bag is leaking', 'It is morning dew', 'The plant releases water vapor during transpiration', 'The plant is crying'], correctAnswer: 'The plant releases water vapor during transpiration', hint: 'Transpiration is the process of water movement through a plant and its evaporation from leaves, which is related to photosynthesis.' },
      { id: 'q10', question: 'In an experiment, a plant is placed in a sealed jar with a CO2 sensor. Over a few hours in sunlight, what will happen to the CO2 level?', options: ['It will increase', 'It will stay the same', 'It will decrease', 'It will fluctuate randomly'], correctAnswer: 'It will decrease', hint: 'Plants use carbon dioxide from the air as a key ingredient for photosynthesis. In a sealed container, the plant will use up the available CO2.' },
    ],
  },
  {
    id: 'newtons-laws-quiz',
    lessonId: 'newtons-laws',
    title: 'Physics in Action',
    questions: [
        { id: 'q1', question: 'Why do you feel pushed back in your seat when a bus suddenly moves forward?', options: ['Because of speed', 'Because of Newton\'s Third Law', 'Because of inertia (First Law)', 'Because of friction'], correctAnswer: 'Because of inertia (First Law)', hint: 'Your body wants to stay at rest, but the bus is moving your seat forward.' },
        { id: 'q2', question: 'It is harder to push a heavy box than a light one to get it moving. This is an example of which law?', options: ['First Law', 'Second Law (F=ma)', 'Third Law', 'Law of Gravity'], correctAnswer: 'Second Law (F=ma)', hint: 'The heavy box has more mass, so it requires more force to achieve the same acceleration.' },
        { id: 'q3', question: 'When you swim, you push water backward with your hands. What pushes you forward?', options: ['Your muscles', 'The water pushing you forward', 'The air pressure', 'Your momentum'], correctAnswer: 'The water pushing you forward', hint: 'This is a perfect example of Newton\'s Third Law: for every action, there is an equal and opposite reaction.' },
        { id: 'q4', question: 'A cricketer catches a fast-moving ball. Why do they pull their hands back while catching it?', options: ['To get a better grip', 'To increase the time of impact, reducing the force', 'To throw it back faster', 'It is just a habit'], correctAnswer: 'To increase the time of impact, reducing the force', hint: 'Based on F=ma (or impulse), increasing the time over which the ball\'s momentum changes reduces the force on the hands.' },
        { id: 'q5', question: 'A rocket moves forward in space by pushing gas out behind it. This works even in a vacuum with no air to push against. Why?', options: ['Because of the First Law', 'Because of the Second Law', 'Because of the Third Law', 'It does not work in a vacuum'], correctAnswer: 'Because of the Third Law', hint: 'The rocket pushes the gas (action), and the gas pushes the rocket (reaction). It doesn\'t need to push against anything else.'},
        { id: 'q6', question: 'If you drop a feather and a hammer on the moon (where there is no air resistance), which will hit the ground first?', options: ['The hammer', 'The feather', 'They will hit at the same time', 'Neither will fall'], correctAnswer: 'They will hit at the same time', hint: 'Without air resistance, all objects fall at the same rate of acceleration, regardless of their mass.' },
        { id: 'q7', question: 'When a car suddenly stops, why do the passengers lurch forward?', options: ['The car pushes them', 'The seatbelt pulls them', 'Their inertia keeps them moving forward', 'Gravity pulls them forward'], correctAnswer: 'Their inertia keeps them moving forward', hint: 'This is Newton\'s First Law. Your body wants to continue moving at the same speed and direction.' },
        { id: 'q8', question: 'To win a tug-of-war, your team must...', options: ['Pull harder on the rope than the other team', 'Push harder on the ground than the other team pushes on the ground', 'Have more people', 'Be heavier'], correctAnswer: 'Push harder on the ground than the other team pushes on the ground', hint: 'The force on the rope is an internal force. The winning team exerts a greater external force on the ground (via friction).' },
        { id: 'q9', question: 'A magician pulls a tablecloth out from under a set of dishes without disturbing them. This works because of...', options: ['Magic', 'The dishes have a lot of inertia', 'The tablecloth is very slippery', 'The dishes are glued down'], correctAnswer: 'The dishes have a lot of inertia', hint: 'The dishes\' tendency to stay at rest (inertia) is greater than the small force applied by the fast-moving tablecloth.' },
        { id: 'q10', question: 'A 1,000 kg car accelerates at 2 m/s². What is the net force acting on the car?', options: ['500 N', '1,000 N', '2,000 N', '4,000 N'], correctAnswer: '2,000 N', hint: 'Use Newton\'s Second Law, F = m * a. Force is measured in Newtons (N).' },
    ],
  },
  {
    id: 'cell-structure-quiz',
    lessonId: 'cell-structure',
    title: 'The Cell and Your Body',
    questions: [
        { id: 'q1', question: 'Which part of your cells works to convert the sugar from food into usable energy (ATP)?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell Membrane'], correctAnswer: 'Mitochondria', hint: 'This organelle is known as the "powerhouse" of the cell for a reason.' },
        { id: 'q2', question: 'Which tiny "factories" in your cells are responsible for building proteins to repair muscles?', options: ['Lysosomes', 'Vacuoles', 'Ribosomes', 'Golgi apparatus'], correctAnswer: 'Ribosomes', hint: 'These organelles follow instructions from the DNA to assemble proteins.' },
        { id: 'q3', question: 'How does a muscle cell get the instructions to contract?', options: ['From the mitochondria', 'From the cell membrane', 'From the nucleus', 'From the cytoplasm'], correctAnswer: 'From the nucleus', hint: 'The nucleus acts as the "control center," holding all the instructions (DNA).' },
        { id: 'q4', question: 'Why does a cut on your skin heal? It\'s because skin cells undergo a process called...', options: ['Cell division (mitosis)', 'Cellular respiration', 'Meiosis', 'Osmosis'], correctAnswer: 'Cell division (mitosis)', hint: 'Your body makes new cells to replace the damaged ones. This is a fundamental process for growth and repair.' },
        { id: 'q5', question: 'When you get sick from a virus, the virus must get inside your cells to replicate. Which part of the cell does it have to cross first?', options: ['Nucleus', 'Mitochondria', 'Cell Wall', 'Cell Membrane'], correctAnswer: 'Cell Membrane', hint: 'This is the outer boundary of an animal cell that controls what goes in and out.' },
        { id: 'q6', question: 'If you feel tired, it might mean the "powerhouses" of your cells are not producing enough energy. Which organelle is this?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctAnswer: 'Mitochondria', hint: 'This organelle is responsible for cellular respiration and energy production (ATP).' },
        { id: 'q7', question: 'Your body\'s immune system uses special cells to "eat" and digest invading bacteria. Which organelle, filled with enzymes, helps with this digestion?', options: ['Golgi Apparatus', 'Lysosome', 'Endoplasmic Reticulum', 'Nucleolus'], correctAnswer: 'Lysosome', hint: 'Lysosomes are like the recycling and waste disposal centers of the cell.' },
        { id: 'q8', question: 'What is the main difference between a plant cell and an animal cell that allows plants to stand up straight?', options: ['A larger nucleus', 'More mitochondria', 'A rigid cell wall', 'A thicker cell membrane'], correctAnswer: 'A rigid cell wall', hint: 'The cell wall provides structural support that animal cells lack.' },
        { id: 'q9', question: 'When you get a vaccine, it teaches your immune cells to recognize a pathogen. Which part of the cell holds the "memory" of this training?', options: ['The mitochondria', 'The cell membrane receptors', 'The DNA in the nucleus', 'The ribosomes'], correctAnswer: 'The DNA in the nucleus', hint: 'Specialized immune cells retain a memory of the pathogen, which is encoded in their genetic material and protein expression.' },
        { id: 'q10', question: 'Drinking salt water is dangerous for humans because it causes water to leave our cells. This process is called...', options: ['Active Transport', 'Mitosis', 'Photosynthesis', 'Osmosis'], correctAnswer: 'Osmosis', hint: 'Osmosis is the movement of water across a membrane from a less concentrated solution to a more concentrated one to balance things out.' },
    ],
  },
  {
    id: 'genetics-basics-quiz',
    lessonId: 'genetics-basics',
    title: 'Genetics and You',
    questions: [
      { id: 'q1', question: 'Why do children often resemble their parents?', options: ['They eat the same food', 'They live in the same house', 'They inherit genes from both parents', 'It is a coincidence'], correctAnswer: 'They inherit genes from both parents', hint: 'Genes are the basic units of heredity, carrying traits from one generation to the next.' },
      { id: 'q2', question: 'DNA testing can be used to identify people in forensics. This is possible because...', options: ['Everyone has the same DNA', 'Each person (except identical twins) has a unique DNA sequence', 'DNA changes every day', 'DNA is only in our blood'], correctAnswer: 'Each person (except identical twins) has a unique DNA sequence', hint: 'While most of our DNA is the same, small variations make each of us genetically unique.' },
      { id: 'q3', question: 'Some farmers breed cows that produce more milk. This is an example of using genetics for...', options: ['Natural selection', 'Artificial selection (selective breeding)', 'Random mutation', 'Cloning'], correctAnswer: 'Artificial selection (selective breeding)', hint: 'Humans are choosing which animals reproduce based on desirable traits, which is a core concept in agriculture.' },
      { id: 'q4', question: 'If a father is colorblind (an X-linked recessive trait) and a mother is a not a carrier, what is the probability their son will be colorblind?', options: ['100%', '50%', '25%', '0%'], correctAnswer: '0%', hint: 'Sons inherit their only X chromosome from their mother. If the mother is not a carrier, she cannot pass the trait to her son.' },
      { id: 'q5', question: 'A certain genetic condition is autosomal dominant. If a person who is heterozygous (has one copy of the gene) has a child with a person who is unaffected, what are the chances the child will have the condition?', options: ['100%', '75%', '50%', '25%'], correctAnswer: '50%', hint: 'The affected parent has a 50% chance of passing on the dominant gene for the condition.' },
      { id: 'q6', question: 'Two parents have brown eyes (a dominant trait, B), but carry the gene for blue eyes (a recessive trait, b). What is the chance they will have a blue-eyed child?', options: ['0%', '25%', '50%', '75%'], correctAnswer: '25%', hint: 'Both parents are Bb. A Punnett square shows the combinations: BB, Bb, Bb, and bb. Only bb results in blue eyes.' },
      { id: 'q7', question: 'Why are identical twins useful for studying "nature vs. nurture" (genetics vs. environment)?', options: ['They have different genes', 'They have the same genes', 'They always grow up in different places', 'They are easy to find'], correctAnswer: 'They have the same genes', hint: 'Since their DNA is identical, any differences between them can be attributed to environmental factors.' },
      { id: 'q8', question: 'A "mutation" in a gene sounds scary, but it can be...', options: ['Always harmful', 'Always beneficial', 'Always neutral', 'Harmful, beneficial, or neutral'], correctAnswer: 'Harmful, beneficial, or neutral', hint: 'Mutations are just changes in DNA. Some cause problems, some have no effect, and some can even be advantageous.' },
      { id: 'q9', question: 'Before a cell divides, it must make a complete copy of its DNA. This process is called...', options: ['Replication', 'Transcription', 'Translation', 'Mutation'], correctAnswer: 'Replication', hint: 'This ensures that each new cell gets a full set of genetic instructions.' },
      { id: 'q10', question: 'CRISPR is a new technology that allows scientists to...', options: ['Read DNA sequences', 'Edit genes in DNA', 'Clone organisms', 'Create new species'], correctAnswer: 'Edit genes in DNA', hint: 'CRISPR is often described as "genetic scissors," allowing for precise changes to the DNA sequence.' },
    ],
  },
  {
    id: 'ml-intro-quiz',
    lessonId: 'ml-intro',
    title: 'AI in Your Daily Life',
    questions: [
        { id: 'q1', question: 'When a streaming service recommends a movie you might like, what is this an example of?', options: ['Computer programming', 'Machine Learning', 'A random guess', 'Internet searching'], correctAnswer: 'Machine Learning', hint: 'The service learns from your viewing history and the history of others to predict what you\'ll enjoy.' },
        { id: 'q2', question: 'Your email automatically puts spam messages in a separate folder. How does it know what is spam?', options: ['Someone reads all your emails', 'It uses a list of bad words', 'It has learned to identify patterns in spam emails', 'All emails from unknown senders are spam'], correctAnswer: 'It has learned to identify patterns in spam emails', hint: 'This is a classic example of classification, a type of supervised machine learning.' },
        { id: 'q3', question: 'When you use a voice assistant (like on a phone) and it understands your commands, what technology is it using?', options: ['A very large dictionary', 'Sound wave analysis', 'Natural Language Processing (a type of AI)', 'Pre-recorded answers'], correctAnswer: 'Natural Language Processing (a type of AI)', hint: 'This field of AI focuses on enabling computers to understand and interpret human language.' },
        { id: 'q4', question: 'A bank uses an AI system to detect fraudulent transactions. It learns from thousands of past transactions, both real and fake. This type of learning is called...?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Generative AI'], correctAnswer: 'Supervised Learning', hint: 'The system is "supervised" because it learns from data that has already been labeled as "fraudulent" or "not fraudulent".' },
        { id: 'q5', question: 'A company wants to group its customers into different marketing segments based on their purchasing habits, without any predefined groups. What type of machine learning should they use?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Classification'], correctAnswer: 'Unsupervised Learning', hint: 'Since there are no predefined labels for the groups, the AI must find the patterns on its own, which is "unsupervised".' },
        { id: 'q6', question: 'An AI for a chess game learns by playing millions of games against itself and gets a "reward" for winning. This is an example of...', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Clustering'], correctAnswer: 'Reinforcement Learning', hint: 'The AI learns through trial and error, guided by rewards and penalties for its actions.' },
        { id: 'q7', question: 'You take a photo of a flower, and an app tells you its species. This is a task called...', options: ['Clustering', 'Regression', 'Image Classification', 'Data Generation'], correctAnswer: 'Image Classification', hint: 'The AI is classifying the image into one of many predefined categories (flower species).' },
        { id: 'q8', question: 'To train a spam filter, you provide it with 1000 emails labeled "spam" and 1000 emails labeled "not spam". This labeled data is called a...', options: ['Test set', 'Algorithm', 'Training set', 'Model'], correctAnswer: 'Training set', hint: 'The model learns from this initial set of labeled data.' },
        { id: 'q9', question: 'A weather app predicts the temperature for tomorrow. This is an example of what kind of problem?', options: ['Classification (spam/not spam)', 'Regression (predicting a continuous value)', 'Clustering (grouping items)', 'Reinforcement Learning (winning a game)'], correctAnswer: 'Regression (predicting a continuous value)', hint: 'Regression is used to predict a numerical value, like temperature, price, or height.' },
        { id: 'q10', question: 'If you want an AI to write a story, you would use what kind of model?', options: ['A classification model', 'A clustering model', 'A regression model', 'A generative model'], correctAnswer: 'A generative model', hint: 'These models are designed to generate new content, like text, images, or music.' },
    ],
  },
  {
    id: 'neural-networks-quiz',
    lessonId: 'neural-networks',
    title: 'Neural Networks in Technology',
    questions: [
      { id: 'q1', question: 'When you unlock your phone using your face, what kind of AI technology is likely at work?', options: ['A simple camera filter', 'A password checker', 'A neural network trained for facial recognition', 'A GPS tracker'], correctAnswer: 'A neural network trained for facial recognition', hint: 'Facial recognition involves identifying complex patterns in images, which is a task well-suited for neural networks.' },
      { id: 'q2', question: 'Online translation tools can translate sentences, not just words. This complex task is often handled by...', options: ['A giant dictionary', 'Human translators in real-time', 'Advanced neural networks (like Transformers)', 'A list of grammar rules'], correctAnswer: 'Advanced neural networks (like Transformers)', hint: 'Modern translation services use neural networks to understand the context and grammar of a sentence.' },
      { id: 'q3', question: 'Digital assistants can generate human-like text to answer your questions. This is a form of...?', options: ['Predictive Text', 'Generative AI powered by neural networks', 'Copying from a website', 'A search engine'], correctAnswer: 'Generative AI powered by neural networks', hint: 'Creating new, original content (like a sentence) is a "generative" task that uses large neural networks.' },
      { id: 'q4', question: 'What does "training" a neural network for image recognition involve?', options: ['Showing it one perfect image', 'Giving it a set of rules for what a "cat" is', 'Showing it thousands of labeled images', 'Programming it with C++'], correctAnswer: 'Showing it thousands of labeled images', hint: 'Neural networks learn by example. They need a lot of data to understand the patterns of what they are trying to identify.' },
      { id: 'q5', question: 'If a neural network incorrectly identifies a dog as a cat, what is the next step in its training process?', options: ['Delete the network and start over', 'Show it a picture of a bird', 'Adjust its internal parameters to correct the mistake', 'Give up on that image'], correctAnswer: 'Adjust its internal parameters to correct the mistake', hint: 'The training process involves making small corrections based on errors, so the network gradually gets more accurate over time.' },
      { id: 'q6', question: 'The "neurons" in a neural network are organized in...', options: ['Circles', 'A straight line', 'Layers', 'A random pattern'], correctAnswer: 'Layers', hint: 'Data passes through an input layer, one or more hidden layers, and an output layer.' },
      { id: 'q7', question: 'A "deep" neural network is one that has...', options: ['Many neurons', 'Many hidden layers', 'A lot of data', 'A very smart programmer'], correctAnswer: 'Many hidden layers', hint: '"Deep learning" refers to neural networks with a deep stack of layers.' },
      { id: 'q8', question: 'Which of these real-world problems is LEAST suited for a neural network?', options: ['Identifying cancerous cells in medical scans', 'Predicting stock market prices', 'Calculating 2 + 2', 'Recognizing spoken words'], correctAnswer: 'Calculating 2 + 2', hint: 'Neural networks excel at pattern recognition in complex data, not simple, deterministic arithmetic.' },
      { id: 'q9', question: 'The process of a neural network learning from data is analogous to...', options: ['A human memorizing a book', 'A human learning a new skill through practice', 'A computer running a program', 'A calculator solving a math problem'], correctAnswer: 'A human learning a new skill through practice', hint: 'Both involve repetition, making mistakes, and adjusting to improve performance over time.' },
      { id: 'q10', question: 'Why do we need powerful computers (GPUs) to train large neural networks?', options: ['They are better at storing text', 'They can perform many simple calculations at the same time', 'They have better internet connections', 'They are more reliable than normal computers'], correctAnswer: 'They can perform many simple calculations at the same time', hint: 'Training a neural network involves millions of parallel mathematical operations, which GPUs are specifically designed to handle efficiently.' },
    ],
  },
];

const badges: Badge[] = [
  { id: 'rookie', name: 'Rookie', icon: 'Star', color: 'text-yellow-400' },
  { id: 'scholar', name: 'Scholar', icon: 'BookOpen', color: 'text-blue-400' },
  { id: 'genius', name: 'Genius', icon: 'BrainCircuit', color: 'text-purple-400' },
  { id: 'explorer', name: 'Explorer', icon: 'Rocket', color: 'text-red-400' },
  { id: 'master', name: 'Master', icon: 'Target', color: 'text-green-400' },
  { id: 'legend', name: 'Legend', icon: 'Zap', color: 'text-indigo-400' },
];

const AUTH_COOKIE_NAME = 'currentUser_id';

const initialUsers: User[] = [
    {
        id: 'user-1',
        name: 'Aarav Sharma',
        email: 'student@example.com',
        password: 'password',
        avatarUrl: 'https://picsum.photos/seed/user1/100/100',
        level: 5,
        xp: 450,
        xpToNextLevel: 500,
        badgeIds: ['rookie'],
        completedLessons: ['algebra-basics'],
        completedTournaments: ['mathematics'],
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
        badgeIds: ['rookie', 'scholar', 'genius'],
        completedLessons: ['algebra-basics', 'geometry-intro', 'photosynthesis'],
        completedTournaments: ['mathematics', 'science'],
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
        badgeIds: ['rookie'],
        completedLessons: [],
        completedTournaments: [],
    },
    { id: 'user-4', name: 'Saanvi Gupta', email: 'saanvi@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/user4/100/100', level: 7, xp: 650, xpToNextLevel: 700, badgeIds: ['rookie', 'scholar'], completedLessons: ['newtons-laws', 'cell-structure'], completedTournaments: ['physics'] },
    { id: 'user-5', name: 'Arjun Reddy', email: 'arjun@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/user5/100/100', level: 6, xp: 550, xpToNextLevel: 600, badgeIds: ['rookie'], completedLessons: ['ml-intro'], completedTournaments: ['ai'] },
    { id: 'user-teacher', name: 'Teacher', email: 'teacher@example.com', password: 'password', avatarUrl: 'https://picsum.photos/seed/teacher/100/100', level: 99, xp: 9999, xpToNextLevel: 10000, badgeIds: badges.map(b => b.id), completedLessons: [], completedTournaments: [] },
];

// --- Server-safe functions ---

export function getSubjects(): Omit<Subject, 'icon'>[] {
  return subjects;
}

export function getLessons(): Lesson[] {
  return lessons;
}

export function getQuizzes(): Quiz[] {
  return quizzes;
}

export function getBadges(): Omit<Badge, 'icon'>[] {
  return badges;
}

export function getIconMap() {
    return iconMap;
}

// --- Client-side only functions ---

const getUsersFromLocalStorage = (): User[] => {
  'use client';
  if (typeof window === 'undefined') return [];
  const usersStr = localStorage.getItem('users');
  if (usersStr) {
    try {
      const parsedUsers = JSON.parse(usersStr);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsedUsers)) {
        return parsedUsers;
      }
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
      // Fallback to initial users if parsing fails
    }
  }
  // If no users in local storage or data is corrupt, initialize with default
  localStorage.setItem('users', JSON.stringify(initialUsers));
  return initialUsers;
};

const saveUsersToLocalStorage = (users: User[]) => {
    'use client';
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
};

export function getUsers(): User[] {
  'use client';
  return getUsersFromLocalStorage();
}


export function getUser(userId: string): User | null {
  'use client';
  const users = getUsersFromLocalStorage();
  return users.find(u => u.id === userId) || null;
}

export function getLeaderboard(): LeaderboardEntry[] {
  'use client';
  const users = getUsersFromLocalStorage();
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  return sortedUsers.map((user, index) => ({
    rank: index + 1,
    user: user,
    xp: user.xp,
  }));
}

export function updateUser(updatedUser: User) {
  'use client';
  if (!updatedUser || !updatedUser.id) return;
  let users = getUsersFromLocalStorage();
  users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
  saveUsersToLocalStorage(users);
}

export function getAuthenticatedUserId(): string | null {
    'use client';
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_COOKIE_NAME);
}

export function logoutUser() {
    'use client';
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_COOKIE_NAME);
}

export function addSubject(subject: { name: string, description: string }) {
    'use client';
    const newSubject: Subject = {
        ...subject,
        id: subject.name.toLowerCase().replace(/\s+/g, '-'),
        icon: 'BookOpen',
        imageId: `custom-${Date.now()}`
    };
    subjects.push(newSubject);
    return newSubject;
}

export function addUser({ name, email, password }: { name: string; email: string; password?: string }): User {
    'use client';
    const users = getUsersFromLocalStorage();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }
    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      password, // In a real app, this should be hashed!
      avatarUrl: `https://picsum.photos/seed/${userId}/100/100`,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      badgeIds: [],
      completedLessons: [],
      completedTournaments: [],
    };
    const updatedUsers = [...users, newUser];
    saveUsersToLocalStorage(updatedUsers);
    return newUser;
}

export function loginUserAction(credentials: { email: string, password?: string }): { success: boolean; message: string; userId?: string } {
    'use client';
    if (typeof window === 'undefined') {
        return { success: false, message: 'Login can only be performed on the client.' };
    }

    const { email, password } = credentials;
    const users = getUsersFromLocalStorage();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, message: 'No user found with this email.' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Incorrect password.' };
    }
    
    localStorage.setItem(AUTH_COOKIE_NAME, user.id);
    
    return { success: true, message: 'Login successful!', userId: user.id };
}
