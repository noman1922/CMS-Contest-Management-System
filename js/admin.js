/**
 * Vectis Assess - Admin Panel Management Module
 * Controls Admin Dashboard analytics, participant roster management,
 * submission evaluation workflows, live telemetry monitoring inspections,
 * contest configurations, and database reset triggers.
 */

const AdminModule = {
  currentFilter: 'all',
  searchQuery: '',

  /**
   * Initialize Admin Dashboard
   */
  initDashboard() {
    AuthService.requireAuth('admin');
    this.renderDashboardStats();
    this.renderRecentActivity();
  },

  /**
   * Render Dashboard KPIs and telemetry counters
   */
  renderDashboardStats() {
    const participants = StorageService.getParticipants();
    const tasks = StorageService.getTasks();
    const submissions = StorageService.getSubmissions();
    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    // Total participants display (500 as requested)
    const totalPartEl = document.getElementById('stat-total-participants');
    if (totalPartEl) totalPartEl.textContent = '500';

    const activePartEl = document.getElementById('stat-active-participants');
    if (activePartEl) activePartEl.textContent = '437';

    const totalTasksEl = document.getElementById('stat-total-tasks');
    if (totalTasksEl) totalTasksEl.textContent = String(tasks.length);

    const totalSubsEl = document.getElementById('stat-total-submissions');
    if (totalSubsEl) totalSubsEl.textContent = '3,842';

    const pendingReviewsEl = document.getElementById('stat-pending-reviews');
    if (pendingReviewsEl) pendingReviewsEl.textContent = String(Math.max(124, pendingCount));
  },

  /**
   * Render Recent Activity Feed
   */
  renderRecentActivity() {
    const container = document.getElementById('admin-activity-feed');
    if (!container) return;

    const activities = [
      { text: "Participant #087 completed Task 08 (Cross-Examination)", time: "3 mins ago", type: "success" },
      { text: "Participant #231 submitted Task 05 (Integrated Business Challenge)", time: "8 mins ago", type: "info" },
      { text: "Submission #183 (Elena Rostova - Task 04) queued for evaluation", time: "12 mins ago", type: "warning" },
      { text: "Task 09 (Architectural Scalability) published to cohort", time: "25 mins ago", type: "info" },
      { text: "Automated integrity telemetry scan completed (0 critical violations)", time: "42 mins ago", type: "neutral" }
    ];

    container.innerHTML = activities.map(act => `
      <div class="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low" style="border:1px solid var(--color-outline-variant);">
        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.type === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : (act.type === 'warning' ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed')}">
          <span class="material-symbols-outlined" style="font-size:16px;">
            ${act.type === 'success' ? 'task_alt' : (act.type === 'warning' ? 'hourglass_empty' : 'bolt')}
          </span>
        </div>
        <div style="flex:1;">
          <p class="font-medium text-on-surface" style="font-size:13px; margin:0;">${act.text}</p>
          <span style="font-size:11px; color:var(--color-on-surface-variant);">${act.time}</span>
        </div>
      </div>
    `).join('');
  },

  /* ==============================================================
     PARTICIPANT MANAGEMENT
     ============================================================== */
  initParticipantsPage() {
    AuthService.requireAuth('admin');
    this.renderParticipantsTable();
  },

  renderParticipantsTable() {
    const tbody = document.getElementById('admin-participants-body');
    if (!tbody) return;

    let list = StorageService.getParticipants();

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => p.participantId.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    }

    // Filter
    if (this.currentFilter === 'active') {
      list = list.filter(p => p.status === 'active');
    } else if (this.currentFilter === 'inactive') {
      list = list.filter(p => p.status === 'inactive');
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td>
          <div class="flex items-center gap-2">
            <span class="font-bold text-primary font-label-md">${p.participantId}</span>
            <span class="badge badge-neutral" style="font-size:10px;">${p.cohort || 'Cohort Alpha'}</span>
          </div>
        </td>
        <td>
          <div>
            <span class="font-medium text-on-surface">${p.name}</span>
            <div style="font-size:11px; color:var(--color-on-surface-variant);">${p.email}</div>
          </div>
        </td>
        <td>
          <span class="font-bold text-on-surface tabular-nums">${p.tasksCompleted}/10</span>
        </td>
        <td>
          <span class="font-bold text-primary tabular-nums">${p.score} pts</span>
        </td>
        <td>
          <span class="badge badge-primary font-bold">#${p.rank || '-'}</span>
        </td>
        <td>
          <span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-error'} font-semibold">
            ${p.status === 'active' ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td style="color:var(--color-on-surface-variant); font-size:12px;">
          ${p.lastActive || '10 mins ago'}
        </td>
        <td>
          <div class="flex items-center gap-1">
            <button class="btn btn-outline btn-sm" onclick="AdminModule.openParticipantModal('${p.participantId}')" title="View Details">
              <span class="material-symbols-outlined" style="font-size:14px">visibility</span>
            </button>
            <button class="btn btn-outline btn-sm" onclick="AdminModule.toggleParticipantStatus('${p.participantId}')" title="${p.status === 'active' ? 'Disable Participant' : 'Activate Participant'}">
              <span class="material-symbols-outlined" style="font-size:14px; color:${p.status === 'active' ? '#dc2626' : '#059669'}">
                ${p.status === 'active' ? 'block' : 'check_circle'}
              </span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    const countEl = document.getElementById('participant-count-badge');
    if (countEl) countEl.textContent = `Showing ${list.length} Records (500 Registered)`;
  },

  toggleParticipantStatus(pid) {
    const p = StorageService.getParticipant(pid);
    if (!p) return;
    const newStatus = p.status === 'active' ? 'inactive' : 'active';
    StorageService.updateParticipant(pid, { status: newStatus });
    this.renderParticipantsTable();
    if (window.UI) window.UI.showToast(`Participant ${pid} is now ${newStatus}.`, 'info');
  },

  openParticipantModal(pid) {
    const p = StorageService.getParticipant(pid);
    if (!p) return;

    let modal = document.getElementById('participant-details-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'participant-details-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 580px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">person</span>
            <h3 class="font-headline font-bold" style="margin:0;">Participant Details: ${p.participantId}</h3>
          </div>
          <button class="btn-icon" onclick="UI.closeModal('participant-details-modal')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body flex flex-col gap-3">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
            <img src="${p.avatar}" class="avatar" style="width:48px;height:48px;" alt="${p.name}">
            <div>
              <h4 class="font-headline font-bold text-on-surface" style="margin:0;">${p.name}</h4>
              <p style="font-size:12px; margin:0; color:var(--color-on-surface-variant);">${p.email} • ${p.cohort}</p>
            </div>
            <div style="margin-left:auto;">
              <span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-error'}">${p.status}</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="p-3 rounded-lg bg-surface-container-low text-center">
              <span class="font-label-sm" style="color:var(--color-on-surface-variant);">Rank</span>
              <p class="font-headline font-bold text-primary" style="font-size:1.3rem; margin:2px 0 0 0;">#${p.rank}</p>
            </div>
            <div class="p-3 rounded-lg bg-surface-container-low text-center">
              <span class="font-label-sm" style="color:var(--color-on-surface-variant);">Score</span>
              <p class="font-headline font-bold text-primary" style="font-size:1.3rem; margin:2px 0 0 0;">${p.score} pts</p>
            </div>
            <div class="p-3 rounded-lg bg-surface-container-low text-center">
              <span class="font-label-sm" style="color:var(--color-on-surface-variant);">Modules</span>
              <p class="font-headline font-bold text-on-surface" style="font-size:1.3rem; margin:2px 0 0 0;">${p.tasksCompleted}/10</p>
            </div>
          </div>

          <div>
            <h4 class="font-headline font-semibold text-on-surface" style="font-size:13px; margin-bottom:6px;">Assessment Track Status:</h4>
            <div class="p-3 rounded-lg bg-surface-container-lowest" style="border:1px solid var(--color-outline-variant); font-size:12px;">
              <div class="flex justify-between py-1 border-b">
                <span>Task 01: Business Diagnostic</span>
                <span class="text-tertiary-container font-semibold">100/100 pts (Verified)</span>
              </div>
              <div class="flex justify-between py-1 border-b">
                <span>Task 02: Market Expansion</span>
                <span class="text-tertiary-container font-semibold">95/100 pts (Verified)</span>
              </div>
              <div class="flex justify-between py-1 border-b">
                <span>Task 03: Financial Modeling</span>
                <span class="text-tertiary-container font-semibold">85/100 pts (Verified)</span>
              </div>
              <div class="flex justify-between py-1">
                <span>Task 04: Operations Optimization</span>
                <span class="badge badge-warning">Under Review</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" onclick="UI.closeModal('participant-details-modal')">Close</button>
        </div>
      </div>
    `;

    modal.classList.add('open');
  },

  /* ==============================================================
     SUBMISSIONS REVIEW & EVALUATION WORKFLOW
     ============================================================== */
  initSubmissionsPage() {
    AuthService.requireAuth('admin');
    this.renderSubmissionsTable();
  },

  renderSubmissionsTable() {
    const tbody = document.getElementById('admin-submissions-body');
    if (!tbody) return;

    let list = StorageService.getSubmissions();

    if (this.currentFilter === 'pending') {
      list = list.filter(s => s.status === 'pending');
    } else if (this.currentFilter === 'reviewed') {
      list = list.filter(s => s.status === 'reviewed');
    }

    tbody.innerHTML = list.map(sub => {
      const isPending = sub.status === 'pending';
      const timeStr = sub.submittedAt ? sub.submittedAt.split(', ')[1] || sub.submittedAt : '10:42 AM';

      return `
        <tr>
          <td>
            <span class="font-bold text-primary font-headline" style="font-size:14px;">${sub.participantId}</span>
          </td>
          <td>
            <span class="font-medium text-on-surface">${sub.taskTitle}</span>
          </td>
          <td style="color:var(--color-on-surface-variant); font-size:13px; white-space:nowrap;">
            ${timeStr}
          </td>
          <td>
            <span class="badge ${isPending ? 'badge-warning' : 'badge-success'} font-semibold">
              ${isPending ? 'Under Review' : `Evaluated (${sub.earnedScore}/${sub.maxScore})`}
            </span>
          </td>
          <td style="text-align:right;">
            <button class="btn ${isPending ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="AdminModule.openEvaluationDrawer('${sub.id}')">
              ${isPending ? 'Evaluate' : 'Review'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Open Evaluation modal/drawer for a submission
   */
  openEvaluationDrawer(submissionId) {
    const sub = StorageService.getSubmission(submissionId);
    if (!sub) return;

    let modal = document.getElementById('submission-evaluation-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'submission-evaluation-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const answersList = Object.keys(sub.answers).map((qId, index) => {
      const ans = sub.answers[qId];
      const qNum = index + 1;

      if (ans.type === 'mcq') {
        return `
          <div class="p-4 rounded-xl bg-surface-container-low" style="border:1px solid var(--color-outline-variant); margin-bottom:14px;">
            <div class="flex justify-between items-center mb-2">
              <span class="badge badge-primary">Q${qNum}: Multiple Choice</span>
              <span class="font-bold ${ans.isCorrect ? 'text-tertiary-container' : 'text-error'}">
                ${ans.pointsEarned || (ans.isCorrect ? ans.points : 0)} / ${ans.maxPoints || 10} pts
              </span>
            </div>
            <p class="font-medium text-on-surface mb-2" style="font-size:13px;">${ans.questionText || 'Selected Choice Answer'}</p>
            <div class="flex items-center gap-3 font-mono text-label-sm">
              <span>Candidate Choice: <strong>Option ${ans.selected}</strong></span>
              <span>Correct Choice: <strong>Option ${ans.correctAnswer}</strong></span>
              <span class="badge ${ans.isCorrect ? 'badge-success' : 'badge-error'}">${ans.isCorrect ? 'Auto-Graded Correct' : 'Incorrect'}</span>
            </div>
          </div>
        `;
      } else if (ans.type === 'written') {
        const currentScore = ans.evaluatedScore !== null ? ans.evaluatedScore : Math.round(ans.maxPoints * 0.9);
        return `
          <div class="p-4 rounded-xl bg-surface-container-low" style="border:1px solid var(--color-outline-variant); margin-bottom:14px;">
            <div class="flex justify-between items-center mb-2">
              <span class="badge badge-secondary">Q${qNum}: Written Synthesis</span>
              <span class="font-bold text-primary font-headline">Max: ${ans.maxPoints} pts</span>
            </div>
            <p class="font-semibold text-on-surface mb-2" style="font-size:13px;">${ans.questionText || 'Prompt response'}</p>
            <div class="p-3 rounded-lg bg-surface-container-lowest" style="border:1px solid var(--color-outline-variant); font-size:13px; line-height:1.6; color:var(--color-on-surface); max-height:160px; overflow-y:auto; margin-bottom:12px;">
              ${ans.answerText}
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Score Awarded (out of ${ans.maxPoints}):</label>
                <input type="number" class="form-input eval-score-input" id="eval-score-${qId}" data-qid="${qId}" value="${currentScore}" max="${ans.maxPoints}" min="0">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Evaluator Feedback:</label>
                <input type="text" class="form-input eval-feedback-input" id="eval-feedback-${qId}" data-qid="${qId}" value="${ans.feedback || 'Comprehensive analysis addressing key criteria.'}">
              </div>
            </div>
          </div>
        `;
      } else if (ans.type === 'admin_pdf') {
        const currentScore = ans.evaluatedScore !== null ? ans.evaluatedScore : Math.round(ans.maxPoints * 0.88);
        return `
          <div class="p-4 rounded-xl bg-surface-container-low" style="border:1px solid var(--color-outline-variant); margin-bottom:14px;">
            <div class="flex justify-between items-center mb-2">
              <span class="badge badge-warning">Q${qNum}: Case Study Analysis</span>
              <span class="font-bold text-primary font-headline">Max: ${ans.maxPoints} pts</span>
            </div>
            <p class="font-semibold text-on-surface mb-1" style="font-size:13px;">${ans.questionText || 'Reference Document Analysis'}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-primary" style="font-size:18px;">picture_as_pdf</span>
              <span class="font-mono text-label-sm">${ans.pdfName || 'Reference_Case.pdf'}</span>
              <button type="button" class="btn btn-outline btn-sm" style="padding:2px 8px; font-size:11px;" onclick="PdfService.openPdfViewer('${ans.pdfName}')">View Case PDF</button>
            </div>
            <div class="p-3 rounded-lg bg-surface-container-lowest" style="border:1px solid var(--color-outline-variant); font-size:13px; line-height:1.6; color:var(--color-on-surface); max-height:140px; overflow-y:auto; margin-bottom:12px;">
              ${ans.answerText}
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Score Awarded (out of ${ans.maxPoints}):</label>
                <input type="number" class="form-input eval-score-input" id="eval-score-${qId}" data-qid="${qId}" value="${currentScore}" max="${ans.maxPoints}" min="0">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Evaluator Feedback:</label>
                <input type="text" class="form-input eval-feedback-input" id="eval-feedback-${qId}" data-qid="${qId}" value="${ans.feedback || 'Effective identification of phase 2 bottlenecks.'}">
              </div>
            </div>
          </div>
        `;
      } else if (ans.type === 'upload_pdf') {
        const currentScore = ans.evaluatedScore !== null ? ans.evaluatedScore : Math.round(ans.maxPoints * 0.95);
        return `
          <div class="p-4 rounded-xl bg-surface-container-low" style="border:1px solid var(--color-outline-variant); margin-bottom:14px;">
            <div class="flex justify-between items-center mb-2">
              <span class="badge badge-success">Q${qNum}: Uploaded Roadmap Deliverable</span>
              <span class="font-bold text-primary font-headline">Max: ${ans.maxPoints} pts</span>
            </div>
            <div class="file-card mb-3" style="background:#ffffff;">
              <div class="flex items-center gap-3">
                <div class="file-icon-box" style="background:var(--color-primary-container); color:#ffffff;">
                  <span class="material-symbols-outlined" style="font-size:24px">picture_as_pdf</span>
                </div>
                <div>
                  <span class="font-bold text-on-surface font-label-md">${ans.fileName}</span>
                  <div style="font-size:11px; color:var(--color-on-surface-variant);">${ans.fileSize || '1.8 MB'} • Candidate Verified Document</div>
                </div>
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="PdfService.openPdfViewer('${ans.fileName}', '${ans.fileId || ''}')">
                <span class="material-symbols-outlined" style="font-size:14px">visibility</span> Inspect Deliverable
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Score Awarded (out of ${ans.maxPoints}):</label>
                <input type="number" class="form-input eval-score-input" id="eval-score-${qId}" data-qid="${qId}" value="${currentScore}" max="${ans.maxPoints}" min="0">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-size:12px;">Evaluator Feedback:</label>
                <input type="text" class="form-input eval-feedback-input" id="eval-feedback-${qId}" data-qid="${qId}" value="${ans.feedback || 'High standard of execution with solid ROI models.'}">
              </div>
            </div>
          </div>
        `;
      }
    }).join('');

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 820px;">
        <div class="modal-header">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline font-bold" style="margin:0;">Submission Evaluation: ${sub.id}</h3>
              <span class="badge ${sub.status === 'reviewed' ? 'badge-success' : 'badge-warning'}">${sub.status}</span>
            </div>
            <p style="font-size:12px; margin:2px 0 0 0; color:var(--color-on-surface-variant);">
              Candidate ${sub.participantId} (${sub.participantName}) • Task: ${sub.taskTitle} • Submitted: ${sub.submittedAt}
            </p>
          </div>
          <button class="btn-icon" onclick="UI.closeModal('submission-evaluation-modal')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body" style="max-height:68vh; overflow-y:auto; padding:20px;">
          ${answersList}
        </div>
        <div class="modal-footer" style="justify-content:space-between;">
          <button class="btn btn-destructive btn-sm" onclick="AdminModule.saveEvaluation('${sub.id}', false)">
            Reject Submission
          </button>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="UI.closeModal('submission-evaluation-modal')">
              Cancel
            </button>
            <button class="btn btn-primary btn-sm" onclick="AdminModule.saveEvaluation('${sub.id}', true)">
              <span class="material-symbols-outlined" style="font-size:16px;">check</span>
              Save Evaluation & Update Leaderboard
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  },

  /**
   * Save Evaluation and update score/rank
   */
  saveEvaluation(subId, approve = true) {
    const scores = {};
    const feedback = {};

    document.querySelectorAll('.eval-score-input').forEach(inp => {
      const qId = inp.getAttribute('data-qid');
      scores[qId] = Number(inp.value) || 0;
    });

    document.querySelectorAll('.eval-feedback-input').forEach(inp => {
      const qId = inp.getAttribute('data-qid');
      feedback[qId] = inp.value;
    });

    const updatedSub = ScoringEngine.applyEvaluation(subId, scores, feedback);
    if (!approve && updatedSub) {
      updatedSub.status = 'rejected';
      StorageService.saveSubmission(updatedSub);
    }

    UI.closeModal('submission-evaluation-modal');
    this.renderSubmissionsTable();

    if (window.UI) {
      window.UI.showToast(`Submission ${subId} evaluated! Leaderboard scores & rankings updated.`, 'success');
    }
  },

  /* ==============================================================
     MONITORING TELEMETRY PANEL
     ============================================================== */
  initMonitoringPage() {
    AuthService.requireAuth('admin');
    this.renderMonitoringTable();
    this.renderMonitoringEvents();
  },

  renderMonitoringTable() {
    const tbody = document.getElementById('admin-monitoring-body');
    if (!tbody) return;

    // Realistic list of candidates actively monitored
    const activeCandidates = [
      { id: "#027", camera: "ON", mic: "ON", fullscreen: "ON", alerts: 2, status: "Active" },
      { id: "#087", camera: "ON", mic: "ON", fullscreen: "ON", alerts: 0, status: "Active" },
      { id: "#231", camera: "ON", mic: "ON", fullscreen: "ON", alerts: 0, status: "Active" },
      { id: "#112", camera: "ON", mic: "ON", fullscreen: "ON", alerts: 1, status: "Active" },
      { id: "#044", camera: "OFF", mic: "ON", fullscreen: "ON", alerts: 3, status: "Active" },
      { id: "#301", camera: "ON", mic: "ON", fullscreen: "ON", alerts: 0, status: "Active" }
    ];

    tbody.innerHTML = activeCandidates.map(c => `
      <tr style="cursor:pointer;" onclick="AdminModule.openMonitoringParticipantModal('${c.id}')">
        <td>
          <span class="font-bold text-primary font-headline" style="font-size:14px;">${c.id}</span>
        </td>
        <td>
          <span class="badge ${c.camera === 'ON' ? 'badge-success' : 'badge-error'} font-semibold">
            ${c.camera}
          </span>
        </td>
        <td>
          <span class="badge ${c.mic === 'ON' ? 'badge-success' : 'badge-error'} font-semibold">
            ${c.mic}
          </span>
        </td>
        <td>
          <span class="badge ${c.fullscreen === 'ON' ? 'badge-primary' : 'badge-neutral'} font-semibold">
            ${c.fullscreen}
          </span>
        </td>
        <td>
          <span class="badge ${c.alerts > 0 ? 'badge-warning' : 'badge-neutral'} font-semibold">
            ${c.alerts}
          </span>
        </td>
        <td>
          <span class="badge badge-success font-semibold">
            ${c.status}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); AdminModule.openMonitoringParticipantModal('${c.id}')">
            View Details
          </button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Open clean participant monitoring details modal
   */
  openMonitoringParticipantModal(pid) {
    const titleEl = document.getElementById('m-modal-title');
    if (titleEl) titleEl.textContent = `Participant ${pid}`;

    const camEl = document.getElementById('m-modal-cam');
    const micEl = document.getElementById('m-modal-mic');
    const fullEl = document.getElementById('m-modal-full');

    if (pid === '#044') {
      if (camEl) camEl.textContent = 'Disconnected';
      if (micEl) micEl.textContent = 'Connected';
      if (fullEl) fullEl.textContent = 'Active';
    } else {
      if (camEl) camEl.textContent = 'Connected';
      if (micEl) micEl.textContent = 'Connected';
      if (fullEl) fullEl.textContent = 'Active';
    }

    const eventsContainer = document.getElementById('m-modal-events');
    if (eventsContainer) {
      if (pid === '#027') {
        eventsContainer.innerHTML = `
          <div class="p-2 rounded bg-surface-container-low flex justify-between" style="font-size:13px;">
            <span class="font-mono text-on-surface-variant">10:42:11</span>
            <span class="font-medium text-on-surface">Tab switched (Monitoring Alert)</span>
          </div>
          <div class="p-2 rounded bg-surface-container-low flex justify-between" style="font-size:13px;">
            <span class="font-mono text-on-surface-variant">10:43:02</span>
            <span class="font-medium text-on-surface">Camera disconnected (Attention Required)</span>
          </div>
        `;
      } else if (pid === '#112') {
        eventsContainer.innerHTML = `
          <div class="p-2 rounded bg-surface-container-low flex justify-between" style="font-size:13px;">
            <span class="font-mono text-on-surface-variant">10:35:18</span>
            <span class="font-medium text-on-surface">Window blur detected (Monitoring Alert)</span>
          </div>
        `;
      } else {
        eventsContainer.innerHTML = `
          <p style="font-size:13px; color:var(--color-on-surface-variant); margin:0;">
            No monitoring alerts recorded. All telemetry normal.
          </p>
        `;
      }
    }

    UI.openModal('monitoring-participant-modal');
  },

  renderMonitoringEvents(filterPid = null) {
    const container = document.getElementById('monitoring-events-stream');
    if (!container) return;

    let events = StorageService.getMonitoringEvents();
    if (filterPid) {
      events = events.filter(e => e.participantId === filterPid);
    }

    container.innerHTML = events.map(e => `
      <div class="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low" style="border:1px solid var(--color-outline-variant); margin-bottom:8px;">
        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${e.severity === 'warning' ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-on-primary-fixed'}">
          <span class="material-symbols-outlined" style="font-size:16px;">
            ${e.severity === 'warning' ? 'warning' : 'verified_user'}
          </span>
        </div>
        <div style="flex:1;">
          <div class="flex items-center justify-between">
            <span class="font-bold text-primary font-label-md">${e.participantId}</span>
            <span class="font-mono" style="font-size:11px; color:var(--color-on-surface-variant);">${e.timestamp}</span>
          </div>
          <p class="font-semibold text-on-surface" style="font-size:13px; margin:2px 0 0 0;">${e.title}</p>
          <p style="font-size:12px; margin:2px 0 0 0; color:var(--color-on-surface-variant);">${e.details}</p>
        </div>
      </div>
    `).join('');
  },

  filterEventsForParticipant(pid) {
    this.renderMonitoringEvents(pid);
    if (window.UI) window.UI.showToast(`Filtered telemetry events for ${pid}`, 'info');
  },

  /* ==============================================================
     SETTINGS & RESET DEMO DATA
     ============================================================== */
  initSettingsPage() {
    AuthService.requireAuth('admin');
    const settings = StorageService.getSettings();

    const nameInput = document.getElementById('settings-contest-name');
    if (nameInput) nameInput.value = settings.contestName;

    const trackInput = document.getElementById('settings-track');
    if (trackInput) trackInput.value = settings.track;

    const statusSelect = document.getElementById('settings-status');
    if (statusSelect) statusSelect.value = settings.status;

    const accessModeSelect = document.getElementById('settings-access-mode');
    if (accessModeSelect) accessModeSelect.value = settings.taskAccessMode || 'all';

    const lbModeSelect = document.getElementById('settings-leaderboard-mode');
    if (lbModeSelect) lbModeSelect.value = settings.leaderboardMode || 'live';

    // Proctoring Checkboxes
    const camCb = document.getElementById('proctor-req-camera');
    if (camCb) camCb.checked = !!settings.proctoring.requireCamera;

    const micCb = document.getElementById('proctor-req-mic');
    if (micCb) micCb.checked = !!settings.proctoring.requireMicrophone;

    const fsCb = document.getElementById('proctor-req-fullscreen');
    if (fsCb) fsCb.checked = !!settings.proctoring.requireFullscreen;

    const tabCb = document.getElementById('proctor-req-tabswitch');
    if (tabCb) tabCb.checked = !!settings.proctoring.detectTabSwitch;

    const blurCb = document.getElementById('proctor-req-windowblur');
    if (blurCb) blurCb.checked = !!settings.proctoring.detectWindowBlur;
  },

  saveSettings() {
    const settings = StorageService.getSettings();

    const nameInput = document.getElementById('settings-contest-name');
    if (nameInput) settings.contestName = nameInput.value;

    const trackInput = document.getElementById('settings-track');
    if (trackInput) settings.track = trackInput.value;

    const statusSelect = document.getElementById('settings-status');
    if (statusSelect) settings.status = statusSelect.value;

    const accessModeSelect = document.getElementById('settings-access-mode');
    if (accessModeSelect) settings.taskAccessMode = accessModeSelect.value;

    const lbModeSelect = document.getElementById('settings-leaderboard-mode');
    if (lbModeSelect) settings.leaderboardMode = lbModeSelect.value;

    const camCb = document.getElementById('proctor-req-camera');
    const micCb = document.getElementById('proctor-req-mic');
    const fsCb = document.getElementById('proctor-req-fullscreen');
    const tabCb = document.getElementById('proctor-req-tabswitch');
    const blurCb = document.getElementById('proctor-req-windowblur');

    settings.proctoring = {
      requireCamera: camCb ? camCb.checked : true,
      requireMicrophone: micCb ? micCb.checked : true,
      requireFullscreen: fsCb ? fsCb.checked : true,
      detectTabSwitch: tabCb ? tabCb.checked : true,
      detectWindowBlur: blurCb ? blurCb.checked : true
    };

    StorageService.saveSettings(settings);
    if (window.UI) window.UI.showToast('Contest & proctoring settings saved successfully.', 'success');
  },

  resetDemo() {
    if (confirm('Are you sure you want to reset all demo data back to factory defaults? All submitted tasks, temporary scores, and custom tasks will be reset.')) {
      StorageService.resetDemoData();
      if (window.UI) window.UI.showToast('Demo data reset successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  }
};
