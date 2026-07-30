/**
 * 高德 JS API v2 配置
 *
 * 使用步骤：
 *   1. 访问 https://lbs.amap.com/ 注册开发者
 *   2. 创建应用 → 添加 Key，服务平台选「Web端(JS API)」
 *   3. 将 Key 和安全密钥填入下方
 */
const AmapConfig = {
  /** 高德 Web端(JS API) Key */
  key: '611883e951636bc52af8d45032b886e3',

  /** 安全密钥（2021年12月后申请的 Key 必填，在控制台 Key 详情页获取） */
  securityCode: '5a51cb844348da6f126327b53a9d87c6',

  /** SDK 加载状态 */
  _ready: false,
  _AMap: null,
  _loading: null,

  /** 加载并初始化高德 SDK（支持多 CDN 重试） */
  load() {
    if (this._AMap) return Promise.resolve(this._AMap);
    if (this._loading) return this._loading;

    this._loading = new Promise((resolve, reject) => {
      window._AMapSecurityConfig = { securityJsCode: this.securityCode };

      // 多 CDN 端点（按优先顺序尝试）
      const endpoints = [
        'https://webapi.amap.com/maps?v=2.0&key=' + this.key,
        'https://webapi.amap.com/v2/maps?v=2.0&key=' + this.key,
      ];

      const tryLoad = (index) => {
        if (index >= endpoints.length) {
          return reject(new Error('所有 CDN 端点均不可达'));
        }

        const script = document.createElement('script');
        script.src = endpoints[index];
        script.onerror = () => {
          console.warn('[AMap] CDN ' + (index + 1) + ' 不可达，尝试备用...');
          document.head.removeChild(script);
          tryLoad(index + 1);
        };
        script.onload = () => {
          if (typeof window.AMap !== 'undefined') {
            // 直接加载成功（非 Loader 方式）
            this._AMap = window.AMap;
            this._ready = true;
            console.log('[AMap] SDK 加载成功 (endpoint ' + (index + 1) + ')');
            resolve(window.AMap);
          } else {
            // 尝试 Loader 方式加载
            if (typeof AMapLoader !== 'undefined') {
              AMapLoader.load({ key: this.key, version: '2.0' })
                .then(AMap => {
                  this._AMap = AMap;
                  this._ready = true;
                  console.log('[AMap] Loader 加载成功');
                  resolve(AMap);
                })
                .catch(reject);
            } else {
              document.head.removeChild(script);
              tryLoad(index + 1);
            }
          }
        };
        document.head.appendChild(script);
      };

      tryLoad(0);
    });

    return this._loading;
  },

  AMap() { return this._AMap; },
};