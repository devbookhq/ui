declare
  team_id uuid;

begin
  team_id := uuid_generate_v4();

  insert into public.teams (id, name) values
    (team_id, new.id);
  insert into public.users_teams (user_id, team_id) values
    (new.id, team_id);
  return new;
end;
