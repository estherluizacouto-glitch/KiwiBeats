import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gevwfciirevgbrzklrpp.supabase.co',
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldndmY2lpcmV2Z2JyemtscnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTg0NTgsImV4cCI6MjA4NjIzNDQ1OH0.auWkhHSUy9mzk-2U0AYExgzf90MQbZ6PPd98VhJMN4w'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
