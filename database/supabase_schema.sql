-- Schéma de base de données Supabase pour SENEGEL ERP
-- Architecture hybride : Backendless (base) + Supabase (fonctionnalités avancées)

-- ========================================
-- EXTENSIONS
-- ========================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- TABLES UTILISATEURS
-- ========================================

-- Table des utilisateurs (synchronisée avec Backendless)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'formateur', 'apprenant', 'super_administrator', 'administrator', 'manager', 'supervisor', 'editor', 'entrepreneur', 'funder', 'mentor', 'intern', 'trainer', 'implementer', 'coach', 'facilitator', 'publisher', 'producer', 'artist', 'alumni')),
    avatar TEXT,
    skills TEXT[] DEFAULT '{}',
    phone VARCHAR(20),
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index pour les performances
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ========================================
-- TABLES PROJETS
-- ========================================

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    start_date DATE,
    end_date DATE,
    due_date DATE,
    budget DECIMAL(15,2) DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_members JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done', 'Cancelled')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    estimated_time INTEGER, -- en minutes
    logged_time INTEGER DEFAULT 0, -- en minutes
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des risques
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    likelihood VARCHAR(20) NOT NULL CHECK (likelihood IN ('High', 'Medium', 'Low')),
    impact VARCHAR(20) NOT NULL CHECK (impact IN ('High', 'Medium', 'Low')),
    mitigation_strategy TEXT,
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'Mitigated', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES FORMATION
-- ========================================

-- Table des cours
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    duration VARCHAR(50), -- ex: "4 semaines", "20 heures"
    level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(100),
    thumbnail TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    price DECIMAL(10,2) DEFAULT 0,
    max_students INTEGER,
    current_students INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des modules de cours
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des leçons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'reading', 'quiz', 'assignment')),
    duration VARCHAR(20), -- ex: "15 minutes"
    content TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des inscriptions aux cours
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
    UNIQUE(course_id, user_id)
);

-- Table des leçons complétées
CREATE TABLE IF NOT EXISTS completed_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(enrollment_id, lesson_id)
);

-- ========================================
-- TABLES CRM
-- ========================================

-- Table des contacts
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    work_email VARCHAR(255),
    personal_email VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Lead', 'Contacted', 'Prospect', 'Customer', 'Lost')),
    avatar TEXT,
    office_phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    position VARCHAR(100),
    industry VARCHAR(100),
    source VARCHAR(100), -- comment ils nous ont trouvés
    notes TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES FINANCIÈRES
-- ========================================

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Partially Paid', 'Cancelled')),
    description TEXT,
    items JSONB DEFAULT '[]',
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_date DATE,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    receipt_url TEXT,
    recurring_source_id UUID,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    date DATE NOT NULL,
    due_date DATE,
    receipt_url TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Paid', 'Unpaid', 'Partially Paid')),
    budget_item_id UUID,
    recurring_source_id UUID,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES RESSOURCES HUMAINES
-- ========================================

-- Table des pointages de temps
CREATE TABLE IF NOT EXISTS time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('project', 'course', 'task')),
    entity_id UUID NOT NULL,
    entity_title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    duration INTEGER NOT NULL, -- en minutes
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes de congés
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES ANALYTICS
-- ========================================

-- Table des événements analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES DOCUMENTS
-- ========================================

-- Table des documents (base de connaissances)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    file_url TEXT,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES OBJECTIFS (OKRs)
-- ========================================

-- Table des objectifs
CREATE TABLE IF NOT EXISTS objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    period VARCHAR(20) NOT NULL CHECK (period IN ('Q1', 'Q2', 'Q3', 'Q4', 'Annual')),
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des résultats clés
CREATE TABLE IF NOT EXISTS key_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID REFERENCES objectives(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    current_value DECIMAL(15,2) DEFAULT 0,
    target_value DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'at_risk')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLES RÉUNIONS
-- ========================================

