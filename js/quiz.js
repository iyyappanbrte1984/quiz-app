// js/quiz.js - Quiz Logic & Question Management
// ==============================================

import { supabase } from './config.js'

// Quiz State
export let quizState = {
  questions: [],
  currentIndex: 0,
  userAnswers: [],
  startTime: null,
  timerInterval: null
}

// ==================== LOAD QUESTIONS ====================

export async function loadQuestions(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true })
      .limit(limit)

    if (error) throw error

    console.log(`✅ Loaded ${data.length} questions from database`)

    return {
      success: true,
      data: data.length > 0 ? data : getDemoQuestions(),
      error: null
    }
  } catch (error) {
    console.error('❌ Load questions error:', error.message)
    console.log('📝 Using demo questions as fallback')

    return {
      success: false,
      data: getDemoQuestions(),
      error: error.message
    }
  }
}

// ==================== DEMO QUESTIONS ====================

export function getDemoQuestions() {
  return [
    {
      id: 1,
      questiontext: 'What is the capital of India?',
      optiona: 'Mumbai',
      optionb: 'New Delhi',
      optionc: 'Bangalore',
      optiond: 'Chennai',
      correctoption: 'b'
    },
    {
      id: 2,
      questiontext: 'Which planet is known as the Red Planet?',
      optiona: 'Venus',
      optionb: 'Mars',
      optionc: 'Jupiter',
      optiond: 'Saturn',
      correctoption: 'b'
    },
    {
      id: 3,
      questiontext: 'What is 2 + 2?',
      optiona: '3',
      optionb: '4',
      optionc: '5',
      optiond: '6',
      correctoption: 'b'
    },
    {
      id: 4,
      questiontext: 'Who wrote Romeo and Juliet?',
      optiona: 'Jane Austen',
      optionb: 'Charles Dickens',
      optionc: 'William Shakespeare',
      optiond: 'Mark Twain',
      correctoption: 'c'
    },
    {
      id: 5,
      questiontext: 'What is the largest ocean?',
      optiona: 'Atlantic Ocean',
      optionb: 'Indian Ocean',
      optionc: 'Arctic Ocean',
      optiond: 'Pacific Ocean',
      correctoption: 'd'
    }
  ]
}

// ==================== INITIALIZE QUIZ ====================

export async function initializeQuiz(questions) {
  quizState.questions = questions
  quizState.currentIndex = 0
  quizState.userAnswers = new Array(questions.length).fill(null)
  quizState.startTime = Date.now()

  console.log(`📚 Quiz initialized with ${questions.length} questions`)

  return quizState
}

// ==================== GET CURRENT QUESTION ====================

export function getCurrentQuestion() {
  if (quizState.currentIndex >= quizState.questions.length) {
    return null
  }

  return quizState.questions[quizState.currentIndex]
}

// ==================== SELECT ANSWER ====================

export function selectAnswer(letter) {
  if (quizState.currentIndex < quizState.userAnswers.length) {
    quizState.userAnswers[quizState.currentIndex] = letter
    console.log(`📝 Answer selected: ${letter}`)
  }
}

// ==================== NEXT QUESTION ====================

export function nextQuestion() {
  if (quizState.currentIndex < quizState.questions.length - 1) {
    quizState.currentIndex++
    return true
  }

  return false
}

// ==================== PREVIOUS QUESTION ====================

export function previousQuestion() {
  if (quizState.currentIndex > 0) {
    quizState.currentIndex--
    return true
  }

  return false
}

// ==================== GET PROGRESS ====================

export function getProgress() {
  const total = quizState.questions.length
  const current = quizState.currentIndex + 1
  const percentage = Math.round((current / total) * 100)

  return {
    current,
    total,
    percentage,
    answered: quizState.userAnswers.filter(a => a !== null).length
  }
}

// ==================== GET ELAPSED TIME ====================

export function getElapsedTime() {
  if (!quizState.startTime) return 0

  return Math.floor((Date.now() - quizState.startTime) / 1000)
}

// ==================== START TIMER ====================

export function startTimer(onTick = null) {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval)
  }

  quizState.timerInterval = setInterval(() => {
    if (onTick) {
      onTick(getElapsedTime())
    }
  }, 1000)

  console.log('⏱️ Timer started')
}

// ==================== STOP TIMER ====================

export function stopTimer() {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval)
    quizState.timerInterval = null
    console.log('⏱️ Timer stopped')
  }
}

// ==================== CALCULATE SCORE ====================

export function calculateScore() {
  let correctCount = 0
  const wrongCount = 0

  quizState.questions.forEach((question, index) => {
    if (quizState.userAnswers[index] === question.correctoption) {
      correctCount++
    }
  })

  const total = quizState.questions.length
  const percentage = Math.round((correctCount / total) * 100)

  return {
    correct: correctCount,
    wrong: total - correctCount,
    total,
    percentage
  }
}

// ==================== RESET QUIZ ====================

export function resetQuiz() {
  stopTimer()

  quizState = {
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    startTime: null,
    timerInterval: null
  }

  console.log('🔄 Quiz reset')
}
