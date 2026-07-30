/**
 * 旅游攻略 - 路由系统
 * 基于 hash 的简单路由，支持参数传递
 */

const Router = {
  currentPage: 'home',
  currentParams: {},

  /**
   * 初始化路由监听
   */
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  /**
   * 处理路由变化
   */
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = {};

    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }

    this.currentParams = params;

    // 解析路径
    switch (true) {
      case path === '/':
      case path === '/home':
        this.currentPage = 'home';
        break;
      case path === '/search':
        this.currentPage = 'search';
        break;
      case path.startsWith('/guide/'):
        this.currentPage = 'guide-detail';
        this.currentParams.guideId = path.split('/')[2];
        break;
      case path === '/create':
        this.currentPage = 'create';
        this.currentParams.editId = params.edit;
        break;
      case path === '/planner':
        this.currentPage = 'planner';
        break;
      case path === '/user':
        this.currentPage = 'user';
        break;
      case path === '/dest':
        this.currentPage = 'dest';
        this.currentParams.destId = params.id;
        break;
      default:
        this.currentPage = 'home';
    }

    this.renderPage();
    this.updateNavActive();
  },

  /**
   * 导航到指定页面
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * 更新导航栏激活状态
   */
  updateNavActive() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeMap = {
      'home': 'home',
      'search': 'search',
      'planner': 'planner',
      'create': 'create',
      'guide-detail': 'search',
      'user': null,
      'dest': 'search'
    };

    const activePage = activeMap[this.currentPage];
    if (activePage) {
      const link = document.querySelector(`[data-page="${activePage}"]`);
      if (link) link.classList.add('active');
    }
  },

  /**
   * 渲染当前页面
   */
  renderPage() {
    const main = document.getElementById('mainContent');
    if (!main) return;

    main.innerHTML = '';

    switch (this.currentPage) {
      case 'home':
        App.renderHome();
        break;
      case 'search':
        App.renderSearch();
        break;
      case 'guide-detail':
        App.renderGuideDetail(this.currentParams.guideId);
        break;
      case 'create':
        App.renderCreate(this.currentParams.editId);
        break;
      case 'planner':
        App.renderPlanner();
        break;
      case 'user':
        App.renderUserCenter();
        break;
      case 'dest':
        App.renderDestDetail(this.currentParams.destId);
        break;
      default:
        App.renderHome();
    }
  }
};