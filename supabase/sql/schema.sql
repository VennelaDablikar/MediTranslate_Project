-- Enable extensions
create extension if not exists "uuid-ossp";

-- Medical terms dictionary
create table if not exists medical_terms (
  id uuid primary key default uuid_generate_v4(),
  english_term text not null,
  hindi text,
  telugu text,
  tamil text,
  explanation text,
  category text
);

-- Medicines database
create table if not exists medicines (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  variants text[],
  purpose text,
  category text
);

-- Dosage rules
create table if not exists dosage_rules (
  id uuid primary key default uuid_generate_v4(),
  pattern text not null,
  meaning text not null
);

-- Abbreviations
create table if not exists abbreviations (
  id uuid primary key default uuid_generate_v4(),
  short text not null,
  expanded text not null
);

-- User history (optional)
create table if not exists user_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  image_url text,
  extracted_text text,
  translated_result text,
  created_at timestamp default now()
);
