drop policy "Enable select for authenticated users only" on "public"."seller_post";

create policy "Enable select for authenticated users only"
on "public"."seller_post"
as permissive
for select
to authenticated, anon
using (true);

create table "public"."grade_level" (
    "id" bigint generated by default as identity not null,
    "grade" text not null
);


alter table "public"."grade_level" enable row level security;

CREATE UNIQUE INDEX grade_level_id_key ON public.grade_level USING btree (id);

CREATE UNIQUE INDEX grade_level_pkey ON public.grade_level USING btree (id);

alter table "public"."grade_level" add constraint "grade_level_pkey" PRIMARY KEY using index "grade_level_pkey";

alter table "public"."grade_level" add constraint "grade_level_id_key" UNIQUE using index "grade_level_id_key";

grant delete on table "public"."grade_level" to "anon";

grant insert on table "public"."grade_level" to "anon";

grant references on table "public"."grade_level" to "anon";

grant select on table "public"."grade_level" to "anon";

grant trigger on table "public"."grade_level" to "anon";

grant truncate on table "public"."grade_level" to "anon";

grant update on table "public"."grade_level" to "anon";

grant delete on table "public"."grade_level" to "authenticated";

grant insert on table "public"."grade_level" to "authenticated";

grant references on table "public"."grade_level" to "authenticated";

grant select on table "public"."grade_level" to "authenticated";

grant trigger on table "public"."grade_level" to "authenticated";

grant truncate on table "public"."grade_level" to "authenticated";

grant update on table "public"."grade_level" to "authenticated";

grant delete on table "public"."grade_level" to "service_role";

grant insert on table "public"."grade_level" to "service_role";

grant references on table "public"."grade_level" to "service_role";

grant select on table "public"."grade_level" to "service_role";

grant trigger on table "public"."grade_level" to "service_role";

grant truncate on table "public"."grade_level" to "service_role";

grant update on table "public"."grade_level" to "service_role";

--
-- Data for Name: grade_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."grade_level" ("id", "grade") VALUES
	(1, 'PreK'),
	(2, 'K'),
	(3, '1st'),
	(4, '2nd'),
	(5, '3rd'),
	(6, '4th'),
	(7, '5th'),
	(8, '6th'),
	(9, '7th'),
	(10, '8th'),
	(11, '9th'),
	(12, '10th'),
	(13, '11th'),
	(14, '12th'),
	(15, 'College'),
	(16, 'Adult');

--
-- Data for Name: post_subject; Type: TABLE DATA; Schema: public; Owner: postgres
--  

INSERT INTO "public"."post_subject" ("id", "subject", "language") VALUES
	(1, 'Geography', 1),
	(2, 'History', 1),
	(3, 'Art & Music', 1),
	(4, 'Holiday', 1),
	(5, 'Math', 1),
	(6, 'Science', 1),
	(7, 'Social Studies', 1),
	(8, 'Specialty', 1);

--
-- Name: grade_level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."grade_level_id_seq"', 16, true);

--
-- Name: post_subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_subject_id_seq"', 8, true);