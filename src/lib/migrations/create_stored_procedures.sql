-- First create the stored procedure that will add the days column
create or replace function create_stored_procedure_add_days()
returns void
language plpgsql
security definer
as $$
begin
  execute $proc$
    create or replace function add_days_column_to_bookings()
    returns void
    language plpgsql
    security definer
    as $inner$
    begin
      -- Add the days column if it doesn't exist
      if not exists (
        select 1
        from information_schema.columns
        where table_name = 'bookings'
        and column_name = 'days'
      ) then
        alter table bookings
        add column days integer
        generated always as (
          extract(day from (end_date - start_date))::integer
        ) stored;
      end if;
    end;
    $inner$;
  $proc$;
end;
$$;
