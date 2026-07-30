/**
 * Travel Planner - 本地存储管理 + 主题
 */
const Storage = {
  getPlans() {
    try {
      const data = localStorage.getItem('travel_plans_v2');
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  },

  savePlan(plan) {
    try {
      const plans = this.getPlans();
      const idx = plans.findIndex(p => p.id === plan.id);
      if (idx >= 0) plans[idx] = plan;
      else plans.push(plan);
      localStorage.setItem('travel_plans_v2', JSON.stringify(plans));
      return true;
    } catch (e) { return false; }
  },

  deletePlan(planId) {
    try {
      const plans = this.getPlans().filter(p => p.id !== planId);
      localStorage.setItem('travel_plans_v2', JSON.stringify(plans));
      return true;
    } catch (e) { return false; }
  },

  /** 获取当前主题 */
  getTheme() {
    try {
      return localStorage.getItem('travel_theme') || 'indigo';
    } catch (e) { return 'indigo'; }
  },

  /** 保存主题 */
  setTheme(name) {
    try {
      localStorage.setItem('travel_theme', name);
      document.documentElement.setAttribute('data-theme', name);
      document.querySelector('meta[name="theme-color"]').content =
        getComputedStyle(document.documentElement).getPropertyValue('--c-primary').trim();
      return true;
    } catch (e) { return false; }
  },
};