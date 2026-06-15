drop policy if exists p1_championships_public_select on public.p1_championships;
create policy p1_championships_public_select on public.p1_championships
  for select to anon, authenticated
  using (
    is_published = true
    or ((select auth.role()) = 'authenticated' and public.p1_is_admin())
  );

drop policy if exists p1_stages_public_select on public.p1_stages;
create policy p1_stages_public_select on public.p1_stages
  for select to anon, authenticated
  using (
    (
      is_published = true
      and exists (
        select 1 from public.p1_championships c
        where c.id = championship_id and c.is_published = true
      )
    )
    or ((select auth.role()) = 'authenticated' and public.p1_is_admin())
  );

drop policy if exists p1_drivers_public_select on public.p1_drivers;
create policy p1_drivers_public_select on public.p1_drivers
  for select to anon, authenticated
  using (
    (public_profile = true and status = 'active')
    or ((select auth.role()) = 'authenticated' and public.p1_is_admin())
  );

drop policy if exists p1_heats_public_select on public.p1_heats;
create policy p1_heats_public_select on public.p1_heats
  for select to anon, authenticated
  using (
    is_published = true
    or ((select auth.role()) = 'authenticated' and public.p1_is_admin())
  );

drop policy if exists p1_heat_results_public_select on public.p1_heat_results;
create policy p1_heat_results_public_select on public.p1_heat_results
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.p1_heats h
      where h.id = heat_id and h.is_published = true
    )
    or ((select auth.role()) = 'authenticated' and public.p1_is_admin())
  );

notify pgrst, 'reload schema';
