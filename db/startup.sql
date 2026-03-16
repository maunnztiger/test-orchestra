CREATE TABLE public.test_runs
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    started_at  timestamp without time zone NOT NULL,
    finished_at timestamp without time zone,
    duration_ms integer,
    created_at  timestamp without time zone DEFAULT now()
);

CREATE TABLE public.features
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    test_run_id integer REFERENCES public.test_runs (id) ON DELETE CASCADE,
    name        text,
    uri         text,
    status      text,
    duration_ms integer
);

CREATE TABLE public.scenarios
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    feature_id  integer REFERENCES public.features (id) ON DELETE CASCADE,
    name        text,
    status      text,
    duration_ms integer
);

CREATE TABLE public.scenario_tags
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    scenario_id integer REFERENCES public.scenarios (id) ON DELETE CASCADE,
    tag         text
);

CREATE TABLE public.steps
(
    id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    scenario_id integer REFERENCES public.scenarios (id) ON DELETE CASCADE,
    keyword     text,
    text        text,
    status      text,
    duration_ms integer,
    error       text
);
