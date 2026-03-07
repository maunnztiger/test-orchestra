--
-- PostgreSQL database dump
--

\restrict iTEejD3BcBH2IxKI13jfZiRwRhSpAPDVnbMnuoP6p86xfSJFcqo0bsirbMqDRyk

-- Dumped from database version 16.13 (Ubuntu 16.13-1.pgdg24.04+1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.features (
    id uuid NOT NULL,
    test_run_id uuid,
    name text,
    uri text,
    status text,
    duration_ms integer
);


ALTER TABLE public.features OWNER TO postgres;

--
-- Name: scenario_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scenario_tags (
    id integer NOT NULL,
    scenario_id uuid,
    tag text
);


ALTER TABLE public.scenario_tags OWNER TO postgres;

--
-- Name: scenario_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scenario_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scenario_tags_id_seq OWNER TO postgres;

--
-- Name: scenario_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scenario_tags_id_seq OWNED BY public.scenario_tags.id;


--
-- Name: scenarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scenarios (
    id uuid NOT NULL,
    feature_id uuid,
    name text,
    status text,
    duration_ms integer
);


ALTER TABLE public.scenarios OWNER TO postgres;

--
-- Name: steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.steps (
    id uuid NOT NULL,
    scenario_id uuid,
    keyword text,
    text text,
    status text,
    duration_ms integer,
    error text
);


ALTER TABLE public.steps OWNER TO postgres;

--
-- Name: test_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_runs (
    id uuid NOT NULL,
    started_at timestamp without time zone NOT NULL,
    finished_at timestamp without time zone,
    duration_ms integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.test_runs OWNER TO postgres;

--
-- Name: scenario_tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_tags ALTER COLUMN id SET DEFAULT nextval('public.scenario_tags_id_seq'::regclass);


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.features (id, test_run_id, name, uri, status, duration_ms) FROM stdin;
ed438cfb-a50b-4380-b958-de439eef91d9	c5d2055d-2614-402c-9f32-a5ef648847fb	login	scenarios/login.md	failed	1
b774e637-b602-41da-8330-03012b21399a	19345159-90ea-4583-99b9-297c964ebff2	login	scenarios/login.md	failed	506
8ad6f85a-252a-45fe-a218-441fe91a6aa8	961cada1-0018-477e-9212-bd9893695733	login	scenarios/login.md	failed	761
ecd60931-792a-4aeb-8427-95973364dbd7	02f58a2e-e8c4-463c-b918-619da204fa96	login	scenarios/login.md	passed	773
920e1d19-7a1f-4dd2-862f-b910af813236	bec4a393-aa63-45e3-b656-3394ed41f2d1	login	scenarios/login.md	passed	629
8daf7f8a-ed24-43c1-bc8e-7a0f585c5ae0	46596416-7dc8-4273-affe-f34b6a0550b6	login	scenarios/login.md	passed	675
\.


--
-- Data for Name: scenario_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scenario_tags (id, scenario_id, tag) FROM stdin;
1	06d0d62c-08a0-4b12-8faf-310ee5e4920e	Login
2	a4c967fb-4f48-4cd9-90aa-7f1eb6547a8a	Login
3	30cd5765-27ec-40f3-9031-44f630dd0962	Login
4	00b4594d-8a0d-4f32-a092-34ab5a80438f	Login
5	b3e5d547-444c-4727-b111-331ca63342f1	Login
6	3f2c015d-a4ba-4701-8d7c-5f391583efd8	Login
\.


--
-- Data for Name: scenarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scenarios (id, feature_id, name, status, duration_ms) FROM stdin;
06d0d62c-08a0-4b12-8faf-310ee5e4920e	ed438cfb-a50b-4380-b958-de439eef91d9	Überprüfen, ob Login funktioniert	failed	1
a4c967fb-4f48-4cd9-90aa-7f1eb6547a8a	b774e637-b602-41da-8330-03012b21399a	Überprüfen, ob Login funktioniert	failed	506
30cd5765-27ec-40f3-9031-44f630dd0962	8ad6f85a-252a-45fe-a218-441fe91a6aa8	Überprüfen, ob Login funktioniert	failed	761
00b4594d-8a0d-4f32-a092-34ab5a80438f	ecd60931-792a-4aeb-8427-95973364dbd7	Überprüfen, ob Login funktioniert	passed	773
b3e5d547-444c-4727-b111-331ca63342f1	920e1d19-7a1f-4dd2-862f-b910af813236	Überprüfen, ob Login funktioniert	passed	629
3f2c015d-a4ba-4701-8d7c-5f391583efd8	8daf7f8a-ed24-43c1-bc8e-7a0f585c5ae0	Überprüfen, ob Login funktioniert	passed	675
\.


--
-- Data for Name: steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.steps (id, scenario_id, keyword, text, status, duration_ms, error) FROM stdin;
663ace53-0150-41ee-a1c7-9a519ddb8611	06d0d62c-08a0-4b12-8faf-310ee5e4920e	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	failed	1	YAML-Datei ist leer oder ungültig
f2eab00a-b003-45d7-8892-298f808ca355	a4c967fb-4f48-4cd9-90aa-7f1eb6547a8a	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	passed	502	\N
645edf47-44d3-41c3-b075-4e03f31c4899	a4c967fb-4f48-4cd9-90aa-7f1eb6547a8a	WENN	der Nutzer sich auf der Startseite einloggt	failed	4	page.fill: value: expected string, got undefined
82aeabd2-a9ed-48ef-82bc-42c3dc904880	30cd5765-27ec-40f3-9031-44f630dd0962	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	passed	495	\N
53574bff-8b1b-4e96-9833-9c368f37a5f2	30cd5765-27ec-40f3-9031-44f630dd0962	WENN	der Nutzer sich auf der Startseite einloggt	passed	96	\N
62cfd0f8-7bd0-4dcf-8f26-62c53a7e5e99	30cd5765-27ec-40f3-9031-44f630dd0962	UND	den Login-Button drückt	passed	147	\N
923cf307-1136-43c8-8b01-d4ac3c0850e8	30cd5765-27ec-40f3-9031-44f630dd0962	DANN	ist in dem Fenster die Produktseite geöffnet	passed	13	\N
3cfbad87-f635-4fb6-a42b-67f11d6c5d30	30cd5765-27ec-40f3-9031-44f630dd0962	UND	links oben befindet sich die Überschrift "Products"	passed	10	\N
bd3640e6-953f-4b7e-81af-62a90bcaef97	30cd5765-27ec-40f3-9031-44f630dd0962	UND	der User sieht eine Liste mit den Produkten	failed	0	No step definition found for: der User sieht eine Liste mit den Produkten
f79bbc67-79a3-4d11-96f6-06f7a1d916af	00b4594d-8a0d-4f32-a092-34ab5a80438f	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	passed	500	\N
d340c297-56fa-4701-8a0b-2d30da329414	00b4594d-8a0d-4f32-a092-34ab5a80438f	WENN	der Nutzer sich auf der Startseite einloggt	passed	101	\N
4179a4b3-3308-4e19-876f-7d88627524f7	00b4594d-8a0d-4f32-a092-34ab5a80438f	UND	den Login-Button drückt	passed	150	\N
106c1570-ef10-404d-a946-d7cd2b944fec	00b4594d-8a0d-4f32-a092-34ab5a80438f	DANN	ist in dem Fenster die Produktseite geöffnet	passed	16	\N
d85ed77f-5c01-4edc-8f79-76e48814960e	00b4594d-8a0d-4f32-a092-34ab5a80438f	UND	links oben befindet sich die Überschrift "Products"	passed	6	\N
5d3894aa-9b45-4302-b5a0-13311171a056	00b4594d-8a0d-4f32-a092-34ab5a80438f	UND	der User sieht eine Liste mit den Produkten	passed	0	\N
b8272e21-c5a2-4754-a362-a1367ba1c00b	b3e5d547-444c-4727-b111-331ca63342f1	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	passed	400	\N
f4480f86-f282-483a-886a-844aa235c882	b3e5d547-444c-4727-b111-331ca63342f1	WENN	der Nutzer sich auf der Startseite einloggt	passed	81	\N
d5e33419-7afe-48f8-b26d-88cafdb5da5e	b3e5d547-444c-4727-b111-331ca63342f1	UND	den Login-Button drückt	passed	97	\N
1fe93fd4-9e6b-46a0-be05-7fbbe10399a3	b3e5d547-444c-4727-b111-331ca63342f1	DANN	ist in dem Fenster die Produktseite geöffnet	passed	23	\N
cca86d64-5ec8-4b52-ba6a-f043a134ee2d	b3e5d547-444c-4727-b111-331ca63342f1	UND	links oben befindet sich die Überschrift "Products"	passed	27	\N
7ab281af-1e94-4ddc-9668-34ea78b69b1f	b3e5d547-444c-4727-b111-331ca63342f1	UND	der User sieht eine Liste mit den Produkten	passed	1	\N
7169607a-87c1-4124-86fc-053136eec9e7	3f2c015d-a4ba-4701-8d7c-5f391583efd8	GEGEBEN	der Nutzer öffnet die Startseite von Saucedemo	passed	412	\N
23c733fe-be91-4736-8f47-40e758b9e82e	3f2c015d-a4ba-4701-8d7c-5f391583efd8	WENN	der Nutzer sich auf der Startseite einloggt	passed	83	\N
3f60a469-cd8a-4815-b19a-f4170fa96a32	3f2c015d-a4ba-4701-8d7c-5f391583efd8	UND	den Login-Button drückt	passed	144	\N
f41e3c63-e4d5-40f8-908d-a8dc8dde2371	3f2c015d-a4ba-4701-8d7c-5f391583efd8	DANN	ist in dem Fenster die Produktseite geöffnet	passed	22	\N
c0f5c301-1901-4bbe-bf95-ef381c184607	3f2c015d-a4ba-4701-8d7c-5f391583efd8	UND	links oben befindet sich die Überschrift "Products"	passed	13	\N
37047c80-246f-4daf-b387-a26563718ce8	3f2c015d-a4ba-4701-8d7c-5f391583efd8	UND	der User sieht eine Liste mit den Produkten	passed	1	\N
\.


--
-- Data for Name: test_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_runs (id, started_at, finished_at, duration_ms, created_at) FROM stdin;
c5d2055d-2614-402c-9f32-a5ef648847fb	2026-03-07 15:45:58.89	2026-03-07 15:46:00.301	1411	2026-03-07 15:46:00.323486
19345159-90ea-4583-99b9-297c964ebff2	2026-03-07 15:50:58.255	2026-03-07 15:51:00.076	1821	2026-03-07 15:51:00.097573
961cada1-0018-477e-9212-bd9893695733	2026-03-07 15:52:28.035	2026-03-07 15:52:30.164	2129	2026-03-07 15:52:30.186993
02f58a2e-e8c4-463c-b918-619da204fa96	2026-03-07 15:55:52.905	2026-03-07 15:55:55.062	2157	2026-03-07 15:55:55.086959
bec4a393-aa63-45e3-b656-3394ed41f2d1	2026-03-07 15:56:34.579	2026-03-07 15:56:35.87	1291	2026-03-07 15:56:35.893297
46596416-7dc8-4273-affe-f34b6a0550b6	2026-03-07 16:01:14.661	2026-03-07 16:01:15.989	1328	2026-03-07 16:01:16.011077
\.


--
-- Name: scenario_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scenario_tags_id_seq', 6, true);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: scenario_tags scenario_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_tags
    ADD CONSTRAINT scenario_tags_pkey PRIMARY KEY (id);


--
-- Name: scenarios scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenarios
    ADD CONSTRAINT scenarios_pkey PRIMARY KEY (id);


--
-- Name: steps steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (id);


--
-- Name: test_runs test_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_runs
    ADD CONSTRAINT test_runs_pkey PRIMARY KEY (id);


--
-- Name: features features_test_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_test_run_id_fkey FOREIGN KEY (test_run_id) REFERENCES public.test_runs(id) ON DELETE CASCADE;


--
-- Name: scenario_tags scenario_tags_scenario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_tags
    ADD CONSTRAINT scenario_tags_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.scenarios(id) ON DELETE CASCADE;


--
-- Name: scenarios scenarios_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenarios
    ADD CONSTRAINT scenarios_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: steps steps_scenario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.steps
    ADD CONSTRAINT steps_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.scenarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iTEejD3BcBH2IxKI13jfZiRwRhSpAPDVnbMnuoP6p86xfSJFcqo0bsirbMqDRyk

