/**
 * Travel Planner v2 - 地图 + 路线可视化 + 主题定制 + 移动端适配
 */

/** Attraction category → emoji */
const ATTR_EMOJI = {
  '博物馆': '🏛️', '公园': '🌳', '历史古迹': '🏛️',
  '商场': '🛍️', '购物': '🛍️', '购物中心': '🛍️',
  '美食街': '🍜', '美食': '🍜',
  '观景台': '🏔️', '观景': '🏔️',
  '网红打卡点': '📸', '打卡': '📸',
  '海滩': '🏖️',
  '寺庙': '🛕', '教堂': '⛪',
  '动物园': '🐼', '街区': '🏘️', '广场': '🏛️',
  '集市': '🛒', '自然风光': '🏞️', '温泉': '♨️',
  '历史建筑': '🏛️', '文化景区': '🏯', '海岛': '🏝️',
  '主题公园': '🎢', '地标建筑': '🗼', '地标': '🗼',
  '古城': '🏘️', '古镇': '🏘️',
};

const App = {
  plan: null,
  addItemDayNum: 1,
  addItemType: 'attraction',
  pendingCoords: null,
  pendingCoordName: '',
  pendingTransportData: null,  // { note, cost } from route result
  mapPickerMap: null,
  mapPickerMarker: null,
  _mapReady: false,

  /* ───── 初始化 ───── */
  init() {
    Storage.setTheme(Storage.getTheme());
    this.loadLatestPlan();

    // 页面立即渲染，不等 SDK
    this.render();
    this.bindGlobalEvents();
    this.initAddModal();
    this.initSavedPlansModal();
    this.initThemeModal();
    this.initMobileTabbar();
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());

    // 后台异步加载地图 SDK
    this._initMapAsync();
  },

  /** 后台加载地图 SDK，成功后启用地图功能 */
  _initMapAsync() {
    AmapConfig.load()
      .then(() => {
        this._mapReady = true;
        console.log('[App] 地图功能已就绪');
        this.initMapPickerModal();
      })
      .catch(err => {
        this._mapReady = false;
        console.warn('[App] 地图 SDK 不可用:', err.message);
        // 禁用地图入口
        const pickSec = document.getElementById('mapPickSection');
        if (pickSec) pickSec.classList.add('map-disabled');
        const locateBtn = document.getElementById('btnMapLocate');
        if (locateBtn) locateBtn.style.display = 'none';
        const pickerBtn = document.getElementById('btnOpenMapPicker');
        if (pickerBtn) pickerBtn.style.display = 'none';
      });
  },

  handleScroll() {
    const tb = document.getElementById('topbar');
    if (window.scrollY > 10) tb.classList.add('scrolled');
    else tb.classList.remove('scrolled');
  },

  loadLatestPlan() {
    const plans = Storage.getPlans();
    this.plan = plans.length > 0 ? plans[plans.length - 1] : this.createDefaultPlan();
  },

  createDefaultPlan() {
    return {
      id: this.genId('plan'),
      name: '我的旅行计划',
      days: [{ day: 1, items: [] }, { day: 2, items: [] }, { day: 3, items: [] }]
    };
  },

  genId(prefix) {
    return (prefix || 'item') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  },

  calcBudget() {
    let total = 0;
    const bd = { attraction: 0, transport: 0, accommodation: 0 };
    this.plan.days.forEach(day => {
      (day.items || []).forEach(item => {
        const c = parseFloat(item.cost) || 0;
        total += c;
        if (bd[item.type] !== undefined) bd[item.type] += c;
      });
    });
    return { total, breakdown: bd };
  },

  /* ───── 全局事件 ───── */
  bindGlobalEvents() {
    document.getElementById('btnNewPlan').addEventListener('click', () => this.newPlan());
    document.getElementById('btnSavedPlans').addEventListener('click', () => this.openSavedPlans());
    document.getElementById('btnThemePicker').addEventListener('click', () => this.openThemeModal());
  },

  /* ═════════════════════════════
     RENDER
     ═════════════════════════════ */
  render() {
    const main = document.getElementById('mainContent');
    const budget = this.calcBudget();
    const totalItems = this.plan.days.reduce((s, d) => s + (d.items || []).length, 0);
    const itemsWithCoords = this.countItemsWithCoords();

    const html = `
      <div class="planner-top">
        <h1>行程规划</h1>
        <p class="sub">规划旅程 · 地图标记 · 路线预览</p>
        <div class="plan-name-row">
          <input class="plan-name-input" id="planName" value="${this.esc(this.plan.name)}" maxlength="30" placeholder="输入行程名称">
          <button class="btn-ghost" id="btnRename" title="重命名" style="padding:5px 8px">&#9998;</button>
        </div>
        <div class="plan-stats">
          <div class="plan-stat"><span class="val">${this.plan.days.length}</span><span class="lbl">天数</span></div>
          <div class="plan-stat"><span class="val">${totalItems}</span><span class="lbl">行程项</span></div>
          <div class="plan-stat"><span class="val">${itemsWithCoords}</span><span class="lbl">地图标记</span></div>
          <div class="plan-stat"><span class="val">¥${budget.total.toFixed(0)}</span><span class="lbl">总预算</span></div>
        </div>
      </div>
      ${this.renderBudgetBar(budget)}
      <div class="planner-days" id="plannerDays">
        ${this.plan.days.map(d => this.renderDayCard(d)).join('')}
      </div>
      <div class="planner-bottom">
        <button class="btn btn-outline" id="btnAddDay"><span>+</span> 添加一天</button>
        <button class="btn btn-primary" id="btnSave">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          保存行程
        </button>
      </div>`;
    main.innerHTML = html;
    this.bindPlanEvents();
  },

  countItemsWithCoords() {
    let count = 0;
    this.plan.days.forEach(d => {
      (d.items || []).forEach(item => {
        if (item.lat && item.lng) count++;
      });
    });
    return count;
  },

  esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; },

  renderBudgetBar(budget) {
    if (budget.total === 0) return '';
    return `<div class="budget-bar">
      <div class="budget-bar-header"><h3>&#128176; 预算概览</h3><span class="budget-total">¥${budget.total.toFixed(0)}</span></div>
      <div class="budget-breakdown">
        <div class="budget-cat"><span class="dot attraction"></span>景点 ¥${budget.breakdown.attraction.toFixed(0)}</div>
        <div class="budget-cat"><span class="dot transport"></span>交通 ¥${budget.breakdown.transport.toFixed(0)}</div>
        <div class="budget-cat"><span class="dot accommodation"></span>住宿 ¥${budget.breakdown.accommodation.toFixed(0)}</div>
      </div></div>`;
  },

  renderDayCard(day) {
    const items = day.items || [];
    return `<div class="day-card" data-day="${day.day}">
      <div class="day-card-header">
        <h3><span>Day ${day.day}</span><span class="day-badge">${items.length}项</span></h3>
        <div class="day-actions">
          ${this.plan.days.length > 1 ? `<button class="btn-day-sm" data-action="removeDay" data-day="${day.day}" title="删除此天">&times;</button>` : ''}
        </div>
      </div>
      <div class="day-card-body">
        ${items.length === 0 ? '<div class="empty-hint">点击下方按钮添加行程内容</div>'
          : items.map((item, i) => this.renderTimelineItem(item, i, items.length)).join('')}
      </div>
      <div class="add-item-zone">
        <button class="btn-add-item" data-action="addItem" data-day="${day.day}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>添加</button>
      </div></div>`;
  },

  renderTimelineItem(item, index, total) {
    const isLast = index === total - 1;
    const typeIcons = { attraction: '&#128205;', transport: '&#128652;', accommodation: '&#127976;' };
    const typeLabels = { attraction: '景点', transport: '交通', accommodation: '住宿' };
    const emoji = item.type === 'attraction' ? this.matchEmoji(item.name) : '';

    return `<div class="timeline-item" data-item-id="${item.id}">
      <div class="timeline-track">
        <div class="timeline-dot ${item.type}">${typeIcons[item.type] || '&#128205;'}</div>
        ${!isLast ? '<div class="timeline-line"></div>' : ''}
      </div>
      <div class="timeline-content">
        <div class="timeline-card card-type-${item.type}">
          <div class="item-type ${item.type}">${typeLabels[item.type] || item.type}</div>
          <div class="item-name">${emoji}${this.esc(item.name)}</div>
          ${item.time ? `<div class="item-note">&#128336; ${item.time}</div>` : ''}
          ${item.cost ? `<div class="item-note">¥${parseFloat(item.cost).toFixed(0)}</div>` : ''}
          ${item.note ? `<div class="item-note">${this.esc(item.note)}</div>` : ''}
          ${item.lat ? `<div class="item-note" style="color:var(--c-primary);margin-top:2px">&#128506; ${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}</div>` : ''}
          <div class="item-actions">
            ${index > 0 ? `<button class="btn-item-sm" data-action="moveUp" data-item-id="${item.id}" title="上移">&#9650;</button>` : ''}
            ${!isLast ? `<button class="btn-item-sm" data-action="moveDown" data-item-id="${item.id}" title="下移">&#9660;</button>` : ''}
            <button class="btn-item-sm delete" data-action="removeItem" data-item-id="${item.id}" title="删除">&times;</button>
          </div>
        </div></div></div>`;
  },

  /** 根据名称匹配品类 emoji，无匹配返回空字符串 */
  matchEmoji(name) {
    if (!name) return '';
    for (const [key, emoji] of Object.entries(ATTR_EMOJI)) {
      if (name.includes(key)) return emoji + ' ';
    }
    return '';
  },

  bindPlanEvents() {
    const nameInput = document.getElementById('planName');
    nameInput.addEventListener('change', () => {
      this.plan.name = nameInput.value.trim() || '我的旅行计划';
      this.autoSave();
    });
    document.getElementById('btnRename').addEventListener('click', () => {
      nameInput.focus(); nameInput.select();
    });
    document.getElementById('btnAddDay').addEventListener('click', () => this.addDay());
    document.getElementById('btnSave').addEventListener('click', () => this.savePlan());

    document.getElementById('plannerDays').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const dayNum = parseInt(btn.dataset.day);
      const itemId = btn.dataset.itemId;
      switch (action) {
        case 'addItem': this.openAddModal(dayNum, 'attraction'); break;
        case 'removeDay': if (confirm('删除 Day ' + dayNum + '？')) this.removeDay(dayNum); break;
        case 'removeItem': this.removeItem(itemId); break;
        case 'moveUp': this.moveItem(itemId, -1); break;
        case 'moveDown': this.moveItem(itemId, 1); break;
      }
    });
  },

  /* ═════════════════════════════
     ADD MODAL
     ═════════════════════════════ */
  initAddModal() {
    const modal = document.getElementById('addItemModal');
    modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeAddModal());
    document.getElementById('btnAddItemClose').addEventListener('click', () => this.closeAddModal());

    const attractionEl = document.getElementById('attractionOptions');
    const transportEl = document.getElementById('transportOptions');
    const accommodationEl = document.getElementById('accommodationOptions');
    const extraSection = document.getElementById('extraSection');

    // 类型切换
    modal.querySelectorAll('.type-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.addItemType = tab.dataset.type;

        const isA = this.addItemType === 'attraction';
        const isT = this.addItemType === 'transport';
        const isAc = this.addItemType === 'accommodation';

        attractionEl.style.display = isA ? '' : 'none';
        transportEl.style.display = isT ? '' : 'none';
        accommodationEl.style.display = isAc ? '' : 'none';
        extraSection.style.display = (isA || isAc) ? '' : 'none';

        // 底部确认按钮：景点或住宿时分别显示对应按钮
        document.getElementById('btnAddAttraction').style.display = isA ? '' : 'none';
        document.getElementById('btnAddAccommodation').style.display = isAc ? '' : 'none';

        if (isT) this.updateRouteSelects();
      });
    });

    // 景点
    attractionEl.querySelectorAll('.transport-item').forEach(btn => {
      btn.addEventListener('click', () => this.addItemToPlan(btn.dataset.name));
    });

    // 路径规划
    document.getElementById('routeFrom').addEventListener('change', () => this.checkRouteReady());
    document.getElementById('routeTo').addEventListener('change', () => this.checkRouteReady());
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.checkRouteReady();
      });
    });
    document.getElementById('btnSearchRoute').addEventListener('click', () => this.searchRoute());

    // 景点 — 确认添加（需通过地图选点）
    document.getElementById('btnAddAttraction').addEventListener('click', () => {
      if (this.pendingCoords && this.pendingCoordName) {
        this.addItemToPlan(this.pendingCoordName);
      } else {
        this.showToast('请先在地图上选择位置', 'info');
      }
    });

    // 住宿 — 确认添加（需通过地图选点）
    document.getElementById('btnAddAccommodation').addEventListener('click', () => {
      if (this.pendingCoords && this.pendingCoordName) {
        this.addItemToPlan(this.pendingCoordName);
      } else {
        this.showToast('请先在地图上选择位置', 'info');
      }
    });

    // 地图选点
    document.getElementById('btnOpenMapPicker').addEventListener('click', () => this.openMapPicker());
    document.getElementById('btnClearCoords').addEventListener('click', () => {
      this.pendingCoords = null; this.pendingCoordName = '';
      document.getElementById('mapCoordsDisplay').style.display = 'none';
      document.getElementById('coordBadge').textContent = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) this.closeAddModal();
    });
  },

  /** 更新路径规划的出发地/目的地下拉 */
  updateRouteSelects() {
    const fromSel = document.getElementById('routeFrom');
    const toSel = document.getElementById('routeTo');
    const locations = [];

    this.plan.days.forEach(day => {
      (day.items || []).forEach(item => {
        if (item.lat && item.lng) {
          const typeLabel = { attraction: '景点', transport: '交通', accommodation: '住宿' }[item.type] || '';
          locations.push({ id: item.id, name: item.name, typeLabel, lng: item.lng, lat: item.lat });
        }
      });
    });

    const opts = locations.map(l => `<option value="${l.id}">[${l.typeLabel}] ${l.name}</option>`).join('');

    fromSel.innerHTML = '<option value="">选择已添加的地点</option>' + opts;
    toSel.innerHTML = '<option value="">选择已添加的地点</option>' + opts;
    this.checkRouteReady();
  },

  checkRouteReady() {
    const fromId = document.getElementById('routeFrom').value;
    const toId = document.getElementById('routeTo').value;
    document.getElementById('btnSearchRoute').disabled = !(fromId && toId && fromId !== toId);
  },

  searchRoute() {
    const fromId = document.getElementById('routeFrom').value;
    const toId = document.getElementById('routeTo').value;
    if (!fromId || !toId) return;

    const locations = [];
    this.plan.days.forEach(day => {
      (day.items || []).forEach(item => {
        if (item.lat && item.lng) locations.push(item);
      });
    });

    const from = locations.find(l => l.id === fromId);
    const to = locations.find(l => l.id === toId);
    if (!from || !to) { this.showToast('请选择有效的地点', 'error'); return; }

    const modeEl = document.querySelector('.mode-tab.active');
    const mode = modeEl ? modeEl.dataset.mode : 'driving';

    const btn = document.getElementById('btnSearchRoute');
    const resultEl = document.getElementById('routeResult');
    btn.textContent = '⏳ 计算路线中...';
    btn.disabled = true;
    resultEl.style.display = 'none';

    MapService.routeSearch(mode, [from.lng, from.lat], [to.lng, to.lat], (result, error) => {
      btn.textContent = '搜索路线';
      btn.disabled = false;
      if (error) {
        // 失败时展示可编辑的时间/距离表单
        const fallbackHTML = `
          <div style="padding:10px;text-align:center;color:var(--c-danger);font-size:.83rem;margin-bottom:8px">${error}</div>
          <div class="route-edit-row">
            <div class="route-edit-field">
              <label>预计时间（可选）</label>
              <div class="route-edit-inputs">
                <input type="number" id="routeEditHours" value="0" min="0" max="999" class="route-edit-num"> <span>小时</span>
                <input type="number" id="routeEditMins" value="0" min="0" max="59" class="route-edit-num"> <span>分钟</span>
              </div>
            </div>
            <div class="route-edit-field">
              <label>距离（可选）</label>
              <div class="route-edit-inputs">
                <input type="number" id="routeEditDist" value="" min="0" step="0.1" placeholder="不填" class="route-edit-num" style="width:70px"> <span>公里</span>
              </div>
            </div>
            <div class="route-edit-field">
              <label>预估费用 (¥)</label>
              <div class="route-edit-inputs">
                <input type="number" id="routeEditCost" value="" min="0" step="0.01" placeholder="手动输入" class="route-edit-num" style="width:76px"> <span>元</span>
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" style="width:100%" id="btnManualAdd">手动添加交通项</button>
        `;
        resultEl.innerHTML = fallbackHTML;
        resultEl.style.display = 'block';

        const minsInput = document.getElementById('routeEditMins');
        minsInput.addEventListener('input', () => {
          const v = parseInt(minsInput.value) || 0;
          if (v > 59) minsInput.value = 59;
          if (v < 0) minsInput.value = 0;
        });

        document.getElementById('btnManualAdd').addEventListener('click', () => {
          const hVal = parseInt(document.getElementById('routeEditHours').value) || 0;
          const mVal = parseInt(document.getElementById('routeEditMins').value) || 0;
          const dVal = parseFloat(document.getElementById('routeEditDist').value) || 0;
          const cVal = parseFloat(document.getElementById('routeEditCost').value) || 0;

          const timeLabel = hVal > 0 ? hVal + '小时' + mVal + '分钟' : (mVal > 0 ? mVal + '分钟' : '');
          const distLabel = dVal >= 1 ? dVal.toFixed(1) + '公里' : (dVal > 0 ? (dVal * 1000).toFixed(0) + '米' : '');

          const modeEl2 = document.querySelector('.mode-tab.active');
          const mode2 = modeEl2 ? modeEl2.dataset.mode : 'driving';
          const modes2 = { driving:'🚗驾车', transit:'🚌公交', walking:'🚶步行', riding:'🚲骑行', train:'🚄高铁', plane:'✈️飞机' };
          const modeLabel = modes2[mode2] || '🚗驾车';

          this.pendingTransportData = {
            note: [timeLabel, distLabel].filter(Boolean).join(', '),
            cost: cVal,
            time: '',
          };
          this.addItemToPlan(`${modeLabel}: ${from.name} → ${to.name}`);
        });
        return;
      }
      this.renderRouteResult(result, mode, from, to);
    });
  },

  renderRouteResult(result, mode, from, to) {
    const el = document.getElementById('routeResult');
    const modes = {
      driving: { label: '驾车', emoji: '🚗', color: '#3b82f6' },
      transit: { label: '公交', emoji: '🚌', color: '#10b981' },
      walking: { label: '步行', emoji: '🚶', color: '#f59e0b' },
      riding:  { label: '骑行', emoji: '🚲', color: '#06b6d4' },
      train:   { label: '高铁', emoji: '🚄', color: '#ef4444' },
      plane:   { label: '飞机', emoji: '✈️', color: '#8b5cf6' },
    };
    const m = modes[mode] || modes.driving;

    const distKm = result.distance >= 1000 ? (result.distance / 1000).toFixed(1) : (result.distance / 1000).toFixed(2);
    const h = Math.floor(result.time / 3600);
    const min = Math.ceil((result.time % 3600) / 60);

    const stepsHTML = (result.steps || []).slice(0, 8).map(s => `
      <div class="route-step">
        <span class="route-step-num">${s.num}</span>
        <span>${s.instruction}</span>
      </div>`).join('');

    el.innerHTML = `
      <div class="route-summary" style="align-items:center">
        <div style="font-size:1.6rem">${m.emoji}</div>
        <div style="flex:1">
          <div style="font-size:.92rem;font-weight:700;color:var(--c-text)">${m.label}</div>
          <div style="font-size:.78rem;color:var(--c-text-2)">${this.esc(from.name)} → ${this.esc(to.name)}</div>
        </div>
      </div>
      <div class="route-edit-row">
        <div class="route-edit-field">
          <label>预计时间</label>
          <div class="route-edit-inputs">
            <input type="number" id="routeEditHours" value="${h}" min="0" max="999" class="route-edit-num"> <span>小时</span>
            <input type="number" id="routeEditMins" value="${min}" min="0" max="59" class="route-edit-num"> <span>分钟</span>
          </div>
        </div>
        <div class="route-edit-field">
          <label>距离</label>
          <div class="route-edit-inputs">
            <input type="number" id="routeEditDist" value="${distKm}" min="0.01" step="0.1" class="route-edit-num" style="width:70px"> <span>公里</span>
          </div>
        </div>
        <div class="route-edit-field">
          <label>预估费用 (¥)</label>
          <div class="route-edit-inputs">
            <input type="number" id="routeEditCost" value="" min="0" step="0.01" placeholder="手动输入" class="route-edit-num" style="width:76px"> <span>元</span>
          </div>
        </div>
      </div>
      ${stepsHTML ? `
      <div class="route-steps" style="margin-top:10px;border-top:1px solid var(--c-border);padding-top:8px">${stepsHTML}${result.steps.length > 8 ? `<div style="padding:6px;color:var(--c-text-3)">...共${result.steps.length}步</div>` : ''}</div>
      ` : ''}
      <button class="btn btn-sm btn-primary" style="margin-top:10px;width:100%" id="btnAddAsTransport">+ 添加「${m.emoji} ${m.label}: ${this.esc(from.name)} → ${this.esc(to.name)}」</button>
    `;
    el.style.display = 'block';

    // 输入验证：分钟不超过59
    const minsInput = document.getElementById('routeEditMins');
    minsInput.addEventListener('input', () => {
      const v = parseInt(minsInput.value) || 0;
      if (v > 59) minsInput.value = 59;
      if (v < 0) minsInput.value = 0;
    });

    document.getElementById('btnAddAsTransport').addEventListener('click', () => {
      const editH = parseInt(document.getElementById('routeEditHours').value) || 0;
      const editM = parseInt(document.getElementById('routeEditMins').value) || 0;
      const editDist = parseFloat(document.getElementById('routeEditDist').value) || parseFloat(distKm);
      const editCost = parseFloat(document.getElementById('routeEditCost').value) || 0;

      const timeLabel = editH > 0 ? editH + '小时' + editM + '分钟' : editM + '分钟';
      const distLabel = editDist >= 1 ? editDist.toFixed(1) + '公里' : (editDist * 1000).toFixed(0) + '米';

      this.pendingTransportData = {
        note: `${timeLabel}, ${distLabel}`,
        cost: editCost,
        time: '',
      };
      this.addItemToPlan(`${m.emoji} ${m.label}: ${from.name} → ${to.name}`);
    });
  },

  closeAddModal() {
    document.getElementById('addItemModal').classList.remove('active');
  },

  openAddModal(dayNum, type) {
    this.addItemDayNum = dayNum;
    this.addItemType = type || 'attraction';
    this.pendingCoords = null; this.pendingCoordName = '';
    this.pendingTransportData = null;

    document.getElementById('addItemDayNum').textContent = dayNum;
    document.getElementById('itemTime').value = '';
    document.getElementById('itemCost').value = '';
    document.getElementById('itemNote').value = '';
    document.getElementById('mapCoordsDisplay').style.display = 'none';
    document.getElementById('coordBadge').textContent = '';
    document.getElementById('routeResult').style.display = 'none';
    document.getElementById('routeResult').innerHTML = '';

    const isA = type === 'attraction';
    const isT = type === 'transport';
    const isAc = type === 'accommodation';

    document.getElementById('attractionOptions').style.display = isA ? '' : 'none';
    document.getElementById('transportOptions').style.display = isT ? '' : 'none';
    document.getElementById('accommodationOptions').style.display = isAc ? '' : 'none';
    document.getElementById('extraSection').style.display = (isA || isAc) ? '' : 'none';

    // 底部确认按钮
    document.getElementById('btnAddAttraction').style.display = isA ? '' : 'none';
    document.getElementById('btnAddAccommodation').style.display = isAc ? '' : 'none';

    const modal = document.getElementById('addItemModal');
    modal.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
    const targetTab = modal.querySelector(`.type-tab[data-type="${type}"]`);
    if (targetTab) targetTab.classList.add('active');

    if (isT) this.updateRouteSelects();

    modal.classList.add('active');
  },

  /** 清理名称中的泛化标签（如"当地博物馆"→"博物馆"） */
  cleanName(name) {
    return name.replace(/^(当地|附近|周边|本地)\s*/g, '').trim();
  },

  addItemToPlan(name) {
    if (this.pendingCoordName) { name = this.cleanName(this.pendingCoordName); }
    if (!name) return;
    const day = this.plan.days.find(d => d.day === this.addItemDayNum);
    if (!day) return;

    // 优先用 pendingTransportData（来自路径规划结果），其次读隐藏表单
    const time = this.pendingTransportData?.time || document.getElementById('itemTime').value;
    const cost = this.pendingTransportData?.cost || parseFloat(document.getElementById('itemCost').value) || 0;
    const note = this.pendingTransportData?.note || document.getElementById('itemNote').value.trim();

    day.items.push({
      id: this.genId('item'), type: this.addItemType, name: name,
      time, cost, note,
      lat: this.pendingCoords ? this.pendingCoords.lat : null,
      lng: this.pendingCoords ? this.pendingCoords.lng : null
    });

    this.pendingCoords = null; this.pendingCoordName = '';
    this.pendingTransportData = null;
    this.closeAddModal();
    this.autoSave();
    this.render();
    this.showToast('已添加: ' + name, 'success');
  },

  /* ═════════════════════════════
     MAP PICKER (AMap)
     ═════════════════════════════ */
  initMapPickerModal() {
    const modal = document.getElementById('mapPickerModal');
    modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeMapPicker());
    document.getElementById('btnMapPickerClose').addEventListener('click', () => this.closeMapPicker());

    document.getElementById('btnMapConfirm').addEventListener('click', () => {
      if (this.pendingCoords) {
        document.getElementById('mapCoordsDisplay').style.display = 'flex';
        document.getElementById('coordBadge').textContent =
          (this.pendingCoordName || '已选位置') + ' (' + this.pendingCoords.lat.toFixed(4) + ', ' + this.pendingCoords.lng.toFixed(4) + ')';
        this.closeMapPicker();
        this.showToast('位置已选择', 'success');
      }
    });

    // 定位按钮
    document.getElementById('btnMapLocate').addEventListener('click', () => {
      if (!this.mapPickerMap) return;
      this.showToast('正在定位...', 'info');
      MapService.geolocation(this.mapPickerMap, (pos, err) => {
        if (err) {
          this.showToast('定位失败: ' + err, 'error');
        } else {
          this.setMapPickerCoords(pos.lat, pos.lng, pos.name);
          this.showToast('已定位: ' + pos.name, 'success');
        }
      });
    });

    // 搜索地点
    const searchInput = document.getElementById('mapSearchInput');
    const resultsEl = document.getElementById('mapSearchResults');
    let searchTO;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTO);
      const q = searchInput.value.trim();
      if (q.length < 2) { resultsEl.innerHTML = ''; return; }
      resultsEl.innerHTML = '<div style="padding:8px;font-size:.82rem;color:var(--c-text-3)">搜索中...</div>';
      searchTO = setTimeout(() => this.amapPlaceSearch(q, resultsEl), 350);
    });
  },

  openMapPicker() {
    if (!this._mapReady) { this.showToast('地图功能暂未就绪', 'info'); return; }
    const modal = document.getElementById('mapPickerModal');
    modal.classList.add('active');
    document.getElementById('mapSearchInput').value = '';
    document.getElementById('mapSearchResults').innerHTML = '';
    document.getElementById('mapPickedInfo').style.display = 'none';
    document.getElementById('btnMapConfirm').disabled = true;
    setTimeout(() => { this.initMapPickerMap(); }, 250);
  },

  closeMapPicker() {
    document.getElementById('mapPickerModal').classList.remove('active');
    MapService.destroyMap(this.mapPickerMap);
    this.mapPickerMap = null;
    this.mapPickerMarker = null;
  },

  initMapPickerMap() {
    if (this.mapPickerMap) {
      this.mapPickerMap.setFitView();
      return;
    }
    this.mapPickerMap = MapService.createMap('mapContainer');

    // 点击地图选点
    this.mapPickerMap.on('click', (e) => {
      MapService.reverseGeocode(e.lnglat.lng, e.lnglat.lat, (addr) => {
        this.setMapPickerCoords(e.lnglat.lat, e.lnglat.lng, addr.name);
      });
    });
  },

  setMapPickerCoords(lat, lng, name) {
    this.pendingCoords = { lat, lng };
    this.pendingCoordName = name || '';
    const AMap = AmapConfig.AMap();

    // 清除旧标记
    if (this.mapPickerMarker) this.mapPickerMap.remove(this.mapPickerMarker);

    // 新标记
    this.mapPickerMarker = new AMap.Marker({
      position: [lng, lat],
    });
    this.mapPickerMap.add(this.mapPickerMarker);
    this.mapPickerMap.setCenter([lng, lat]);

    document.getElementById('mapPickedInfo').style.display = 'flex';
    document.getElementById('mapPickedName').textContent = name || '选定位置';
    document.getElementById('mapPickedCoords').textContent = lat.toFixed(5) + ', ' + lng.toFixed(5);
    document.getElementById('btnMapConfirm').disabled = false;
  },

  /** 高德地点搜索 */
  amapPlaceSearch(query, resultsEl) {
    MapService.placeSearch(query, (results, error) => {
      if (error) {
        resultsEl.innerHTML = `<div style="padding:8px;font-size:.82rem;color:var(--c-danger)">搜索失败: ${error}，点击重试</div>`;
        resultsEl.style.cursor = 'pointer';
        resultsEl.onclick = () => this.amapPlaceSearch(query, resultsEl);
        return;
      }
      if (!results || results.length === 0) {
        resultsEl.innerHTML = '<div style="padding:8px;font-size:.82rem;color:var(--c-text-3)">未找到地点</div>';
        return;
      }
      resultsEl.innerHTML = results.map(d => `
        <div class="result-item" data-lat="${d.lat}" data-lng="${d.lng}" data-name="${this.esc(d.name)}">
          <div class="r-icon" style="background:var(--c-primary-l);color:var(--c-primary)">&#128506;</div>
          <div class="r-info"><div class="r-name">${this.esc(d.name)}</div><div class="r-desc">${this.esc(d.address || '')}</div></div>
        </div>`).join('');

      resultsEl.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
          const lat = parseFloat(item.dataset.lat), lng = parseFloat(item.dataset.lng);
          const name = item.dataset.name;
          this.setMapPickerCoords(lat, lng, name);
          resultsEl.innerHTML = '';
          document.getElementById('mapSearchInput').value = name;
        });
      });
    });
  },

  /* ═════════════════════════════
     THEME
     ═════════════════════════════ */
  initThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('btnThemeClose').addEventListener('click', () => modal.classList.remove('active'));
  },

  openThemeModal() {
    const themes = [
      { id: 'indigo', name: '靛蓝', color: '#6366f1' },
      { id: 'rose', name: '玫红', color: '#e11d48' },
      { id: 'emerald', name: '翠绿', color: '#059669' },
      { id: 'violet', name: '紫罗兰', color: '#7c3aed' },
      { id: 'sky', name: '天蓝', color: '#0284c7' },
      { id: 'orange', name: '暖橙', color: '#ea580c' },
      { id: 'teal', name: '青碧', color: '#0d9488' },
      { id: 'slate', name: '岩灰', color: '#334155' },
    ];
    const current = Storage.getTheme();
    document.getElementById('themeGrid').innerHTML = themes.map(t => `
      <div class="theme-option ${t.id === current ? 'active' : ''}" data-theme="${t.id}">
        <div class="theme-swatch" style="background:${t.color}"></div>
        <span class="theme-name">${t.name}</span>
      </div>`).join('');

    document.getElementById('themeGrid').querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const name = opt.dataset.theme;
        Storage.setTheme(name);
        this.showToast('主题已切换: ' + themes.find(t=>t.id===name).name, 'success');
        document.getElementById('themeModal').classList.remove('active');
      });
    });

    document.getElementById('themeModal').classList.add('active');
  },

  /* ═════════════════════════════
     MOBILE TABBAR
     ═════════════════════════════ */
  initMobileTabbar() {
    document.querySelectorAll('.tabbar-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.tabbar-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        const tab = item.dataset.tab;
        if (tab === 'planner') window.scrollTo({ top: 0, behavior: 'smooth' });
        else if (tab === 'save') this.savePlan();
      });
    });
  },

  /* ═════════════════════════════
     ITEM / DAY OPS
     ═════════════════════════════ */
  removeItem(itemId) {
    for (const day of this.plan.days) {
      const idx = (day.items||[]).findIndex(i => i.id === itemId);
      if (idx >= 0) {
        const name = day.items[idx].name;
        day.items.splice(idx, 1);
        this.autoSave(); this.render();
        this.showToast('已删除: ' + name, 'info'); return;
      }
    }
  },

  moveItem(itemId, dir) {
    for (const day of this.plan.days) {
      const idx = (day.items||[]).findIndex(i => i.id === itemId);
      if (idx < 0) continue;
      const ni = idx + dir;
      if (ni < 0 || ni >= day.items.length) return;
      [day.items[idx], day.items[ni]] = [day.items[ni], day.items[idx]];
      this.autoSave(); this.render(); return;
    }
  },

  addDay() {
    const n = this.plan.days.length + 1;
    this.plan.days.push({ day: n, items: [] });
    this.autoSave(); this.render();
    this.showToast('已添加 Day ' + n, 'success');
  },

  removeDay(dayNum) {
    const idx = this.plan.days.findIndex(d => d.day === dayNum);
    if (idx < 0) return;
    this.plan.days.splice(idx, 1);
    this.plan.days.forEach((d, i) => { d.day = i + 1; });
    this.autoSave(); this.render();
    this.showToast('已删除 Day ' + dayNum, 'info');
  },

  /* ═════════════════════════════
     SAVE / LOAD
     ═════════════════════════════ */
  autoSave() { Storage.savePlan(this.plan); },
  savePlan() {
    if (Storage.savePlan(this.plan)) this.showToast('行程已保存成功！', 'success');
    else this.showToast('保存失败，请重试', 'error');
  },

  initSavedPlansModal() {
    const modal = document.getElementById('savedPlansModal');
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('btnPlansClose').addEventListener('click', () => modal.classList.remove('active'));
  },

  openSavedPlans() {
    const modal = document.getElementById('savedPlansModal');
    const listEl = document.getElementById('plansList');
    const plans = Storage.getPlans();
    if (plans.length === 0) {
      listEl.innerHTML = '<div class="empty-plans"><div class="empty-icon">&#128197;</div><p>还没有保存的行程</p></div>';
    } else {
      listEl.innerHTML = plans.map(p => {
        const ti = p.days.reduce((s, d) => s + (d.items ? d.items.length : 0), 0);
        const b = p.days.reduce((s, d) => {
          if (!d.items) return s;
          return s + d.items.reduce((ss, i) => ss + (parseFloat(i.cost) || 0), 0);
        }, 0);
        return `<div class="plan-item" data-plan-id="${p.id}">
          <div class="plan-info"><div class="plan-name">${this.esc(p.name)}</div><div class="plan-meta">${p.days.length}天 · ${ti}项 · ¥${b.toFixed(0)}</div></div>
          <div class="plan-item-actions">
            <button class="btn btn-sm btn-outline" data-action="loadPlan" data-plan-id="${p.id}">加载</button>
            <button class="btn btn-sm btn-danger" data-action="deletePlan" data-plan-id="${p.id}">删除</button>
          </div></div>`;
      }).join('');
    }
    modal.classList.add('active');
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const pid = btn.dataset.planId;
      if (btn.dataset.action === 'loadPlan') { this.loadPlan(pid); modal.classList.remove('active'); }
      else if (btn.dataset.action === 'deletePlan') {
        if (confirm('确定要删除此行程？')) { Storage.deletePlan(pid); this.showToast('行程已删除', 'info'); this.openSavedPlans(); }
      }
    });
  },

  loadPlan(planId) {
    const plan = Storage.getPlans().find(p => p.id === planId);
    if (plan) { this.plan = plan; this.render(); this.showToast('已加载: ' + plan.name, 'success'); }
  },

  newPlan() {
    if (this.plan.days.some(d => d.items && d.items.length > 0)) {
      if (!confirm('当前行程未保存，确定新建？')) return;
    }
    this.plan = this.createDefaultPlan();
    this.autoSave(); this.render();
    this.showToast('已创建新行程', 'success');
  },

  /* ═════════════════════════════
     TOAST
     ═════════════════════════════ */
  showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut .28s ease forwards'; setTimeout(() => toast.remove(), 300); }, 2000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());