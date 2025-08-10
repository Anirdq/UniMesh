-- Location: supabase/migrations/20250109133149_unimesh_complete_platform.sql
-- UniMesh: Complete University Student Networking Platform
-- Modules: Authentication, Profile Management, Discovery, Communication, Community

-- 1. Custom Types and Enums
CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'moderator');
CREATE TYPE public.academic_year AS ENUM ('freshman', 'sophomore', 'junior', 'senior', 'graduate', 'phd');
CREATE TYPE public.connection_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'file');
CREATE TYPE public.event_type AS ENUM ('academic', 'social', 'sports', 'cultural', 'workshop', 'meetup');
CREATE TYPE public.organization_category AS ENUM ('academic', 'cultural', 'sports', 'technology', 'volunteer', 'professional', 'hobby');
CREATE TYPE public.join_request_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Core User Management Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    university TEXT NOT NULL,
    major TEXT,
    academic_year public.academic_year,
    role public.user_role DEFAULT 'student'::public.user_role,
    bio TEXT,
    profile_picture_url TEXT,
    looking_for TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Profile Skills and Interests
CREATE TABLE public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    interest_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Learning and Building Sections
CREATE TABLE public.user_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_code TEXT NOT NULL,
    class_name TEXT NOT NULL,
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    description TEXT,
    repository_url TEXT,
    demo_url TEXT,
    technologies TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Connection and Discovery System
CREATE TABLE public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    requestee_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.connection_status DEFAULT 'pending'::public.connection_status,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, requestee_id)
);

-- 6. Messaging System
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    is_group BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    message_type public.message_type DEFAULT 'text'::public.message_type,
    file_url TEXT,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Campus Events System
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_type public.event_type DEFAULT 'social'::public.event_type,
    location TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    max_attendees INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 8. Student Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category public.organization_category DEFAULT 'academic'::public.organization_category,
    logo_url TEXT,
    website_url TEXT,
    contact_email TEXT,
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

