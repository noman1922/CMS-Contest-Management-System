/**
 * Vectis Assess - Authentication & Session Service
 * Provides client-side role-based demo authentication, phone/email login,
 * multi-contest session scoping, guards, and 1-click role switching.
 */

const AuthService = {
  /**
   * Attempt demo login with Phone Number OR Email
   */
  login(identifier, password) {
    const rawId = (identifier || '').trim();
    const cleanId = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/\D/g, '');
    const cleanPass = (password || '').trim();

    // Check Admin Credentials (email or phone)
    if ((cleanId === 'admin@demo.com' || cleanDigits === '8801700000001' || cleanDigits === '01700000001' || cleanId === 'admin') && cleanPass === 'admin123') {
      const adminUser = StorageService.getUser('admin-01') || SEED_DATA.adminUser;
      StorageService.setSession({
        userId: adminUser.id,
        role: 'admin',
        currentContestId: null,
        loginTime: new Date().toISOString()
      });
      return { success: true, user: adminUser, redirect: 'admin/contests.html' };
    }

    // Check Participant Credentials (email, phone, or participant ID)
    if (cleanPass === '123456') {
      let participant = null;

      // 1. Direct match in users list
      participant = StorageService.getUser(rawId);

      // 2. Fallbacks
      if (!participant) {
        if (cleanId === 'participant@demo.com' || cleanDigits.endsWith('027') || cleanId === '#027' || cleanId === 'elena') {
          participant = StorageService.getUser('participant-027');
        } else if (cleanId.startsWith('participant') && cleanId.includes('@')) {
          const match = cleanId.match(/participant(\d+)/);
          if (match) {
            const pId = `#${match[1].padStart(3, '0')}`;
            participant = StorageService.getUser(pId);
          }
        }
      }

      // Default fallback to Elena Rostova (#027)
      if (!participant) {
        participant = StorageService.getUser('participant-027');
      }

      if (participant) {
        if (participant.status === 'disabled') {
          return { success: false, message: 'This participant account has been disabled by the administrator.' };
        }

        StorageService.setSession({
          userId: participant.id,
          role: 'participant',
          currentContestId: null,
          loginTime: new Date().toISOString()
        });

        return { success: true, user: participant, redirect: 'participant/contests.html' };
      }
    }

    return {
      success: false,
      message: 'Invalid credentials. Use admin@demo.com (admin123) or participant@demo.com (123456) / phone.'
    };
  },

  /**
   * Log out and redirect to home login (clears session, keeps demo data intact)
   */
  logout() {
    StorageService.clearSession();
    StorageService.clearCurrentContestId();
    sessionStorage.setItem('vectis_toast_msg', 'You have logged out successfully.');
    sessionStorage.setItem('vectis_toast_type', 'info');
    const pathPrefix = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/participant/') ? '../' : '';
    window.location.href = `${pathPrefix}index.html`;
  },

  /**
   * Return active user session or default mock user if none set
   */
  getUser() {
    let user = StorageService.getCurrentUser();
    if (!user) {
      if (window.location.pathname.includes('/admin/')) {
        user = StorageService.getUser('admin-01') || SEED_DATA.adminUser;
        StorageService.setSession({
          userId: user.id,
          role: 'admin',
          currentContestId: null,
          loginTime: new Date().toISOString()
        });
      } else if (window.location.pathname.includes('/participant/')) {
        user = StorageService.getUser('participant-027');
        StorageService.setSession({
          userId: user.id,
          role: 'participant',
          currentContestId: null,
          loginTime: new Date().toISOString()
        });
      }
    }
    return user;
  },

  /**
   * Guard route based on required role and contest selection
   */
  requireAuth(requiredRole, requireContest = false) {
    const user = this.getUser();
    const pathPrefix = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/participant/') ? '../' : '';

    if (!user) {
      window.location.href = `${pathPrefix}index.html`;
      return null;
    }

    // Role Guard
    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'admin') {
        window.location.href = `${pathPrefix}admin/contests.html`;
      } else {
        window.location.href = `${pathPrefix}participant/contests.html`;
      }
      return null;
    }

    // Contest Guard (if page requires an active contest to be selected)
    if (requireContest) {
      const currentCid = StorageService.getCurrentContestId();
      if (!currentCid) {
        if (user.role === 'admin') {
          window.location.href = `${pathPrefix}admin/contests.html`;
        } else {
          window.location.href = `${pathPrefix}participant/contests.html`;
        }
        return null;
      }

      // Check participant eligibility for this contest
      if (user.role === 'participant') {
        const contest = StorageService.getContest(currentCid);
        if (contest && contest.participantIds && !contest.participantIds.includes(user.participantId)) {
          sessionStorage.setItem('vectis_toast_msg', 'You are not eligible for this contest.');
          sessionStorage.setItem('vectis_toast_type', 'warning');
          StorageService.clearCurrentContestId();
          window.location.href = `${pathPrefix}participant/contests.html`;
          return null;
        }
      }
    }

    return user;
  },

  /**
   * Switch roles instantly with 1-click for demo presentation.
   * Landing pages are strictly My Contests (for Participant) or Contests (for Admin).
   */
  switchRole(targetRole) {
    const pathPrefix = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/participant/') ? '../' : '';
    
    if (targetRole === 'admin') {
      const adminUser = StorageService.getUser('admin-01') || SEED_DATA.adminUser;
      StorageService.setSession({
        userId: adminUser.id,
        role: 'admin',
        currentContestId: null,
        loginTime: new Date().toISOString()
      });
      sessionStorage.setItem('vectis_toast_msg', 'Switched to Admin Demo (Dr. Alistair Vance)');
      sessionStorage.setItem('vectis_toast_type', 'success');
      window.location.href = `${pathPrefix}admin/contests.html`;
    } else {
      const p27 = StorageService.getUser('participant-027');
      StorageService.setSession({
        userId: p27.id,
        role: 'participant',
        currentContestId: null,
        loginTime: new Date().toISOString()
      });
      sessionStorage.setItem('vectis_toast_msg', 'Switched to Participant Demo (Elena Rostova)');
      sessionStorage.setItem('vectis_toast_type', 'success');
      window.location.href = `${pathPrefix}participant/contests.html`;
    }
  }
};
