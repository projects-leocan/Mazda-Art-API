PGDMP      +        
        |            artProject_nodeJs     16.3 (Ubuntu 16.3-1.pgdg22.04+1)     16.3 (Ubuntu 16.3-1.pgdg22.04+1) u    D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            G           1262    16492    artProject_nodeJs    DATABASE     y   CREATE DATABASE "artProject_nodeJs" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_IN';
 #   DROP DATABASE "artProject_nodeJs";
                postgres    false            H           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   pg_database_owner    false    5            �            1259    16493    admin    TABLE     �  CREATE TABLE public.admin (
    admin_id bigint NOT NULL,
    admin_name text NOT NULL,
    admin_email character varying(30) NOT NULL,
    admin_password text NOT NULL,
    admin_address character varying(50) NOT NULL,
    admin_contact character varying(10) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    is_main_admin smallint DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone
);
    DROP TABLE public.admin;
       public         heap    postgres    false            �            1259    16499    admin_admin_id_seq    SEQUENCE     �   ALTER TABLE public.admin ALTER COLUMN admin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admin_admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    65966 
   admin_role    TABLE     s   CREATE TABLE public.admin_role (
    id bigint NOT NULL,
    admin_id bigint NOT NULL,
    role bigint NOT NULL
);
    DROP TABLE public.admin_role;
       public         heap    postgres    false            �            1259    65965    admin_role_id_seq    SEQUENCE     �   ALTER TABLE public.admin_role ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admin_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    254            �            1259    16500    artist    TABLE     "  CREATE TABLE public.artist (
    artist_id bigint NOT NULL,
    fname text,
    lname text,
    dob timestamp without time zone,
    gender character varying(10),
    email character varying(50),
    mobile_number character varying(15),
    address1 text,
    address2 text,
    city character varying(20),
    state character varying(20),
    pincode text,
    social_media_profile_link text,
    artist_portfolio text,
    profile_pic text,
    created_at date,
    updated_at date,
    password text,
    is_kyc_verified smallint DEFAULT 0
);
    DROP TABLE public.artist;
       public         heap    postgres    false            �            1259    16506    artist_comments    TABLE     �   CREATE TABLE public.artist_comments (
    id bigint NOT NULL,
    admin_id bigint,
    comment text NOT NULL,
    artist_id bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.artist_comments;
       public         heap    postgres    false            �            1259    16512    artist_comments_id_seq    SEQUENCE     �   ALTER TABLE public.artist_comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artist_comments_id_seq
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            �            1259    33147 
   artist_kyc    TABLE     �   CREATE TABLE public.artist_kyc (
    id bigint NOT NULL,
    aadhar_document text,
    voting_document text,
    pan_document text,
    passport_document text,
    document_id bigint
);
    DROP TABLE public.artist_kyc;
       public         heap    postgres    false            �            1259    41356    artist_kyc_documents    TABLE     s   CREATE TABLE public.artist_kyc_documents (
    id bigint NOT NULL,
    document_id bigint,
    artist_id bigint
);
 (   DROP TABLE public.artist_kyc_documents;
       public         heap    postgres    false            �            1259    16513 
   artist_moc    TABLE     d   CREATE TABLE public.artist_moc (
    id bigint NOT NULL,
    artist_id bigint,
    moc_id bigint
);
    DROP TABLE public.artist_moc;
       public         heap    postgres    false            �            1259    16516    artist_moc_id_seq    SEQUENCE     �   ALTER TABLE public.artist_moc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artist_moc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    49583    artist_portfolio    TABLE     r   CREATE TABLE public.artist_portfolio (
    id bigint NOT NULL,
    artist_portfolio text,
    artist_id bigint
);
 $   DROP TABLE public.artist_portfolio;
       public         heap    postgres    false            �            1259    49582    artist_portfolio_id_seq    SEQUENCE     �   ALTER TABLE public.artist_portfolio ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artist_portfolio_id_seq
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    248            �            1259    16517    artist_user_id_seq    SEQUENCE     �   ALTER TABLE public.artist ALTER COLUMN artist_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artist_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    49556    artwork_comment    TABLE     �   CREATE TABLE public.artwork_comment (
    id bigint NOT NULL,
    artwork_id bigint,
    comment character varying,
    created_at timestamp with time zone,
    jury_id bigint
);
 #   DROP TABLE public.artwork_comment;
       public         heap    postgres    false            �            1259    49555    artwork_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.artwork_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.artwork_comment_id_seq;
       public          postgres    false    246            I           0    0    artwork_comment_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.artwork_comment_id_seq OWNED BY public.artwork_comment.id;
          public          postgres    false    245            �            1259    16614 
   contact_us    TABLE     �  CREATE TABLE public.contact_us (
    id bigint NOT NULL,
    created_date timestamp without time zone,
    full_name character varying(100),
    email character varying(50) NOT NULL,
    contact_no character varying(14),
    message character varying(5000) NOT NULL,
    status smallint DEFAULT 1,
    admin_id bigint,
    response_date timestamp with time zone,
    message_response character varying(5000)
);
    DROP TABLE public.contact_us;
       public         heap    postgres    false            �            1259    16613    contact_us_id_seq    SEQUENCE     �   ALTER TABLE public.contact_us ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contact_us_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    242            �            1259    16518 	   enquiries    TABLE     �  CREATE TABLE public.enquiries (
    id bigint NOT NULL,
    created_date timestamp without time zone,
    full_name character varying(100),
    email character varying(50) NOT NULL,
    contact_no character varying(14),
    query character varying(5000) NOT NULL,
    status smallint DEFAULT 1,
    admin_id bigint,
    resolve_date timestamp with time zone,
    query_response character varying(5000)
);
    DROP TABLE public.enquiries;
       public         heap    postgres    false            �            1259    16524    enquiries_id_seq    SEQUENCE     �   ALTER TABLE public.enquiries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.enquiries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    223            �            1259    16525    grant_assign    TABLE     �   CREATE TABLE public.grant_assign (
    id bigint NOT NULL,
    jury_id bigint NOT NULL,
    grant_id bigint NOT NULL,
    assign_by bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
     DROP TABLE public.grant_assign;
       public         heap    postgres    false            �            1259    16529    grant_assign_id_seq    SEQUENCE     �   ALTER TABLE public.grant_assign ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.grant_assign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    225            �            1259    16530    grants    TABLE     o  CREATE TABLE public.grants (
    grant_id bigint NOT NULL,
    "category_MOD" bigint NOT NULL,
    created_by bigint NOT NULL,
    hight bigint NOT NULL,
    width bigint NOT NULL,
    theme_id bigint NOT NULL,
    application_fees bigint NOT NULL,
    submission_end_date timestamp without time zone NOT NULL,
    max_allow_submision bigint NOT NULL,
    no_of_awards bigint NOT NULL,
    no_of_nominations bigint NOT NULL,
    rank_1_price bigint NOT NULL,
    rank_2_price bigint NOT NULL,
    rank_3_price bigint NOT NULL,
    nominee_price bigint NOT NULL,
    grand_amount bigint NOT NULL,
    created_at timestamp without time zone,
    updated_by bigint,
    updated_at date,
    is_flat_pyramid smallint DEFAULT 0,
    id character varying(20),
    know_more character varying(100),
    for_each_amount bigint DEFAULT 0 NOT NULL,
    grant_uid character varying(100)
);
    DROP TABLE public.grants;
       public         heap    postgres    false            �            1259    16534    grants_grant_id_seq    SEQUENCE     �   ALTER TABLE public.grants ALTER COLUMN grant_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.grants_grant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    227            �            1259    16535    jury    TABLE       CREATE TABLE public.jury (
    id bigint NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(50) NOT NULL,
    contact_no character varying(15) NOT NULL,
    password character varying(100) NOT NULL,
    address character varying(200) NOT NULL,
    designation character varying(50) NOT NULL,
    dob date NOT NULL,
    about text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp without time zone,
    is_jury_password_updated smallint DEFAULT 0 NOT NULL
);
    DROP TABLE public.jury;
       public         heap    postgres    false            �            1259    16541    jury_id_seq    SEQUENCE     �   ALTER TABLE public.jury ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.jury_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    229            �            1259    16542 
   jury_links    TABLE     p   CREATE TABLE public.jury_links (
    id bigint NOT NULL,
    jury_id bigint,
    link character varying(255)
);
    DROP TABLE public.jury_links;
       public         heap    postgres    false            �            1259    16545    jury_links_id_seq    SEQUENCE     �   ALTER TABLE public.jury_links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.jury_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    231            �            1259    16546    medium_of_choice    TABLE     �   CREATE TABLE public.medium_of_choice (
    id bigint NOT NULL,
    medium_of_choice text,
    created_by bigint,
    updated_by bigint,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
 $   DROP TABLE public.medium_of_choice;
       public         heap    postgres    false            �            1259    16551    medium_of_choice_id_seq    SEQUENCE     �   ALTER TABLE public.medium_of_choice ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.medium_of_choice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    233            �            1259    65960    submission_admin_review    TABLE     �   CREATE TABLE public.submission_admin_review (
    id bigint NOT NULL,
    artwork_id bigint NOT NULL,
    admin_id bigint,
    status bigint,
    comment character varying(255),
    star_assigned smallint
);
 +   DROP TABLE public.submission_admin_review;
       public         heap    postgres    false            �            1259    65959    submission_admin_review_id_seq    SEQUENCE     �   ALTER TABLE public.submission_admin_review ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.submission_admin_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    252            �            1259    16552    submission_details    TABLE     �  CREATE TABLE public.submission_details (
    id bigint NOT NULL,
    artist_id bigint,
    transaction_id character varying(255),
    grant_id bigint,
    art_file character varying(255),
    art_title text,
    height double precision,
    width double precision,
    art_description text,
    submited_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    submission_updated_count bigint DEFAULT 1,
    updated_at timestamp without time zone,
    status character varying(255) DEFAULT '1'::character varying,
    jury_id bigint,
    assign_date timestamp without time zone,
    comment character varying(500),
    star_assigned smallint DEFAULT 0,
    artwork_id bigint
);
 &   DROP TABLE public.submission_details;
       public         heap    postgres    false            �            1259    16561    submission_details_id_seq    SEQUENCE     �   ALTER TABLE public.submission_details ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.submission_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    235            �            1259    57788    submission_review_details    TABLE     �   CREATE TABLE public.submission_review_details (
    id bigint NOT NULL,
    artwork_id bigint NOT NULL,
    jury_id bigint NOT NULL,
    status bigint NOT NULL,
    comment character varying(255) NOT NULL,
    star_assigned smallint NOT NULL
);
 -   DROP TABLE public.submission_review_details;
       public         heap    postgres    false            �            1259    57787     submission_review_details_id_seq    SEQUENCE     �   ALTER TABLE public.submission_review_details ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.submission_review_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    250            �            1259    16562    theme    TABLE     �   CREATE TABLE public.theme (
    id bigint NOT NULL,
    theme character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_by bigint,
    updated_by bigint
);
    DROP TABLE public.theme;
       public         heap    postgres    false            �            1259    16565    theme_id_seq    SEQUENCE     �   ALTER TABLE public.theme ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.theme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    237            �            1259    16566    trasaction_detail    TABLE     f  CREATE TABLE public.trasaction_detail (
    id bigint NOT NULL,
    artist_id bigint,
    grant_id bigint,
    trasaction_id text,
    trasaction_status character varying(255),
    trasaction_amount bigint,
    updated_at timestamp without time zone,
    payment_init_date timestamp without time zone,
    payment_success_date timestamp without time zone
);
 %   DROP TABLE public.trasaction_detail;
       public         heap    postgres    false            �            1259    16571    trasaction_detail_id_seq    SEQUENCE     �   ALTER TABLE public.trasaction_detail ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.trasaction_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    239            S           2604    49564    artwork_comment id    DEFAULT     x   ALTER TABLE ONLY public.artwork_comment ALTER COLUMN id SET DEFAULT nextval('public.artwork_comment_id_seq'::regclass);
 A   ALTER TABLE public.artwork_comment ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    246    245    246                      0    16493    admin 
   TABLE DATA           �   COPY public.admin (admin_id, admin_name, admin_email, admin_password, admin_address, admin_contact, created_at, is_main_admin, updated_at) FROM stdin;
    public          postgres    false    215   ��       A          0    65966 
   admin_role 
   TABLE DATA           8   COPY public.admin_role (id, admin_id, role) FROM stdin;
    public          postgres    false    254   [�                 0    16500    artist 
   TABLE DATA           �   COPY public.artist (artist_id, fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_profile_link, artist_portfolio, profile_pic, created_at, updated_at, password, is_kyc_verified) FROM stdin;
    public          postgres    false    217   ��                 0    16506    artist_comments 
   TABLE DATA           W   COPY public.artist_comments (id, admin_id, comment, artist_id, created_at) FROM stdin;
    public          postgres    false    218   Р       6          0    33147 
   artist_kyc 
   TABLE DATA           x   COPY public.artist_kyc (id, aadhar_document, voting_document, pan_document, passport_document, document_id) FROM stdin;
    public          postgres    false    243   ʦ       7          0    41356    artist_kyc_documents 
   TABLE DATA           J   COPY public.artist_kyc_documents (id, document_id, artist_id) FROM stdin;
    public          postgres    false    244   .�                 0    16513 
   artist_moc 
   TABLE DATA           ;   COPY public.artist_moc (id, artist_id, moc_id) FROM stdin;
    public          postgres    false    220   m�       ;          0    49583    artist_portfolio 
   TABLE DATA           K   COPY public.artist_portfolio (id, artist_portfolio, artist_id) FROM stdin;
    public          postgres    false    248   Χ       9          0    49556    artwork_comment 
   TABLE DATA           W   COPY public.artwork_comment (id, artwork_id, comment, created_at, jury_id) FROM stdin;
    public          postgres    false    246   ��       5          0    16614 
   contact_us 
   TABLE DATA           �   COPY public.contact_us (id, created_date, full_name, email, contact_no, message, status, admin_id, response_date, message_response) FROM stdin;
    public          postgres    false    242   -�       "          0    16518 	   enquiries 
   TABLE DATA           �   COPY public.enquiries (id, created_date, full_name, email, contact_no, query, status, admin_id, resolve_date, query_response) FROM stdin;
    public          postgres    false    223   �       $          0    16525    grant_assign 
   TABLE DATA           T   COPY public.grant_assign (id, jury_id, grant_id, assign_by, created_at) FROM stdin;
    public          postgres    false    225   �       &          0    16530    grants 
   TABLE DATA           b  COPY public.grants (grant_id, "category_MOD", created_by, hight, width, theme_id, application_fees, submission_end_date, max_allow_submision, no_of_awards, no_of_nominations, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, created_at, updated_by, updated_at, is_flat_pyramid, id, know_more, for_each_amount, grant_uid) FROM stdin;
    public          postgres    false    227   D�       (          0    16535    jury 
   TABLE DATA           �   COPY public.jury (id, full_name, email, contact_no, password, address, designation, dob, about, created_at, updated_at, is_jury_password_updated) FROM stdin;
    public          postgres    false    229   ��       *          0    16542 
   jury_links 
   TABLE DATA           7   COPY public.jury_links (id, jury_id, link) FROM stdin;
    public          postgres    false    231   ��       ,          0    16546    medium_of_choice 
   TABLE DATA           p   COPY public.medium_of_choice (id, medium_of_choice, created_by, updated_by, created_at, updated_at) FROM stdin;
    public          postgres    false    233   ��       ?          0    65960    submission_admin_review 
   TABLE DATA           k   COPY public.submission_admin_review (id, artwork_id, admin_id, status, comment, star_assigned) FROM stdin;
    public          postgres    false    252   ��       .          0    16552    submission_details 
   TABLE DATA             COPY public.submission_details (id, artist_id, transaction_id, grant_id, art_file, art_title, height, width, art_description, submited_time, submission_updated_count, updated_at, status, jury_id, assign_date, comment, star_assigned, artwork_id) FROM stdin;
    public          postgres    false    235   ټ       =          0    57788    submission_review_details 
   TABLE DATA           l   COPY public.submission_review_details (id, artwork_id, jury_id, status, comment, star_assigned) FROM stdin;
    public          postgres    false    250   ^�       0          0    16562    theme 
   TABLE DATA           Z   COPY public.theme (id, theme, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    237   $�       2          0    16566    trasaction_detail 
   TABLE DATA           �   COPY public.trasaction_detail (id, artist_id, grant_id, trasaction_id, trasaction_status, trasaction_amount, updated_at, payment_init_date, payment_success_date) FROM stdin;
    public          postgres    false    239   �       J           0    0    admin_admin_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.admin_admin_id_seq', 61, true);
          public          postgres    false    216            K           0    0    admin_role_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.admin_role_id_seq', 148, true);
          public          postgres    false    253            L           0    0    artist_comments_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.artist_comments_id_seq', 49, true);
          public          postgres    false    219            M           0    0    artist_moc_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.artist_moc_id_seq', 57, true);
          public          postgres    false    221            N           0    0    artist_portfolio_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.artist_portfolio_id_seq', 99, true);
          public          postgres    false    247            O           0    0    artist_user_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.artist_user_id_seq', 51, true);
          public          postgres    false    222            P           0    0    artwork_comment_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.artwork_comment_id_seq', 3, true);
          public          postgres    false    245            Q           0    0    contact_us_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.contact_us_id_seq', 16, true);
          public          postgres    false    241            R           0    0    enquiries_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.enquiries_id_seq', 22, true);
          public          postgres    false    224            S           0    0    grant_assign_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.grant_assign_id_seq', 134, true);
          public          postgres    false    226            T           0    0    grants_grant_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.grants_grant_id_seq', 38, true);
          public          postgres    false    228            U           0    0    jury_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jury_id_seq', 80, true);
          public          postgres    false    230            V           0    0    jury_links_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.jury_links_id_seq', 196, true);
          public          postgres    false    232            W           0    0    medium_of_choice_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.medium_of_choice_id_seq', 12, true);
          public          postgres    false    234            X           0    0    submission_admin_review_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.submission_admin_review_id_seq', 2, true);
          public          postgres    false    251            Y           0    0    submission_details_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.submission_details_id_seq', 16, true);
          public          postgres    false    236            Z           0    0     submission_review_details_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.submission_review_details_id_seq', 14, true);
          public          postgres    false    249            [           0    0    theme_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.theme_id_seq', 5, true);
          public          postgres    false    238            \           0    0    trasaction_detail_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.trasaction_detail_id_seq', 14, true);
          public          postgres    false    240            U           2606    16573    admin admin_admin_email_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_admin_email_key UNIQUE (admin_email);
 E   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_admin_email_key;
       public            postgres    false    215            W           2606    16575    admin admin_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);
 :   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_pkey;
       public            postgres    false    215            �           2606    65970    admin_role admin_role_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.admin_role
    ADD CONSTRAINT admin_role_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.admin_role DROP CONSTRAINT admin_role_pkey;
       public            postgres    false    254            ]           2606    16577 #   artist_comments artist_cmments_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.artist_comments
    ADD CONSTRAINT artist_cmments_pkey PRIMARY KEY (id);
 M   ALTER TABLE ONLY public.artist_comments DROP CONSTRAINT artist_cmments_pkey;
       public            postgres    false    218            Y           2606    65972    artist artist_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.artist
    ADD CONSTRAINT artist_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.artist DROP CONSTRAINT artist_email_key;
       public            postgres    false    217            |           2606    41360 .   artist_kyc_documents artist_kyc_documents_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.artist_kyc_documents
    ADD CONSTRAINT artist_kyc_documents_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.artist_kyc_documents DROP CONSTRAINT artist_kyc_documents_pkey;
       public            postgres    false    244            z           2606    41364    artist_kyc artist_kyc_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.artist_kyc
    ADD CONSTRAINT artist_kyc_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.artist_kyc DROP CONSTRAINT artist_kyc_pkey;
       public            postgres    false    243            _           2606    16581    artist_moc artist_moc_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.artist_moc
    ADD CONSTRAINT artist_moc_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.artist_moc DROP CONSTRAINT artist_moc_pkey;
       public            postgres    false    220            �           2606    49589 &   artist_portfolio artist_portfolio_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.artist_portfolio
    ADD CONSTRAINT artist_portfolio_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.artist_portfolio DROP CONSTRAINT artist_portfolio_pkey;
       public            postgres    false    248            ~           2606    49566 $   artwork_comment artwork_comment_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.artwork_comment
    ADD CONSTRAINT artwork_comment_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.artwork_comment DROP CONSTRAINT artwork_comment_pkey;
       public            postgres    false    246            x           2606    16621    contact_us contact_us_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.contact_us
    ADD CONSTRAINT contact_us_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.contact_us DROP CONSTRAINT contact_us_pkey;
       public            postgres    false    242            a           2606    16583    enquiries enquiries_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.enquiries DROP CONSTRAINT enquiries_pkey;
       public            postgres    false    223            c           2606    16585    grant_assign grant_assign_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.grant_assign
    ADD CONSTRAINT grant_assign_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.grant_assign DROP CONSTRAINT grant_assign_pkey;
       public            postgres    false    225            e           2606    16587    grants grant_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.grants
    ADD CONSTRAINT grant_pkey PRIMARY KEY (grant_id);
 ;   ALTER TABLE ONLY public.grants DROP CONSTRAINT grant_pkey;
       public            postgres    false    227            g           2606    16589    jury jury_email_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.jury
    ADD CONSTRAINT jury_email_key UNIQUE (email);
 =   ALTER TABLE ONLY public.jury DROP CONSTRAINT jury_email_key;
       public            postgres    false    229            i           2606    16591    jury jury_email_key1 
   CONSTRAINT     P   ALTER TABLE ONLY public.jury
    ADD CONSTRAINT jury_email_key1 UNIQUE (email);
 >   ALTER TABLE ONLY public.jury DROP CONSTRAINT jury_email_key1;
       public            postgres    false    229            n           2606    16593    jury_links jury_links_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.jury_links
    ADD CONSTRAINT jury_links_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.jury_links DROP CONSTRAINT jury_links_pkey;
       public            postgres    false    231            k           2606    16595    jury jury_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jury
    ADD CONSTRAINT jury_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jury DROP CONSTRAINT jury_pkey;
       public            postgres    false    229            p           2606    16597 &   medium_of_choice medium_of_choice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.medium_of_choice
    ADD CONSTRAINT medium_of_choice_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.medium_of_choice DROP CONSTRAINT medium_of_choice_pkey;
       public            postgres    false    233            �           2606    65964 4   submission_admin_review submission_admin_review_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.submission_admin_review
    ADD CONSTRAINT submission_admin_review_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.submission_admin_review DROP CONSTRAINT submission_admin_review_pkey;
       public            postgres    false    252            r           2606    16599 *   submission_details submission_details_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.submission_details
    ADD CONSTRAINT submission_details_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.submission_details DROP CONSTRAINT submission_details_pkey;
       public            postgres    false    235            �           2606    57792 8   submission_review_details submission_review_details_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.submission_review_details
    ADD CONSTRAINT submission_review_details_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.submission_review_details DROP CONSTRAINT submission_review_details_pkey;
       public            postgres    false    250            t           2606    16601    theme theme_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.theme
    ADD CONSTRAINT theme_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.theme DROP CONSTRAINT theme_pkey;
       public            postgres    false    237            v           2606    16603 (   trasaction_detail trasaction_detail_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.trasaction_detail
    ADD CONSTRAINT trasaction_detail_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.trasaction_detail DROP CONSTRAINT trasaction_detail_pkey;
       public            postgres    false    239            [           2606    16605    artist user_pkey2 
   CONSTRAINT     V   ALTER TABLE ONLY public.artist
    ADD CONSTRAINT user_pkey2 PRIMARY KEY (artist_id);
 ;   ALTER TABLE ONLY public.artist DROP CONSTRAINT user_pkey2;
       public            postgres    false    217            l           1259    16606    fki_jury_id_FK    INDEX     J   CREATE INDEX "fki_jury_id_FK" ON public.jury_links USING btree (jury_id);
 $   DROP INDEX public."fki_jury_id_FK";
       public            postgres    false    231            �           2606    41370    artist_kyc_documents artist_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.artist_kyc_documents
    ADD CONSTRAINT artist_id FOREIGN KEY (artist_id) REFERENCES public.artist(artist_id) NOT VALID;
 H   ALTER TABLE ONLY public.artist_kyc_documents DROP CONSTRAINT artist_id;
       public          postgres    false    3419    217    244            �           2606    57793 $   submission_review_details artwork_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.submission_review_details
    ADD CONSTRAINT artwork_id FOREIGN KEY (artwork_id) REFERENCES public.submission_details(id);
 N   ALTER TABLE ONLY public.submission_review_details DROP CONSTRAINT artwork_id;
       public          postgres    false    235    3442    250            �           2606    41375     artist_kyc_documents document_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.artist_kyc_documents
    ADD CONSTRAINT document_id FOREIGN KEY (document_id) REFERENCES public.artist_kyc(id) NOT VALID;
 J   ALTER TABLE ONLY public.artist_kyc_documents DROP CONSTRAINT document_id;
       public          postgres    false    243    3450    244            �           2606    16607    jury_links jury_id_FK    FK CONSTRAINT        ALTER TABLE ONLY public.jury_links
    ADD CONSTRAINT "jury_id_FK" FOREIGN KEY (jury_id) REFERENCES public.jury(id) NOT VALID;
 A   ALTER TABLE ONLY public.jury_links DROP CONSTRAINT "jury_id_FK";
       public          postgres    false    3435    231    229               Q  x���K{�:�5|
�͈��du�Ro����g6�(�
����~�8��ڳ;+ސ�!?��*4o�#��Ga�����g���7s��x���Et����o{v�6N�*m�����|�_��m�>~��gjb6�'"�֛�F#J%TC �
�*�H%&� �h��9�H$ĒR ��#�ծRX"Ὧ�pXo�Rs��}{5}�Eb���끆��c'�h��g��֪�zgOC��Q~�1Ύ�f�a��V�0�u�"���*I@�[�S �)Һq�^�m��u�E�6�|�6n�v?jN_�g��Ӏ-�qk,�}�lZ��5zU:+���QQkbB�&8�A�?�,rI�s_�9&��)���S� 2ƻ0�7��սx�Y|.�s:\?Q�2��N����_�Io��G�B�'�i�9=E~_��c���W���c�%�ؼ��DBn"l	�����8�{ps#���Q<9�������̇ӰHI�e� ����4|��� v�:S��FW��O��J�ۗTJD�B�%	�J"L�9�HG��|�O���{j ��;�8��2jϭe������x��h�u�lB[/�ok��nhTQş�^��"�Z��$_`�ˏ�jnKa�;�?�%��
;����p����"+�����vw�q�o�A��֧�H�eD��6[
j1JTh?�=�b���A��Pn��0Fu���c��R��~!�c(�����dbns(&����U�m2\wX����k������A�ٻ���E/��j�׭%&HgP�a��xS���2(�����(�`�vu���>�ΐ���#PBaB��?M]�y��      A   -   x�341�43�4�2411��3��01̀Ð+F��� �"@         (  x��W[W�H~n�ľ&�y�������9{ZhI �I�0��:Mt\���P6��u��U5'h��%���W!"R�.�]�;-��Q�*�(�u�&��k�Hڮp8&��h�ǅ�y�v�|1)(#���$����X,�IOm~���Ŕw1�+��?Nޢ��_�ݨ4�)���.����WD7�R?���o&��P!���q���J;�s�X� ���	r1x1aVQ6�l~�8�thm����P*\[2���ɤ���bV=�p�%�Q�81���~z�*�u��R  ��w1�VMV���Jt���.*{�<��JG�R �q�jgV��t�Ł͑��Ι�LW��w���?R�� �X��_�؋�8B�=#�6�ɊՖ��b���:�#�:�),X����Y�d�+lF1� ��c�t
7��x����a�����<p�؂?S�.&8��0fے��s�9��/���_����>Y\��px�m��?��]�����w|��O���pw:�\=�N}�Z�!C��pqV�G ��&Ub��(?2Y�I�������lsBM&�1)rF$�a�c�Zܢd�9G��H�2��~�D'qR�M2�E"V h���"%�s�k�c�L�r���[�l�Q�}H�E�dU}caVT_�&�W$$ҭ�FM1j�[�
(̿�x��S(�	,�Q� �Mg/k�]���� �VF�c��)�3 � �^[^r�bV�0�A��M��ZA���v�.��	t�x��Yq�e#��Jx���bI�2�'� 9�iP��[��Lr��\'�8�a�����T�{��R��_����9�=[Zw�`4�{L.�C�]�����ѬG�K��d#B=S��[\�"k�m��8.����4��ڎS�a�h��]�����L���ՉV�k���V�ȭ�ǜb��Q��o���>��y]zq��_���	��͂���Ǯ]y�*��e8OU��*0 �j:�.2��4�Z��b*�0�γl�v&�����������x�,���ݘR���Ǿ�a��k$�Y��l�K�Y��or��(�)��a�e�xӰS�b6�/T:��A�u�Y�t�l��B�*?�k[>�}�4G�p�Q�d�}���������aH��D_ٱZ�K�|����*=:����x� x��n��0�D�^��|M�q��5��ը���X?KǍ���:���S�-��E�ct��<��5:WyjfT�)^��I�r%]��:����&x��\ͪH��"������؄�!�ג5[�
��i;Ld.@�_�*{���2D����w ��������Q�zh���1���3��D>ˑ�d1[�-l���]A������Q�O��y�++��H�:������������&*����;����b��6�:�b��
)��x�����A��`>U�N�$�7~����z��Ѷ�����I-B���X�\��F��ȅޏ�����j�����P>���:�ùgs9���@5[<]���8lB}�&}��SnO��V_�nS_�����������{         �  x��Ko7���$-�
��co��4����\�m-�Z
��8��RqlK�+�d@�g��y�o)��g�����i��^�a��4�����7h �f^0\7�7LS����=�6Kh���Q�њj��1Df��[kJ���g��1o�"��0C�Bs�Os�%i�1O;H@=�5�Q����$U�kÉ;��4ZQ�Қ��T�A��kʴ�\�N�Ќ
m����S<t���^0Gx���U7>�xs�
;�u7<���F�Ĩ�X9Nxi���9��FZ*��.3�GJKx9�g���6JR�<�X}�Ɓ�<[��JŔ5������l@�A�Jnoc���_�n��������l�ǡ�Fb������컽��8�R-�q�p��Y�)�U�F�F;ʜ7��(��ʆ����BJED�w�n�lð8y�*�f�nYvghJ1��)��IDi�����QK%���I"J����;#<Kk��B"IЪ�y<�s�i��(�������Y1���a�D���Ǳ�k���Y�8�[��H�\+i<������1�;�l�fۇ.b����Oc\ûʹ]�K&�0u�M��1˴F�~�)��a&S����i�M���>LS׆�2���0o��#P^�/p����͐�����	R���kWa\���9��\dq3��8M��0�۰�,����n9�Nj�ǫ�5�ՍW�Ѕ�)]�%l7���q^EXc��.�6+��I�rZ�e8�b��y���e�	�����r�r�jL۫U	�b���*9dsW��z,`�MmN�e�-Vx{1��>�c郅��(�;�	�r��KѲ-��ϖ�`��	^�!��g�������{�m��{��U9��]�{��y��1-�f��99��;
�X�<"0�o�j%�I8]4Ϋ�Ŋb����܎��E���a1��iVtYn���Ҧ{�/�����Tb�0���:����~q�>
�^��*�/×!�3͘j��v��ւ��:TUTr�X���Go�m�x�����c���vw g��S�)��;?��3�S��vW�܍������9��B5X��b%6a�����nZ�LETP��\a��0��	�����UX�c��{�T��U�J�J�J�J�Hr�Ҹ�u�2ό&�W�T���I#'a$�xS���m�t
7%��������������D*�Ў)+K*K*K*KNa��ܓ�F����*J*J*J*JNږ�C����wZ�+J*J*J*J~%�*�q_B��,�,�,�,�9��Fyj�7O��,�,�,�,�9��F(����*K*K*K*K~�%�Pa<�J����w�P�(��M��Xz+�bO[������'�?m�a�=��%�P�Ϩ�����1����6�S��{o��:�-ر�t�1�-j��bÃ�2��eC�OJsC��<����#>:��9�%�l_���q(�4j�}
e��L���{-�9s&��h_����$���χ׽�ғ/��7$a      6   T   x�3�LLL�HL,�+OM*�,�/I�2�`�����ϐˈT-F\Ƥj1�2�$B�	�)g��B U�)�� 2����� L&T�      7   /   x����@İ�]�&��B�u �P�E�e���p��0d]��ߥ���"         Q   x����0Cѳ=Lb�6�t�9�OO|uP7ĽbS/nl� ��`vA{jo���	�Z�F)΅P� �쎢��}~���w��p��      ;   �   x�e�9n�0Ek����y��`� @�ܿ�DɆ��>��Ez���9"�#��*Q)�JS�*X�p���(����i���������;W����Ї��'g5���� �s�ը���&C�'�������ڴ�uZ�ьŗPD>D�E�C����-�(��x"e������gh3�mؑm�A7�__4D^"٥�Z��~�i�l�      9   u   x�u�A
1 �s���eC�$[������E�P�}"���T����>��pm������ρ�Pщ�$�a&8Ww�Y%�\����"�Q���;�dS�Fq2���3��r)�      5   �  x���Mo�0����}�@R��Nk�]v�C1�5ڴ���N����A�9N.&u���/E/�\��B�h�v��"G��{ZY.r]������MZ�j�nD��A-n�fH�A~���A���2{�؈Zi6��p� ~��N~j~m�ݛ\���}[��*�BiT\�⺮s#w�~ɝH��nqi*d`pεnO���N+BОh��
ጢ�H2�E�k�_SӋ���5-��Lи��ۼigB��5G��9ă�o���6}��C���OqL����*m�"��-��X����a
sS�0�q1����ӡ��fl��J��v��*�S�*�����|��!��q	��7�G���0#9�R�>���&rP�E4� )�	 �п2����e
��U�9���$P��!؝@6ޝ7h�+��*l ���OxH���6�SE���8�ߩY�e��p�����U7�      "   �  x���[o�@��׿������^�� x�!�T!UHn�*������MK�Z������sf�*�SeOA�`��N��@,�Ul������V����rv�.�J.���F;ˀ��Ǧ�?�?n��.?�������O栝D��;�)񾨪���4�j���ײ��<V���e_=�qT^�#I����>T�JZ�Ʊ�UU��mQ}��(���P��b���f�ar�Q`����q,⦩n�*3e�Ai��b�n�:��E�Wm��� \�SolGݟҰ��A��x�����/''o�d`I@K6Α���u>/KR9TChv���@�G���>77���M������o����J�V��S�Yԫ!�]�$У9�v�s�A���qH�lٕM���� ���R�ա# ��1-�CJ�M�P�޸�8��Zyb�?g�Ȇ�!��5�0}��{��~���TF�#�g&{d�Ƕ��YS��$G֎�n�K�e�/y�]      $   0  x���ɍ�8E�r�@	\EұL�q̧
�i�T>>S\?�b#j�B��^/��S�4�����.���:IOYәm�6'��i��3��\�����c�a?�OZs�d����'#|h��a�)��Ŭ�������x.]��X<|p�O�K��tk��|,����Q,'� ��x�/3�(s��>L0T�N�Y��v�ysR�)G�4�Ը�����_u[/�EW�����o�e�P7��%GW�.o��Yu�9+C�XH�ȝғ��������|}]��#����H^DC7����$Bۗ+\̍��n?Z�V�|�av{rS�&�Yd�y�Nޓ1���;����-E�?�Nu�:r�䉊��{�i���s�3}e�ޭ�z�P��~Q�X�v�~�^�c�'&�0F�lp,��%����i5X��Hdy��wb\*U���Q�߯�3�b@��v�� ��wʆ�3e'لf��Q�>��A\P��jc_)仾S9�;T���A`��@Ax�v�z!�Z��ok��yN���'[�^ui2*�~U�=}�&�J��m�C�ˌ�pl7B���~q�4,��v>��ނF�dK>S��{���dJ-��v�䣍�x��z[�m��'��*t@!0e	���V��'��#.R!p����\M��:\hUo_~�P]�8ʆAl����X�G�"��?qH��+�������\u��]P%W�����#�
yQp����U�a��DR��n{�ȩNI\}�����1���W	�c�e�{����n?x�W��zy_9�3�<#�r��=]9݁�Ա5��q�`���      &   U  x��V1r�0��W����x�N���MR��L<��g�� �P�L9AQ����p4d�B�h����=���:�����0 s�E_q�Ё�Y��v2��b^���O����>��O����y�sC��c��ϟd�E�Q�@a�4�+��A��z0�dO�ω�,S���K�u0,��qx���Q�,?�@���8�!�ޓ��*5�2wZN����q��AP��	�ܑ���P��X	H5��jH�e�3�Y-���<�;`{����XǪ��$� @i��� ��_��"�V_Ibe��~EOc4�Z�sPMNKi/p�.C������*&��[�'�&{�*��5y�Jc0s;��"�ƾ�U��@b�>���C��?_��&!����ࣂ�Qw3��̹�P��F���]���)�kᳯ��!6Г�������Zj6��Tms�78Ŭ�PM]'u;�}/�׻��5�)�+�,�L������V������w��_�����R�>��m>��֔Ϥ��*�<� �⿋,�)�z��r�;t�9��^�j�m��y]fbހ�����VF�z{y;�^~��O����j39Ǉ�i�Z�ہ      (   �  x��X�v�Z}&_�C�uB`�����hPTP$�F�у���\T���A%&�2IW�K�[aȜk͹��B7���z\bA�������7���@1��X?(�Ǫ���հ�NY����p�|�k}��J���g�=������m Ⱥ)a��#w�O��us\27�*N#�ğ'"�N	� �@��`]7uq?��7����̵s?�0@�@�$�I���/���&�g�@7g0�r�����nTs������{7�qâz]-�P�h�eI��0�2i�����q>��l�-�B9W&]Jh-a�a&U#�(=�wi5C3�R3�מ�cÌ8�b �8m61���t�*���Ƈ�X��u�(pE��9^��.9Ӑ�t0��2{2��+�5Hh����fw�����o�o3eL��'��H�GA�m?/�azI=�4歜��3� �5f���� ���@�,� 
)�E�*�k�7�zfo@R� IEfX�+8��n(�b!��Ps;g��A��E�yװL����5�5��*;e�:e�/�		�p�/@���_gN�33�/JC2C% bb�����6��Ͽ7���kr��z`�(|�D3z���=Yc�}����9�a�L@$R��(�}����>6�C}=�c�eW���^���MA^��A��a?�9!Q.8m�Ҭ�ez��ղ�2`��<(�;Ș}��C�l�TRl۾������XK�m��S�_(��M��8W�#MV�@��N8o�B����z�Bt܃9n�����x5��]k�e����̇�o���%"a���a����QI��8
{������E�ƛ�ݸ�\Ĩ"D֕��zU�x����(R'@�d�:C��(��t�sb<��҉J�бo�TI��J�E�Nw���%�i�'��,S���
Ί�ej��l��q��ѣ<%��*�m5Ӯ�M�0=��9 s���~M��='���(W7�E���\�zw�p�=(�U�;wF)��f'�
~=����O
0��I���gtq���bK��q��;w���#h�w���� 4�����O#��� ���f=L��10{/��V`Ж�D[їD���4VH˒��X\�a�8|�d3� ?��U�� �:��E�5��i��C�X��K��f蹼#l���#�m��ZC�M���;����D����t�:^
t�{���wF��WEͬ�)�5��/��3]{���ȿ��u�Zl�	�2ክ:����Q&=�����a@S!e� ��]K(}�%o��z����8���9�Cc��5�aRF�A�K��`�UFҳ�M�cg̘N_�.:��,f�b	V�n�G���QL�8Fĉ?聼������e&��#G&
h$����N��e��y�@&�:���V�np�Qw$����#]�P]�}=����f�Y��b�lPt�d�H��Z��1!GS�k�Dk�@�JR��'��.!�7 �Ƒ���g�XP-���i��b�����4k�j��G]5�_#�o�D��ѠH�l2a�w L�\�����#�#�'[��,:ao~|r�q�3�ڹ�����j����\��0��� f������т-�ת�ڋeъ��i�XK�W��
����n2^��.&udz���W�w�bb�y�F�%��E�nyi-�:����^���fh�XZo��4�糮��jke��ӊ��条��KJng�?K��^�IG$f/�J�{��M����ׁ��s7������Mu�OG�Kw��c����l:�ZQ��H=�Ȏ�[��[<�ӎ��^"Y5���u3���&��ޡ)(��7�$wM^�UH��:@�W*W��M�V[�ˏ��_{9��h/tr��g����vv��B�jԺ��E����nz�
����9)�ո�UW#O�FX��G�+�|W�J~^�>xg�"!�gRϹrТ��,��1��^�OR4�Ac=��@(�q/��
s��Zs�_n?>(��^k�www� FN�      *   ]  x�}��r�0E��c�[��]v�|Cg:�Wgx�����X�+�^Y&`Ĥ�X+��K���������sn6G[DjE�۶iS��+�Sr4��_B� '�^���O�FL��V�g�P��r��!.Mwp�� !�b"��%�bȖG�s|�ږ��gI1��¯GEZ�a�⤸6����lT#�4H�����j[z)�x��|�G���
$�E���E(A��wC�ƺ�X�B����3�+vY�+1�I�����i@���n�@<hp�U6`rW��P͛W��O>T��-L�})���̌����B�����#U׾�m�ۇ
>Jf���s��a�d�Ε�/��~?6Q� uTY�      ,   �   x����
� �s|
_���v���)V�
{���KH!��������1���e��'�Lz�J=��&f(�%�rLKq,6���JY ��;����X��6j%�ƒ+��[�*�p��v�ci�z�Ӑ��h�ɲ��"����Z      ?   2   x�3�4�42�4����K-�4�2�4��s���f�%���ps��qqq �2	�      .   u  x��UMo�6=S�b�sMp�!R��6[`�K��e��,sc6%Ht\��w(;��-�na}�z�ͼ�dR0d%���ŲrڊR;�C|bl<<��o:�B���a�$�����1)��H��^
��������VK4��>�Zcm,��ժ�Ϛ�wKa]m�V�[a����1��G��,h?Z���;�B�4(������C�0̬��ԏ��0L���+�Ə�s�J	U-	4r�š&�_~��V�Iv)5��UYA��u�=�V]H$SL:�*V�\U*1ú��H�"��i���NW�63���kt�6e-��3e�6���a��$Ӆ��\�+�:a,�B����� �Z�-�����s�y������JI��a�/��I>S�Y��2�7c��T�:b{��-���U.fM4ɂܩJk��V�/p�Z�����W�+����¹|e���8+�ޅ��L	v��CM��P��\)!J�/�U�'E��h��9F8d.�i
�D�l��)�L�U�$�T�h������()������Jh���r��،c��	�!�C|��I�%$?�Kr����}��o�=m�ϱS��<ޑ%��[Ado���~wiߏ��E�8�Gf��$�~��؏��>�OCp{���*������&h`E�.mR�9g��
��'7	�]�|��I���oie�d�V�����4��`�r�I�F��㪉�n���0��G�u������3�6S�ڑ�2AO���)6����mH�L3��M�p��֚�U�)�͋ ��[�lʂfu4���g��r�v�!�>|�W�� |�8�W�i�|1��Rm�9��J�xK=��v��Μ�͜az>@�wT��6�xr U~�O]ha��R������c)J�*g1����D_xQ� +���      =   �   x�]�1�0Eg�9j҄6c'�
+�F**���S1�J���gY�!�����>*Eu=��R/������B�d�yr���S͔�3!vHl��~T������-��y��]�.���=�qJҁG��]���W���Y,0���SI�I�-�u>�ٕ�p�?�2����j�by�i��_�MCt      0   K   x�3��Pp
�4202�50�52P00�#�b���\F���>�~ή$�2�t�$I�	H�B��#T-1z\\\ �z&�      2   c  x���MK�@���hh�C af6�y��"^D(޼T*�UPۊ�ߛ,دXm�=����0�S��e��&p׿����BF.sT9�Y��W�ЪTl��t�r7Du
R�l�8�U�r�M.�CΣ����ĎO�q���r��}����=�|�եU�H����t2�ny�,^	�@jx����� u=��0D��i�h���UMa83u�
]���X?7��/M�P�z�r��J5�No4P}tmʱ�tE�K��f���ۖi��@��5I�L�{��EU@����U�2y�x�J�0O�O��V}�}8��	°�^?�����u�[�Ɲ����V��U�?"�P!�q�     