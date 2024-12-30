import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Timer, Brain, Share2, Star, AlertCircle, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { formatTime } from '../utils/helpers';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  getDoc,
  doc,
  setDoc,
  increment
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8D2w0J8auihu3BbR8McIpoSduDfI2jxo",
  authDomain: "are-you-genius-1f253.firebaseapp.com",
  projectId: "are-you-genius-1f253",
  storageBucket: "are-you-genius-1f253.firebasestorage.app",
  messagingSenderId: "771421054895",
  appId: "1:771421054895:web:7a27a9c69f722069ebb15a",
  measurementId: "G-RE3R9WGMH9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = {
  logical: {
    name: "Logical & Mathematical Reasoning",
    questions: [
      {
        question: "What comes next in the sequence: 2, 6, 12, 20, 30, ___?",
        options: ["40", "42", "56", "60"],
        correct: 1,
        timeLimit: 45,
        explanation: "Each number increases by adding the next even number (4,6,8,10,12)"
      },
      {
        question: "A is the sister of B. B is the son of C. D is the father of C. What is A's relation to D?",
        options: ["Daughter", "Granddaughter", "Mother", "Sister"],
        correct: 1,
        timeLimit: 45,
        explanation: "A is B's sister, B is C's son, and D is C's father, making A D's granddaughter"
      },
      {
        question: "Find the odd one out: Dog, Cat, Tiger, Cow.",
        options: ["Dog", "Cat", "Tiger", "Cow"],
        correct: 2,
        timeLimit: 30,
        explanation: "Tiger is a wild animal while others are domestic"
      },
      {
        question: "If 5 apples cost $15, what is the cost of 8 apples?",
        options: ["$18", "$20", "$24", "$25"],
        correct: 2,
        timeLimit: 40,
        explanation: "If 5 apples = $15, then 1 apple = $3, so 8 apples = $24"
      },
      {
        question: "Rearrange the letters 'PAPEL' to form a meaningful word.",
        options: ["APPLE", "PAPEL", "LAPEL", "PLEA"],
        correct: 0,
        timeLimit: 30,
        explanation: "PAPEL can be rearranged to form APPLE"
      },
      {
        question: "Solve: 25 + 5 × 4 − 10 ÷ 2",
        options: ["35", "40", "45", "50"],
        correct: 1,
        timeLimit: 60,
        explanation: "Following BODMAS: 5×4=20, 10÷2=5, then 25+20-5=40"
      },
      {
        question: "If 3 pens cost $9, how many pens can you buy for $27?",
        options: ["6", "7", "8", "9"],
        correct: 3,
        timeLimit: 45,
        explanation: "If 3 pens = $9, then 1 pen = $3, so $27 ÷ $3 = 9 pens"
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct: 1,
        timeLimit: 45,
        explanation: "15% = 0.15, 200 × 0.15 = 30"
      },
      {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correct: 2,
        timeLimit: 30,
        explanation: "12 × 12 = 144"
      },
      {
        question: "Find the next letter in the sequence: A, D, G, J, ___?",
        options: ["K", "L", "M", "N"],
        correct: 2,
        timeLimit: 45,
        explanation: "Each letter jumps 3 positions in the alphabet"
      }
    ]
  },
  pattern: {
    name: "Pattern Recognition",
    questions: [
      {
        question: "Which number completes the series? 1, 1, 2, 3, 5, 8, ___?",
        options: ["11", "12", "13", "14"],
        correct: 2,
        timeLimit: 45,
        explanation: "Fibonacci sequence - each number is the sum of the previous two"
      },
      {
        question: "Find the missing number: 3, 9, 27, ___?",
        options: ["54", "72", "81", "90"],
        correct: 2,
        timeLimit: 40,
        explanation: "Each number is multiplied by 3"
      },
      {
        question: "Which word does not belong: Red, Blue, Green, Apple?",
        options: ["Red", "Blue", "Green", "Apple"],
        correct: 3,
        timeLimit: 30,
        explanation: "Apple is not a color"
      },
      {
        question: "What is the next number in the sequence: 2, 4, 8, 16, ___?",
        options: ["24", "28", "30", "32"],
        correct: 3,
        timeLimit: 40,
        explanation: "Each number is multiplied by 2"
      },
      {
        question: "Complete the pattern: 1, 4, 9, 16, 25, ___?",
        options: ["30", "36", "42", "49"],
        correct: 1,
        timeLimit: 45,
        explanation: "Square numbers: 1², 2², 3², 4², 5², 6²"
      }
    ]
  }
};

