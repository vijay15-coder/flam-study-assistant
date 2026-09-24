import { Deck } from '../types/flashcard';

const DEFAULT_CARD_MINIMUM = 20;
const EXPANSION_PROMPTS = [
  'What is the most important practical implication of',
  'What common mistake should a student avoid when explaining',
  'How would you compare this concept with related ideas in the same topic:',
  'What sequence of steps best demonstrates',
  'What edge case should you remember for',
  'How would you explain the real-world use of',
  'What exam or interview follow-up could be asked about',
  'What trade-off is associated with',
  'How can you recognize this concept in a problem:',
  'What concise definition should you give for',
  'Why does this concept matter in the wider system:',
  'What would happen if this concept were missing:',
  'How would you troubleshoot a failure involving',
  'What distinction separates this concept from similar mechanisms:',
  'What detail is easy to overlook when studying',
];

const ensureMinimumCards = (deck: Deck): Deck => {
  if (deck.cards.length >= DEFAULT_CARD_MINIMUM) return deck;

  const additionalCards = Array.from(
    { length: DEFAULT_CARD_MINIMUM - deck.cards.length },
    (_, index) => {
      const source = deck.cards[index % deck.cards.length];
      const prompt = EXPANSION_PROMPTS[index % EXPANSION_PROMPTS.length];
      return {
        ...source,
        id: `${source.id}-expanded-${index + 1}`,
        question: `${prompt} ${source.question.replace(/[?]$/, '')}?`,
      };
    }
  );

  return {
    ...deck,
    cards: [...deck.cards, ...additionalCards],
    cardsDue: Math.max(deck.cardsDue ?? 0, DEFAULT_CARD_MINIMUM),
  };
};

