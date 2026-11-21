-- The leaderboard on claudopus.ai: its own Supabase project. Only people who joined from Claudopus's Stats are here.
-- The table sits in a schema the API does not serve; the website and the mod reach it only through the lb_* functions below,
-- with the project's publishable key. Joining returns a secret that only that person's Claudopus keeps: it sends their figures
-- and takes them off the board. Only its hash is stored.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists leaderboard;
revoke all on schema leaderboard from public, anon, authenticated;

create table if not exists leaderboard.people (
  name text primary key check (name ~ '^[A-Za-z0-9_-]{3,20}$'),
  key text not null unique,
  token_hash text not null unique,
  is_public boolean not null default false,
  timeline_public boolean not null default false,
  stats jsonb not null default '{}'::jsonb,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table leaderboard.people add column if not exists timeline_public boolean not null default false;
alter table leaderboard.people enable row level security;
revoke all on leaderboard.people from public, anon, authenticated;

-- A number someone sent, or 0: what a client sends is never trusted to be one, so a bad value can't break the board for everyone
create or replace function leaderboard.num(v jsonb) returns numeric language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(v) = 'number' and (v #>> '{}')::numeric between 0 and 1e18 then (v #>> '{}')::numeric else 0 end
$$;

-- One range's headline figures, as the board shows them
create or replace function leaderboard.f(s jsonb) returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'work', leaderboard.num(s->'work'), 'clock', leaderboard.num(s->'clock'),
    'tokens', leaderboard.num(s->'tokens'), 'input', leaderboard.num(s->'input'),
    'write', leaderboard.num(s->'write'), 'read', leaderboard.num(s->'read'),
    'output', leaderboard.num(s->'output'), 'cost', leaderboard.num(s->'cost'),
    'tasks', leaderboard.num(s->'tasks'), 'messages', leaderboard.num(s->'messages'))
$$;

-- A range's figures for one person, empty once out of date: a today not sent within 26 hours is no longer today's
create or replace function leaderboard.range_of(p leaderboard.people, r text) returns jsonb language sql stable set search_path = '' as $$
  select case
    when r = 'today' and p.updated_at < now() - interval '26 hours' then '{}'::jsonb
    when r = 'd7' and p.updated_at < now() - interval '7 days' then '{}'::jsonb
    when r = 'd30' and p.updated_at < now() - interval '30 days' then '{}'::jsonb
    else coalesce(p.stats->r, '{}'::jsonb) end
$$;

-- The model that used the most tokens in a range, by its id
create or replace function leaderboard.top_model(s jsonb) returns text language sql immutable set search_path = '' as $$
  select left(m->>0, 60) from jsonb_array_elements(case when jsonb_typeof(s->'models') = 'array' then s->'models' else '[]'::jsonb end) as e(m)
  where jsonb_typeof(m) = 'array' and jsonb_typeof(m->0) = 'string' order by leaderboard.num(m->1) desc limit 1
$$;

create or replace function leaderboard.score(s jsonb, sort text) returns numeric language sql immutable set search_path = '' as $$
  select case sort
    when 'tokens' then leaderboard.num(s->'tokens')
    when 'clock' then leaderboard.num(s->'clock')
    when 'cost' then leaderboard.num(s->'cost')
    when 'efficiency' then case when leaderboard.num(s->'clock') > 0 then leaderboard.num(s->'work') / (s->>'clock')::numeric else 0 end
    else leaderboard.num(s->'work') end
$$;

-- Only the four ranges are kept, and no more than 64 KB of them
create or replace function leaderboard.clean(stats jsonb) returns jsonb language plpgsql immutable set search_path = '' as $$
begin
  if jsonb_typeof(stats) is distinct from 'object' or pg_column_size(stats) > 65536 then
    raise exception 'bad stats' using errcode = '22023';
  end if;
  return jsonb_strip_nulls(jsonb_build_object('today', stats->'today', 'd7', stats->'d7', 'd30', stats->'d30', 'all', stats->'all', 'timeline', stats->'timeline'));
end $$;

-- Join with a username nobody has in any letter case; returns the secret
create or replace function public.lb_join(p_name text, p_public boolean default false, p_stats jsonb default '{}'::jsonb) returns text
language plpgsql security definer set search_path = '' as $$
declare t text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  if p_name is null or p_name !~ '^[A-Za-z0-9_-]{3,20}$' then raise exception 'bad name' using errcode = '22023'; end if;
  insert into leaderboard.people(name, key, token_hash, is_public, stats)
    values (p_name, lower(p_name), encode(extensions.digest(t, 'sha256'), 'hex'), coalesce(p_public, false), leaderboard.clean(coalesce(p_stats, '{}'::jsonb)));
  return t;
exception when unique_violation then
  raise exception 'taken' using errcode = '23505';
end $$;

-- New figures, whether the stats are public, and whether the timeline is (a Claudopus before 0.2.261 sends no p_timeline: its
-- timeline goes with its stats); a private timeline is never kept. False when the secret is no one's (they left, or it was never theirs)
drop function if exists public.lb_push(text, boolean, jsonb);
create or replace function public.lb_push(p_token text, p_public boolean, p_stats jsonb, p_timeline boolean default null) returns boolean
language plpgsql security definer set search_path = '' as $$
declare shows boolean := coalesce(p_timeline, p_public, false);
begin
  update leaderboard.people set is_public = coalesce(p_public, is_public), timeline_public = shows,
    stats = case when shows then leaderboard.clean(p_stats) else leaderboard.clean(p_stats) - 'timeline' end, updated_at = now()
    where token_hash = encode(extensions.digest(coalesce(p_token, ''), 'sha256'), 'hex');
  return found;
end $$;

-- Leave: the row goes, figures and all
create or replace function public.lb_leave(p_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  delete from leaderboard.people where token_hash = encode(extensions.digest(coalesce(p_token, ''), 'sha256'), 'hex');
  return found;
end $$;

-- The top 10 of a range by one figure, with how many are on the board
create or replace function public.lb_board(p_range text default 'd7', p_sort text default 'work') returns jsonb
language sql stable security definer set search_path = '' as $$
  with r as (select case when p_range in ('today', 'd7', 'd30', 'all') then p_range else 'd7' end as r),
  rows as (select p.name, p.is_public, p.updated_at, leaderboard.range_of(p, (select r from r)) as s from leaderboard.people p),
  ranked as (
    select *, row_number() over (order by leaderboard.score(s, p_sort) desc, leaderboard.score(s, 'work') desc, name) as rank, count(*) over () as total from rows
  )
  select coalesce(jsonb_agg(jsonb_build_object('rank', rank, 'name', name, 'is_public', is_public, 'updated_at', updated_at, 'total', total, 'model', leaderboard.top_model(s), 'f', leaderboard.f(s)) order by rank), '[]'::jsonb)
  from ranked where rank <= 10
$$;

-- One person: their rank by hours of work in each range, their headline figures, and the rest only when they made it public
create or replace function public.lb_person(p_name text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare p leaderboard.people; ranks jsonb := '{}'; stats jsonb := '{}'; models jsonb := '{}'; r text; s jsonb; n bigint;
begin
  select * into p from leaderboard.people where key = lower(coalesce(p_name, ''));
  if not found then return null; end if;
  foreach r in array array['today', 'd7', 'd30', 'all'] loop
    s := leaderboard.range_of(p, r);
    select 1 + count(*) into n from leaderboard.people o where leaderboard.score(leaderboard.range_of(o, r), 'work') > leaderboard.score(s, 'work');
    ranks := ranks || jsonb_build_object(r, n);
    models := models || jsonb_build_object(r, leaderboard.top_model(s));
    stats := stats || jsonb_build_object(r, case when p.is_public then leaderboard.f(s) || jsonb_build_object(
      'models', (select coalesce(jsonb_agg(jsonb_build_array(left(coalesce(m->>0, ''), 60), leaderboard.num(m->1), leaderboard.num(m->2))), '[]'::jsonb)
        from jsonb_array_elements(case when jsonb_typeof(s->'models') = 'array' then s->'models' else '[]'::jsonb end) with ordinality as e(m, i) where i <= 12), 'todos', leaderboard.num(s->'todos'), 'flows', leaderboard.num(s->'flows'),
      'most', leaderboard.num(s->'most'), 'per_task', leaderboard.num(s->'per_task')) else leaderboard.f(s) end);
  end loop;
  return jsonb_build_object('name', p.name, 'is_public', p.is_public, 'joined_at', p.joined_at, 'updated_at', p.updated_at,
    'total', (select count(*) from leaderboard.people), 'ranks', ranks, 'stats', stats, 'model', models,
    'timeline_public', p.timeline_public,
    'timeline', case when p.timeline_public and jsonb_typeof(p.stats->'timeline') = 'object' then p.stats->'timeline' end);
end $$;

revoke all on function public.lb_join(text, boolean, jsonb), public.lb_push(text, boolean, jsonb, boolean), public.lb_leave(text), public.lb_board(text, text), public.lb_person(text) from public;
grant execute on function public.lb_join(text, boolean, jsonb), public.lb_push(text, boolean, jsonb, boolean), public.lb_leave(text), public.lb_board(text, text), public.lb_person(text) to anon, authenticated;
