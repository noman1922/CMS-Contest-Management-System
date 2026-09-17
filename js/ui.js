/**
 * Vectis Assess - Common UI Component Helpers
 * Manages toast notifications, modals, countdown timers, mobile sidebar drawers,
 * and pure vanilla JavaScript CSV export.
 */

const UI = {
  /**
   * Display toast notification
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check_circle';
    if (type === 'error') iconName = 'error';
    if (type === 'warning') iconName = 'warning';

    toast.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:20px; color:${type === 'success' ? '#059669' : (type === 'error' ? '#dc2626' : (type === 'warning' ? '#d97706' : '#2563eb'))}">
        ${iconName}
      </span>
      <div style="flex:1; font-size:13px; line-height:1.4;">${message}</div>
      <button style="background:none; border:none; cursor:pointer; color:var(--color-outline); padding:2px;" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined" style="font-size:16px;">close</span>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4500);
  },

  /**
   * Open / close generic modal
   */
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('open');
  },

  /**
   * Real-time Countdown timer helper
   */
  initCountdown(elementId, initialSeconds = 16362) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let secondsRemaining = initialSeconds;

    function renderTime() {
      const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, '0');
      const seconds = String(secondsRemaining % 60).padStart(2, '0');
      el.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    renderTime();

    const interval = setInterval(() => {
      if (secondsRemaining > 0) {
        secondsRemaining--;
        renderTime();
      } else {
        clearInterval(interval);
        el.textContent = '00h 00m 00s (CONCLUDED)';
      }
    }, 1000);
  },

  /**
   * Responsive Mobile Sidebar Drawer Toggle
   */
  initMobileSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const toggleBtn = document.querySelector('.mobile-nav-toggle');

    if (!sidebar) return;

    // Create backdrop if not existing
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });
    }

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  },

  /**
   * Vanilla JavaScript CSV Export
   */
  exportToCsv(filename, headers, rows) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const text = String(cell || '').replace(/"/g, '""');
        return `"${text}"`;
      }).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(`Exported "${filename}" successfully.`, 'success');
  },

  /**
   * Initialize Admin Contest Switcher in Header
   */
  initAdminHeader() {
    const switcherBtn = document.getElementById('contest-switcher-btn');
    const dropdownMenu = document.getElementById('contest-switcher-dropdown');
    const nameEl = document.getElementById('header-contest-name');
    const badgeEl = document.getElementById('header-contest-badge');

    if (!switcherBtn || !dropdownMenu) return;

    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    StorageService.setCurrentContestId(currentCid);
    const contest = StorageService.getContest(currentCid);
    const contests = StorageService.getContests();

    if (contest) {
      const status = typeof getContestStatus === 'function' ? getContestStatus(contest) : contest.status;
      if (nameEl) nameEl.textContent = contest.name;
      if (badgeEl) {
        badgeEl.textContent = status.toUpperCase();
        badgeEl.className = `badge ${status === 'live' ? 'badge-success' : (status === 'upcoming' ? 'badge-warning' : 'badge-neutral')}`;
      }
    }

    // Populate dropdown
    dropdownMenu.innerHTML = `
      <div style="padding:6px 12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--color-on-surface-variant);">
        Switch Contest
      </div>
      ${contests.map(c => {
        const status = typeof getContestStatus === 'function' ? getContestStatus(c) : c.status;
        const isActive = c.id === currentCid;
        return `
          <div class="contest-dropdown-item ${isActive ? 'active' : ''}" onclick="UI.switchAdminContest('${c.id}')">
            <div>
              <div style="font-weight:${isActive ? '700' : '600'}; font-size:13px;">${c.name}</div>
              <span style="font-size:11px; text-transform:uppercase; color:var(--color-on-surface-variant);">${status}</span>
            </div>
            ${isActive ? '<span class="material-symbols-outlined" style="font-size:16px; color:var(--color-primary);">check</span>' : ''}
          </div>
        `;
      }).join('')}
      <div class="contest-dropdown-divider"></div>
      <a href="contests.html" class="contest-dropdown-item" style="color:var(--color-primary); font-weight:600;">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined" style="font-size:16px;">folder_open</span>
          <span>All Contests</span>
        </span>
      </a>
    `;

    switcherBtn.onclick = (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    };

    document.addEventListener('click', (e) => {
      if (!switcherBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  },

  /**
   * Switch active contest for admin and refresh current page context
   */
  switchAdminContest(contestId) {
    StorageService.setCurrentContestId(contestId);
    sessionStorage.setItem('vectis_toast_msg', `Switched context to contest "${StorageService.getContest(contestId)?.name || contestId}"`);
    sessionStorage.setItem('vectis_toast_type', 'info');

    // Update query param and reload
    const url = new URL(window.location.href);
    url.searchParams.set('contest', contestId);
    window.location.href = url.toString();
  },

  /**
   * Initialize Participant Header & Profile Dropdown
   */
  initParticipantHeader() {
    const profileBtn = document.getElementById('participant-profile-btn');
    const profileMenu = document.getElementById('participant-profile-dropdown');
    const contestTitleEl = document.getElementById('header-contest-title');

    const currentCid = StorageService.getCurrentContestId() || 'contest-001';
    const contest = StorageService.getContest(currentCid);
    if (contest) {
      if (contestTitleEl) contestTitleEl.textContent = contest.name;
      document.querySelectorAll('.sidebar-contest-name').forEach(el => el.textContent = contest.name);
    }

    // Sync logged in participant info in header & profile menu
    const session = StorageService.getSession();
    if (session && session.userId) {
      const user = StorageService.getUser(session.userId);
      if (user) {
        document.querySelectorAll('#user-header-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('#user-header-avatar').forEach(el => { if (user.avatar) el.src = user.avatar; });
        document.querySelectorAll('#menu-user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('#menu-user-id').forEach(el => el.textContent = `Participant ${user.participantId || '#027'}`);
      }
    }

    if (profileBtn && profileMenu) {
      profileBtn.onclick = (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
      };

      document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
          profileMenu.classList.remove('show');
        }
      });
    }
  }
};

// Initialize mobile sidebar and check pending session toasts on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  UI.initMobileSidebar();
  UI.initAdminHeader();
  UI.initParticipantHeader();

  const msg = sessionStorage.getItem('vectis_toast_msg');
  if (msg) {
    const type = sessionStorage.getItem('vectis_toast_type') || 'info';
    sessionStorage.removeItem('vectis_toast_msg');
    sessionStorage.removeItem('vectis_toast_type');
    setTimeout(() => {
      UI.showToast(msg, type);
    }, 200);
  }
});

