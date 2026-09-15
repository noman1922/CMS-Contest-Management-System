/**
 * Vectis Assess - Dynamic Task Builder & Task Management Module
 * Supports adding unlimited questions of all 4 types (MCQ, Written, PDF+Written, Participant PDF Upload),
 * reordering (move up/down), duplication, deletion, live point recalculation, and publishing.
 */

const TaskBuilderModule = {
  currentTask: {
    id: null,
    taskNumber: '11',
    title: '',
    description: '',
    points: 100,
    deadline: '2025-10-31 18:00 UTC',
    timeLimitMinutes: 60,
    status: 'published',
    track: 'Executive Strategy',
    proctoring: {
      camera: true,
      microphone: true,
      fullscreen: true
    },
    questions: []
  },

  /**
   * Reset builder for a brand new task
   */
  initNewTask() {
    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const tasks = StorageService.getTasks(currentCid);
    const nextNum = String(tasks.length + 1).padStart(2, '0');
    this.currentTask = {
      id: `task-${Date.now().toString().slice(-4)}`,
      contestId: currentCid,
      taskNumber: nextNum,
      title: 'Global Supply Chain Transformation Case',
      description: 'Comprehensive case assessment evaluating operational resilience, balance sheet hedging, and executive presentation.',
      points: 100,
      deadline: '2026-10-31 18:00 UTC',
      timeLimitMinutes: 60,
      status: 'published',
      track: 'Operations & Strategy',
      proctoring: {
        camera: true,
        microphone: true,
        fullscreen: true
      },
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'mcq',
          questionText: 'Which strategic hedging instrument protects against currency volatility in cross-border procurement?',
          points: 20,
          options: [
            { id: 'A', text: 'Currency forward contract' },
            { id: 'B', text: 'Pure spot market settlement' },
            { id: 'C', text: 'Floating interest swap' },
            { id: 'D', text: 'Subordinated debenture' }
          ],
          correctAnswer: 'A'
        },
        {
          id: `q-${Date.now()}-2`,
          type: 'written',
          questionText: 'Formulate a 60-day vendor diversification roadmap mitigating tier-1 supplier dependency.',
          points: 30,
          characterLimit: 2000,
          instructions: 'Detail vendor qualification timelines, SLA requirements, and minimum order commitments.'
        },
        {
          id: `q-${Date.now()}-3`,
          type: 'admin_pdf',
          questionText: 'Review the attached benchmark report and identify the 2 primary operational bottlenecks.',
          points: 20,
          pdfName: 'Procurement_Risk_Audit_Q4.pdf',
          pdfSize: '1.9 MB',
          characterLimit: 1500,
          instructions: 'Cite specific audit findings from Section 3.'
        },
        {
          id: `q-${Date.now()}-4`,
          type: 'upload_pdf',
          questionText: 'Upload your finalized executive slide presentation (.PDF).',
          points: 30,
          allowedTypes: '.pdf',
          maxSizeMB: 10,
          instructions: 'Slide deck must include executive summary, roadmap matrix, and budget projections.'
        }
      ]
    };
    this.recalculateTotalPoints();
    this.renderBuilderQuestions();
  },

  /**
   * Load existing task into builder for editing
   */
  loadTask(taskId) {
    const task = StorageService.getTask(taskId);
    if (!task) return false;
    this.currentTask = JSON.parse(JSON.stringify(task));
    this.recalculateTotalPoints();
    this.renderBuilderQuestions();
    return true;
  },

  /**
   * Add a new question to the builder
   */
  addQuestion(type = 'mcq') {
    const qCount = this.currentTask.questions.length + 1;
    const newId = `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let newQ = {
      id: newId,
      type: type,
      questionText: `Question ${qCount} Statement...`,
      points: 25
    };

    if (type === 'mcq') {
      newQ.options = [
        { id: 'A', text: 'Option A description' },
        { id: 'B', text: 'Option B description' },
        { id: 'C', text: 'Option C description' },
        { id: 'D', text: 'Option D description' }
      ];
      newQ.correctAnswer = 'A';
    } else if (type === 'written') {
      newQ.characterLimit = 2000;
      newQ.instructions = 'Provide clear reasoning with quantitative support.';
    } else if (type === 'admin_pdf') {
      newQ.pdfName = 'Reference_Case_Memo.pdf';
      newQ.pdfSize = '2.2 MB';
      newQ.characterLimit = 2000;
      newQ.instructions = 'Read the attached PDF and answer the prompt.';
    } else if (type === 'upload_pdf') {
      newQ.allowedTypes = '.pdf';
      newQ.maxSizeMB = 10;
      newQ.instructions = 'Upload solution deck in Adobe Acrobat PDF format.';
    }

    this.currentTask.questions.push(newQ);
    this.recalculateTotalPoints();
    this.renderBuilderQuestions();
  },

  /**
   * Move question up in sequence
   */
  moveUp(index) {
    if (index <= 0) return;
    const temp = this.currentTask.questions[index];
    this.currentTask.questions[index] = this.currentTask.questions[index - 1];
    this.currentTask.questions[index - 1] = temp;
    this.renderBuilderQuestions();
  },

  /**
   * Move question down in sequence
   */
  moveDown(index) {
    if (index >= this.currentTask.questions.length - 1) return;
    const temp = this.currentTask.questions[index];
    this.currentTask.questions[index] = this.currentTask.questions[index + 1];
    this.currentTask.questions[index + 1] = temp;
    this.renderBuilderQuestions();
  },

  /**
   * Duplicate question
   */
  duplicateQuestion(index) {
    const q = this.currentTask.questions[index];
    const clone = JSON.parse(JSON.stringify(q));
    clone.id = `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    clone.questionText += ' (Copy)';
    this.currentTask.questions.splice(index + 1, 0, clone);
    this.recalculateTotalPoints();
    this.renderBuilderQuestions();
  },

  /**
   * Delete question
   */
  deleteQuestion(index) {
    if (this.currentTask.questions.length <= 1) {
      if (window.UI) window.UI.showToast('Tasks must contain at least 1 question.', 'warning');
      return;
    }
    this.currentTask.questions.splice(index, 1);
    this.recalculateTotalPoints();
    this.renderBuilderQuestions();
  },

  /**
   * Sum total points across questions
   */
  recalculateTotalPoints() {
    let total = 0;
    this.currentTask.questions.forEach(q => {
      total += (Number(q.points) || 0);
    });
    this.currentTask.points = total;
    const totalEl = document.getElementById('builder-total-points');
    if (totalEl) totalEl.textContent = `${total} Points`;
  },

  /**
   * Render question builder cards inside the builder canvas
   */
  renderBuilderQuestions() {
    const container = document.getElementById('builder-questions-container');
    if (!container) return;

    container.innerHTML = this.currentTask.questions.map((q, index) => {
      const qNum = index + 1;

      let typeSpecificFields = '';

      if (q.type === 'mcq') {
        typeSpecificFields = `
          <div class="form-group" style="margin-top:12px;">
            <label class="form-label" style="font-size:12px;">Options (select radio for correct answer):</label>
            <div class="flex flex-col gap-2">
              ${(q.options || []).map(opt => `
                <div class="flex items-center gap-2">
                  <input type="radio" name="correct-${q.id}" ${q.correctAnswer === opt.id ? 'checked' : ''} onchange="TaskBuilderModule.currentTask.questions[${index}].correctAnswer = '${opt.id}'" title="Mark as correct answer">
                  <span class="font-bold text-primary" style="font-size:13px; min-width:20px;">${opt.id}</span>
                  <input type="text" class="form-input" style="padding:6px 10px; font-size:13px;" value="${opt.text}" oninput="TaskBuilderModule.currentTask.questions[${index}].options.find(o => o.id === '${opt.id}').text = this.value">
                </div>
              `).join('')}
            </div>
            <div class="flex items-center gap-2 mt-2" style="font-size:12px; color:var(--color-on-surface-variant);">
              <span>Correct Answer:</span>
              <select class="form-select" style="width:auto; padding:3px 8px; font-size:12px;" onchange="TaskBuilderModule.currentTask.questions[${index}].correctAnswer = this.value; TaskBuilderModule.renderBuilderQuestions();">
                ${(q.options || []).map(opt => `<option value="${opt.id}" ${q.correctAnswer === opt.id ? 'selected' : ''}>Option ${opt.id}</option>`).join('')}
              </select>
            </div>
          </div>
        `;
      } else if (q.type === 'written') {
        typeSpecificFields = `
          <div class="grid grid-cols-2 gap-3" style="margin-top:12px;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:12px;">Character Limit:</label>
              <input type="number" class="form-input" value="${q.characterLimit || 2000}" onchange="TaskBuilderModule.currentTask.questions[${index}].characterLimit = Number(this.value)">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:12px;">Instructions:</label>
              <input type="text" class="form-input" value="${q.instructions || ''}" placeholder="Explain key considerations..." onchange="TaskBuilderModule.currentTask.questions[${index}].instructions = this.value">
            </div>
          </div>
        `;
      } else if (q.type === 'admin_pdf') {
        typeSpecificFields = `
          <div class="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2" style="margin-top:12px; border:1px dashed var(--color-outline-variant);">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">picture_as_pdf</span>
                <span class="font-semibold text-on-surface font-label-md">${q.pdfName || 'Reference_Case.pdf'}</span>
              </div>
              <button class="btn btn-outline btn-sm" type="button" onclick="document.getElementById('admin-pdf-input-${index}').click()">
                Change Attached PDF
              </button>
              <input type="file" id="admin-pdf-input-${index}" accept=".pdf" style="display:none;" onchange="TaskBuilderModule.handleAdminPdfAttachment(${index}, this.files[0])">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:12px;">Question Prompt based on Document:</label>
              <input type="text" class="form-input" value="${q.instructions || ''}" placeholder="Based on page 4, state the bottleneck..." onchange="TaskBuilderModule.currentTask.questions[${index}].instructions = this.value">
            </div>
          </div>
        `;
      } else if (q.type === 'upload_pdf') {
        typeSpecificFields = `
          <div class="grid grid-cols-2 gap-3" style="margin-top:12px;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:12px;">Max File Size (MB):</label>
              <input type="number" class="form-input" value="${q.maxSizeMB || 10}" onchange="TaskBuilderModule.currentTask.questions[${index}].maxSizeMB = Number(this.value)">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:12px;">Upload Instructions:</label>
              <input type="text" class="form-input" value="${q.instructions || ''}" placeholder="Submit PDF deliverable..." onchange="TaskBuilderModule.currentTask.questions[${index}].instructions = this.value">
            </div>
          </div>
        `;
      }

      return `
        <div class="q-card-simple" id="builder-q-${q.id}" style="margin-bottom:0; padding:18px 20px;">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 mb-3 border-b">
            <div class="flex items-center gap-3">
              <span class="font-headline font-bold text-on-surface" style="font-size:14px;">
                Question ${qNum}
              </span>
              <div class="flex items-center gap-1.5">
                <span style="font-size:12px; color:var(--color-on-surface-variant);">Type:</span>
                <select class="form-select" style="width:auto; padding:4px 8px; font-size:12px;" onchange="TaskBuilderModule.changeQuestionType(${index}, this.value)">
                  <option value="mcq" ${q.type === 'mcq' ? 'selected' : ''}>MCQ</option>
                  <option value="written" ${q.type === 'written' ? 'selected' : ''}>Written Answer</option>
                  <option value="admin_pdf" ${q.type === 'admin_pdf' ? 'selected' : ''}>Reference PDF + Answer</option>
                  <option value="upload_pdf" ${q.type === 'upload_pdf' ? 'selected' : ''}>Participant PDF Upload</option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <span style="font-size:12px; color:var(--color-on-surface-variant);">Points:</span>
                <input type="number" class="form-input" style="width:64px; padding:4px 8px; font-size:12px;" value="${q.points}" onchange="TaskBuilderModule.currentTask.questions[${index}].points = Number(this.value); TaskBuilderModule.recalculateTotalPoints();">
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="TaskBuilderModule.duplicateQuestion(${index})" title="Duplicate">
                Duplicate
              </button>
              <button type="button" class="btn btn-icon text-error" onclick="TaskBuilderModule.deleteQuestion(${index})" title="Delete">
                <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
              </button>
            </div>
          </div>

          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;">Question Text</label>
            <textarea class="form-textarea" rows="2" placeholder="Enter question..." oninput="TaskBuilderModule.currentTask.questions[${index}].questionText = this.value">${q.questionText}</textarea>
          </div>

          ${typeSpecificFields}
        </div>
      `;
    }).join('');
  },

  /**
   * Switch question type on the fly
   */
  changeQuestionType(index, newType) {
    const q = this.currentTask.questions[index];
    q.type = newType;
    if (newType === 'mcq' && !q.options) {
      q.options = [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' }
      ];
      q.correctAnswer = 'A';
    } else if (newType === 'admin_pdf' && !q.pdfName) {
      q.pdfName = 'Reference_Case.pdf';
      q.pdfSize = '2.1 MB';
    } else if (newType === 'upload_pdf' && !q.maxSizeMB) {
      q.maxSizeMB = 10;
      q.allowedTypes = '.pdf';
    }
    this.renderBuilderQuestions();
  },

  /**
   * Handle admin uploading/attaching a PDF to a question
   */
  async handleAdminPdfAttachment(index, file) {
    if (!file) return;
    const res = await PdfService.processUpload(file);
    if (res.success) {
      this.currentTask.questions[index].pdfName = res.file.name;
      this.currentTask.questions[index].pdfSize = res.file.size;
      this.currentTask.questions[index].pdfFileId = res.file.fileId;
      this.renderBuilderQuestions();
      if (window.UI) window.UI.showToast(`Attached "${res.file.name}" to Question ${index + 1}`, 'success');
    } else {
      if (window.UI) window.UI.showToast(res.message, 'error');
    }
  },

  /**
   * Save task to localStorage
   */
  saveTask(publish = true) {
    const titleInput = document.getElementById('task-builder-title');
    const descInput = document.getElementById('task-builder-desc');
    const deadlineInput = document.getElementById('task-builder-deadline');
    const timeLimitInput = document.getElementById('task-builder-timelimit');
    const cameraCheckbox = document.getElementById('task-builder-camera');
    const micCheckbox = document.getElementById('task-builder-mic');
    const fullscreenCheckbox = document.getElementById('task-builder-fullscreen');

    if (titleInput && titleInput.value.trim()) {
      this.currentTask.title = titleInput.value.trim();
    }
    if (descInput) this.currentTask.description = descInput.value.trim();
    if (deadlineInput) this.currentTask.deadline = deadlineInput.value;
    if (timeLimitInput) this.currentTask.timeLimitMinutes = Number(timeLimitInput.value) || 60;

    this.currentTask.proctoring = {
      camera: cameraCheckbox ? cameraCheckbox.checked : true,
      microphone: micCheckbox ? micCheckbox.checked : true,
      fullscreen: fullscreenCheckbox ? fullscreenCheckbox.checked : true
    };

    this.currentTask.status = publish ? 'published' : 'draft';
    this.recalculateTotalPoints();

    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    this.currentTask.contestId = currentCid;

    StorageService.saveTask(this.currentTask);

    // Keep contest taskIds array updated
    const contest = StorageService.getContest(currentCid);
    if (contest) {
      contest.taskIds = contest.taskIds || [];
      if (!contest.taskIds.includes(this.currentTask.id)) {
        contest.taskIds.push(this.currentTask.id);
        StorageService.saveContest(contest);
      }
    }

    if (window.UI) {
      window.UI.showToast(`Task "${this.currentTask.title}" ${publish ? 'published' : 'saved as draft'} successfully!`, 'success');
    }
    return true;
  },

  deleteTask(taskId) {
    StorageService.deleteTask(taskId);
    if (window.UI) window.UI.showToast('Task deleted successfully.', 'info');
    return true;
  },

  duplicateTask(taskId) {
    const task = StorageService.getTask(taskId);
    if (!task) return false;
    const currentCid = StorageService.getCurrentContestId() || task.contestId || 'contest-001';
    const clone = JSON.parse(JSON.stringify(task));
    clone.id = `task-${Date.now().toString().slice(-4)}`;
    clone.contestId = currentCid;
    clone.title = `${clone.title} (Copy)`;
    StorageService.saveTask(clone);
    if (window.UI) window.UI.showToast(`Duplicated "${task.title}"`, 'success');
    return true;
  }
};