// Continue in next part...// ... continuing from previous part

const IQTest = () => {
  const [stage, setStage] = useState('start');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [rawScore, setRawScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [rating, setRating] = useState(0);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [totalTests, setTotalTests] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchTotalTests();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === 'test' && timeLeft > 0 && !isAnswerRevealed) {
      timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerRevealed) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timeLeft, stage, isAnswerRevealed]);

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const scores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopScores(scores);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchTotalTests = async () => {
    try {
      const statsDoc = await getDoc(doc(db, 'stats', 'testCount'));
      if (statsDoc.exists()) {
        setTotalTests(statsDoc.data().total || 0);
      }
    } catch (error) {
      console.error('Error fetching total tests:', error);
    }
  };

  const calculateIQScore = (correctAnswers, totalQuestions, timeRatio) => {
    // Base score calculation
    const accuracyPercentage = (correctAnswers / totalQuestions) * 100;
    
    // Calculate base IQ using a more accurate formula
    let baseIQ = 85 + (accuracyPercentage / 100) * 30;
    
    // Time adjustment
    let timeAdjustment = 0;
    if (timeRatio <= 0.7) timeAdjustment = 15;
    else if (timeRatio <= 0.85) timeAdjustment = 10;
    else if (timeRatio <= 1) timeAdjustment = 5;
    else if (timeRatio > 1.3) timeAdjustment = -10;
    else if (timeRatio > 1.15) timeAdjustment = -5;

    // Difficulty adjustment based on question patterns
    const difficultyBonus = Math.floor((correctAnswers / totalQuestions) * 10);
    
    // Calculate final IQ
    let finalIQ = baseIQ + timeAdjustment + difficultyBonus;
    
    // Add random variation within a small range (-2 to +2)
    finalIQ += Math.floor(Math.random() * 5) - 2;
    
    // Ensure IQ stays within realistic bounds
    return Math.max(70, Math.min(140, Math.round(finalIQ)));
  };

  const calculateFinalScore = (finalAnswers, totalTimeSpent) => {
    const correctAnswers = finalAnswers.filter(
      (answer, index) => answer === questions[index].correct
    ).length;

    const totalTimeLimit = questions.reduce((sum, q) => sum + q.timeLimit, 0);
    const timeRatio = totalTimeSpent / totalTimeLimit;

    const rawScore = (correctAnswers / questions.length) * 100;
    const iqScore = calculateIQScore(correctAnswers, questions.length, timeRatio);

    return {
      rawScore: Math.round(rawScore),
      iqScore,
      correctAnswers,
      timeRatio,
      totalQuestions: questions.length
    };
  };

  const handleTimeUp = () => {
    if (!isAnswerRevealed) {
      setIsAnswerRevealed(true);
      setTimeout(() => {
        moveToNextQuestion(-1);
      }, 2000);
    }
  };

  const saveResult = async (result) => {
    try {
      const scoreData = {
        name: name.trim(),
        age: parseInt(age),
        score: result.iqScore,
        rawScore: result.rawScore,
        totalTime,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeRatio: result.timeRatio,
        timestamp: new Date().toISOString(),
        rating
      };

      await addDoc(collection(db, 'scores'), scoreData);
      const statsRef = doc(db, 'stats', 'testCount');
      await setDoc(statsRef, { total: increment(1) }, { merge: true });

      fetchLeaderboard();
      fetchTotalTests();
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const startTest = () => {
    if (parseInt(age) < 16) {
      setShowAgeWarning(true);
      return;
    }
    setShowAgeWarning(false);
    
    // Combine all questions from categories
    const allQuestions = [
      ...categories.logical.questions,
      ...categories.pattern.questions
    ];
    
    // Shuffle questions
    const shuffledQuestions = allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 30); // Take first 30 questions
    
    setQuestions(shuffledQuestions);
    setStartTime(Date.now());
    setTimeLeft(shuffledQuestions[0].timeLimit);
    setStage('test');
  };

  const moveToNextQuestion = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(questions[currentQuestion + 1].timeLimit);
    } else {
      const endTime = Date.now();
      const totalTimeSpent = (endTime - startTime) / 1000;
      setTotalTime(totalTimeSpent);
      
      const result = calculateFinalScore(newAnswers, totalTimeSpent);
      setScore(result.iqScore);
      setRawScore(result.rawScore);
      setStage('result');
      saveResult(result);
    }
  };

  const handleAnswer = (answerIndex) => {
    if (!isAnswerRevealed) {
      setSelectedAnswer(answerIndex);
      setIsAnswerRevealed(true);
      setTimeout(() => {
        moveToNextQuestion(answerIndex);
      }, 2000);
    }
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My IQ Test Result',
        text: `I scored ${score} on the IQ test! Raw score: ${rawScore}%`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-6 w-6" />
            </motion.div>
            IQ Test Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === 'start' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="max-w-xs mx-auto"
                />
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age (16+)"
                  className="max-w-xs mx-auto"
                />
                {showAgeWarning && (
                  <div className="text-red-500 flex items-center justify-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    You must be 16 or older to take this test
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Scores
                </h3>
                <div className="space-y-2">
                  {topScores.map((score, index) => (
                    <div key={score.id} className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        {index + 1}.
                        <span className="font-medium">{score.name}</span>
                      </span>
                      <span className="font-bold">{score.score}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Total Tests Taken: {totalTests}
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startTest}
                  disabled={!age || !name}
                  className="mt-4"
                >
                  Start Test
                </Button>
              </div>
            </motion.div>
          )}

          {stage === 'test' && questions[currentQuestion] && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <p className="text-lg font-medium mb-4">{questions[currentQuestion].question}</p>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleAnswer(index)}
                        variant="outline"
                        className={`w-full text-left justify-start ${
                          isAnswerRevealed
                            ? index === questions[currentQuestion].correct
                              ? 'bg-green-100 border-green-500 text-green-700'
                              : index === selectedAnswer
                              ? 'bg-red-100 border-red-500 text-red-700'
                              : ''
                            : ''
                        }`}
                        disabled={isAnswerRevealed}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option}</span>
                          {isAnswerRevealed && index === questions[currentQuestion].correct && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {isAnswerRevealed && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                {isAnswerRevealed && (
                  <div className="mt-4 text-sm text-gray-600">
                    {questions[currentQuestion].explanation}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-6"
            >
              <h3 className="text-2xl font-bold">
                {name}'s Results
              </h3>
              <div className="space-y-2">
                <p className="text-xl">
                  IQ Score: <span className="font-bold">{score}</span>
                </p>
                <p className="text-lg">
                  Raw Score: <span className="font-bold">{rawScore}%</span>
                </p>
                <p className="text-gray-600">
                  Time taken: {formatTime(Math.floor(totalTime))}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`h-8 w-8 cursor-pointer ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={shareResult} className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Result
                </Button>
                <Button
                  onClick={() => {
                    setStage('start');
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setScore(0);
                    setAge('');
                    setName('');
                    setRating(0);
                    setShowAgeWarning(false);
                  }}
                >
                  Take Test Again
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IQTest;