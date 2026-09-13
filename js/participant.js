/**
 * Vectis Assess - Participant Workspace & Task Answering Module
 * Manages participant dashboard metrics, live task rendering, answer state caching,
 * PDF drag-and-drop processing, permission verification, and task submissions.
 */

const ParticipantModule = {
  currentParticipant: null,
  activeTask: null,
  taskAnswers: {},
  uploadedPdfRecord: null,

  /**
   * Initialize Participant Dashboard
   */
  initDashboard() {
    this.currentParticipant = AuthService.requireAuth('participant', true);
    if (!this.currentParticipant) return;

    this.renderDashboardHeader();
    this.renderDashboardMetrics();
    this.renderDashboardTasks();
    this.setupDashboardFilters();
  },

  /**
   * Render dashboard greeting, contest name, and participant ID
   */
  renderDashboardHeader() {
    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const contest = StorageService.getContest(currentCid);

    const greetingEl = document.getElementById('participant-greeting');
    if (greetingEl) {
      greetingEl.textContent = `Welcome back, ${this.currentParticipant.name || 'Participant ' + this.currentParticipant.participantId}`;
    }

    const contestEl = document.getElementById('dashboard-contest-name');
    if (contestEl && contest) {
      contestEl.innerHTML = `Contest: <strong>${contest.name}</strong>`;
    }

    const idBadge = document.getElementById('header-participant-id');
    if (idBadge) {
      idBadge.textContent = `Participant ${this.currentParticipant.participantId}`;
    }
  },

  /**
   * Render metrics (Rank, Total Score, Tasks Done, Accuracy)
   */
  renderDashboardMetrics() {
    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const p = StorageService.getParticipant(this.currentParticipant.participantId) || this.currentParticipant;
    const tasks = StorageService.getTasks(currentCid);
    const taskStates = StorageService.getParticipantTaskStates(this.currentParticipant.participantId, currentCid);

    const totalTasks = tasks.length || 10;
    let completedCount = 0;
    tasks.forEach(t => {
      if (taskStates[t.id] && taskStates[t.id].status === 'completed') {
        completedCount++;
      }
    });

    // Fallback for demo contest-001 if states not filled
    if (currentCid === 'contest-001' && completedCount === 0) {
      completedCount = p.tasksCompleted || 7;
    }

    const rankEl = document.getElementById('metric-rank');
    if (rankEl) rankEl.textContent = `#${p.rank || 27}`;

    const scoreEl = document.getElementById('metric-score');
    if (scoreEl) scoreEl.textContent = `${p.score || 640}`;

    const tasksEl = document.getElementById('metric-tasks');
    if (tasksEl) tasksEl.innerHTML = `${completedCount} <span class="text-on-surface-variant font-headline" style="font-size:1.25rem;">/ ${totalTasks}</span>`;

    const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const progressText = document.getElementById('contest-progress-text');
    if (progressText) {
      progressText.textContent = `${completedCount} of ${totalTasks} tasks completed (${progressPercent}%)`;
    }

    const progressBadge = document.getElementById('participant-progress-badge');
    if (progressBadge) {
      progressBadge.textContent = `${completedCount} of ${totalTasks} tasks completed`;
    }

    const progressBar = document.getElementById('contest-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
  },

  /**
   * Render task list cards (Simple, calm task rows)
   */
  renderDashboardTasks() {
    const container = document.getElementById('participant-tasks-list');
    if (!container) return;

    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const tasks = StorageService.getTasks(currentCid);
    const taskStates = StorageService.getParticipantTaskStates(this.currentParticipant.participantId, currentCid);

    // Update Section 2 (Current Task)
    const currentTaskSection = document.getElementById('dashboard-current-task-box');
    if (currentTaskSection) {
      if (tasks.length === 0) {
        currentTaskSection.innerHTML = `
          <div style="padding:16px; color:var(--color-on-surface-variant); font-size:13px;">
            No tasks published for this contest yet.
          </div>
        `;
      } else {
        const activeT = tasks.find(t => (taskStates[t.id]?.status === 'in_progress')) || 
                        tasks.find(t => (taskStates[t.id]?.status !== 'completed')) || 
                        tasks[0];
        const state = taskStates[activeT.id] || { status: 'not_started' };
        currentTaskSection.innerHTML = `
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-primary font-bold">Task ${activeT.taskNumber}</span>
                <span class="badge ${state.status === 'in_progress' ? 'badge-secondary' : 'badge-neutral'} font-semibold">
                  ${state.status === 'in_progress' ? 'In Progress' : (state.status === 'completed' ? 'Completed' : 'Available')}
                </span>
              </div>
              <h3 class="font-headline font-bold text-on-surface" style="font-size:1.25rem; margin:0;">
                ${activeT.title}
              </h3>
              <p style="font-size:13px; color:var(--color-on-surface-variant); margin-top:4px;">
                ${activeT.questions ? activeT.questions.length : 0} Questions • ${activeT.points} Points
              </p>
            </div>
            <a href="task.html?id=${activeT.id}" class="btn btn-primary" style="padding:10px 20px;">
              <span>${state.status === 'completed' ? 'Review Task' : 'Continue Task'}</span>
              <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
            </a>
          </div>
        `;
      }
    }

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="q-card-simple" style="padding:32px; text-align:center; color:var(--color-on-surface-variant); font-size:13px;">
          No tasks have been published for this contest yet.
        </div>
      `;
      return;
    }

    container.innerHTML = tasks.map(t => {
      const state = taskStates[t.id] || { status: 'not_started' };
      
      let statusBadge = '';
      let actionBtn = '';

      if (state.status === 'completed') {
        statusBadge = `<span class="badge badge-success font-semibold">Completed</span>`;
        actionBtn = `<a href="task.html?id=${t.id}" class="btn btn-outline btn-sm">Review</a>`;
      } else if (state.status === 'under_review') {
        statusBadge = `<span class="badge badge-warning font-semibold">Under Review</span>`;
        actionBtn = `<a href="task.html?id=${t.id}" class="btn btn-outline btn-sm">View</a>`;
      } else if (state.status === 'in_progress') {
        statusBadge = `<span class="badge badge-secondary font-semibold">In Progress</span>`;
        actionBtn = `<a href="task.html?id=${t.id}" class="btn btn-primary btn-sm">Continue</a>`;
      } else if (state.status === 'locked') {
        statusBadge = `<span class="badge badge-neutral font-semibold">Locked</span>`;
        actionBtn = `<button class="btn btn-subtle btn-sm" disabled>Locked</button>`;
      } else {
        statusBadge = `<span class="badge badge-neutral font-semibold">Not Started</span>`;
        actionBtn = `<a href="task.html?id=${t.id}" class="btn btn-subtle btn-sm">Start</a>`;
      }

      return `
        <div class="simple-task-row">
          <div class="flex items-center gap-3">
            <span class="font-bold text-on-surface" style="font-size:13px; min-width:60px;">Task ${t.taskNumber}</span>
            <span class="text-on-surface" style="font-size:13px; font-weight:500;">${t.title}</span>
            <span style="font-size:12px; color:var(--color-on-surface-variant);">${t.points} pts</span>
          </div>
          <div class="flex items-center gap-3">
            ${statusBadge}
            ${actionBtn}
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Setup task filters (All, Active, Completed)
   */
  setupDashboardFilters() {
    const buttons = document.querySelectorAll('#task-filter-group .filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        const items = document.querySelectorAll('.task-item');
        items.forEach(item => {
          const status = item.getAttribute('data-status');
          if (filter === 'all') {
            item.style.display = 'flex';
          } else if (filter === 'active') {
            item.style.display = (status === 'in_progress' || status === 'not_started' || status === 'under_review') ? 'flex' : 'none';
          } else if (filter === 'completed') {
            item.style.display = (status === 'completed') ? 'flex' : 'none';
          }
        });
      });
    });
  },

  /**
   * Initialize Task Answering Interface (task.html)
   */
  async initTaskAnswering() {
    this.currentParticipant = AuthService.requireAuth('participant', true);
    if (!this.currentParticipant) return;

    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const contestTasks = StorageService.getTasks(currentCid);

    if (contestTasks.length === 0) {
      if (window.UI) window.UI.showToast('No tasks available for this contest.', 'warning');
      window.location.href = 'tasks.html';
      return;
    }

    // Get task ID from URL query param (e.g. ?id=task-05)
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId) {
      this.activeTask = contestTasks.find(t => t.id === taskId);
    }
    if (!this.activeTask) {
      this.activeTask = contestTasks[0];
    }

    this.currentQuestionIndex = 0;
    this.renderTaskMeta();

    // Pre-fill demo answers on Task 05 if not yet populated
    if (this.activeTask.id === 'task-05' && Object.keys(this.taskAnswers).length === 0) {
      this.prefillDemoTask05();
    }

    this.renderQuestionStepper();
    this.initProctoringGate();
  },

  /**
   * Render Task title, breadcrumb, points, and timer
   */
  renderTaskMeta() {
    const task = this.activeTask;
    document.title = `ACI Career Edge Program - ${task.title}`;

    const titleEl = document.getElementById('task-page-title');
    if (titleEl) titleEl.textContent = `Task ${task.taskNumber}: ${task.title}`;

    const breadcrumbEl = document.getElementById('task-breadcrumb-title');
    if (breadcrumbEl) breadcrumbEl.textContent = `Task ${task.taskNumber}`;

    const pointsEl = document.getElementById('task-total-points');
    if (pointsEl) pointsEl.textContent = `${task.points} Points`;
  },

  /**
   * Check if question at index has an answer
   */
  isQuestionAnswered(index) {
    if (!this.activeTask || !this.activeTask.questions[index]) return false;
    const q = this.activeTask.questions[index];
    const ans = this.taskAnswers[q.id];
    if (ans === undefined || ans === null) return false;
    if (typeof ans === 'string') return ans.trim().length > 0;
    if (typeof ans === 'object') return !!ans.name;
    return true;
  },

  /**
   * Count total answered questions
   */
  countAnsweredQuestions() {
    if (!this.activeTask || !this.activeTask.questions) return 0;
    let count = 0;
    for (let i = 0; i < this.activeTask.questions.length; i++) {
      if (this.isQuestionAnswered(i)) count++;
    }
    return count;
  },

  /**
   * Render Question Stepper Pills & Current Question Card
   */
  renderQuestionStepper() {
    const questions = this.activeTask.questions || [];
    const totalQ = questions.length;
    const currentIdx = this.currentQuestionIndex;

    // Update Counter Label
    const counterLabel = document.getElementById('q-nav-counter-label');
    if (counterLabel) {
      counterLabel.textContent = `Question ${currentIdx + 1} of ${totalQ}`;
    }

    // Render Pills
    const pillsRow = document.getElementById('q-pills-row');
    if (pillsRow) {
      pillsRow.innerHTML = questions.map((q, idx) => {
        const isCurrent = (idx === currentIdx);
        const isAnswered = this.isQuestionAnswered(idx);
        let classList = 'q-nav-pill';
        if (isCurrent) classList += ' current';
        else if (isAnswered) classList += ' answered';

        return `
          <button type="button" class="${classList}" onclick="ParticipantModule.goToQuestion(${idx})" title="Question ${idx + 1}">
            ${idx + 1}
          </button>
        `;
      }).join('');
    }

    // Render Single Active Question
    this.renderCurrentQuestion();
  },

  /**
   * Render the active single question (Google Forms simplicity)
   */
  renderCurrentQuestion() {
    const container = document.getElementById('active-question-container');
    if (!container) return;

    const qIndex = this.currentQuestionIndex;
    const totalQ = this.activeTask.questions.length;
    const q = this.activeTask.questions[qIndex];
    const isFirst = (qIndex === 0);
    const isLast = (qIndex === totalQ - 1);

    if (q.type === 'mcq') {
      const selectedVal = this.taskAnswers[q.id];
      container.innerHTML = `
        <div class="q-card-simple">
          <div class="q-meta-row">
            <span class="badge badge-neutral" style="font-size:12px;">Question ${qIndex + 1} of ${totalQ}</span>
            <span class="font-headline font-bold text-primary" style="font-size:14px;">${q.points} Points</span>
          </div>
          <h2 class="q-title" style="margin-top:4px;">
            ${q.questionText}
          </h2>
          <div class="flex flex-col gap-2 pt-1 mb-6">
            ${(q.options || []).map(opt => {
              const isSelected = (selectedVal === opt.id);
              return `
                <div class="mcq-option-row ${isSelected ? 'selected' : ''}" id="opt-row-${q.id}-${opt.id}" onclick="ParticipantModule.selectMcqOption('${q.id}', '${opt.id}')">
                  <div class="mcq-radio-circle"></div>
                  <div class="mcq-option-text">${opt.text}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="step-navigation-bar">
            ${isFirst ? '<div></div>' : `
              <button type="button" class="btn btn-outline" onclick="ParticipantModule.prevQuestion()">
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
                <span>Previous</span>
              </button>
            `}
            ${isLast ? `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.openSubmitConfirmation()">
                <span>Submit Task</span>
                <span class="material-symbols-outlined" style="font-size:16px;">send</span>
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.nextQuestion()">
                <span>Save & Continue</span>
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
              </button>
            `}
          </div>
        </div>
      `;
    } else if (q.type === 'written') {
      const currentVal = this.taskAnswers[q.id] || '';
      container.innerHTML = `
        <div class="q-card-simple">
          <div class="q-meta-row">
            <span class="badge badge-neutral" style="font-size:12px;">Question ${qIndex + 1} of ${totalQ}</span>
            <span class="font-headline font-bold text-primary" style="font-size:14px;">${q.points} Points</span>
          </div>
          <h2 class="q-title" style="margin-top:4px;">
            ${q.questionText}
          </h2>
          ${q.instructions ? `<p style="font-size:13px; color:var(--color-on-surface-variant); margin-top:-10px; margin-bottom:16px;">${q.instructions}</p>` : ''}
          
          <textarea class="form-textarea" id="textarea-${q.id}" rows="7" placeholder="Write your answer here..." oninput="ParticipantModule.handleWrittenInput('${q.id}', this)">${currentVal}</textarea>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; margin-bottom:20px;">
            <span id="char-count-${q.id}" style="font-size:12px; color:var(--color-on-surface-variant);">${currentVal.length} / ${q.characterLimit || 2000} characters</span>
            <span style="font-size:12px; color:var(--color-on-surface-variant);">Auto-saved</span>
          </div>

          <div class="step-navigation-bar">
            ${isFirst ? '<div></div>' : `
              <button type="button" class="btn btn-outline" onclick="ParticipantModule.prevQuestion()">
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
                <span>Previous</span>
              </button>
            `}
            ${isLast ? `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.openSubmitConfirmation()">
                <span>Submit Task</span>
                <span class="material-symbols-outlined" style="font-size:16px;">send</span>
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.nextQuestion()">
                <span>Save & Continue</span>
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
              </button>
            `}
          </div>
        </div>
      `;
    } else if (q.type === 'admin_pdf') {
      const docName = q.pdfName || 'Business Case Study.pdf';
      const currentVal = this.taskAnswers[q.id] || '';
      container.innerHTML = `
        <div class="q-card-simple">
          <div class="q-meta-row">
            <span class="badge badge-neutral" style="font-size:12px;">Question ${qIndex + 1} of ${totalQ}</span>
            <span class="font-headline font-bold text-primary" style="font-size:14px;">${q.points} Points</span>
          </div>
          <h2 class="q-title" style="margin-top:4px; margin-bottom:12px;">
            Read the attached document and answer the question.
          </h2>

          <!-- Clean Attached PDF Document -->
          <div class="file-card" style="margin-bottom:18px;">
            <div class="flex items-center gap-3">
              <div class="file-icon-box">
                <span class="material-symbols-outlined" style="font-size:24px;">picture_as_pdf</span>
              </div>
              <div>
                <span class="font-bold text-on-surface font-label-md">${docName}</span>
                <p style="font-size:12px; color:var(--color-on-surface-variant); margin-top:2px;">${q.pdfSize || '2.4 MB'} • Case Document</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="PdfService.openPdfViewer('${docName}', '${q.pdfFileId || ''}')">
              <span class="material-symbols-outlined" style="font-size:16px;">visibility</span>
              <span>View PDF</span>
            </button>
          </div>

          <p class="font-semibold text-on-surface" style="font-size:14px; margin-bottom:10px;">
            ${q.questionText}
          </p>
          <textarea class="form-textarea" id="textarea-${q.id}" rows="6" placeholder="Write your answer here..." oninput="ParticipantModule.handleWrittenInput('${q.id}', this)">${currentVal}</textarea>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; margin-bottom:20px;">
            <span id="char-count-${q.id}" style="font-size:12px; color:var(--color-on-surface-variant);">${currentVal.length} / 2000 characters</span>
            <span style="font-size:12px; color:var(--color-on-surface-variant);">Auto-saved</span>
          </div>

          <div class="step-navigation-bar">
            ${isFirst ? '<div></div>' : `
              <button type="button" class="btn btn-outline" onclick="ParticipantModule.prevQuestion()">
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
                <span>Previous</span>
              </button>
            `}
            ${isLast ? `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.openSubmitConfirmation()">
                <span>Submit Task</span>
                <span class="material-symbols-outlined" style="font-size:16px;">send</span>
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.nextQuestion()">
                <span>Save & Continue</span>
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
              </button>
            `}
          </div>
        </div>
      `;
    } else if (q.type === 'upload_pdf') {
      const file = this.taskAnswers[q.id] || this.uploadedPdfRecord;
      const hasFile = !!file;
      container.innerHTML = `
        <div class="q-card-simple">
          <div class="q-meta-row">
            <span class="badge badge-neutral" style="font-size:12px;">Question ${qIndex + 1} of ${totalQ}</span>
            <span class="font-headline font-bold text-primary" style="font-size:14px;">${q.points} Points</span>
          </div>
          <h2 class="q-title" style="margin-top:4px;">
            ${q.questionText}
          </h2>
          ${q.instructions ? `<p style="font-size:13px; color:var(--color-on-surface-variant); margin-top:-10px; margin-bottom:16px;">${q.instructions}</p>` : ''}

          <!-- Dropzone -->
          <div class="upload-dropzone" id="dropzone-${q.id}" style="${hasFile ? 'display:none;' : ''}" onclick="document.getElementById('file-input-${q.id}').click()">
            <input type="file" id="file-input-${q.id}" accept=".pdf" style="display:none;" onchange="ParticipantModule.handlePdfUpload('${q.id}', this.files[0])">
            <div class="upload-icon-circle">
              <span class="material-symbols-outlined" style="font-size:28px;">cloud_upload</span>
            </div>
            <p class="font-label-lg font-semibold text-on-surface">
              Drag PDF here, or <span style="color:var(--color-secondary); text-decoration:underline;">Browse Files</span>
            </p>
            <p style="font-size:12px; color:var(--color-on-surface-variant); margin-top:4px;">
              Accepted format: PDF • Max size: 10 MB
            </p>
          </div>

          <!-- Uploaded File State Preview -->
          <div id="uploaded-state-${q.id}" style="${hasFile ? 'display:block;' : 'display:none;'}">
            ${hasFile ? `
              <div class="file-card" style="margin-bottom:20px; background:#f8fafc;">
                <div class="flex items-center gap-3">
                  <div class="file-icon-box" style="background:#ecfdf5; color:#059669;">
                    <span class="material-symbols-outlined" style="font-size:24px;">check_circle</span>
                  </div>
                  <div>
                    <span class="font-bold text-on-surface font-label-md">${file.name}</span>
                    <p style="font-size:12px; color:var(--color-on-surface-variant); margin-top:2px;">${file.size || '1.8 MB'}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="btn btn-outline btn-sm" onclick="ParticipantModule.openFilePicker('${q.id}')">
                    Replace
                  </button>
                  <button type="button" class="btn btn-icon text-error" onclick="ParticipantModule.removeUploadedFile('${q.id}')" title="Remove">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="step-navigation-bar" style="margin-top:20px;">
            ${isFirst ? '<div></div>' : `
              <button type="button" class="btn btn-outline" onclick="ParticipantModule.prevQuestion()">
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
                <span>Previous</span>
              </button>
            `}
            ${isLast ? `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.openSubmitConfirmation()">
                <span>Submit Task</span>
                <span class="material-symbols-outlined" style="font-size:16px;">send</span>
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="ParticipantModule.nextQuestion()">
                <span>Save & Continue</span>
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
              </button>
            `}
          </div>
        </div>
      `;

      // Setup dropzone listeners
      const dropzone = document.getElementById(`dropzone-${q.id}`);
      if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => {
          dropzone.classList.remove('dragover');
        });
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            ParticipantModule.handlePdfUpload(q.id, e.dataTransfer.files[0]);
          }
        });
      }
    }
  },

  /**
   * Helper to trigger file browser
   */
  openFilePicker(qId) {
    const input = document.getElementById(`file-input-${qId}`);
    if (input) input.click();
  },

  /**
   * Navigate to next question or open submit confirmation
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.activeTask.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestionStepper();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.openSubmitConfirmation();
    }
  },

  /**
   * Navigate to previous question
   */
  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuestionStepper();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Jump to question index directly
   */
  goToQuestion(idx) {
    if (idx >= 0 && idx < this.activeTask.questions.length) {
      this.currentQuestionIndex = idx;
      this.renderQuestionStepper();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Proctoring & Permission gate check
   */
  async initProctoringGate() {
    const settings = StorageService.getSettings();
    const isCameraReq = settings.proctoring.requireCamera || (this.activeTask.proctoring && this.activeTask.proctoring.camera);
    const isMicReq = settings.proctoring.requireMicrophone || (this.activeTask.proctoring && this.activeTask.proctoring.microphone);

    if (isCameraReq || isMicReq) {
      const modal = document.getElementById('proctoring-permission-modal');
      if (modal) {
        modal.classList.add('open');
      } else {
        this.grantPermissionsAndStart();
      }
    }
  },

  /**
   * Triggered when participant clicks "Enable Camera & Microphone"
   */
  async grantPermissionsAndStart() {
    UI.closeModal('proctoring-permission-modal');

    await MonitoringService.requestMediaPermissions();
    await MonitoringService.startMonitoring(this.currentParticipant.participantId, this.activeTask.id, this.activeTask);
    MonitoringService.renderMonitoringWidget();

    const settings = StorageService.getSettings();
    if (settings.proctoring.requireFullscreen) {
      MonitoringService.requestFullscreenMode();
    }

    if (window.UI) {
      window.UI.showToast('Camera and microphone monitoring synchronized.', 'success');
    }
  },

  /**
   * Pre-fill Task 05 answers so user can see it in progress or submit right away
   */
  prefillDemoTask05() {
    this.taskAnswers['q-05-1'] = 'C';
    this.taskAnswers['q-05-2'] = 'B';
    this.taskAnswers['q-05-3'] = 'B';
    this.taskAnswers['q-05-4'] = "Enterprise digital transformation improves supply chain resiliency through real-time telemetry, automated demand re-forecasting, and unified visibility between ERP and third-party logistics. By decentralizing inventory buffers and employing algorithmic lead-time analysis, enterprise business units reduce bullwhip disruptions while ensuring vendor SLA compliance under volatile currency and trade fluctuations.";
    this.taskAnswers['q-05-5'] = "The primary bottleneck identified on page 4 lies in the single-source procurement bottleneck for microcontroller sub-assemblies. A 90-day remediation must execute: 1) Dual-sourcing qualification within 30 days, 2) Buffer inventory ramp to 45 days, 3) Implementation of dynamic supplier risk scores.";
    this.taskAnswers['q-05-6'] = {
      name: 'solution.pdf',
      size: '1.8 MB',
      uploadedAt: '4 mins ago',
      fileId: 'pdf-sample-027'
    };
    this.uploadedPdfRecord = this.taskAnswers['q-05-6'];
  },

  /**
   * Select MCQ option
   */
  selectMcqOption(qId, optionId) {
    this.taskAnswers[qId] = optionId;

    // Update row highlights
    const q = this.activeTask.questions[this.currentQuestionIndex];
    if (q && q.options) {
      q.options.forEach(opt => {
        const row = document.getElementById(`opt-row-${qId}-${opt.id}`);
        if (row) {
          if (opt.id === optionId) row.classList.add('selected');
          else row.classList.remove('selected');
        }
      });
    }

    // Refresh stepper pills to show question is answered
    this.updatePillStates();
  },

  /**
   * Handle text changes
   */
  handleWrittenInput(qId, textarea) {
    this.taskAnswers[qId] = textarea.value;
    const countEl = document.getElementById(`char-count-${qId}`);
    if (countEl) {
      countEl.textContent = `${textarea.value.length} / 2000 characters`;
    }
    this.updatePillStates();
  },

  /**
   * Dynamically update question stepper pills without re-rendering active card
   */
  updatePillStates() {
    const pillsRow = document.getElementById('q-pills-row');
    if (!pillsRow || !this.activeTask) return;
    const questions = this.activeTask.questions || [];
    const currentIdx = this.currentQuestionIndex;

    const pills = pillsRow.querySelectorAll('.q-nav-pill');
    pills.forEach((pill, idx) => {
      pill.className = 'q-nav-pill';
      if (idx === currentIdx) pill.classList.add('current');
      else if (this.isQuestionAnswered(idx)) pill.classList.add('answered');
    });
  },

  /**
   * Handle PDF upload from participant
   */
  async handlePdfUpload(qId, file) {
    if (!file) return;
    const res = await PdfService.processUpload(file, 10);
    if (res.success) {
      this.uploadedPdfRecord = res.file;
      this.taskAnswers[qId] = res.file;
      this.renderUploadedFileCard(qId, res.file);
      if (window.UI) window.UI.showToast(`Uploaded "${res.file.name}" (${res.file.size})`, 'success');
    } else {
      if (window.UI) window.UI.showToast(res.message, 'error');
    }
  },

  /**
   * Render uploaded file state card
   */
  renderUploadedFileCard(qId, fileRecord) {
    const container = document.getElementById(`uploaded-state-${qId}`);
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = `
      <div class="file-card" style="margin-top:12px; background:var(--color-surface-container-low);">
        <div class="flex items-center gap-3">
          <div class="file-icon-box" style="background:var(--color-primary-container); color:#ffffff;">
            <span class="material-symbols-outlined" style="font-size:24px">picture_as_pdf</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-surface font-label-md">${fileRecord.name}</span>
              <span class="badge badge-success" style="font-size:10px; padding:1px 6px;">Uploaded & Verified</span>
            </div>
            <span style="font-size:12px; color:var(--color-on-surface-variant);">
              ${fileRecord.size} • Uploaded ${fileRecord.uploadedAt || 'Just now'} • SHA-256 Passed
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-outline btn-sm" onclick="PdfService.openPdfViewer('${fileRecord.name}', '${fileRecord.fileId}')">
            <span class="material-symbols-outlined" style="font-size:14px">visibility</span> Preview
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('file-input-${qId}').click()">
            <span class="material-symbols-outlined" style="font-size:14px">sync</span> Replace
          </button>
          <button type="button" class="btn btn-icon text-error" title="Remove File" onclick="ParticipantModule.removeUploadedFile('${qId}')">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `;
  },

  removeUploadedFile(qId) {
    delete this.taskAnswers[qId];
    this.uploadedPdfRecord = null;
    const container = document.getElementById(`uploaded-state-${qId}`);
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }
    if (window.UI) window.UI.showToast('Uploaded deliverable removed.', 'info');
  },

  /**
   * Open Submit Confirmation Modal
   */
  openSubmitConfirmation() {
    const countEl = document.getElementById('modal-answered-count');
    if (countEl && this.activeTask && this.activeTask.questions) {
      countEl.textContent = `${this.countAnsweredQuestions()} / ${this.activeTask.questions.length} questions`;
    }
    const modal = document.getElementById('submission-confirmation-modal');
    if (modal) {
      modal.classList.add('open');
    }
  },

  /**
   * Final Task Submission Execution
   */
  confirmSubmitTask() {
    UI.closeModal('submission-confirmation-modal');

    const task = this.activeTask;
    const participant = this.currentParticipant;

    // 1. Evaluate MCQs automatically
    const mcqEval = ScoringEngine.evaluateTaskMCQs(task, this.taskAnswers);

    // 2. Prepare submission object
    const subAnswers = {};
    task.questions.forEach(q => {
      if (q.type === 'mcq') {
        subAnswers[q.id] = mcqEval.mcqResults[q.id];
      } else if (q.type === 'written') {
        subAnswers[q.id] = {
          type: 'written',
          questionText: q.questionText,
          answerText: this.taskAnswers[q.id] || "No written response provided.",
          evaluatedScore: null,
          maxPoints: q.points,
          feedback: ""
        };
      } else if (q.type === 'admin_pdf') {
        subAnswers[q.id] = {
          type: 'admin_pdf',
          questionText: q.questionText,
          pdfName: q.pdfName || "Reference_Case.pdf",
          answerText: this.taskAnswers[q.id] || "No written response provided.",
          evaluatedScore: null,
          maxPoints: q.points,
          feedback: ""
        };
      } else if (q.type === 'upload_pdf') {
        const file = this.taskAnswers[q.id] || this.uploadedPdfRecord;
        subAnswers[q.id] = {
          type: 'upload_pdf',
          questionText: q.questionText,
          fileName: file ? file.name : "Uploaded_Solution.pdf",
          fileSize: file ? file.size : "1.8 MB",
          fileId: file ? file.fileId : null,
          evaluatedScore: null,
          maxPoints: q.points,
          feedback: ""
        };
      }
    });

    const isFullyScored = mcqEval.isFullyScored;
    const currentCid = StorageService.getCurrentContestId() || task.contestId || 'contest-001';

    const submissionRecord = {
      id: `sub-${Date.now()}`,
      contestId: currentCid,
      participantId: participant.participantId,
      participantName: participant.name,
      taskId: task.id,
      taskTitle: task.title,
      submittedAt: new Date().toLocaleString(),
      status: isFullyScored ? 'reviewed' : 'pending',
      earnedScore: isFullyScored ? mcqEval.mcqScore : mcqEval.mcqScore,
      maxScore: task.points,
      answers: subAnswers
    };

    StorageService.saveSubmission(submissionRecord);

    // 3. Update participant task state
    StorageService.updateParticipantTaskState(participant.participantId, task.id, {
      status: isFullyScored ? 'completed' : 'under_review',
      score: isFullyScored ? mcqEval.mcqScore : null,
      submittedAt: 'Just now'
    }, currentCid);

    // 4. Update participant total score & leaderboard
    if (isFullyScored) {
      const pRecord = StorageService.getParticipant(participant.participantId);
      if (pRecord) {
        pRecord.score += mcqEval.mcqScore;
        pRecord.tasksCompleted = Math.min(10, pRecord.tasksCompleted + 1);
        StorageService.updateParticipant(pRecord.participantId, pRecord);
      }
      ScoringEngine.calculateLeaderboard(currentCid);
    }

    // 5. Log monitoring event for task completion
    MonitoringService.logEvent('task_submitted', 'Task submitted', `Candidate submitted ${task.title}. MCQ score: ${mcqEval.mcqScore}/${mcqEval.maxMcqScore} pts.`);

    // 6. Stop active media streams
    MonitoringService.stopMonitoring();

    // 7. Show success confirmation modal
    this.showSubmissionSuccessModal(task, mcqEval, isFullyScored);
  },

  showSubmissionSuccessModal(task, mcqEval, isFullyScored) {
    let modal = document.getElementById('submission-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'submission-success-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 520px; text-align:center;">
        <div class="modal-body" style="padding:32px 24px;">
          <div style="width:60px; height:60px; border-radius:50%; background:#ecfdf5; color:#059669; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
            <span class="material-symbols-outlined" style="font-size:36px">verified</span>
          </div>
          <h2 class="font-headline font-bold text-primary" style="font-size:1.4rem;">Task Submitted Successfully!</h2>
          <p style="font-size:13px; color:var(--color-on-surface-variant); margin-top:8px;">
            Your answers for <strong>Task ${task.taskNumber}: ${task.title}</strong> have been officially recorded.
          </p>

          <div style="background:var(--color-surface-container-low); border-radius:12px; padding:16px; margin:20px 0; text-align:left; font-size:13px;" class="flex flex-col gap-2">
            <div class="flex justify-between">
              <span style="color:var(--color-on-surface-variant);">MCQ Automated Score:</span>
              <span class="font-bold text-primary">${mcqEval.mcqScore} / ${mcqEval.maxMcqScore} Points</span>
            </div>
            <div class="flex justify-between">
              <span style="color:var(--color-on-surface-variant);">Written & PDF Status:</span>
              <span class="badge ${isFullyScored ? 'badge-success' : 'badge-warning'} font-semibold">
                ${isFullyScored ? 'Completed' : 'Under Review by Evaluator'}
              </span>
            </div>
            <div class="flex justify-between">
              <span style="color:var(--color-on-surface-variant);">Submission Timestamp:</span>
              <span class="font-mono text-on-surface">${new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div class="flex gap-3 justify-center">
            <a href="leaderboard.html" class="btn btn-secondary">
              <span class="material-symbols-outlined" style="font-size:18px">leaderboard</span>
              View Live Leaderboard
            </a>
            <a href="dashboard.html" class="btn btn-outline">
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  }
};
