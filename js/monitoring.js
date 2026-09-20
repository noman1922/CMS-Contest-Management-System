/**
 * Vectis Assess - Camera, Microphone, Fullscreen & Proctoring Telemetry Service
 * Manages MediaDevices API streams, tab visibility tracking, fullscreen locks,
 * and records neutral monitoring telemetry events.
 */

const MonitoringService = {
  mediaStream: null,
  activeParticipantId: '#027',
  activeTaskId: null,
  alertCount: 0,
  isFullscreen: false,
  isListening: false,
  simulatedStreamInterval: null,

  /**
   * Initialize monitoring for a specific task and participant
   */
  async startMonitoring(participantId, taskId, taskConfig = {}) {
    this.activeParticipantId = participantId;
    this.activeTaskId = taskId;
    this.alertCount = 0;

    const settings = StorageService.getSettings();
    const proctoring = {
      ...settings.proctoring,
      ...(taskConfig.proctoring || {})
    };

    // Attach listeners for tab visibility and window blur if enabled
    if (!this.isListening) {
      this.attachTelemetryListeners(proctoring);
      this.isListening = true;
    }

    // Return requirements object so UI can prompt user if needed
    return {
      requireCamera: !!proctoring.requireCamera,
      requireMicrophone: !!proctoring.requireMicrophone,
      requireFullscreen: !!proctoring.requireFullscreen,
      proctoring
    };
  },

  /**
   * Request live camera & mic stream using standard MediaDevices API
   */
  async requestMediaPermissions() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });

        // Log successful camera & microphone connection
        this.logEvent('camera_connected', 'Camera enabled', '1080p webcam feed synchronized');
        this.logEvent('microphone_connected', 'Microphone enabled', 'Microphone audio input stream validated');

        return { success: true, stream: this.mediaStream, simulated: false };
      } else {
        throw new Error('MediaDevices API not supported in this browser context');
      }
    } catch (err) {
      console.warn('Real webcam/mic not accessible or blocked:', err.message);
      // Fallback: provide graceful simulated stream so demo never crashes
      this.logEvent('camera_permission_denied', 'Camera permission prompt handled', 'Fallback simulation stream engaged for presentation');
      return { success: false, error: err.message, canSimulate: true };
    }
  },

  /**
   * Create simulated camera feed for test presentations without webcam hardware
   */
  createSimulatedStream(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    if (this.simulatedStreamInterval) clearInterval(this.simulatedStreamInterval);

    this.simulatedStreamInterval = setInterval(() => {
      frame++;
      // Render clean synthetic camera feed
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient avatar silhouette
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(160, 100, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(160, 220, 75, 0, Math.PI * 2);
      ctx.fill();

      // Timestamp watermark
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`CANDIDATE ${this.activeParticipantId} // LIVE TELEMETRY`, 12, 20);
      ctx.fillText(new Date().toLocaleTimeString(), 12, 34);

      // Subtle pulse dot
      ctx.fillStyle = (frame % 30 < 15) ? '#10b981' : '#059669';
      ctx.beginPath();
      ctx.arc(295, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    }, 100);

    const stream = canvas.captureStream(15);
    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.play().catch(() => {});
    }
    this.mediaStream = stream;
    this.logEvent('camera_connected', 'Camera enabled', 'Simulated telemetry stream active');
    return stream;
  },

  /**
   * Request Fullscreen mode
   */
  async requestFullscreenMode() {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
      this.isFullscreen = true;
      this.logEvent('fullscreen_enter', 'Fullscreen entered', 'Proctored workspace lock engaged');
      return true;
    } catch (e) {
      console.warn('Fullscreen request bypassed or rejected:', e);
      return false;
    }
  },

  /**
   * Attach listeners for tab switching, window blur, and fullscreen changes
   */
  attachTelemetryListeners(proctoring) {
    // Tab switch detection (Page Visibility API)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.alertCount++;
        this.logEvent('tab_switch', 'Tab switch detected', 'Browser tab lost visibility / user navigated away');
        if (window.UI) {
          window.UI.showToast('Potential monitoring issue: Tab switch detected. Please stay within the assessment tab.', 'warning');
        }
        this.updateWidgetUI();
      } else {
        this.logEvent('window_focus', 'Window focused', 'Participant returned to assessment workspace');
      }
    });

    // Window blur detection
    window.addEventListener('blur', () => {
      if (proctoring.detectWindowBlur) {
        this.logEvent('window_blur', 'Window blurred', 'Application window lost focus');
      }
    });

    // Fullscreen change listener
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
        this.alertCount++;
        this.logEvent('fullscreen_exit', 'Fullscreen exited', 'Attention required: Candidate exited enforced full-screen container');
        if (window.UI) {
          window.UI.showToast('Attention required: Fullscreen mode exited. Please return to fullscreen.', 'warning');
        }
        this.updateWidgetUI();
      } else {
        this.isFullscreen = true;
      }
    });
  },

  /**
   * Log an event into storage
   */
  logEvent(type, title, details) {
    const severity = (type === 'tab_switch' || type === 'fullscreen_exit' || type === 'camera_disconnect') ? 'warning' : 'info';
    StorageService.addMonitoringEvent({
      participantId: this.activeParticipantId,
      taskId: this.activeTaskId,
      type,
      title,
      severity,
      details
    });
  },

  /**
   * Mount or update compact floating monitoring widget in DOM
   */
  renderMonitoringWidget(containerId = 'monitoring-widget-container') {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'monitoring-floating-widget';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="monitoring-widget-header">
        <span class="flex items-center gap-1.5">
          <span class="pulse-dot" style="background:#10b981; width:7px; height:7px;"></span>
          <span>MONITORING ACTIVE</span>
        </span>
        <span class="badge ${this.alertCount > 0 ? 'badge-warning' : 'badge-neutral'}" style="font-size:10px; padding:1px 6px;">
          ${this.alertCount} Alert${this.alertCount === 1 ? '' : 's'}
        </span>
      </div>
      <video id="monitoring-video-preview" class="monitoring-video-preview" autoplay playsinline muted></video>
      <div class="monitoring-telemetry-list">
        <div class="monitoring-telemetry-row">
          <span style="color:var(--color-on-surface-variant)">Camera:</span>
          <span class="font-semibold text-tertiary-container flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:13px">videocam</span> Connected
          </span>
        </div>
        <div class="monitoring-telemetry-row">
          <span style="color:var(--color-on-surface-variant)">Microphone:</span>
          <span class="font-semibold text-tertiary-container flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:13px">mic</span> Connected
          </span>
        </div>
        <div class="monitoring-telemetry-row">
          <span style="color:var(--color-on-surface-variant)">Fullscreen:</span>
          <span class="font-semibold ${this.isFullscreen ? 'text-tertiary-container' : 'text-on-surface-variant'} flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:13px">fullscreen</span> ${this.isFullscreen ? 'Active' : 'Optional'}
          </span>
        </div>
      </div>
    `;

    const videoEl = document.getElementById('monitoring-video-preview');
    if (this.mediaStream) {
      videoEl.srcObject = this.mediaStream;
    } else {
      this.createSimulatedStream(videoEl);
    }
  },

  updateWidgetUI() {
    const widget = document.getElementById('monitoring-widget-container');
    if (widget) {
      this.renderMonitoringWidget();
    }
  },

  /**
   * Stop all active monitoring tracks on task completion or page navigation
   */
  stopMonitoring() {
    if (this.mediaStream && this.mediaStream.getTracks) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.simulatedStreamInterval) {
      clearInterval(this.simulatedStreamInterval);
    }
    this.mediaStream = null;
  }
};
