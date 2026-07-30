/**
 * 高德地图服务（基于 JS API v2）
 *
 * 注意：PlaceSearch / Geocoder / Geolocation 是 AMap 插件，
 * 必须通过 AMap.plugin() 加载后才能使用。
 */
const MapService = {
  _pluginCache: {},
  _pluginFailed: {},

  /** 确保插件已加载（异步）。失败时标记跳过，不再重试 */
  _ensurePlugins(names, callback) {
    const AMap = AmapConfig.AMap();
    const missing = names.filter(n => !this._pluginCache[n] && !this._pluginFailed[n]);
    if (missing.length === 0) {
      // 全部已解析（成功或失败）
      return callback();
    }

    AMap.plugin(missing, () => {
      missing.forEach(n => { this._pluginCache[n] = true; });
      callback();
    }, (err) => {
      // 插件 CDN 不可达 — 标记为失败，不再重试
      missing.forEach(n => { this._pluginFailed[n] = true; });
      console.warn('[Map] 插件加载失败:', missing.join(','));
      callback(new Error('出行规划服务暂不可用（插件加载失败）'));
    });
  },

  // ═══════════════════════ 地图实例 ═══════════════════════

  createMap(containerId, options = {}) {
    const AMap = AmapConfig.AMap();
    return new AMap.Map(containerId, {
      zoom: options.zoom || 5,
      center: options.center || [104.19, 35.86],
      viewMode: '2D',
      resizeEnable: true,
    });
  },

  destroyMap(map) { if (map) map.destroy(); },

  // ═══════════════════════ 地点搜索 ═══════════════════════

  placeSearch(query, callback) {
    const AMap = AmapConfig.AMap();
    this._ensurePlugins(['AMap.PlaceSearch'], (err) => {
      if (err) { callback(null, err.message); return; }
      const ps = new AMap.PlaceSearch({ pageSize: 5, pageIndex: 1, citylimit: false });
      ps.search(query, (status, result) => {
        // TIP_CITIES / TIP_WORDS 等仍可能有 POI 数据，不算失败
        const pois = result?.poiList?.pois || [];
        if (status === 'complete' && pois.length > 0) {
          callback(pois.map(p => ({
            name: p.name, address: p.address || '',
            lat: p.location.lat, lng: p.location.lng, category: p.type || '',
          })), null);
        } else if (status === 'complete' && pois.length === 0) {
          callback(null, '未找到地点');
        } else {
          callback(null, status === 'error' ? (result?.info || '搜索失败') : '搜索失败');
        }
      });
    });
  },

  // ═══════════════════════ 定位 ═══════════════════════

  geolocation(map, callback) {
    const AMap = AmapConfig.AMap();
    this._ensurePlugins(['AMap.Geolocation'], (err) => {
      if (err) { callback(null, err.message); return; }
      const geo = new AMap.Geolocation({
        enableHighAccuracy: true, timeout: 8000,
        showButton: false, showMarker: false, showCircle: false,
      });
      map.addControl(geo);
      geo.getCurrentPosition((status, result) => {
        if (status === 'complete' && result.position) {
          callback({ lat: result.position.lat, lng: result.position.lng, name: result.formattedAddress || '定位位置' }, null);
        } else {
          const msg = { PERMISSION_DENIED: '定位权限被拒绝', POSITION_UNAVAILABLE: '位置不可用', TIMEOUT: '定位超时' };
          callback(null, msg[result.message] || result.message || '定位失败');
        }
      });
    });
  },

  // ═══════════════════════ 逆地理编码 ═══════════════════════

  reverseGeocode(lng, lat, callback) {
    const AMap = AmapConfig.AMap();
    this._ensurePlugins(['AMap.Geocoder'], (err) => {
      if (err) { callback(null, err.message); return; }
      const geocoder = new AMap.Geocoder({});
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const addr = result.regeocode?.formattedAddress || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          callback({ name: addr, address: addr }, null);
        } else {
          callback({ name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, address: '' }, null);
        }
      });
    });
  },

  // ═══════════════════════ 路径规划 ═══════════════════════

  /** Haversine 球面距离（米） */
  _calcDistance(lng1, lat1, lng2, lat2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  routeSearch(mode, origin, dest, callback) {
    const AMap = AmapConfig.AMap();

    // ── 飞机 / 高铁：直算距离和时间，不走 AMap 插件 ──
    if (mode === 'plane' || mode === 'train') {
      const dist = this._calcDistance(origin[0], origin[1], dest[0], dest[1]);
      let time;
      if (mode === 'plane') {
        time = Math.round(dist / 800 * 3600) + 7200; // 800km/h + 2h boarding
      } else {
        time = Math.round(dist / 250 * 3600); // 250km/h
      }
      callback({
        time, distance: Math.round(dist),
        steps: [{
          num: 1,
          instruction: mode === 'plane' ? '飞行直达' : '高铁直达',
          distance: Math.round(dist),
          duration: time,
        }],
        origin: '', destination: '',
      }, null);
      return;
    }

    const pluginMap = { driving: 'AMap.Driving', transit: 'AMap.Transfer', walking: 'AMap.Walking', riding: 'AMap.Riding' };
    const pluginName = pluginMap[mode] || 'AMap.Driving';

    this._ensurePlugins([pluginName], (pluginErr) => {
      if (pluginErr) { callback(null, pluginErr.message); return; }

      let searcher;
      try {
        switch (mode) {
          case 'driving':  searcher = new AMap.Driving({ policy: 0 }); break;
          case 'transit':  searcher = new AMap.Transfer({ policy: 0 }); break;
          case 'walking':  searcher = new AMap.Walking({ policy: 0 }); break;
          case 'riding':   searcher = new AMap.Riding({ policy: 0 }); break;
          default:         searcher = new AMap.Driving({ policy: 0 });
        }
      } catch (e) {
        callback(null, '路线规划初始化失败');
        return;
      }

      searcher.search(origin, dest, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const route = (result.routes && result.routes[0]) || {};
          callback({
            time: route.time || 0,
            distance: route.distance || 0,
            steps: (route.steps || []).map((s, i) => ({
              num: i + 1,
              instruction: s.instruction || s.road || '',
              distance: s.distance || 0,
              duration: s.duration || 0,
            })),
            origin: result.origin || '',
            destination: result.destination || '',
          }, null);
        } else {
          callback(null, result?.info || '路线规划失败');
        }
      });
    });
  },

  drawRoute(map, items) {
    map.clearMap();
    const typeColors = { attraction: '#f59e0b', transport: '#06b6d4', accommodation: '#8b5cf6' };
    const typeLabels = { attraction: '景点', transport: '交通', accommodation: '住宿' };
    const coords = [];

    items.forEach((item, i) => {
      const pos = [item.lng, item.lat];
      coords.push(pos);
      const color = typeColors[item.type] || '#6366f1';
      const marker = new AmapConfig.AMap().Marker({
        position: pos,
        content: `<div style="background:${color};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${i+1}</div>`,
        offset: new AmapConfig.AMap().Pixel(-13, -13),
      });
      const infoHTML = `<b>${i+1}. ${item.name}</b><br><small>${typeLabels[item.type]||item.type}</small>${item.time?'<br>'+item.time:''}`;
      marker.on('click', () => {
        new AmapConfig.AMap().InfoWindow({ content: infoHTML, offset: new AmapConfig.AMap().Pixel(0, -30) }).open(map, pos);
      });
      map.add(marker);
    });

    if (coords.length >= 2) {
      map.add(new AmapConfig.AMap().Polyline({
        path: coords, strokeColor: '#6366f1', strokeWeight: 3,
        strokeOpacity: .7, strokeStyle: 'dashed', lineJoin: 'round',
      }));
    }
    map.setFitView(null, false, [80, 80, 80, 80]);
  },

  getLegendHTML(items) {
    const unique = [...new Map(items.map(i => [i.type, i])).values()];
    const colors = { attraction: '#f59e0b', transport: '#06b6d4', accommodation: '#8b5cf6' };
    const labels = { attraction: '景点', transport: '交通', accommodation: '住宿' };
    return unique.map(i =>
      `<span style="display:flex;align-items:center;gap:4px"><span class="legend-dot" style="background:${colors[i.type]||'#6366f1'}"></span>${labels[i.type]||i.type}</span>`
    ).join('');
  }
};