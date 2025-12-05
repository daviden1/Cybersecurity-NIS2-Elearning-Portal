BEGIN;

-- Insert sample courses
INSERT INTO courses (title, description, video_url, duration_minutes, is_active) VALUES
('Conformità NIS2: Fondamenti', 'Questo corso copre i fondamenti della direttiva NIS2, inclusi i requisiti di sicurezza, gli obblighi di reporting e le migliori pratiche per la conformità delle organizzazioni critiche.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 120, true),
('Gestione Incidenti & Reporting', 'Impara come gestire efficacemente gli incidenti di sicurezza, implementare procedure di reporting secondo NIS2 e mantenere la resilienza operativa.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 90, true),
('Framework di Sicurezza per PMI', 'Scopri come implementare framework di sicurezza adatti alle piccole e medie imprese, con focus su soluzioni pratiche e conformità normativa.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 150, true);

-- Get the course IDs for quiz creation
DO $$
DECLARE
    nis2_course UUID;
    incident_course UUID;
    framework_course UUID;
BEGIN
    SELECT id INTO nis2_course FROM courses WHERE title = 'Conformità NIS2: Fondamenti';
    SELECT id INTO incident_course FROM courses WHERE title = 'Gestione Incidenti & Reporting';
    SELECT id INTO framework_course FROM courses WHERE title = 'Framework di Sicurezza per PMI';

    -- Insert quizzes for each course
    INSERT INTO quizzes (course_id, title, passing_score) VALUES
    (nis2_course, 'Quiz Finale: Conformità NIS2', 70),
    (incident_course, 'Quiz Finale: Gestione Incidenti', 75),
    (framework_course, 'Quiz Finale: Framework di Sicurezza', 70);

    -- Get quiz IDs for questions
    INSERT INTO quiz_questions (quiz_id, question, options, correct_answer) VALUES
    -- NIS2 Quiz Questions
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Conformità NIS2'), 
     'Qual è l''obiettivo principale della direttiva NIS2?', 
     ARRAY['Proteggere i dati personali', 'Migliorare la cybersicurezza nell''UE', 'Regolare il commercio elettronico', 'Standardizzare le password'],
     1),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Conformità NIS2'), 
     'Entro quanto tempo deve essere notificato un incidente grave?', 
     ARRAY['24 ore', '48 ore', '72 ore', '1 settimana'],
     2),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Conformità NIS2'), 
     'Chi è responsabile dell''implementazione NIS2 in un''azienda?', 
     ARRAY['Solo il CEO', 'Il responsabile IT', 'Il management aziendale', 'I dipendenti'],
     2),

    -- Incident Management Quiz Questions
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Gestione Incidenti'), 
     'Qual è il primo passo nella gestione di un incidente?', 
     ARRAY['Contattare le autorità', 'Identificare e contenere', 'Documentare tutto', 'Informare i clienti'],
     1),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Gestione Incidenti'), 
     'Cosa include un piano di risposta agli incidenti?', 
     ARRAY['Solo contatti di emergenza', 'Procedure complete e ruoli', 'Solo backup dei dati', 'Solo formazione'],
     1),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Gestione Incidenti'), 
     'Qual è lo scopo del post-mortem analysis?', 
     ARRAY['Assegnare colpe', 'Imparare e migliorare', 'Punire i responsabili', 'Creare documentazione'],
     1),

    -- Framework Quiz Questions
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Framework di Sicurezza'), 
     'Quale framework è basato su controlli di sicurezza?', 
     ARRAY['ISO 27001', 'GDPR', 'NIS2', 'SOX'],
     0),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Framework di Sicurezza'), 
     'Cosa è un risk assessment?', 
     ARRAY['Valutazione dei rischi di sicurezza', 'Test di penetrazione', 'Audit finanziario', 'Analisi del personale'],
     0),
    ((SELECT id FROM quizzes WHERE title = 'Quiz Finale: Framework di Sicurezza'), 
     'Qual è il principio di "defense in depth"?', 
     ARRAY['Un solo livello di sicurezza', 'Più livelli di protezione', 'Solo sicurezza fisica', 'Solo sicurezza digitale'],
     1);
END $$;

COMMIT;