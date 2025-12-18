# Backend Setup Guide

This guide provides step-by-step instructions to set up, configure, and run the MediTranslate backend securely.

## Prerequisites

- **Python 3.10+**
- **pip** (Python package manager)
- **Supabase Account** (for Auth & Database)
- **Google Cloud Account** (for Gemini AI)

## 1. Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## 2. Environment Configuration

The backend relies on several environment variables. These are managed in the root `.env.local` file (which is symlinked or copied to `.env`).

**Required Variables (`.env.local`):**

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Connection (from Supabase -> Settings -> Database -> Connection String)
POSTGRES_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Google AI (Gemini)
GOOGLE_API_KEY=your_google_ai_studio_key
OCR_ENGINE=gemini
PREFERRED_OCR=gemini
```

> **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is critical for administrative tasks like deleting user accounts. Never expose this key on the frontend.

## 3. Database Setup (Supabase)

Go to the SQL Editor in your Supabase dashboard and run the following schema to set up the necessary tables and security policies.

### Schema (`supabase_schema.sql`)

```sql
-- 1. Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  mobile text,
  gender text,
  dob date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update using ( auth.uid() = id );

-- 2. Create Scans Table (for history)
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  patient_name text,
  image_url text, -- Link to storage bucket image
  results jsonb,  -- Full analysis JSON
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.scans enable row level security;

-- Policies
create policy "Users can view their own scans."
  on public.scans for select using ( auth.uid() = user_id );

create policy "Users can insert their own scans."
  on public.scans for insert with check ( auth.uid() = user_id );

-- 3. Auto-Create Profile Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, mobile, gender, dob)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'mobile',
    new.raw_user_meta_data->>'gender',
    (new.raw_user_meta_data->>'dob')::date
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Storage Setup
1.  Go to **Storage** in Supabase.
2.  Create a new public bucket named `scans`.
3.  Add a policy to allow authenticated users to upload images.

## 4. Running the Server

You can run the backend directly using `uvicorn` or via the project startup script.

**Using Startup Script (Recommended):**
```bash
# From project root
./start.sh
```

**Manual Start:**
```bash
# From backend directory
uvicorn app.main:app --reload --port 8000
```

## 5. API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
