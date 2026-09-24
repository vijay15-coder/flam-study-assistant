import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  MessageSquare,
  ThumbsUp,
  BarChart2,
  TrendingUp,
  Trophy,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Search,
  Layers,
  ChevronDown,
  RotateCw,
  FileText,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { Deck } from '../../types/flashcard';

interface LibraryViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  const handleExportMarkdown = () => {
    let content = `# Study Guide: ${currentDeck.title}\n`;
    content += `Study notes exported from GoodOff\n`;
    content += `Total Cards: ${currentDeck.cards.length}\n\n`;
    content += `## Flashcard Summaries\n\n`;

    currentDeck.cards.forEach((card, idx) => {
      content += `### ${idx + 1}. ${card.question}\n`;
      content += `**Answer:** ${card.answer}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentDeck.title.replace(/\s+/g, '_')}_notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dynamicResources = [
    {
      title: `${currentDeck.title} - Study notes`,
      category: currentDeck.title,
      format: 'Markdown Guide',
      size: `${Math.max(1, Math.round(currentDeck.cards.length * 1.5))} KB`,
      description: `A markdown copy of the questions and answers in this deck.`,
      onDownload: handleExportMarkdown,
    },
    {
      title: `${currentDeck.title} - Quick reference`,
      category: currentDeck.title,
      format: 'Quick Reference',
      size: '450 KB',
      description: `A short reference for the main concepts in this deck.`,
      onDownload: handleExportMarkdown,
    },
    {
      title: `${currentDeck.title} - Printable 2-Column Flashcard Sheet`,
      category: currentDeck.title,
      format: 'Printable Sheet',
      size: '620 KB',
      description: `Formatted 2-column layout (Question / Answer) ready to fold and review offline for ${currentDeck.title}.`,
      onDownload: handleExportMarkdown,
    },
  ];

  const filtered = dynamicResources.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Knowledge Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Library: {currentDeck.title} {currentDeck.icon}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Export or search the notes from{' '}
            <strong className="text-slate-800 font-semibold">{currentDeck.title}</strong>.
          </p>
        </div>

                <div className="relative">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch Topic ({currentDeck.title.substring(0, 16)}...)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 block">
                Switch Subject / Topic
              </span>
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder={`Search notes for ${currentDeck.title}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
        />
      </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.format}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>{item.size}</span>
              <button
                type="button"
                onClick={item.onDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ForumViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
}) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      deckId: currentDeck.id,
      author: 'Aarav Sharma',
      role: 'Class 11 Student',
      time: '2 hours ago',
      title: `Tricky question on ${currentDeck.title}: ${currentDeck.cards[0]?.question || 'Core concept clarification'}`,
      content: `I am reviewing the flashcards for ${currentDeck.title}. Specifically, why is the answer formulated as: "${currentDeck.cards[0]?.answer?.substring(0, 100) || 'this'}..."? Does anyone have an intuition for this in practice?`,
      upvotes: 12,
      replies: 4,
      hasUpvoted: false,
    },
    {
      id: 2,
      deckId: currentDeck.id,
      author: 'Nasir',
      role: 'Class 11 Student',
      time: '5 hours ago',
      title: `Exam Tip for ${currentDeck.title}`,
      content: `Make sure to pay attention to edge cases when testing yourself on ${currentDeck.title}. In the exam, questions often test the boundary conditions rather than the general formula!`,
      upvotes: 24,
      replies: 5,
      hasUpvoted: true,
    },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  useEffect(() => {
    setPosts([
      {
        id: Date.now() + 1,
        deckId: currentDeck.id,
        author: 'Aarav Sharma',
        role: 'Class 11 Student',
        time: '2 hours ago',
        title: `Discussion: ${currentDeck.cards[0]?.question || currentDeck.title}`,
        content: `I'm going through the "${currentDeck.title}" deck. Can someone share an easy memory mnemonic for: "${currentDeck.cards[0]?.answer?.substring(0, 80)}"?`,
        upvotes: 8,
        replies: 3,
        hasUpvoted: false,
      },
      {
        id: Date.now() + 2,
        deckId: currentDeck.id,
        author: 'Nasir',
        role: 'Class 11 Student',
        time: '4 hours ago',
        title: `Summary of key formulas for ${currentDeck.title}`,
        content: `Created flashcards for ${currentDeck.title} with ${currentDeck.cards.length} cards.`,
        upvotes: 19,
        replies: 6,
        hasUpvoted: true,
      },
    ]);
  }, [currentDeck.id]);

  const toggleUpvote = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
              hasUpvoted: !p.hasUpvoted,
            }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;
    const post = {
      id: Date.now(),
      deckId: currentDeck.id,
      author: 'Nasir',
      role: 'Class 11 Student',
      time: 'Just now',
      title: newTitle.trim(),
      content: newQuestion.trim(),
      upvotes: 1,
      replies: 0,
      hasUpvoted: true,
    };
    setPosts([post, ...posts]);
    setNewTitle('');
    setNewQuestion('');
    setShowPostModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Knowledge Center
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 font-semibold">
              Topic Community Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Forum: {currentDeck.title} {currentDeck.icon}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Ask questions, exchange memory mnemonics, and solve homework problems specifically
            centered on <strong className="text-slate-800 font-semibold">{currentDeck.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
                    <div className="relative">
            <button
              type="button"
              onClick={() => setShowDeckSelector(!showDeckSelector)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Switch ({currentDeck.title.substring(0, 14)}...)</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showDeckSelector && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
                <span className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 block">
                  Switch Topic Forum
                </span>
                {allDecks.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onSelectDeck(d.id);
                      setShowDeckSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      d.id === currentDeck.id
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{d.title}</span>
                    <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowPostModal(!showPostModal)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>+ Ask Question</span>
          </button>
        </div>
      </div>

      {showPostModal && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Ask a Question about "{currentDeck.title}"
            </h3>
            <span className="text-xs text-slate-400">Tagged: {currentDeck.title}</span>
          </div>
          <input
            type="text"
            placeholder={`Question title (e.g. How does ${currentDeck.title} apply in practice?)`}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            required
          />
          <textarea
            placeholder="Describe the card, formula, or concept you want help with..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPostModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

            <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{post.author}</span>
                <span>·</span>
                <span>{post.role}</span>
                <span>·</span>
                <span>{post.time}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {currentDeck.title}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => toggleUpvote(post.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  post.hasUpvoted
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.replies} Peer Replies</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AnalyticsViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
}) => {
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const totalCards = currentDeck.cards.length;
  const cardsDue = currentDeck.cardsDue ?? totalCards;
  const masteredCards = Math.max(0, totalCards - cardsDue);
  const progressPercent = Math.round((masteredCards / totalCards) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Knowledge Center
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 font-semibold">Real-Time Metrics</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Analytics: {currentDeck.title} {currentDeck.icon}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Current card counts and review progress for{' '}
            <strong className="text-slate-800 font-semibold">{currentDeck.title}</strong>.
          </p>
        </div>

                <div className="relative">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch Topic ({currentDeck.title.substring(0, 16)}...)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 block">
                Select Deck to View Analytics
              </span>
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Total Cards</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">{totalCards}</span>
          <span className="text-xs text-slate-500 mt-1 block">{currentDeck.title}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Cards Due</span>
          <span className="text-3xl font-black text-orange-600 mt-1 block">{cardsDue}</span>
          <span className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" /> Needs Review
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Mastered Cards</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">{masteredCards}</span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle className="w-3.5 h-3.5" /> Long-Term Retention
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Cards reviewed</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">{progressPercent}%</span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Progress
          </span>
        </div>
      </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Concept Mastery Breakdown: {currentDeck.title}
          </h3>
          <span className="text-xs text-slate-400 font-medium">{totalCards} Concepts</span>
        </div>

        <div className="space-y-3">
          {currentDeck.cards.map((card, idx) => {
            const isDue = idx < cardsDue;
            const mastery = isDue ? 0 : 100;

            return (
              <div key={card.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-start justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {idx + 1}. {card.question}
                  </span>
                  <span
                    className={`font-bold flex-shrink-0 ${
                      mastery >= 85 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {isDue ? 'Due' : 'Reviewed'}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      mastery >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ChallengesViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
  onStartStudy?: (mode: 'smart_study' | 'practice') => void;
  onStartQuiz?: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
  onStartStudy,
  onStartQuiz,
}) => {
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [claimedIds, setClaimedIds] = useState<number[]>([2]);
  const [userXp, setUserXp] = useState<number>(0);
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  const totalCards = Math.max(1, currentDeck.cards.length);
  const cardsDue = currentDeck.cardsDue ?? totalCards;
  const cardsMastered = Math.max(0, totalCards - cardsDue);
  const progressRatio = currentDeck.progress ? currentDeck.progress / 100 : cardsMastered / totalCards;

  const challenges = [
    {
      id: 1,
      title: `${currentDeck.title}: Clean Run`,
      rewardXp: 1,
      reward: 'Checklist item',
      progress: Math.min(totalCards, Math.max(totalCards, 6)),
      total: totalCards,
      actionLabel: 'Practice Flashcards',
      actionType: 'practice' as const,
      description: `Answer all ${totalCards} cards in "${currentDeck.title}" without missing a card.`,
    },
    {
      id: 2,
      title: `${currentDeck.title}: Spaced Repetition Hero`,
      rewardXp: 1,
      reward: 'Checklist item',
      progress: 3,
      total: 3,
      actionLabel: 'Review Spaced Repetition',
      actionType: 'smart_study' as const,
      description: `Complete 3 consecutive review sessions on "${currentDeck.title}".`,
    },
    {
      id: 3,
      title: `${currentDeck.title}: 100% Quiz Accuracy`,
      rewardXp: 1,
      reward: 'Checklist item',
      progress: 8,
      total: 10,
      actionLabel: 'Launch Quiz Arena',
      actionType: 'quiz' as const,
      description: `Score 100% on a multiple-choice quiz for "${currentDeck.title}".`,
    },
    {
      id: 4,
      title: `${currentDeck.title}: Rapid Fire Master`,
      rewardXp: 1,
      reward: 'Checklist item',
      progress: Math.min(totalCards, Math.round(progressRatio * totalCards)),
      total: totalCards,
      actionLabel: 'Smart Study Mode',
      actionType: 'smart_study' as const,
      description: `Recall ${totalCards} flashcards in under 2 minutes for "${currentDeck.title}".`,
    },
  ];

  const checklistProgressPct = Math.round((claimedIds.length / challenges.length) * 100);

  const handleClaimReward = (id: number, rewardXp: number, title: string) => {
    if (claimedIds.includes(id)) return;

    setClaimedIds((prev) => [...prev, id]);
    setUserXp((prev) => prev + rewardXp);
    setCelebrationToast(`Marked "${title}" complete.`);

    setTimeout(() => {
      setCelebrationToast(null);
    }, 4000);
  };

  const filteredChallenges = challenges.filter((c) => {
    const isCompleted = c.progress >= c.total;
    if (activeTab === 'completed') return isCompleted && claimedIds.includes(c.id);
    if (activeTab === 'active') return !isCompleted || !claimedIds.includes(c.id);
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
            {celebrationToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
          <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-xs sm:text-sm font-bold">{celebrationToast}</span>
        </div>
      )}

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/35 via-orange-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-amber-600 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Study checklist
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">Active Topic: {currentDeck.title}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Challenges: {currentDeck.title} {currentDeck.icon}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Optional tasks for <strong className="text-slate-800 font-semibold">{currentDeck.title}</strong>. Use them to decide what to review next.
          </p>
        </div>

                <div className="relative z-10">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch: {currentDeck.title.substring(0, 16)}...</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDeckSelector ? 'rotate-180' : ''}`} />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Switch Topic Challenges
              </span>
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="bg-gradient-to-r from-black via-neutral-950 to-neutral-900 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight">Study progress</span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                This session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tasks completed:{' '}
              <strong className="text-white font-mono">{claimedIds.length}</strong>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Checklist progress</span>
            <span className="font-mono tabular-nums">{claimedIds.length} / {challenges.length}</span>
          </div>
          <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${checklistProgressPct}%` }}
            />
          </div>
        </div>
      </div>

            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Missions ({challenges.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          In Progress
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            activeTab === 'completed'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Claimed ✓ ({claimedIds.length})
        </button>
      </div>

            <div className="space-y-4">
        {filteredChallenges.map((c) => {
          const isCompleted = c.progress >= c.total;
          const isClaimed = claimedIds.includes(c.id);

          return (
            <div
              key={c.id}
              className={`glass-card glass-card-hover rounded-3xl p-5 sm:p-6 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 ${
                isCompleted && !isClaimed
                  ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/30'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-slate-900">{c.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
                    +{c.reward}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>

                                <div className="pt-2 max-w-md">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                    <span>Topic Progress</span>
                    <span className="font-semibold text-slate-700">
                      {c.progress} / {c.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, (c.progress / c.total) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

                            <div className="flex-shrink-0 flex items-center gap-2">
                {isClaimed ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                    <span>Claimed ✓</span>
                  </span>
                ) : isCompleted ? (
                  <button
                    type="button"
                    onClick={() => handleClaimReward(c.id, c.rewardXp, c.title)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Claim (+{c.reward})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (c.actionType === 'quiz') {
                        if (onStartQuiz) onStartQuiz();
                      } else {
                        if (onStartStudy) onStartStudy(c.actionType);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all duration-150 active:scale-95"
                  >
                    <span>{c.actionLabel} →</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PomodoroViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
  onStartFullStudy: () => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
  onStartFullStudy,
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const cards = currentDeck.cards;
  const currentCard = cards[activeCardIdx] || cards[0];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (mode === 'work') {
              setMode('break');
              return 5 * 60;
            } else {
              setMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const format = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Knowledge Center
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Pomodoro Focus: {currentDeck.title} {currentDeck.icon}
          </h1>
          <p className="text-xs text-slate-500">
            Study <strong className="text-slate-800">{currentDeck.title}</strong> flashcards for 25
            minutes, then rest for 5 minutes.
          </p>
        </div>

                <div className="relative">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch ({currentDeck.title.substring(0, 14)}...)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 block">
                Select Deck for Pomodoro Focus
              </span>
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                    setActiveCardIdx(0);
                    setIsFlipped(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md text-center space-y-6">
                <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('work');
              setTimeLeft(25 * 60);
              setIsRunning(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'work'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Study {currentDeck.title.substring(0, 16)} (25 min)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('break');
              setTimeLeft(5 * 60);
              setIsRunning(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'break'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rest Break (5 min)
          </button>
        </div>

                <div className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tight">
          {format(timeLeft)}
        </div>

                <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
          >
            {isRunning ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>{isRunning ? 'Pause Session' : 'Start Focus Session'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Live Focus Flashcard ({activeCardIdx + 1} of {cards.length})
          </span>
          <button
            type="button"
            onClick={onStartFullStudy}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Open Full Study Mode →
          </button>
        </div>

        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer text-center space-y-2 transition shadow-inner"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {isFlipped ? 'Answer' : 'Question (Click to flip)'}
          </span>
          <p className="text-sm font-semibold text-slate-800">
            {isFlipped ? currentCard?.answer : currentCard?.question}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveCardIdx((i) => Math.max(0, i - 1));
              setIsFlipped(false);
            }}
            disabled={activeCardIdx === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ← Previous Card
          </button>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
          >
            <RotateCw className="w-3 h-3" />
            <span>Flip</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCardIdx((i) => Math.min(cards.length - 1, i + 1));
              setIsFlipped(false);
            }}
            disabled={activeCardIdx === cards.length - 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Next Card →
          </button>
        </div>
      </div>
    </div>
  );
};
