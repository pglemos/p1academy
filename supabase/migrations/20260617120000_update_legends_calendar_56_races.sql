with championship as (
  select id
  from public.p1_championships
  where slug = 'legends-2026'
),
updated_championship as (
  update public.p1_championships
  set
    expected_stages = '56 corridas oficiais entre julho e dezembro de 2026',
    version = 'Calendário Oficial - Versão 4.0',
    version_date = date '2026-06-17',
    settings = coalesce(settings, '{}'::jsonb) || jsonb_build_object(
      'totalRaces', 56,
      'months', 'Julho a dezembro',
      'firstRace', '01/07/2026',
      'finalRace', '19/12/2026',
      'weekdayWindows', 'Quartas 20:30 e 21:05',
      'saturdayWindow', 'Sábados 09:00 e 09:30'
    ),
    updated_at = now()
  where id in (select id from championship)
  returning id
),
stage_seed(stage_code, race_number, title, scheduled_date, scheduled_time, weekday, month_name, sort_order) as (
  values
    ('LH-01', 1, 'Bateria 01', date '2026-07-01', time '20:30', 'Quarta', 'Julho', 1),
    ('LH-02', 2, 'Bateria 02', date '2026-07-01', time '21:05', 'Quarta', 'Julho', 2),
    ('LH-03', 3, 'Bateria 03', date '2026-07-04', time '09:00', 'Sábado', 'Julho', 3),
    ('LH-04', 4, 'Bateria 04', date '2026-07-04', time '09:30', 'Sábado', 'Julho', 4),
    ('LH-05', 5, 'Bateria 05', date '2026-07-15', time '20:30', 'Quarta', 'Julho', 5),
    ('LH-06', 6, 'Bateria 06', date '2026-07-15', time '21:05', 'Quarta', 'Julho', 6),
    ('LH-07', 7, 'Bateria 07', date '2026-07-18', time '09:00', 'Sábado', 'Julho', 7),
    ('LH-08', 8, 'Bateria 08', date '2026-07-18', time '09:30', 'Sábado', 'Julho', 8),
    ('LH-09', 9, 'Bateria 09', date '2026-07-29', time '20:30', 'Quarta', 'Julho', 9),
    ('LH-10', 10, 'Bateria 10', date '2026-07-29', time '20:30', 'Quarta', 'Julho', 10),
    ('LH-11', 1, 'Bateria 01', date '2026-08-01', time '09:00', 'Sábado', 'Agosto', 11),
    ('LH-12', 2, 'Bateria 02', date '2026-08-01', time '09:30', 'Sábado', 'Agosto', 12),
    ('LH-13', 3, 'Bateria 03', date '2026-08-12', time '20:30', 'Quarta', 'Agosto', 13),
    ('LH-14', 4, 'Bateria 04', date '2026-08-12', time '21:05', 'Quarta', 'Agosto', 14),
    ('LH-15', 5, 'Bateria 05', date '2026-08-15', time '09:00', 'Sábado', 'Agosto', 15),
    ('LH-16', 6, 'Bateria 06', date '2026-08-15', time '09:30', 'Sábado', 'Agosto', 16),
    ('LH-17', 7, 'Bateria 07', date '2026-08-26', time '20:30', 'Quarta', 'Agosto', 17),
    ('LH-18', 8, 'Bateria 08', date '2026-08-26', time '21:05', 'Quarta', 'Agosto', 18),
    ('LH-19', 9, 'Bateria 09', date '2026-08-29', time '09:00', 'Sábado', 'Agosto', 19),
    ('LH-20', 10, 'Bateria 10', date '2026-08-29', time '09:30', 'Sábado', 'Agosto', 20),
    ('LH-21', 1, 'Bateria 01', date '2026-09-02', time '20:30', 'Quarta', 'Setembro', 21),
    ('LH-22', 2, 'Bateria 02', date '2026-09-02', time '21:05', 'Quarta', 'Setembro', 22),
    ('LH-23', 3, 'Bateria 03', date '2026-09-05', time '09:00', 'Sábado', 'Setembro', 23),
    ('LH-24', 4, 'Bateria 04', date '2026-09-05', time '09:30', 'Sábado', 'Setembro', 24),
    ('LH-25', 5, 'Bateria 05', date '2026-09-16', time '20:30', 'Quarta', 'Setembro', 25),
    ('LH-26', 6, 'Bateria 06', date '2026-09-16', time '21:05', 'Quarta', 'Setembro', 26),
    ('LH-27', 7, 'Bateria 07', date '2026-09-19', time '09:00', 'Sábado', 'Setembro', 27),
    ('LH-28', 8, 'Bateria 08', date '2026-09-19', time '09:30', 'Sábado', 'Setembro', 28),
    ('LH-29', 9, 'Bateria 09', date '2026-09-30', time '20:30', 'Quarta', 'Setembro', 29),
    ('LH-30', 10, 'Bateria 10', date '2026-09-30', time '21:05', 'Quarta', 'Setembro', 30),
    ('LH-31', 1, 'Bateria 01', date '2026-10-03', time '09:00', 'Sábado', 'Outubro', 31),
    ('LH-32', 2, 'Bateria 02', date '2026-10-03', time '09:30', 'Sábado', 'Outubro', 32),
    ('LH-33', 3, 'Bateria 03', date '2026-10-14', time '20:30', 'Quarta', 'Outubro', 33),
    ('LH-34', 4, 'Bateria 04', date '2026-10-14', time '21:05', 'Quarta', 'Outubro', 34),
    ('LH-35', 5, 'Bateria 05', date '2026-10-17', time '09:00', 'Sábado', 'Outubro', 35),
    ('LH-36', 6, 'Bateria 06', date '2026-10-17', time '09:30', 'Sábado', 'Outubro', 36),
    ('LH-37', 7, 'Bateria 07', date '2026-10-28', time '20:30', 'Quarta', 'Outubro', 37),
    ('LH-38', 8, 'Bateria 08', date '2026-10-28', time '21:05', 'Quarta', 'Outubro', 38),
    ('LH-39', 9, 'Bateria 09', date '2026-10-31', time '09:00', 'Sábado', 'Outubro', 39),
    ('LH-40', 10, 'Bateria 10', date '2026-10-31', time '09:30', 'Sábado', 'Outubro', 40),
    ('LH-41', 1, 'Bateria 01', date '2026-11-04', time '20:30', 'Quarta', 'Novembro', 41),
    ('LH-42', 2, 'Bateria 02', date '2026-11-04', time '21:05', 'Quarta', 'Novembro', 42),
    ('LH-43', 3, 'Bateria 03', date '2026-11-07', time '09:00', 'Sábado', 'Novembro', 43),
    ('LH-44', 4, 'Bateria 04', date '2026-11-07', time '09:30', 'Sábado', 'Novembro', 44),
    ('LH-45', 5, 'Bateria 05', date '2026-11-18', time '20:30', 'Quarta', 'Novembro', 45),
    ('LH-46', 6, 'Bateria 06', date '2026-11-18', time '21:05', 'Quarta', 'Novembro', 46),
    ('LH-47', 7, 'Bateria 07', date '2026-11-21', time '09:00', 'Sábado', 'Novembro', 47),
    ('LH-48', 8, 'Bateria 08', date '2026-11-21', time '09:30', 'Sábado', 'Novembro', 48),
    ('LH-49', 1, 'Bateria 01', date '2026-12-02', time '20:30', 'Quarta', 'Dezembro', 49),
    ('LH-50', 2, 'Bateria 02', date '2026-12-02', time '21:05', 'Quarta', 'Dezembro', 50),
    ('LH-51', 3, 'Bateria 03', date '2026-12-05', time '09:00', 'Sábado', 'Dezembro', 51),
    ('LH-52', 4, 'Bateria 04', date '2026-12-05', time '09:30', 'Sábado', 'Dezembro', 52),
    ('LH-53', 5, 'Bateria 05', date '2026-12-16', time '20:30', 'Quarta', 'Dezembro', 53),
    ('LH-54', 6, 'Bateria 06', date '2026-12-16', time '21:05', 'Quarta', 'Dezembro', 54),
    ('LH-55', 7, 'Bateria 07', date '2026-12-19', time '09:00', 'Sábado', 'Dezembro', 55),
    ('LH-56', 8, 'Bateria 08', date '2026-12-19', time '09:30', 'Sábado', 'Dezembro', 56)
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
