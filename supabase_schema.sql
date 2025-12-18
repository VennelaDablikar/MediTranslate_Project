-- Create a table for public profiles using the auth.users table
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

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create a table for storing scan history (prescriptions)
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  patient_name text,
  image_url text,
  results jsonb, -- Stores the full analysis result
  created_at timestamptz default now()
);

-- Enable RLS for scans
alter table public.scans enable row level security;

-- Create policies for scans
create policy "Users can view their own scans."
  on public.scans for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own scans."
  on public.scans for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup and automatically create a profile
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

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
