/**
 * Vectis Assess - Leaderboard Component Logic
 * Renders live leaderboard rankings, handles real-time filtering,
 * search by Participant ID, and CSV exports.
 */

const LeaderboardModule = {
  currentFilter: 'all',
  currentSort: 'score',
  searchQuery: '',

  /**
   * Render the leaderboard table into specified tbody element
   */
  renderTable(tbodyId = 'leaderboard-body', currentUserPid = '#027', contestId = null) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const cid = contestId || StorageService.getCurrentContestId() || 'contest-001';

    // Get sorted participants using scoring engine
    let list = ScoringEngine.calculateLeaderboard(cid);

    // Apply Search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.participantId.toLowerCase().includes(q) || 
        (p.name && p.name.toLowerCase().includes(q))
      );
    }

    // Apply Filter
    if (this.currentFilter === 'top50') {
      list = list.slice(0, 50);
    } else if (this.currentFilter === 'cohortA') {
      list = list.filter(p => p.cohort === 'Cohort Alpha');
    } else if (this.currentFilter === 'cohortB') {
      list = list.filter(p => p.cohort === 'Cohort Beta');
    }

    // Apply Sort
    if (this.currentSort === 'tasks') {
      list.sort((a, b) => b.tasksCompleted - a.tasksCompleted);
    } else if (this.currentSort === 'movement') {
      list.sort((a, b) => (b.trend || 0) - (a.trend || 0));
    } else {
      list.sort((a, b) => b.score - a.score);
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:32px; color:var(--color-on-surface-variant); font-size:13px;">
            No participant scores recorded yet for this contest.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((p, index) => {
      const isCurrentUser = p.participantId === currentUserPid;
      const rankNum = index + 1;

      // Medal emojis for top 3
      let medal = '';
      if (rankNum === 1) medal = '🥇 ';
      else if (rankNum === 2) medal = '🥈 ';
      else if (rankNum === 3) medal = '🥉 ';

      return `
        <tr class="${isCurrentUser ? 'highlight-row' : ''}">
          <td class="font-headline font-bold text-on-surface tabular-nums">
            ${medal}${rankNum}
          </td>
          <td>
            <div class="flex items-center gap-2">
              <span class="font-bold ${isCurrentUser ? 'text-primary' : 'text-on-surface'}" style="font-size:14px;">${p.participantId}</span>
              ${isCurrentUser ? '<span class="badge badge-primary font-bold" style="font-size:10px; padding:2px 8px;">YOU</span>' : ''}
            </div>
          </td>
          <td>
            <span class="font-headline font-bold text-on-surface tabular-nums" style="font-size:14px;">
              ${p.score}
            </span>
          </td>
          <td style="text-align:right;">
            <span class="font-semibold text-on-surface-variant tabular-nums" style="font-size:13px;">
              ${p.tasksCompleted}/10
            </span>
          </td>
        </tr>
      `;
    }).join('');

    // Update sync time indicator
    const syncTimeEl = document.getElementById('sync-time');
    if (syncTimeEl) {
      syncTimeEl.textContent = new Date().toLocaleTimeString();
    }
  },

  /**
   * Export leaderboard to CSV
   */
  exportCSV() {
    const list = ScoringEngine.calculateLeaderboard();
    const headers = ['Rank', 'Participant ID', 'Cohort', 'Score', 'Tasks Completed', 'Trend', 'Last Active'];
    const rows = list.map(p => [
      p.rank,
      p.participantId,
      p.cohort,
      p.score,
      `${p.tasksCompleted}/10`,
      p.trend > 0 ? `+${p.trend}` : p.trend,
      p.lastActive
    ]);
    UI.exportToCsv('ACI_Career_Edge_Program_Live_Leaderboard.csv', headers, rows);
  }
};
