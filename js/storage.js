/**
 * Vectis Assess - Centralized Storage Service Layer
 * Encapsulates localStorage access, multi-contest data models,
 * contest-scoped tasks/submissions/telemetry, and session management.
 */

const STORAGE_KEYS = {
  INITIALIZED: 'vectis_db_initialized_v2',
  USERS: 'vectis_users',
  CONTESTS: 'vectis_contests',
  TASKS: 'vectis_tasks',
  SUBMISSIONS: 'vectis_submissions',
  SCORES: 'vectis_scores',
  MONITORING_EVENTS: 'vectis_monitoring_events',
  SETTINGS: 'vectis_settings',
  SESSION: 'vectis_session',
  PARTICIPANT_TASK_STATES: 'vectis_participant_task_states',
  PDF_CACHE: 'vectis_pdf_cache',
  // Backward compatibility keys
  CURRENT_USER: 'vectis_current_user',
  PARTICIPANTS: 'vectis_participants'
};

const StorageService = {
  /**
   * Initialize localStorage with multi-contest seed data if not initialized
   */
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetDemoData();
    }
  },

  /**
   * Reset the entire demo database back to initial SEED_DATA
   */
  resetDemoData() {
    try {
      const users = SEED_DATA.users || [SEED_DATA.adminUser, ...SEED_DATA.participants];
      const contests = SEED_DATA.contests || [];
      const tasks = SEED_DATA.tasks || [];
      const submissions = SEED_DATA.submissions || [];
      const monitoringEvents = SEED_DATA.monitoringEvents || [];

      // Make sure all tasks, submissions, and events have contest-001 by default
      tasks.forEach(t => { t.contestId = t.contestId || "contest-001"; });
      submissions.forEach(s => { s.contestId = s.contestId || "contest-001"; });
      monitoringEvents.forEach(e => { e.contestId = e.contestId || "contest-001"; });

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(contests));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      localStorage.setItem(STORAGE_KEYS.MONITORING_EVENTS, JSON.stringify(monitoringEvents));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_DATA.contestSettings));
      localStorage.setItem(STORAGE_KEYS.PARTICIPANT_TASK_STATES, JSON.stringify({
        "#027": SEED_DATA.participantTaskStates
      }));
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(SEED_DATA.participants));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

      console.log('ACI Career Edge Program: Multi-contest demo database reset successfully.');
      return true;
    } catch (e) {
      console.error('StorageService: Failed to reset demo data', e);
      return false;
    }
  },

  /* ---------------- Session & Current Contest ---------------- */
  getSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (data) return JSON.parse(data);

      // Fallback check on old CURRENT_USER
      const oldUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (oldUser) {
        const u = JSON.parse(oldUser);
        return {
          userId: u.id,
          role: u.role,
          currentContestId: null,
          loginTime: new Date().toISOString()
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  setSession(session) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      // Sync backward-compatible current user
      if (session && session.userId) {
        const user = this.getUser(session.userId);
        if (user) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to set session', e);
      return false;
    }
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentContestId() {
    // 1. Check URL query params first (e.g. ?contest=contest-001 or ?contestId=contest-001)
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const urlContest = params.get('contest') || params.get('contestId');
      if (urlContest) {
        this.setCurrentContestId(urlContest);
        return urlContest;
      }
    }

    // 2. Check session
    const session = this.getSession();
    if (session && session.currentContestId) {
      return session.currentContestId;
    }

    // 3. Fallback
    return null;
  },

  setCurrentContestId(contestId) {
    const session = this.getSession() || {
      userId: null,
      role: null,
      currentContestId: null,
      loginTime: new Date().toISOString()
    };
    session.currentContestId = contestId;
    this.setSession(session);
  },

  clearCurrentContestId() {
    const session = this.getSession();
    if (session) {
      session.currentContestId = null;
      this.setSession(session);
    }
  },

  getCurrentUser() {
    const session = this.getSession();
    if (!session || !session.userId) return null;
    return this.getUser(session.userId);
  },

  setCurrentUser(user) {
    if (!user) {
      this.clearSession();
      return;
    }
    const session = this.getSession() || {};
    session.userId = user.id;
    session.role = user.role;
    session.loginTime = session.loginTime || new Date().toISOString();
    this.setSession(session);
  },

  clearCurrentUser() {
    this.clearSession();
  },

  /* ---------------- Users (Participants & Admins) ---------------- */
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : (SEED_DATA.users || [SEED_DATA.adminUser, ...SEED_DATA.participants]);
    } catch (e) {
      return SEED_DATA.users || [SEED_DATA.adminUser, ...SEED_DATA.participants];
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      // Also update participants for backward compatibility
      const participants = users.filter(u => u.role === 'participant');
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
      return true;
    } catch (e) {
      console.error('Failed to save users', e);
      return false;
    }
  },

  getUser(identifier) {
    if (!identifier) return null;
    const users = this.getUsers();
    const clean = String(identifier).trim().toLowerCase();
    return users.find(u => 
      (u.id && u.id.toLowerCase() === clean) ||
      (u.participantId && u.participantId.toLowerCase() === clean) ||
      (u.email && u.email.toLowerCase() === clean) ||
      (u.altEmail && u.altEmail.toLowerCase() === clean) ||
      (u.phone && u.phone.replace(/\D/g, '') === clean.replace(/\D/g, ''))
    );
  },

  updateUser(identifier, updates) {
    const users = this.getUsers();
    const clean = String(identifier).trim().toLowerCase();
    const idx = users.findIndex(u => 
      (u.id && u.id.toLowerCase() === clean) ||
      (u.participantId && u.participantId.toLowerCase() === clean) ||
      (u.email && u.email.toLowerCase() === clean)
    );
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  saveUser(user) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.participantId === user.participantId || u.email === user.email);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    return this.saveUsers(users);
  },

  // Backward-compatible participant methods
  getParticipants() {
    return this.getUsers().filter(u => u.role === 'participant');
  },

  saveParticipants(participants) {
    const users = this.getUsers();
    const admin = users.find(u => u.role === 'admin') || SEED_DATA.adminUser;
    return this.saveUsers([admin, ...participants]);
  },

  getParticipant(identifier) {
    const user = this.getUser(identifier);
    return user && user.role === 'participant' ? user : null;
  },

  updateParticipant(identifier, updates) {
    return this.updateUser(identifier, updates);
  },

  /* ---------------- Contests ---------------- */
  getContests() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTESTS);
      const list = data ? JSON.parse(data) : (SEED_DATA.contests || []);
      // Recalculate dynamic status based on time
      return list.map(c => ({
        ...c,
        computedStatus: typeof getContestStatus === 'function' ? getContestStatus(c) : c.status
      }));
    } catch (e) {
      return SEED_DATA.contests || [];
    }
  },

  getContest(contestId) {
    if (!contestId) return null;
    const contests = this.getContests();
    return contests.find(c => c.id === contestId);
  },

  saveContests(contests) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(contests));
      return true;
    } catch (e) {
      console.error('Failed to save contests', e);
      return false;
    }
  },

  saveContest(contest) {
    const contests = this.getContests();
    const idx = contests.findIndex(c => c.id === contest.id);
    if (idx !== -1) {
      contests[idx] = contest;
    } else {
      contests.unshift(contest);
    }
    return this.saveContests(contests);
  },

  deleteContest(contestId) {
    const contests = this.getContests().filter(c => c.id !== contestId);
    return this.saveContests(contests);
  },

  /* ---------------- Contest Settings ---------------- */
  getSettings(contestId = null) {
    const cid = contestId || this.getCurrentContestId();
    if (cid) {
      const contest = this.getContest(cid);
      if (contest && contest.settings) return contest.settings;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : SEED_DATA.contestSettings;
    } catch (e) {
      return SEED_DATA.contestSettings;
    }
  },

  saveSettings(settings, contestId = null) {
    const cid = contestId || this.getCurrentContestId();
    if (cid) {
      const contest = this.getContest(cid);
      if (contest) {
        contest.settings = { ...(contest.settings || {}), ...settings };
        this.saveContest(contest);
      }
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Failed to save settings', e);
      return false;
    }
  },

  /* ---------------- Tasks (Contest Scoped) ---------------- */
  getTasks(contestId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      const allTasks = data ? JSON.parse(data) : (SEED_DATA.tasks || []);

      // If 'all' explicitly passed, return everything
      if (contestId === 'all') return allTasks;

      // Filter by specified contest or active session contest
      const targetCid = contestId !== null ? contestId : this.getCurrentContestId();
      if (targetCid) {
        return allTasks.filter(t => (t.contestId || "contest-001") === targetCid);
      }
      return allTasks;
    } catch (e) {
      return SEED_DATA.tasks || [];
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Failed to save tasks', e);
      return false;
    }
  },

  getTask(taskId) {
    const all = this.getTasks('all');
    return all.find(t => t.id === taskId || t.taskNumber === taskId);
  },

  saveTask(task) {
    if (!task.contestId) {
      task.contestId = this.getCurrentContestId() || "contest-001";
    }
    const allTasks = this.getTasks('all');
    const index = allTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    return this.saveTasks(allTasks);
  },

  deleteTask(taskId) {
    const allTasks = this.getTasks('all').filter(t => t.id !== taskId);
    return this.saveTasks(allTasks);
  },

  /* ---------------- Participant Task States ---------------- */
  getParticipantTaskStates(participantId = "#027", contestId = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_TASK_STATES);
      const all = raw ? JSON.parse(raw) : {};
      const cid = contestId || this.getCurrentContestId() || 'contest-001';
      const key = `${cid}_${participantId}`;
      if (all[key]) return all[key];
      if (all[participantId]) return all[participantId];
      return SEED_DATA.participantTaskStates;
    } catch (e) {
      return SEED_DATA.participantTaskStates;
    }
  },

  updateParticipantTaskState(participantId, taskId, stateUpdate, contestId = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_TASK_STATES);
      const all = raw ? JSON.parse(raw) : {};
      const cid = contestId || this.getCurrentContestId() || 'contest-001';
      const key = `${cid}_${participantId}`;
      if (!all[key]) {
        all[key] = { ...(all[participantId] || SEED_DATA.participantTaskStates) };
      }
      all[key][taskId] = {
        ...(all[key][taskId] || {}),
        ...stateUpdate
      };
      // Keep simple participantId key in sync for backward compatibility
      all[participantId] = all[key];
      localStorage.setItem(STORAGE_KEYS.PARTICIPANT_TASK_STATES, JSON.stringify(all));
      return true;
    } catch (e) {
      console.error('Failed to update task state', e);
      return false;
    }
  },

  /* ---------------- Submissions (Contest Scoped) ---------------- */
  getSubmissions(contestId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      const allSubs = data ? JSON.parse(data) : (SEED_DATA.submissions || []);
      if (contestId === 'all') return allSubs;
      const targetCid = contestId !== null ? contestId : this.getCurrentContestId();
      if (targetCid) {
        return allSubs.filter(s => (s.contestId || "contest-001") === targetCid);
      }
      return allSubs;
    } catch (e) {
      return SEED_DATA.submissions || [];
    }
  },

  saveSubmissions(submissions) {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      return true;
    } catch (e) {
      console.error('Failed to save submissions', e);
      return false;
    }
  },

  getSubmission(subId) {
    const all = this.getSubmissions('all');
    return all.find(s => s.id === subId);
  },

  saveSubmission(submission) {
    if (!submission.contestId) {
      submission.contestId = this.getCurrentContestId() || "contest-001";
    }
    const allSubs = this.getSubmissions('all');
    const index = allSubs.findIndex(s => s.id === submission.id);
    if (index !== -1) {
      allSubs[index] = submission;
    } else {
      allSubs.unshift(submission);
    }
    return this.saveSubmissions(allSubs);
  },

  /* ---------------- Monitoring Telemetry Events (Contest Scoped) ---------------- */
  getMonitoringEvents(contestId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MONITORING_EVENTS);
      const allEvents = data ? JSON.parse(data) : (SEED_DATA.monitoringEvents || []);
      if (contestId === 'all') return allEvents;
      const targetCid = contestId !== null ? contestId : this.getCurrentContestId();
      if (targetCid) {
        return allEvents.filter(e => (e.contestId || "contest-001") === targetCid);
      }
      return allEvents;
    } catch (e) {
      return SEED_DATA.monitoringEvents || [];
    }
  },

  addMonitoringEvent(event) {
    try {
      const allEvents = this.getMonitoringEvents('all');
      const targetCid = event.contestId || this.getCurrentContestId() || "contest-001";
      const newEvent = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        contestId: targetCid,
        isoTime: new Date().toISOString(),
        timestamp: new Date().toLocaleTimeString(),
        ...event
      };
      allEvents.unshift(newEvent);
      if (allEvents.length > 100) allEvents.length = 100;
      localStorage.setItem(STORAGE_KEYS.MONITORING_EVENTS, JSON.stringify(allEvents));
      return newEvent;
    } catch (e) {
      console.error('Failed to log monitoring event', e);
      return null;
    }
  },

  /* ---------------- Browser PDF Storage Cache ---------------- */
  storePdfFile(fileId, fileData) {
    if (!window._pdfSessionCache) window._pdfSessionCache = {};
    window._pdfSessionCache[fileId] = fileData;

    try {
      const safeMeta = {
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        lastModified: fileData.lastModified,
        previewText: fileData.previewText || ""
      };
      if (fileData.base64 && fileData.base64.length < 500000) {
        safeMeta.base64 = fileData.base64;
      }
      localStorage.setItem(`vectis_pdf_${fileId}`, JSON.stringify(safeMeta));
    } catch (e) {
      console.warn('StorageService: LocalStorage quota reached for PDF; file cached in session memory safely.');
    }
  },

  getPdfFile(fileId) {
    if (window._pdfSessionCache && window._pdfSessionCache[fileId]) {
      return window._pdfSessionCache[fileId];
    }
    try {
      const stored = localStorage.getItem(`vectis_pdf_${fileId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }
};

// Auto-initialize on file load
StorageService.init();