CREATE TABLE public.join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.join_request_status DEFAULT 'pending'::public.join_request_status,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- 9. Notice Board System
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'general',
    is_approved BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('event-images', 'event-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('organization-logos', 'organization-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('message-attachments', 'message-attachments', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- 11. Indexes for Performance
CREATE INDEX idx_user_profiles_university ON public.user_profiles(university);
CREATE INDEX idx_user_profiles_academic_year ON public.user_profiles(academic_year);
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_user_interests_user_id ON public.user_interests(user_id);
CREATE INDEX idx_user_classes_user_id ON public.user_classes(user_id);
CREATE INDEX idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX idx_connections_requester_id ON public.connections(requester_id);
CREATE INDEX idx_connections_requestee_id ON public.connections(requestee_id);
CREATE INDEX idx_connections_status ON public.connections(status);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX idx_organization_members_organization_id ON public.organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_notices_author_id ON public.notices(author_id);
CREATE INDEX idx_notices_created_at ON public.notices(created_at);

-- 12. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 13. Helper Functions
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_uuid 
    AND cp.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_organization_member(org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = org_uuid 
    AND om.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- 14. RLS Policies

-- User Profiles (Pattern 1: Core User Table)
CREATE POLICY "users_manage_own_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "public_read_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (is_active = true);

-- User Skills (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_skills"
ON public.user_skills
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User Interests (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_interests"
ON public.user_interests
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User Classes (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_classes"
ON public.user_classes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User Projects (Pattern 2: Simple User Ownership + Public Read)
CREATE POLICY "users_manage_own_projects"
ON public.user_projects
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_read_projects"
ON public.user_projects
FOR SELECT
TO public
USING (true);

-- Connections (Pattern 3: Operation-Specific)
CREATE POLICY "users_view_own_connections"
ON public.connections
FOR SELECT
TO authenticated
USING (requester_id = auth.uid() OR requestee_id = auth.uid());

CREATE POLICY "users_create_connections"
ON public.connections
FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "users_update_own_connections"
ON public.connections
FOR UPDATE
TO authenticated
USING (requestee_id = auth.uid())
WITH CHECK (requestee_id = auth.uid());

-- Conversations (Pattern 7: Complex Relationships)
CREATE POLICY "participants_access_conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(id));

CREATE POLICY "users_create_conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Conversation Participants (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_participation"
ON public.conversation_participants
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Messages (Pattern 7: Complex Relationships)
CREATE POLICY "participants_view_messages"
ON public.messages
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "users_create_messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid() AND public.is_conversation_participant(conversation_id));

-- Events (Pattern 4: Public Read, Private Write)
CREATE POLICY "public_read_events"
ON public.events
FOR SELECT
TO public
USING (is_public = true);

CREATE POLICY "users_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

-- Event Attendees (Pattern 2: Simple User Ownership + Event Access)
CREATE POLICY "users_manage_own_attendance"
ON public.event_attendees
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Organizations (Pattern 4: Public Read, Private Write)
CREATE POLICY "public_read_organizations"
ON public.organizations
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admins_manage_organizations"
ON public.organizations
FOR ALL
TO authenticated
USING (admin_id = auth.uid())
WITH CHECK (admin_id = auth.uid());

-- Organization Members (Pattern 7: Complex Relationships)
CREATE POLICY "members_view_organization_membership"
ON public.organization_members
FOR SELECT
TO authenticated
USING (public.is_organization_member(organization_id) OR user_id = auth.uid());

CREATE POLICY "users_join_organizations"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Join Requests (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_join_requests"
ON public.join_requests
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Notices (Pattern 4: Public Read, Private Write)
CREATE POLICY "public_read_approved_notices"
ON public.notices
FOR SELECT
TO public
USING (is_approved = true);

CREATE POLICY "users_manage_own_notices"
ON public.notices
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Storage Policies
CREATE POLICY "users_view_profile_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

CREATE POLICY "users_upload_own_profile_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-images' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_profile_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "users_delete_own_profile_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "public_view_event_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "users_upload_event_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images' AND owner = auth.uid());

CREATE POLICY "public_view_organization_logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'organization-logos');

CREATE POLICY "users_upload_organization_logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'organization-logos' AND owner = auth.uid());

CREATE POLICY "participants_view_message_attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-attachments'
    AND (owner = auth.uid() OR EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversation_participants cp ON m.conversation_id = cp.conversation_id
        WHERE m.file_url LIKE '%' || name || '%'
        AND cp.user_id = auth.uid()
    ))
);

CREATE POLICY "users_upload_message_attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message-attachments' AND owner = auth.uid());

-- 15. Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, university, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'university', 'Unknown University'),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 16. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
    BEFORE UPDATE ON public.connections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 17. Mock Data
DO $$
DECLARE
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    student3_uuid UUID := gen_random_uuid();
    admin_uuid UUID := gen_random_uuid();
    project1_uuid UUID := gen_random_uuid();
    project2_uuid UUID := gen_random_uuid();
    event1_uuid UUID := gen_random_uuid();
    event2_uuid UUID := gen_random_uuid();
    org1_uuid UUID := gen_random_uuid();
    org2_uuid UUID := gen_random_uuid();
    conversation1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alex.chen@university.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Chen", "university": "Tech University", "role": "student"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'maya.patel@university.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Maya Patel", "university": "Tech University", "role": "student"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'jordan.smith@university.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jordan Smith", "university": "Tech University", "role": "student"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@university.edu', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "University Admin", "university": "Tech University", "role": "admin"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional data
    UPDATE public.user_profiles SET
        major = 'Computer Science',
        academic_year = 'junior'::public.academic_year,
        bio = 'Passionate about machine learning and web development. Looking for project collaborators and study partners.',
        looking_for = 'Seeking a partner for a hackathon and study group for CS301'
    WHERE id = student1_uuid;

    UPDATE public.user_profiles SET
        major = 'Data Science',
        academic_year = 'sophomore'::public.academic_year,
        bio = 'Exploring the intersection of statistics and technology. Love analyzing patterns in data.',
        looking_for = 'Looking for research opportunities and ML study group'
    WHERE id = student2_uuid;

    UPDATE public.user_profiles SET
        major = 'Software Engineering',
        academic_year = 'senior'::public.academic_year,
        bio = 'Full-stack developer with a passion for clean code and user experience.',
        looking_for = 'Open to making new friends and mentoring junior students'
    WHERE id = student3_uuid;

    -- Insert skills and interests
    INSERT INTO public.user_skills (user_id, skill_name) VALUES
        (student1_uuid, 'Python'),
        (student1_uuid, 'Machine Learning'),
        (student1_uuid, 'React'),
        (student2_uuid, 'Python'),
        (student2_uuid, 'Statistics'),
        (student2_uuid, 'SQL'),
        (student3_uuid, 'JavaScript'),
        (student3_uuid, 'Node.js'),
        (student3_uuid, 'AWS');

    INSERT INTO public.user_interests (user_id, interest_name) VALUES
        (student1_uuid, 'AI/ML'),
        (student1_uuid, 'Web Development'),
        (student1_uuid, 'Photography'),
        (student2_uuid, 'Data Visualization'),
        (student2_uuid, 'Yoga'),
        (student2_uuid, 'Cooking'),
        (student3_uuid, 'Open Source'),
        (student3_uuid, 'Rock Climbing'),
        (student3_uuid, 'Music Production');

    -- Insert classes
    INSERT INTO public.user_classes (user_id, class_code, class_name, semester) VALUES
        (student1_uuid, 'CS301', 'Advanced Data Structures', 'Fall 2025'),
        (student1_uuid, 'CS420', 'Machine Learning', 'Fall 2025'),
        (student2_uuid, 'STAT302', 'Statistical Methods', 'Fall 2025'),
        (student2_uuid, 'CS301', 'Advanced Data Structures', 'Fall 2025'),
        (student3_uuid, 'SE401', 'Software Architecture', 'Fall 2025');

    -- Insert projects
    INSERT INTO public.user_projects (id, user_id, project_name, description, repository_url, technologies) VALUES
        (project1_uuid, student1_uuid, 'Campus Food Tracker', 
         'Mobile app to track dining hall hours and menu items',
         'https://github.com/alexchen/campus-food-tracker',
         ARRAY['React Native', 'Firebase', 'Node.js']),
        (project2_uuid, student3_uuid, 'Study Group Finder',
         'Web platform to help students find study groups for their classes',
         'https://github.com/jordansmith/study-group-finder',
         ARRAY['React', 'Express.js', 'PostgreSQL']);

    -- Insert connections
    INSERT INTO public.connections (requester_id, requestee_id, status, message) VALUES
        (student1_uuid, student2_uuid, 'accepted'::public.connection_status, 'Hey! I see we are both in CS301. Want to form a study group?'),
        (student3_uuid, student1_uuid, 'pending'::public.connection_status, 'I would love to mentor you on full-stack development!');

    -- Insert organizations
    INSERT INTO public.organizations (id, name, description, category, admin_id) VALUES
        (org1_uuid, 'Tech Entrepreneurs Club',
         'A community for students interested in startups and entrepreneurship',
         'technology'::public.organization_category, admin_uuid),
        (org2_uuid, 'Data Science Society',
         'Learn and practice data science skills through workshops and projects',
         'academic'::public.organization_category, student2_uuid);

    -- Insert organization members
    INSERT INTO public.organization_members (organization_id, user_id, role) VALUES
        (org1_uuid, admin_uuid, 'admin'),
        (org1_uuid, student1_uuid, 'member'),
        (org2_uuid, student2_uuid, 'admin'),
        (org2_uuid, student1_uuid, 'member');

    -- Insert events
    INSERT INTO public.events (id, title, description, event_type, location, start_date, organizer_id, max_attendees) VALUES
        (event1_uuid, 'Hackathon 2025: Build for Good',
         'A 48-hour hackathon focused on creating solutions for social impact',
         'workshop'::public.event_type, 'Computer Science Building, Room 101',
         '2025-02-15 09:00:00+00', student3_uuid, 100),
        (event2_uuid, 'Data Science Workshop: Intro to ML',
         'Learn the basics of machine learning with hands-on exercises',
         'workshop'::public.event_type, 'Library Conference Room A',
         '2025-01-20 14:00:00+00', student2_uuid, 30);

    -- Insert event attendees
    INSERT INTO public.event_attendees (event_id, user_id) VALUES
        (event1_uuid, student1_uuid),
        (event1_uuid, student2_uuid),
        (event2_uuid, student1_uuid),
        (event2_uuid, student3_uuid);

    -- Insert conversation and messages
    INSERT INTO public.conversations (id, name, is_group, created_by) VALUES
        (conversation1_uuid, 'CS301 Study Group', true, student1_uuid);

    INSERT INTO public.conversation_participants (conversation_id, user_id) VALUES
        (conversation1_uuid, student1_uuid),
        (conversation1_uuid, student2_uuid);

    INSERT INTO public.messages (conversation_id, sender_id, content) VALUES
        (conversation1_uuid, student1_uuid, 'Hey Maya! Ready to tackle those algorithm problems?'),
        (conversation1_uuid, student2_uuid, 'Absolutely! I have been working through the dynamic programming chapter.');

    -- Insert notices
    INSERT INTO public.notices (title, content, author_id, category, is_approved) VALUES
        ('Study Group for CS301', 
         'Looking for 2-3 more students to join our CS301 study group. We meet every Tuesday and Thursday at 7 PM in the library.',
         student1_uuid, 'academic', true),
        ('Selling Engineering Graphics Tools',
         'Barely used compass set and drawing tools. Great condition, asking $25. Contact me if interested!',
         student3_uuid, 'marketplace', true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;