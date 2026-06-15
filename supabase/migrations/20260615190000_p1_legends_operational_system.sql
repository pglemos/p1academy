create extension if not exists pgcrypto;

create table if not exists public.p1_admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null default 'admin' check (role in ('owner', 'admin', 'race_control')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists p1_admin_users_email_key on public.p1_admin_users (lower(email));

create or replace function public.p1_touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.p1_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.p1_admin_users admin_user
    where admin_user.is_active = true
      and lower(admin_user.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.p1_is_admin() from public;
grant execute on function public.p1_is_admin() to authenticated;
grant execute on function public.p1_is_admin() to service_role;

create table if not exists public.p1_championships (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  edition text not null,
  season text not null,
  status text not null default 'draft',
  venue text,
  address text,
  organizer text,
  whatsapp text,
  whatsapp_number text,
  format text,
  ballast text,
  heat_duration text,
  super_final_duration text,
  seats text,
  valid_results text,
  expected_stages text,
  rules_pdf text,
  calendar_pdf text,
  version text,
  version_date date,
  is_published boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.p1_stages (
  id uuid primary key default gen_random_uuid(),
  championship_id uuid not null references public.p1_championships(id) on delete cascade,
  stage_code text not null,
  race_number integer not null,
  title text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  weekday text not null,
  month_name text not null,
  max_seats integer not null default 22,
  status text not null default 'scheduled' check (status in ('scheduled', 'open', 'full', 'completed', 'cancelled')),
  sort_order integer not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (championship_id, stage_code)
);

create index if not exists p1_stages_championship_sort_idx on public.p1_stages (championship_id, sort_order);
create index if not exists p1_stages_date_idx on public.p1_stages (scheduled_date, scheduled_time);

create table if not exists public.p1_registrations (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique default ('P1-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  championship_id uuid not null references public.p1_championships(id) on delete restrict,
  full_name text not null,
  cpf text not null,
  birth_date text not null,
  whatsapp text not null,
  email text not null,
  city text not null,
  age integer not null check (age between 8 and 90),
  weight numeric(6,2) not null check (weight between 30 and 180),
  experience text,
  current_level text,
  availability text not null,
  intended_heats text,
  ranking_interest text,
  preferred_race_windows text,
  equipment text,
  equipment_details text,
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  medical_restrictions text,
  allergies text,
  medications text,
  goals text,
  notes text,
  accepted_contact boolean not null default false,
  accepted_rules boolean not null default false,
  accepted_responsibility boolean not null default false,
  accepted_image boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'waitlist')),
  admin_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists p1_registrations_championship_status_idx on public.p1_registrations (championship_id, status, created_at desc);
create index if not exists p1_registrations_email_idx on public.p1_registrations (lower(email));

create table if not exists public.p1_drivers (
  id uuid primary key default gen_random_uuid(),
  championship_id uuid not null references public.p1_championships(id) on delete cascade,
  registration_id uuid unique references public.p1_registrations(id) on delete set null,
  full_name text not null,
  display_name text not null,
  email text,
  whatsapp text,
  city text,
  current_level text,
  weight numeric(6,2),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  public_profile boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (championship_id, display_name)
);

create index if not exists p1_drivers_championship_status_idx on public.p1_drivers (championship_id, status, display_name);

create table if not exists public.p1_heats (
  id uuid primary key default gen_random_uuid(),
  championship_id uuid not null references public.p1_championships(id) on delete cascade,
  stage_id uuid references public.p1_stages(id) on delete set null,
  title text not null,
  heat_date date not null,
  type text not null default 'regular' check (type in ('regular', 'super_final')),
  source text not null default 'manual' check (source in ('manual', 'live', 'import')),
  track_layout text,
  category text,
  is_published boolean not null default true,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists p1_heats_championship_date_idx on public.p1_heats (championship_id, heat_date desc, created_at desc);

create table if not exists public.p1_heat_results (
  id uuid primary key default gen_random_uuid(),
  heat_id uuid not null references public.p1_heats(id) on delete cascade,
  championship_id uuid not null references public.p1_championships(id) on delete cascade,
  driver_id uuid references public.p1_drivers(id) on delete set null,
  driver_name text not null,
  kart text,
  position integer,
  status text not null default 'ok' check (status in ('ok', 'dsq', 'no-time')),
  raw_ms integer,
  official_ms integer,
  gap_ms integer,
  score numeric(8,3) not null default 0,
  note text,
  source_position integer,
  best_lap_number text,
  total_laps text,
  average_speed_kmh text,
  second_best_lap_number text,
  second_best_time text,
  federation text,
  gap_to_leader text,
  gap_to_previous text,
  created_at timestamptz not null default now()
);

create index if not exists p1_heat_results_heat_idx on public.p1_heat_results (heat_id, position nulls last);
create index if not exists p1_heat_results_championship_score_idx on public.p1_heat_results (championship_id, status, score desc);

drop trigger if exists p1_admin_users_touch_updated_at on public.p1_admin_users;
create trigger p1_admin_users_touch_updated_at before update on public.p1_admin_users for each row execute function public.p1_touch_updated_at();
drop trigger if exists p1_championships_touch_updated_at on public.p1_championships;
create trigger p1_championships_touch_updated_at before update on public.p1_championships for each row execute function public.p1_touch_updated_at();
drop trigger if exists p1_stages_touch_updated_at on public.p1_stages;
create trigger p1_stages_touch_updated_at before update on public.p1_stages for each row execute function public.p1_touch_updated_at();
drop trigger if exists p1_registrations_touch_updated_at on public.p1_registrations;
create trigger p1_registrations_touch_updated_at before update on public.p1_registrations for each row execute function public.p1_touch_updated_at();
drop trigger if exists p1_drivers_touch_updated_at on public.p1_drivers;
create trigger p1_drivers_touch_updated_at before update on public.p1_drivers for each row execute function public.p1_touch_updated_at();
drop trigger if exists p1_heats_touch_updated_at on public.p1_heats;
create trigger p1_heats_touch_updated_at before update on public.p1_heats for each row execute function public.p1_touch_updated_at();

alter table public.p1_admin_users enable row level security;
alter table public.p1_championships enable row level security;
alter table public.p1_stages enable row level security;
alter table public.p1_registrations enable row level security;
alter table public.p1_drivers enable row level security;
alter table public.p1_heats enable row level security;
alter table public.p1_heat_results enable row level security;

drop policy if exists p1_admin_users_self_select on public.p1_admin_users;
create policy p1_admin_users_self_select on public.p1_admin_users
  for select to authenticated
  using (public.p1_is_admin() or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists p1_admin_users_admin_all on public.p1_admin_users;
create policy p1_admin_users_admin_all on public.p1_admin_users
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_championships_public_select on public.p1_championships;
create policy p1_championships_public_select on public.p1_championships
  for select to anon, authenticated
  using (is_published = true or public.p1_is_admin());

drop policy if exists p1_championships_admin_all on public.p1_championships;
create policy p1_championships_admin_all on public.p1_championships
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_stages_public_select on public.p1_stages;
create policy p1_stages_public_select on public.p1_stages
  for select to anon, authenticated
  using (is_published = true and exists (
    select 1 from public.p1_championships c
    where c.id = championship_id and c.is_published = true
  ) or public.p1_is_admin());

drop policy if exists p1_stages_admin_all on public.p1_stages;
create policy p1_stages_admin_all on public.p1_stages
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_registrations_admin_all on public.p1_registrations;
create policy p1_registrations_admin_all on public.p1_registrations
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_drivers_public_select on public.p1_drivers;
create policy p1_drivers_public_select on public.p1_drivers
  for select to anon, authenticated
  using (public_profile = true and status = 'active' or public.p1_is_admin());

drop policy if exists p1_drivers_admin_all on public.p1_drivers;
create policy p1_drivers_admin_all on public.p1_drivers
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_heats_public_select on public.p1_heats;
create policy p1_heats_public_select on public.p1_heats
  for select to anon, authenticated
  using (is_published = true or public.p1_is_admin());

drop policy if exists p1_heats_admin_all on public.p1_heats;
create policy p1_heats_admin_all on public.p1_heats
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

drop policy if exists p1_heat_results_public_select on public.p1_heat_results;
create policy p1_heat_results_public_select on public.p1_heat_results
  for select to anon, authenticated
  using (exists (
    select 1 from public.p1_heats h
    where h.id = heat_id and h.is_published = true
  ) or public.p1_is_admin());

drop policy if exists p1_heat_results_admin_all on public.p1_heat_results;
create policy p1_heat_results_admin_all on public.p1_heat_results
  for all to authenticated
  using (public.p1_is_admin())
  with check (public.p1_is_admin());

grant select on public.p1_championships, public.p1_stages, public.p1_drivers, public.p1_heats, public.p1_heat_results to anon, authenticated;
grant select, insert, update, delete on public.p1_admin_users, public.p1_championships, public.p1_stages, public.p1_registrations, public.p1_drivers, public.p1_heats, public.p1_heat_results to authenticated;
grant all on public.p1_admin_users, public.p1_championships, public.p1_stages, public.p1_registrations, public.p1_drivers, public.p1_heats, public.p1_heat_results to service_role;

create or replace view public.p1_public_standings
with (security_invoker = true)
as
with eligible as (
  select
    r.championship_id,
    coalesce(r.driver_id::text, lower(regexp_replace(r.driver_name, '\s+', ' ', 'g'))) as driver_key,
    r.driver_name,
    h.type,
    r.position,
    r.score,
    r.official_ms,
    h.heat_date,
    r.created_at
  from public.p1_heat_results r
  join public.p1_heats h on h.id = r.heat_id
  where h.is_published = true
    and r.status = 'ok'
    and r.score > 0
),
regular_ranked as (
  select
    *,
    row_number() over (
      partition by championship_id, driver_key
      order by score desc, official_ms asc nulls last, heat_date asc, created_at asc
    ) as score_rank
  from eligible
  where type = 'regular'
),
regular_totals as (
  select
    championship_id,
    driver_key,
    max(driver_name) as driver_name,
    round(sum(score) filter (where score_rank <= 10), 3) as regular_total,
    count(*) filter (where score_rank <= 10) as valid_regular_results,
    greatest(count(*) - 10, 0) as discarded_regular_results,
    count(*) filter (where position = 1) as wins
  from regular_ranked
  group by championship_id, driver_key
),
super_totals as (
  select
    championship_id,
    driver_key,
    max(driver_name) as driver_name,
    round(sum(score), 3) as super_final_total
  from eligible
  where type = 'super_final'
  group by championship_id, driver_key
),
combined as (
  select
    coalesce(r.championship_id, s.championship_id) as championship_id,
    coalesce(r.driver_key, s.driver_key) as driver_key,
    coalesce(r.driver_name, s.driver_name) as driver_name,
    coalesce(r.regular_total, 0)::numeric(8,3) as regular_total,
    coalesce(s.super_final_total, 0)::numeric(8,3) as super_final_total,
    (coalesce(r.regular_total, 0) + coalesce(s.super_final_total, 0))::numeric(8,3) as total,
    coalesce(r.valid_regular_results, 0) as valid_regular_results,
    coalesce(r.discarded_regular_results, 0) as discarded_regular_results,
    coalesce(r.wins, 0) as wins
  from regular_totals r
  full outer join super_totals s
    on s.championship_id = r.championship_id
   and s.driver_key = r.driver_key
)
select
  c.slug as championship_slug,
  combined.championship_id,
  combined.driver_key,
  combined.driver_name,
  dense_rank() over (
    partition by combined.championship_id
    order by combined.total desc, combined.wins desc, combined.regular_total desc, combined.driver_name asc
  ) as position,
  combined.total,
  combined.regular_total,
  combined.super_final_total,
  combined.valid_regular_results,
  combined.discarded_regular_results,
  combined.wins
from combined
join public.p1_championships c on c.id = combined.championship_id
where c.is_published = true;

grant select on public.p1_public_standings to anon, authenticated, service_role;

insert into public.p1_championships (
  slug, name, edition, season, status, venue, address, organizer, whatsapp, whatsapp_number,
  format, ballast, heat_duration, super_final_duration, seats, valid_results, expected_stages,
  rules_pdf, calendar_pdf, version, version_date, is_published, settings
) values (
  'legends-2026',
  'Legends Kart Series',
  '1ª Edição Oficial',
  '2026',
  'Calendário oficial publicado',
  'Kartódromo Internacional de Betim',
  'Av. Adutora Várzea das Flores, 477 - Itacolomi, Betim - MG, 32672-586',
  'André Felisberto',
  '(21) 99596-0077',
  '5521995960077',
  'Rental kart, categoria única, tomada de tempo',
  '100 kg',
  '20 minutos',
  '10 minutos',
  '22 pilotos por bateria',
  '10 melhores corridas válidas',
  '42 corridas oficiais entre julho e dezembro de 2026',
  '/regulamentos/regulamento-legends-kart-series-2026.pdf',
  '/regulamentos/calendario-legends-kart-series-2026.pdf',
  'Regulamento Geral - Versão 3.0',
  date '2026-05-16',
  true,
  jsonb_build_object(
    'totalRaces', 42,
    'months', 'Julho a dezembro',
    'firstRace', '01/07/2026',
    'finalRace', '19/12/2026',
    'weekdayWindows', 'Quartas 20:30 e 21:05',
    'saturdayWindow', 'Sábados 09:15',
    'maxValidRegularResults', 10,
    'regularBaseScore', 10,
    'superFinalBaseScore', 5
  )
)
on conflict (slug) do update set
  name = excluded.name,
  edition = excluded.edition,
  season = excluded.season,
  status = excluded.status,
  venue = excluded.venue,
  address = excluded.address,
  organizer = excluded.organizer,
  whatsapp = excluded.whatsapp,
  whatsapp_number = excluded.whatsapp_number,
  format = excluded.format,
  ballast = excluded.ballast,
  heat_duration = excluded.heat_duration,
  super_final_duration = excluded.super_final_duration,
  seats = excluded.seats,
  valid_results = excluded.valid_results,
  expected_stages = excluded.expected_stages,
  rules_pdf = excluded.rules_pdf,
  calendar_pdf = excluded.calendar_pdf,
  version = excluded.version,
  version_date = excluded.version_date,
  is_published = excluded.is_published,
  settings = excluded.settings,
  updated_at = now();

with championship as (
  select id from public.p1_championships where slug = 'legends-2026'
),
stage_seed(stage_code, race_number, title, scheduled_date, scheduled_time, weekday, month_name, sort_order) as (
  values
  ('LH-01', 1, 'Bateria 01', date '2026-07-01', time '20:30', 'Quarta', 'Julho', 1),
  ('LH-02', 2, 'Bateria 02', date '2026-07-01', time '21:05', 'Quarta', 'Julho', 2),
  ('LH-03', 3, 'Bateria 03', date '2026-07-04', time '09:15', 'Sábado', 'Julho', 3),
  ('LH-04', 5, 'Bateria 05', date '2026-07-15', time '20:30', 'Quarta', 'Julho', 4),
  ('LH-05', 6, 'Bateria 06', date '2026-07-15', time '21:05', 'Quarta', 'Julho', 5),
  ('LH-06', 7, 'Bateria 07', date '2026-07-18', time '09:15', 'Sábado', 'Julho', 6),
  ('LH-07', 8, 'Bateria 08', date '2026-07-29', time '20:30', 'Quarta', 'Julho', 7),
  ('LH-08', 9, 'Bateria 09', date '2026-07-29', time '21:05', 'Quarta', 'Julho', 8),
  ('LH-09', 1, 'Bateria 01', date '2026-08-01', time '09:15', 'Sábado', 'Agosto', 9),
  ('LH-10', 2, 'Bateria 02', date '2026-08-12', time '20:30', 'Quarta', 'Agosto', 10),
  ('LH-11', 3, 'Bateria 03', date '2026-08-12', time '21:05', 'Quarta', 'Agosto', 11),
  ('LH-12', 5, 'Bateria 05', date '2026-08-15', time '09:15', 'Sábado', 'Agosto', 12),
  ('LH-13', 6, 'Bateria 06', date '2026-08-26', time '20:30', 'Quarta', 'Agosto', 13),
  ('LH-14', 7, 'Bateria 07', date '2026-08-26', time '21:05', 'Quarta', 'Agosto', 14),
  ('LH-15', 8, 'Bateria 08', date '2026-08-29', time '09:15', 'Sábado', 'Agosto', 15),
  ('LH-16', 1, 'Bateria 01', date '2026-09-02', time '20:30', 'Quarta', 'Setembro', 16),
  ('LH-17', 2, 'Bateria 02', date '2026-09-02', time '21:05', 'Quarta', 'Setembro', 17),
  ('LH-18', 3, 'Bateria 03', date '2026-09-05', time '09:15', 'Sábado', 'Setembro', 18),
  ('LH-19', 5, 'Bateria 05', date '2026-09-16', time '20:30', 'Quarta', 'Setembro', 19),
  ('LH-20', 6, 'Bateria 06', date '2026-09-16', time '21:05', 'Quarta', 'Setembro', 20),
  ('LH-21', 7, 'Bateria 07', date '2026-09-19', time '09:15', 'Sábado', 'Setembro', 21),
  ('LH-22', 8, 'Bateria 08', date '2026-09-30', time '20:30', 'Quarta', 'Setembro', 22),
  ('LH-23', 9, 'Bateria 09', date '2026-09-30', time '21:05', 'Quarta', 'Setembro', 23),
  ('LH-24', 1, 'Bateria 01', date '2026-10-03', time '09:15', 'Sábado', 'Outubro', 24),
  ('LH-25', 2, 'Bateria 02', date '2026-10-14', time '20:30', 'Quarta', 'Outubro', 25),
  ('LH-26', 3, 'Bateria 03', date '2026-10-14', time '21:05', 'Quarta', 'Outubro', 26),
  ('LH-27', 5, 'Bateria 05', date '2026-10-17', time '09:15', 'Sábado', 'Outubro', 27),
  ('LH-28', 6, 'Bateria 06', date '2026-10-28', time '20:30', 'Quarta', 'Outubro', 28),
  ('LH-29', 7, 'Bateria 07', date '2026-10-28', time '21:05', 'Quarta', 'Outubro', 29),
  ('LH-30', 8, 'Bateria 08', date '2026-10-31', time '09:15', 'Sábado', 'Outubro', 30),
  ('LH-31', 1, 'Bateria 01', date '2026-11-04', time '20:30', 'Quarta', 'Novembro', 31),
  ('LH-32', 2, 'Bateria 02', date '2026-11-04', time '21:05', 'Quarta', 'Novembro', 32),
  ('LH-33', 3, 'Bateria 03', date '2026-11-07', time '09:15', 'Sábado', 'Novembro', 33),
  ('LH-34', 5, 'Bateria 05', date '2026-11-18', time '20:30', 'Quarta', 'Novembro', 34),
  ('LH-35', 6, 'Bateria 06', date '2026-11-18', time '21:05', 'Quarta', 'Novembro', 35),
  ('LH-36', 7, 'Bateria 07', date '2026-11-21', time '09:15', 'Sábado', 'Novembro', 36),
  ('LH-37', 1, 'Bateria 01', date '2026-12-02', time '20:30', 'Quarta', 'Dezembro', 37),
  ('LH-38', 2, 'Bateria 02', date '2026-12-02', time '21:05', 'Quarta', 'Dezembro', 38),
  ('LH-39', 3, 'Bateria 03', date '2026-12-05', time '09:15', 'Sábado', 'Dezembro', 39),
  ('LH-40', 5, 'Bateria 05', date '2026-12-16', time '20:30', 'Quarta', 'Dezembro', 40),
  ('LH-41', 6, 'Bateria 06', date '2026-12-16', time '21:05', 'Quarta', 'Dezembro', 41),
  ('LH-42', 7, 'Bateria 07', date '2026-12-19', time '09:15', 'Sábado', 'Dezembro', 42)
)
insert into public.p1_stages (
  championship_id, stage_code, race_number, title, scheduled_date, scheduled_time, weekday, month_name, sort_order, max_seats, status, is_published
)
select
  championship.id,
  stage_seed.stage_code,
  stage_seed.race_number,
  stage_seed.title,
  stage_seed.scheduled_date,
  stage_seed.scheduled_time,
  stage_seed.weekday,
  stage_seed.month_name,
  stage_seed.sort_order,
  22,
  'scheduled',
  true
from championship
cross join stage_seed
on conflict (championship_id, stage_code) do update set
  race_number = excluded.race_number,
  title = excluded.title,
  scheduled_date = excluded.scheduled_date,
  scheduled_time = excluded.scheduled_time,
  weekday = excluded.weekday,
  month_name = excluded.month_name,
  sort_order = excluded.sort_order,
  max_seats = excluded.max_seats,
  status = excluded.status,
  is_published = excluded.is_published,
  updated_at = now();
