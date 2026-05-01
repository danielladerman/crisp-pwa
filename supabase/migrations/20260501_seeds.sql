-- Seeds: where writing actually lives. A seed is created either by a
-- writing-category drill or by free-writing in the Seeds tab. Status
-- tracks the seed's journey from raw idea to shipped essay.

create table seeds (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade not null,
  body            text not null,
  source_drill_id text,
  category        text,
  status          text not null default 'seed'
                  check (status in ('seed', 'drafting', 'shipped', 'killed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table seeds enable row level security;

create policy "users own their seeds"
  on seeds for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index seeds_user_updated_idx on seeds (user_id, updated_at desc);

create or replace function seeds_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger seeds_set_updated_at
  before update on seeds
  for each row execute function seeds_set_updated_at();
