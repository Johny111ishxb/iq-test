import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Brain, Share2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const IQTest = () => {
  // Define all question arrays first
  const logicalQuestions = [
    {
      question: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
      options: [
        "All roses fade quickly",
        "Some roses might fade quickly",
        "No roses fade quickly",
        "All flowers are roses"
      ],
      correct: 1,
      timeLimit: 45,
      difficulty: 'medium'
    },
    {
      question: "In a race, if you pass the person in 2nd place, what position are you in?",
      options: ["1st place", "2nd place", "3rd place", "Last place"],
      correct: 1,
      timeLimit: 45,
      difficulty: 'medium'
    }
  ];

  const mathQuestions = [
    {
      question: "If a sequence follows the pattern: 3, 7, 15, 31, ..., what's the next number?",
      options: ["63", "47", "51", "59"],
      correct: 0,
      timeLimit: 60,
      difficulty: 'hard'
    },
    {
      question: "What is the next number in the sequence: 2, 6, 12, 20, ?",
      options: ["30", "28", "32", "24"],
      correct: 0,
      timeLimit: 45,
      difficulty: 'medium'
    }
  ];

  const verbalQuestions = [
    {
      question: "Choose the word that best completes the analogy: Book is to Reading as Fork is to:",
      options: ["Kitchen", "Eating", "Cooking", "Food"],
      correct: 1,
      timeLimit: 45,
      difficulty: 'medium'
    },
    {
      question: "Which word does NOT belong in the group? Swift, Fast, Quick, Nimble, Sluggish, Rapid",
      options: ["Swift", "Quick", "Sluggish", "Rapid"],
      correct: 2,
      timeLimit: 45,
      difficulty: 'medium'
    }
  ];

  const patternQuestions = [
    {
      question: "What comes next in the pattern? 🔷 ⭐ 🔷 ⭐ 🔷 ?",
      options: ["🔷", "⭐", "⭕", "🔺"],
      correct: 1,
      timeLimit: 30,
      difficulty: 'easy'
    },
    {
      question: "Complete the pattern: AABBCCAABBCC...",
      options: ["AABB", "CCAA", "BBCC", "AACC"],
      correct: 1,
      timeLimit: 30,
      difficulty: 'easy'
    }
  ];

  const spatialQuestions = [
    {
      question: "If a cube is unfolded, how many faces will it show?",
      options: ["4", "5", "6", "8"],
      correct: 2,
      timeLimit: 45,
      difficulty: 'medium'
    },
    {
      question: "Which is the correct mirror image of 'b'?",
      options: ["b", "d", "p", "q"],
      correct: 1,
      timeLimit: 30,
      difficulty: 'easy'
    }
  ];

  // Now define categories array using the question arrays
  const categories = [
    { name: 'Logical Reasoning', questions: logicalQuestions },
    { name: 'Mathematical Thinking', questions: mathQuestions },
    { name: 'Verbal Comprehension', questions: verbalQuestions },
    { name: 'Pattern Recognition', questions: patternQuestions },
    { name: 'Spatial Reasoning', questions: spatialQuestions }
  ];

  const [stage, setStage] = useState('start');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [testId, setTestId] = useState('');

  // Rest of the component remains the same...
  
  useEffect(() => {
    if (stage === 'start') {
      setTestId(generateTestId());
    }
  }, [stage]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const generateTestId = () => {
    return `IQ-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  };

  const startTest = () => {
    if (!age || parseInt(age) < 16) {
      setShowAgeWarning(true);
      return;
    }
    setShowAgeWarning(false);
    setStage('category');
  };

  const startCategory = () => {
    setStage('test');
    setTimeLeft(categories[category].questions[0].timeLimit);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, {
      category: category,
      questionIndex: currentQuestion,
      answer: answerIndex
    }];
    setAnswers(newAnswers);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const currentCategoryQuestions = categories[category].questions;
    if (currentQuestion + 1 < currentCategoryQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(currentCategoryQuestions[currentQuestion + 1].timeLimit);
    } else if (category + 1 < categories.length) {
      setCategory(category + 1);
      setCurrentQuestion(0);
      setTimeLeft(categories[category + 1].questions[0].timeLimit);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let categoryScores = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    answers.forEach(answer => {
      const question = categories[answer.category].questions[answer.questionIndex];
      const categoryName = categories[answer.category].name;
      
      if (!categoryScores[categoryName]) {
        categoryScores[categoryName] = { correct: 0, total: 0 };
      }
      
      if (answer.answer === question.correct) {
        categoryScores[categoryName].correct++;
        totalCorrect++;
      }
      categoryScores[categoryName].total++;
      totalQuestions++;
    });

    const baseIQ = 100;
    const maxDeviation = 30;
    const percentageCorrect = totalCorrect / totalQuestions;
    const calculatedScore = Math.round(baseIQ + (percentageCorrect - 0.5) * 2 * maxDeviation);

    setScore({
      total: calculatedScore,
      categories: categoryScores
    });
    setStage('result');
  };

  const getShareableLink = () => {
    return `${window.location.origin}/iq-result/${testId}/${score.total}`;
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            <Brain className="h-8 w-8" />
            Advanced IQ Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stage === 'start' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="mb-4 text-lg">Enter your age to begin the comprehensive IQ assessment:</p>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age (16+ required)"
                  className="max-w-xs mx-auto"
                />
                {showAgeWarning && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You must be 16 or older to take this test.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="text-center">
                <Button
                  onClick={startTest}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Begin Assessment
                </Button>
              </div>
            </div>
          )}

          {stage === 'category' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-6">
                {categories[category].name}
              </h3>
              <p className="text-center text-gray-600">
                This section contains {categories[category].questions.length} questions.
              </p>
              <div className="text-center">
                <Button onClick={startCategory} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Start Section
                </Button>
              </div>
            </div>
          )}

          {stage === 'test' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Question {currentQuestion + 1} of {categories[category].questions.length}
                </span>
                <span className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="p-6 rounded-lg border border-gray-200">
                <p className="text-lg font-medium mb-6">
                  {categories[category].questions[currentQuestion].question}
                </p>
                <div className="space-y-3">
                  {categories[category].questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      variant="outline"
                      className="w-full text-left justify-start hover:bg-blue-50 transition-colors"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {stage === 'result' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Your IQ Score: {score.total}
                </h3>
                <p className="mt-2 text-gray-600">
                  Test ID: {testId}
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(score.categories).map(([category, data]) => (
                  <div key={category} className="p-4 rounded-lg bg-gray-50">
                    <h4 className="font-semibold">{category}</h4>
                    <p className="text-gray-600">
                      {data.correct} correct out of {data.total} ({Math.round(data.correct/data.total * 100)}%)
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => navigator.clipboard.writeText(getShareableLink())}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Copy Shareable Link
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setStage('start');
                    setCurrentQuestion(0);
                    setCategory(0);
                    setAnswers([]);
                    setScore(0);
                    setAge('');
                  }}
                >
                  Take Test Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IQTest;