-- Keep the published Legends heats in one chronological sequence.
-- The source reports identify the heats by the order of the full season,
-- rather than restarting the number at each date.
with renames(id, title) as (
  values
    ('cbd0914f-9261-4ba0-b3bd-0f3aa370e162'::uuid, 'Bateria 01 - Legends I'),
    ('d087c944-b891-4ab4-99f4-f6f5b8c95927'::uuid, 'Bateria 02 - Legends II'),
    ('2aba8b15-4f50-45b5-8ee2-524827b479a8'::uuid, 'Bateria 03 - Legends III'),
    ('e96fcaae-ea85-4a7d-a196-efbd9299b0a1'::uuid, 'Bateria 04 - Legends IV'),
    ('a7cd03c5-fbb8-4b14-a36e-1491a3e44591'::uuid, 'Bateria 05 - Legends V'),
    ('53293964-ae2b-4a89-aca6-959cd783490f'::uuid, 'Bateria 06 - Legends VI'),
    ('8ffaecf4-07d4-4db5-9054-fe1ee3de42f1'::uuid, 'Bateria 07 - Legends VII'),
    ('02aaf35c-f030-4f83-ba58-8c7fe50646cc'::uuid, 'Bateria 08 - Legends VIII'),
    ('51f3f936-77cc-4e57-92e3-83d59036f55f'::uuid, 'Bateria 09 - Legends IX'),
    ('6628ca0f-0820-4967-a800-9c0dc513d8e0'::uuid, 'Bateria 10 - Legends X'),
    ('d6a960c8-8916-4e80-89d4-21754c3e0a12'::uuid, 'Bateria 11 - Legends XI'),
    ('19c16f0b-d072-4207-b7b9-4c9554d65df6'::uuid, 'Bateria 12 - Legends XII'),
    ('4d918214-0abf-4e8f-9e2c-f3b9e6b0c177'::uuid, 'Bateria 13 - Legends XIII'),
    ('43750a36-b2d2-4cdd-9872-d763ab4c2c88'::uuid, 'Bateria 14 - Legends XIV'),
    ('c86680ff-7052-4f3c-9e9f-17482e87db1d'::uuid, 'Bateria 15 - Legends XV'),
    ('e62104d8-1e8d-4ba0-9c7e-633b6ab9e71e'::uuid, 'Bateria 16 - Legends XVI'),
    ('28fea6f5-7935-4dec-9dec-803f391d0e8e'::uuid, 'Bateria 17 - Legends XVII'),
    ('47ebc64f-2ff2-47b9-afc2-6f0ab59cce06'::uuid, 'Bateria 18 - Legends XVIII')
)
update public.p1_heats as heat
set
  title = renames.title,
  raw_payload = jsonb_set(coalesce(heat.raw_payload, '{}'::jsonb), '{title}', to_jsonb(renames.title), true)
from renames
where heat.id = renames.id;