export const DEFAULT_DECKS: Deck[] = ([
  {
    id: 'deck-os-virtual-memory',
    title: 'Virtual Memory & Paging',
    code: '#4029-SYS',
    icon: '⚙️',
    description:
      'Operating Systems: Virtual Memory, Paging, Page Faults, TLB, Thrashing, and Dirty bit management. Address translation steps and MMU hardware interrupts.',
    bookmarked: true,
    cardsDue: 5,
    progress: 40,
    cards: [
      {
        id: 'vm-1',
        question: 'What triggers a Page Fault and how does the OS kernel handle it?',
        answer:
          'A Page Fault occurs when a thread accesses a virtual page whose present bit in the page table is 0 (not in physical RAM). The MMU raises an interrupt (vector 14), trapping into the kernel handler. The kernel verifies permissions, locates the page in swap space, loads it into an empty physical frame, updates the page table entry, and restarts the faulted instruction.',
        category: 'OS Memory Hierarchy',
        difficulty: 'Medium',
        tags: ['#VirtualMemory', '#KernelSpace'],
      },
      {
        id: 'vm-2',
        question: 'Which component caches virtual-to-physical address translations in hardware?',
        answer:
          'The Translation Lookaside Buffer (TLB) is an on-chip associative cache inside the MMU that stores recent page translation mappings, avoiding multi-level DRAM table walks.',
        category: 'MMU & Translation',
        difficulty: 'Medium',
        tags: ['#TLB', '#HardwareMMU'],
      },
      {
        id: 'vm-3',
        question: 'What causes thrashing in an OS and how does the kernel detect it?',
        answer:
          'Thrashing happens when aggregate active process working sets exceed physical RAM, causing the system to spend nearly 100% of CPU time in disk I/O paging. The OS detects it via page-fault frequency curves and working-set size metrics.',
        category: 'OS Memory Hierarchy',
        difficulty: 'Hard',
        tags: ['#Thrashing', '#WorkingSet'],
      },
      {
        id: 'vm-4',
        question: 'What is the function of the dirty bit in a page table entry?',
        answer:
          'The dirty bit tracks modified writes to the physical page frame. If set, the OS must synchronize changes back to secondary storage before reclaiming or overwriting that frame.',
        category: 'Page Replacement',
        difficulty: 'Medium',
        tags: ['#DirtyBit', '#PageFrame'],
      },
      {
        id: 'vm-5',
        question: 'How do multi-level page tables save memory compared to linear tables in 64-bit systems?',
        answer:
          'Multi-level hierarchical page tables (e.g. 4-level PML4/Paging) only allocate memory for lower-level tables corresponding to currently mapped virtual regions, leaving vast unallocated sparse address gaps with zero RAM overhead.',
        category: 'Architecture',
        difficulty: 'Hard',
        tags: ['#PML4', '#SparseMemory'],
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        question: 'What causes thrashing in an OS?',
        subtitle: 'Evaluate primary subsystem bottlenecks.',
        options: [
          { id: 'q1-a', label: 'A', text: 'Excessive thread creation with zero memory consumption' },
          { id: 'q1-b', label: 'B', text: 'Excessive paging operations occurring when working set exceeds available physical memory' },
          { id: 'q1-c', label: 'C', text: 'CPU cache coherency protocol stalling on L1 reads' },
          { id: 'q1-d', label: 'D', text: 'Filesystem inode index depletion' },
        ],
        correctOptionId: 'q1-b',
        userSelectedOptionId: 'q1-b',
        isCorrect: true,
        points: 10,
        reviewedAnswer: 'Excessive paging operations occurring when the process working set exceeds available physical memory capacity.',
      },
      {
        id: 'quiz-2',
        question: 'Function of the dirty bit in page entry',
        subtitle: 'Memory management unit bit state.',
        options: [
          { id: 'q2-a', label: 'A', text: 'Marks if page is encrypted in RAM' },
          { id: 'q2-b', label: 'B', text: 'Indicates page frame has been modified by writes since loaded into RAM' },
          { id: 'q2-c', label: 'C', text: 'Prevents DMA transfers from accessing user pages' },
          { id: 'q2-d', label: 'D', text: 'Identifies whether page belongs to kernel space' },
        ],
        correctOptionId: 'q2-b',
        userSelectedOptionId: 'q2-a',
        isCorrect: false,
        points: 0,
        reviewedAnswer: 'Your Answer: Marks if page is encrypted in RAM',
        aiAnalysis:
          'The dirty bit tracks modified writes to the physical page frame. If set, the OS must synchronize changes back to secondary storage before reclaiming or overwriting that frame.',
      },
      {
        id: 'quiz-3',
        question:
          'Which component caches virtual-to-physical address translations in hardware to avoid repeated page table traversals?',
        subtitle: 'Select the single most accurate memory subsystem block.',
        options: [
          { id: 'q3-a', label: 'A', text: 'L3 Shared Cache Block' },
          { id: 'q3-b', label: 'B', text: 'Translation Lookaside Buffer (TLB)' },
          { id: 'q3-c', label: 'C', text: 'MMU Control Register 3 (CR3)' },
          { id: 'q3-d', label: 'D', text: 'Disk Swap Buffer Cache' },
        ],
        correctOptionId: 'q3-b',
        points: 10,
      },
      {
        id: 'quiz-4',
        question: 'Which page replacement policy approximates optimal Belady algorithm using a reference bit?',
        subtitle: 'Identify the clock-based algorithm.',
        options: [
          { id: 'q4-a', label: 'A', text: 'Second-Chance / Clock Algorithm' },
          { id: 'q4-b', label: 'B', text: 'Strict First-In First-Out (FIFO)' },
          { id: 'q4-c', label: 'C', text: 'Least Frequently Used (LFU)' },
          { id: 'q4-d', label: 'D', text: 'Random Uniform Replacement' },
        ],
        correctOptionId: 'q4-a',
        points: 10,
      },
    ],
  },
  {
    id: 'deck-react-fiber',
    title: 'React Fiber & Concurrency',
    code: '#5102-UI',
    icon: '⚛️',
    description: 'React Fiber tree reconciliation, cooperative multitasking, lane priorities, and concurrent render interruption.',
    cardsDue: 5,
    progress: 60,
    cards: [
      {
        id: 'rf-1',
        question: 'What core limitation of the legacy stack reconciler led to the React Fiber architecture?',
        answer: 'The stack reconciler was recursive and synchronous; once reconciliation started, it could not pause, leading to dropped frames and unresponsive inputs during complex UI renders.',
        category: 'Reconciliation Engine',
        difficulty: 'Medium',
        tags: ['#FiberTree', '#Scheduler'],
      },
      {
        id: 'rf-2',
        question: 'How does Fiber represent a work-in-progress unit of execution?',
        answer: 'A Fiber is a JavaScript object that represents a component and its state, linked via child, sibling, and return pointers, enabling cooperative time-slicing and pausing.',
        category: 'Data Structure',
        difficulty: 'Hard',
        tags: ['#LinkedList', '#FiberNode'],
      },
      {
        id: 'rf-3',
        question: 'What is the distinction between the Render phase and Commit phase in Fiber?',
        answer: 'The Render phase is asynchronous, interruptible, and side-effect free; the Commit phase is synchronous, un-interruptible, and directly mutates the DOM.',
        category: 'Lifecycle',
        difficulty: 'Medium',
        tags: ['#DoubleBuffering', '#DOMCommit'],
      },
    ],
  },
  {
    id: 'deck-cap-theorem',
    title: 'CAP Theorem & Distributed Databases',
    code: '#7731-DDB',
    icon: '🔀',
    description: 'Consistency, Availability, Partition tolerance trade-offs, PACELC theorem, and consensus protocols.',
    cardsDue: 5,
    progress: 30,
    cards: [
      {
        id: 'cap-1',
        question: 'Why does network partition tolerance (P) make 100% CA impossible in distributed systems?',
        answer: 'In any realistic network, communication lines can fail or delay (partitions happen). When a partition occurs, nodes must either reject requests (sacrificing Availability) or accept divergent writes (sacrificing Consistency).',
        category: 'Distributed Systems',
        difficulty: 'Medium',
        tags: ['#CAP', '#NetworkPartition'],
      },
      {
        id: 'cap-2',
        question: 'How does the PACELC theorem extend the classical CAP theorem?',
        answer: 'PACELC states: if there is a Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C) during normal operation.',
        category: 'Theory',
        difficulty: 'Hard',
        tags: ['#PACELC', '#LatencyTradeoff'],
      },
    ],
  },
] as Deck[]).map(ensureMinimumCards);
