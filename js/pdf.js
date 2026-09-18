/**
 * Vectis Assess - PDF Handling & In-Browser Document Viewer
 * Manages PDF drag-and-drop uploads, Base64/Blob conversion,
 * in-app modal preview, excerpt viewer, and download simulation.
 */

const PdfService = {
  /**
   * Validate and parse an uploaded PDF file from an input or drop event
   */
  async processUpload(file, maxSizeMB = 10) {
    if (!file) return { success: false, message: "No file provided" };

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return { success: false, message: "Invalid file type. Only Adobe Acrobat (.PDF) documents are permitted." };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return { success: false, message: `File size (${fileSizeMB.toFixed(1)} MB) exceeds the maximum allowed limit of ${maxSizeMB} MB.` };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const fileId = `pdf-${Date.now()}`;
        const fileRecord = {
          fileId,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          rawBytes: file.size,
          type: 'application/pdf',
          uploadedAt: new Date().toLocaleTimeString(),
          base64: base64Data,
          previewText: "Executive strategic memorandum and roadmap deliverables verified under ISO 27001 evaluation standards."
        };

        StorageService.storePdfFile(fileId, fileRecord);
        resolve({ success: true, file: fileRecord });
      };

      reader.onerror = () => {
        resolve({ success: false, message: "Failed to read file from disk." });
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Render in-app PDF Preview modal with realistic document viewer interface
   */
  openPdfViewer(fileName, fileId = null, excerptContent = null) {
    let modal = document.getElementById('pdf-viewer-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pdf-viewer-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const file = fileId ? StorageService.getPdfFile(fileId) : null;
    const documentTitle = fileName || (file ? file.name : "Document_Case_Study.pdf");
    const previewBody = excerptContent || (file && file.previewText ? file.previewText : `
      <div style="font-family:monospace; line-height:1.7; color:#334155; font-size:13px;">
        <div style="border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
          <p style="font-weight:700; color:#0f172a; font-size:15px;">CONFIDENTIAL // ACI CAREER EDGE PROGRAM CASE STUDY</p>
          <p>Document: ${documentTitle} • Classified Assessment Material</p>
          <p style="color:#64748b;">Page 1 of 8 • Security Watermark: #027-ELENA-ROSTOVA</p>
        </div>
        <h4 style="color:#1e3a8a; margin-top:12px; font-weight:700;">1. EXECUTIVE CHALLENGE CONTEXT</h4>
        <p>Across macroeconomic shifts in Q3, supply chain telemetry indicated severe upstream delivery delays within the critical microcontroller manufacturing corridor. Cross-regional freight tariffs surged by 42% while tier-1 suppliers reported 60-day buffer shortages.</p>
        
        <h4 style="color:#1e3a8a; margin-top:14px; font-weight:700;">2. OPERATIONAL BOTTLENECK AUDIT</h4>
        <p>Single-source dependencies at facility Beta-4 created an operational bottleneck in Phase 2 assembly lines. Downtime expanded from 8 hours per week to 38 hours, degrading total order fulfillment SLAs to 81.4% against the target 98.0% benchmark.</p>
        
        <h4 style="color:#1e3a8a; margin-top:14px; font-weight:700;">3. REMEDIATION MANDATE</h4>
        <p>Candidates are required to formulate a 90-day multi-phased risk mitigation strategy, detailing vendor dual-sourcing qualification, buffer inventory recalibration, and cash flow impact forecasting.</p>
      </div>
    `);

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 780px;">
        <div class="modal-header" style="background:var(--color-surface-container-low)">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary" style="font-size:24px">picture_as_pdf</span>
            <div>
              <h3 style="font-size:15px; margin:0;" class="font-headline">${documentTitle}</h3>
              <span style="font-size:11px; color:var(--color-on-surface-variant)">Secure In-App Document Previewer</span>
            </div>
          </div>
          <button class="btn-icon" onclick="document.getElementById('pdf-viewer-modal').classList.remove('open')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body" style="background:#f8fafc; padding:24px; min-height:360px; max-height:65vh; overflow-y:auto;">
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:24px; box-shadow:var(--shadow-sm);">
            ${previewBody}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" onclick="PdfService.downloadMockPdf('${documentTitle}')">
            <span class="material-symbols-outlined" style="font-size:16px">download</span>
            Download Document
          </button>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('pdf-viewer-modal').classList.remove('open')">
            Close Preview
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
  },

  /**
   * Safe local mock download for browser demo
   */
  downloadMockPdf(fileName) {
    const content = `ACI CAREER EDGE PROGRAM DOCUMENT EXPORT\nFile: ${fileName}\nExported At: ${new Date().toLocaleString()}\nThis is a verified assessment document generated for the local demo.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.UI) {
      window.UI.showToast(`Document "${fileName}" downloaded successfully.`, 'success');
    }
  }
};
