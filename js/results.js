// js/results.js - Results & Scoring Management
// ============================================

import { supabase } from './config.js'

// ==================== SAVE QUIZ RESULT ====================

export async function saveQuizResult(userId, score, totalQuestions, durationSeconds) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const correctAnswers = score
    const wrongAnswers = totalQuestions - score

    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        {
          userid: userId,
          score: score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          duration_seconds: durationSeconds,
          attempted_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error

    console.log('✅ Quiz result saved:', { score, totalQuestions, duration: durationSeconds })

    // Update user profile
    await incrementUserAttempts(userId)
    await updateBestScore(userId, score)

    return { 
      success: true, 
      data, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Save result error:', error.message)

    return { 
      success: false, 
      data: null, 
      error: error.message 
    }
  }
}

// ==================== GET USER QUIZ HISTORY ====================

export async function getUserResults(userId, limit = 10) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('userid', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    console.log(`✅ Retrieved ${data.length} quiz results`)

    return { 
      success: true, 
      data, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Get results error:', error.message)

    return { 
      success: false, 
      data: [], 
      error: error.message 
    }
  }
}

// ==================== GET USER STATISTICS ====================

export async function getStatistics(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .select('score, total_questions, duration_seconds')
      .eq('userid', userId)

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        success: true,
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimeSpent: 0,
          averageTime: 0
        },
        error: null
      }
    }

    const totalAttempts = data.length
    const averageScore = Math.round(
      data.reduce((sum, r) => sum + r.score, 0) / totalAttempts
    )
    const bestScore = Math.max(...data.map(r => r.score))
    const totalTimeSpent = data.reduce((sum, r) => sum + (r.duration_seconds || 0), 0)
    const averageTime = Math.round(totalTimeSpent / totalAttempts)

    console.log('📊 Statistics calculated:', { totalAttempts, averageScore, bestScore })

    return {
      success: true,
      stats: {
        totalAttempts,
        averageScore,
        bestScore,
        totalTimeSpent,
        averageTime
      },
      error: null
    }
  } catch (error) {
    console.error('❌ Get statistics error:', error.message)

    return {
      success: false,
      stats: {},
      error: error.message
    }
  }
}

// ==================== INCREMENT USER ATTEMPTS ====================

async function incrementUserAttempts(userId) {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('attempts')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const newAttempts = (profile?.attempts || 0) + 1

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ attempts: newAttempts })
      .eq('id', userId)

    if (updateError) throw updateError

    console.log(`✅ Attempts updated to ${newAttempts}`)
  } catch (error) {
    console.error('⚠️ Error updating attempts:', error.message)
  }
}

// ==================== UPDATE BEST SCORE ====================

async function updateBestScore(userId, score) {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('best_score')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const currentBest = profile?.best_score || 0

    if (score > currentBest) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ best_score: score })
        .eq('id', userId)

      if (updateError) throw updateError

      console.log(`✅ New best score: ${score}`)
    }
  } catch (error) {
    console.error('⚠️ Error updating best score:', error.message)
  }
}

// ==================== FORMAT RESULT FOR DISPLAY ====================

export function formatResultData(correctCount, totalQuestions, durationSeconds) {
  const percentage = Math.round((correctCount / totalQuestions) * 100)
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  return {
    correct: correctCount,
    incorrect: totalQuestions - correctCount,
    total: totalQuestions,
    percentage,
    timeFormatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    grade: getGrade(percentage),
    message: getResultMessage(percentage)
  }
}

// ==================== GET GRADE ====================

export function getGrade(percentage) {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

// ==================== GET RESULT MESSAGE ====================

export function getResultMessage(percentage) {
  if (percentage >= 90) return '🎉 Excellent! Outstanding performance!'
  if (percentage >= 80) return '👏 Great! Very good effort!'
  if (percentage >= 70) return '👍 Good! Keep practicing!'
  if (percentage >= 60) return '💪 Pass! You can do better!'
  return '📚 Need more practice. Try again!'
}

// ==================== GET PERFORMANCE LEVEL ====================

export function getPerformanceLevel(percentage) {
  if (percentage >= 90) return 'expert'
  if (percentage >= 80) return 'advanced'
  if (percentage >= 70) return 'intermediate'
  if (percentage >= 60) return 'beginner'
  return 'novice'
}

// ==================== CALCULATE LEADERBOARD POSITION ====================

export async function getLeaderboardPosition(userId, score) {
  try {
    const { data: allScores, error } = await supabase
      .from('quiz_results')
      .select('score')
      .gt('score', score)

    if (error) throw error

    const position = (allScores?.length || 0) + 1

    return { 
      success: true, 
      position, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Get leaderboard position error:', error.message)

    return { 
      success: false, 
      position: null, 
      error: error.message 
    }
  }
}
