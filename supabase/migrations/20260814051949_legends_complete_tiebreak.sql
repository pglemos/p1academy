create or replace view public.p1_public_standings
with (security_invoker = true)
as
with eligible as (
  select
    r.championship_id,
    coalesce(r.driver_id::text, lower(regexp_replace(r.driver_name, '\\s+', ' ', 'g'))) as driver_key,
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
    ) as score_rank,
    count(*) filter (where position = 1) over (
      partition by championship_id, driver_key
    ) as win_count
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
    count(*) filter (where position = 1) as wins,
    array_cat(
      coalesce(
        array_agg(score order by score desc, official_ms asc nulls last, heat_date asc, created_at asc)
          filter (where score_rank <= 10 and score_rank > win_count),
        array[]::numeric[]
      ),
      array_fill(
        0::numeric,
        array[(10 - count(*) filter (where score_rank <= 10 and score_rank > win_count))::integer]
      )
    ) as tiebreak_scores
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
    coalesce(r.wins, 0) as wins,
    coalesce(r.tiebreak_scores, array_fill(0::numeric, array[10])) as tiebreak_scores
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
    order by combined.total desc, combined.wins desc, combined.tiebreak_scores desc, combined.driver_name asc
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
