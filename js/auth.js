// js/auth.js - Authentication Functions
// ======================================

import { supabase } from './config.js'

// ==================== LOGIN ====================

export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) throw error

    console.log('✅ Login successful:', data.user.email)
    return { 
      success: true, 
      user: data.user, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Login error:', error.message)
    return { 
      success: false, 
      user: null, 
      error: error.message 
    }
  }
}

// ==================== REGISTRATION ====================

export async function registerUser(email, password, fullname) {
  try {
    // Validate inputs
    if (!email || !password || !fullname) {
      throw new Error('All fields are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { fullname: fullname.trim() }
      }
    })

    if (error) throw error

    console.log('✅ Registration successful:', email)
    return { 
      success: true, 
      user: data.user, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Register error:', error.message)
    return { 
      success: false, 
      user: null, 
      error: error.message 
    }
  }
}

// ==================== LOGOUT ====================

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    console.log('✅ Logout successful')
    return { 
      success: true, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Logout error:', error.message)
    return { 
      success: false, 
      error: error.message 
    }
  }
}

// ==================== GET CURRENT USER ====================

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return user
  } catch (error) {
    console.error('❌ Get user error:', error.message)
    return null
  }
}

// ==================== GET SESSION ====================

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    return session
  } catch (error) {
    console.error('❌ Get session error:', error.message)
    return null
  }
}

// ==================== CREATE USER PROFILE ====================

export async function createUserProfile(userId, fullname, email) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          fullname: fullname.trim(),
          email: email.trim(),
          created_at: new Date().toISOString(),
          attempts: 0,
          best_score: 0
        }
      ])
      .select()

    if (error) throw error

    console.log('✅ Profile created for:', fullname)
    return { 
      success: true, 
      data, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Create profile error:', error.message)
    return { 
      success: false, 
      data: null, 
      error: error.message 
    }
  }
}

// ==================== GET USER PROFILE ====================

export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return { 
      success: true, 
      data, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Get profile error:', error.message)
    return { 
      success: false, 
      data: null, 
      error: error.message 
    }
  }
}

// ==================== UPDATE USER PROFILE ====================

export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()

    if (error) throw error

    console.log('✅ Profile updated')
    return { 
      success: true, 
      data, 
      error: null 
    }
  } catch (error) {
    console.error('❌ Update profile error:', error.message)
    return { 
      success: false, 
      data: null, 
      error: error.message 
    }
  }
}

// ==================== LISTEN TO AUTH CHANGES ====================

export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session)
    }
  )

  return subscription
}