-- Table des réunions
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    meeting_url TEXT,
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des participants aux réunions
CREATE TABLE IF NOT EXISTS meeting_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'attended', 'absent')),
    response_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(meeting_id, user_id)
);

-- ========================================
-- TABLES BUDGETS
-- ========================================

-- Table des budgets
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Project', 'Office', 'Department', 'Company')),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'exceeded')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des lignes de budget
CREATE TABLE IF NOT EXISTS budget_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des éléments de budget
CREATE TABLE IF NOT EXISTS budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_line_id UUID REFERENCES budget_lines(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEX POUR PERFORMANCE
-- ========================================

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON projects(due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

CREATE INDEX IF NOT EXISTS idx_time_logs_user_id ON time_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_date ON time_logs(date);

CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);

CREATE INDEX IF NOT EXISTS idx_objectives_project_id ON objectives(project_id);
CREATE INDEX IF NOT EXISTS idx_objectives_period_year ON objectives(period, year);

CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON meetings(organizer_id);

CREATE INDEX IF NOT EXISTS idx_budgets_project_id ON budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_type ON budgets(type);

-- ========================================
-- TRIGGERS POUR UPDATED_AT
-- ========================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour toutes les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_logs_updated_at BEFORE UPDATE ON time_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_objectives_updated_at BEFORE UPDATE ON objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_results_updated_at BEFORE UPDATE ON key_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLITIQUES RLS
-- ========================================

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les projets
CREATE POLICY "Users can view projects they own or are assigned to" ON projects
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid()::text = ANY(SELECT jsonb_array_elements_text(team_members))
    );

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Project owners can update their projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les tâches
CREATE POLICY "Users can view tasks from their projects" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = tasks.project_id 
            AND (p.user_id = auth.uid() OR auth.uid()::text = ANY(SELECT jsonb_array_elements_text(p.team_members)))
        )
    );

-- Politiques pour les cours
CREATE POLICY "All authenticated users can view active courses" ON courses
    FOR SELECT USING (status = 'active' AND auth.role() = 'authenticated');

CREATE POLICY "Instructors can manage their courses" ON courses
    FOR ALL USING (auth.uid() = instructor_id);

-- Politiques pour les inscriptions aux cours
CREATE POLICY "Users can view their own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les contacts CRM
CREATE POLICY "Users can view contacts assigned to them" ON contacts
    FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Users can manage contacts assigned to them" ON contacts
    FOR ALL USING (auth.uid() = assigned_to);

-- Politiques pour les factures
CREATE POLICY "Users can view invoices they created" ON invoices
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Politiques pour les dépenses
CREATE POLICY "Users can view expenses they created" ON expenses
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Politiques pour les pointages de temps
CREATE POLICY "Users can view their own time logs" ON time_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time logs" ON time_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les demandes de congés
CREATE POLICY "Users can view their own leave requests" ON leave_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leave requests" ON leave_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les documents
CREATE POLICY "Users can view public documents or their own" ON documents
    FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ========================================
-- FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour calculer la progression d'un cours
CREATE OR REPLACE FUNCTION calculate_course_progress(course_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    -- Compter le nombre total de leçons requises
    SELECT COUNT(*) INTO total_lessons
    FROM lessons l
    JOIN course_modules cm ON l.module_id = cm.id
    WHERE cm.course_id = course_uuid AND l.is_required = true;
    
    -- Compter les leçons complétées par l'utilisateur
    SELECT COUNT(*) INTO completed_lessons
    FROM completed_lessons cl
    JOIN course_enrollments ce ON cl.enrollment_id = ce.id
    JOIN lessons l ON cl.lesson_id = l.id
    JOIN course_modules cm ON l.module_id = cm.id
    WHERE ce.course_id = course_uuid 
    AND ce.user_id = user_uuid 
    AND l.is_required = true;
    
    -- Calculer le pourcentage
    IF total_lessons = 0 THEN
        RETURN 0;
    ELSE
        RETURN ROUND((completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le temps total passé sur un projet
CREATE OR REPLACE FUNCTION calculate_project_time(project_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(duration) FROM time_logs 
         WHERE entity_type = 'project' AND entity_id = project_uuid::text),
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_projects', (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid),
        'completed_projects', (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid AND status = 'Completed'),
        'total_courses', (SELECT COUNT(*) FROM course_enrollments WHERE user_id = user_uuid),
        'completed_courses', (SELECT COUNT(*) FROM course_enrollments WHERE user_id = user_uuid AND status = 'completed'),
        'total_time_logged', (SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE user_id = user_uuid),
        'active_tasks', (SELECT COUNT(*) FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.assignee_id = user_uuid AND t.status != 'Done')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- DONNÉES INITIALES
-- ========================================

-- Insérer des utilisateurs de test SENEGEL
INSERT INTO users (id, email, name, role, avatar, skills, phone, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'fatou.ndiaye@senegel.org', 'Fatou N''diaye', 'admin', 'https://picsum.photos/seed/admin/100/100', ARRAY['System Administration', 'Data Analysis', 'Strategic Planning'], '+221 78 123 45 67', 'Dakar, Sénégal'),
('550e8400-e29b-41d4-a716-446655440002', 'moussa.faye@senegel.org', 'Moussa Faye', 'formateur', 'https://picsum.photos/seed/formateur/100/100', ARRAY['Formation', 'Pédagogie', 'Gestion de Projets'], '+221 78 234 56 78', 'Dakar, Sénégal'),
('550e8400-e29b-41d4-a716-446655440003', 'amina.diop@senegel.org', 'Amina Diop', 'apprenant', 'https://picsum.photos/seed/apprenant/100/100', ARRAY['Digital Marketing', 'Community Management', 'Content Creation'], '+221 78 345 67 89', 'Dakar, Sénégal'),
('550e8400-e29b-41d4-a716-446655440004', 'admin@senegel.org', 'Administrateur SENEGEL', 'super_administrator', 'https://picsum.photos/seed/superadmin/100/100', ARRAY['System Administration', 'Data Analysis', 'Strategic Planning'], '+221 78 456 78 90', 'Dakar, Sénégal')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- COMMENTAIRES
-- ========================================

COMMENT ON TABLE users IS 'Utilisateurs de la plateforme SENEGEL ERP';
COMMENT ON TABLE projects IS 'Projets gérés par la plateforme';
COMMENT ON TABLE tasks IS 'Tâches associées aux projets';
COMMENT ON TABLE risks IS 'Risques identifiés pour les projets';
COMMENT ON TABLE courses IS 'Cours de formation disponibles';
COMMENT ON TABLE course_enrollments IS 'Inscriptions aux cours';
COMMENT ON TABLE contacts IS 'Contacts CRM et prospects';
COMMENT ON TABLE invoices IS 'Factures et facturation';
COMMENT ON TABLE expenses IS 'Dépenses et coûts';
COMMENT ON TABLE time_logs IS 'Pointages de temps des utilisateurs';
COMMENT ON TABLE leave_requests IS 'Demandes de congés';
COMMENT ON TABLE analytics_events IS 'Événements pour analytics et métriques';
COMMENT ON TABLE documents IS 'Base de connaissances et documentation';
COMMENT ON TABLE objectives IS 'Objectifs OKR';
COMMENT ON TABLE key_results IS 'Résultats clés des objectifs';
COMMENT ON TABLE meetings IS 'Réunions et rendez-vous';
COMMENT ON TABLE budgets IS 'Budgets et allocations financières';

-- ========================================
-- FIN DU SCHÉMA
-- ========================================

-- Le schéma Supabase est maintenant prêt pour SENEGEL ERP !
-- Architecture hybride : Backendless (base) + Supabase (fonctionnalités avancées)
-- RLS activé pour la sécurité des données
-- Index optimisés pour les performances
-- Fonctions utilitaires pour les calculs métier
