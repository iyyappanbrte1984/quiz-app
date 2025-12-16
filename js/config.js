// js/config.js - Supabase Configuration & Initialization
// ========================================================

// Get Supabase credentials from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
  "https://qqmbquelvcupzngbowvs.supabase.co"

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbWJxdWVsdmN1cHpuZ2Jvd3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODM3NzgsImV4cCI6MjA4MTM1OTc3OH0.SumVLhNoXsxGaz711E2G6hq6vlxGXOLA2AhUqBdiTE"

// Initialize Supabase Client
export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

// Export config for use in other modules
export const config = {
  supabase: {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || "MCQ Quiz App",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "5000")
  },
  features: {
    demoMode: import.meta.env.VITE_ENABLE_DEMO_MODE === "true",
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    quizTimeLimit: parseInt(import.meta.env.VITE_QUIZ_TIME_LIMIT || "3600")
  }
}

// Make Supabase client available globally
window.supabaseClient = supabase
window.appConfig = config

// Validate connection
export async function validateConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error("❌ Supabase connection error:", error.message)
    return false
  }
}

// Log configuration (non-sensitive)
console.log("📋 Quiz App Configuration:")
console.log(`   App: ${config.app.name} v${config.app.version}`)
console.log(`   Demo Mode: ${config.features.demoMode}`)
console.log(`   API Timeout: ${config.app.apiTimeout}ms`)
