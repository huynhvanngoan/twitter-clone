import { hasInjectionContext, inject, version, unref, defineComponent, h, computed, ref, provide, shallowReactive, watch, Suspense, nextTick, Fragment, Transition, useSSRContext, mergeProps, resolveComponent, createApp, effectScope, reactive, getCurrentScope, getCurrentInstance, toRef, isRef, withCtx, createTextVNode, toDisplayString, createSlots, createVNode, resolveDynamicComponent, openBlock, createBlock, onErrorCaptured, onServerPrefetch, defineAsyncComponent, shallowRef, isReadonly, isShallow, isReactive, toRaw, renderList, renderSlot } from 'vue';
import { $ as $fetch$1, y as hasProtocol, z as isScriptProtocol, A as joinURL, B as withQuery, C as defu, D as sanitizeStatusCode, E as parseQuery, F as createHooks, c as createError$1, G as withTrailingSlash, H as withoutTrailingSlash, I as toRouteMatcher, J as createRouter$1 } from '../runtime.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { getActiveHead, CapoPlugin } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION, useRouter as useRouter$1 } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderSuspense, ssrRenderSlot, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { HomeIcon } from '@heroicons/vue/24/solid';
import { ChatBubbleOvalLeftEllipsisIcon, ArrowPathIcon, HeartIcon, ArrowUpOnSquareIcon, PencilIcon, ChevronDownIcon, MagnifyingGlassIcon, HashtagIcon, BellIcon, InboxIcon, BookmarkIcon, DocumentTextIcon, UserIcon, EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline';
import mitt from 'mitt';
import { jwtDecode } from 'jwt-decode';
import { TransitionRoot, Dialog, TransitionChild, DialogPanel } from '@headlessui/vue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink", "prefetch": true, "prefetchOn": { "visibility": true } };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.13.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version[0] === "3";
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2) {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k)) {
        continue;
      }
      if (k === "titleTemplate" || k[0] === "o" && k[1] === "n") {
        resolved[k] = unref(root[k]);
        continue;
      }
      resolved[k] = resolveUnrefHeadInput(root[k]);
    }
    return resolved;
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": (ctx) => {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
[CapoPlugin({ track: true })];
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => useNuxtApp().vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-CbjC2mS_.mjs').then((m) => m.default || m)
  },
  {
    name: "search",
    path: "/search",
    component: () => import('./search-B-uz8Ib5.mjs').then((m) => m.default || m)
  },
  {
    name: "status-id",
    path: "/status/:id()",
    component: () => import('./_id_-DuViptFx.mjs').then((m) => m.default || m)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  const unsub = router.beforeResolve((final) => {
    unsub();
    if (final === to) {
      const unsub2 = router.afterEach(async () => {
        unsub2();
        await nuxtApp.runWithContext(() => showError(error));
      });
      return false;
    }
  });
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.matched.length === 0) {
          await nuxtApp.runWithContext(() => showError(createError$1({
            statusCode: 404,
            fatal: false,
            statusMessage: `Page not found: ${to.fullPath}`,
            data: {
              path: to.fullPath
            }
          })));
        } else if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY
];
const layouts = {};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0$2 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$m = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    viewBox: "0 0 24 24",
    class: "text-blue-400 dark:text-white",
    fill: "currentColor"
  }, _attrs))}><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logo/Twitter.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$l = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_LogoTwitter = __nuxt_component_1$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center h-screen" }, _attrs))}><div class="absolute size-20 animate-ping">`);
  _push(ssrRenderComponent(_component_LogoTwitter, null, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Loading.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$2]]);
async function preloadRouteComponents(to, router = useRouter()) {
  {
    return;
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function resolveTrailingSlashBehavior(to, resolve) {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, options.trailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, options.trailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = computed(() => {
      var _a;
      if (!to.value || isAbsoluteUrl.value) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return resolveTrailingSlashBehavior(
          href2,
          router.resolve
          /* will not be called */
        );
      }
      if (typeof to.value === "object") {
        return ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null;
      }
      return resolveTrailingSlashBehavior(
        joinURL(config.app.baseURL, to.value),
        router.resolve
        /* will not be called */
      );
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate() {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      function shouldPrefetch(mode) {
        var _a, _b;
        return !prefetched.value && (typeof props.prefetchOn === "string" ? props.prefetchOn === mode : ((_a = props.prefetchOn) == null ? void 0 : _a[mode]) ?? ((_b = options.prefetchOn) == null ? void 0 : _b[mode])) && (props.prefetch ?? options.prefetch) !== false && props.noPrefetch !== true && props.target !== "_blank" && !isSlowConnection();
      }
      async function prefetch(nuxtApp = useNuxtApp()) {
        if (prefetched.value) {
          return;
        }
        prefetched.value = true;
        const path = typeof to.value === "string" ? to.value : isExternal.value ? resolveRouteObject(to.value) : router.resolve(to.value).fullPath;
        await Promise.all([
          nuxtApp.hooks.callHook("link:prefetch", path).catch(() => {
          }),
          !isExternal.value && !hasTarget.value && preloadRouteComponents(to.value, router).catch(() => {
          })
        ]);
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (shouldPrefetch("interaction")) {
              routerLinkProps.onPointerenter = prefetch.bind(null, void 0);
              routerLinkProps.onFocus = prefetch.bind(null, void 0);
            }
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href: href.value || null, rel, target }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
function isSlowConnection() {
  {
    return;
  }
}
const useTailwindConfig = () => {
  return {
    defaultTransition: "transition ease-in-out duration-350",
    twitterBorderColor: "border-white-200 dark:border-gray-700"
  };
};
const _sfc_main$k = {
  __name: "Tab",
  __ssrInlineRender: true,
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const { defaultTransition } = useTailwindConfig();
    const props = __props;
    const textClasses = computed(
      () => props.active ? "font-semibold" : "font-normal"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_nuxt_link, mergeProps({
        to: "/",
        class: ["flex items-center p-3 text-black w-min hover:bg-gray-200 rounded-full dark:hover:bg-dim-200 dark:text-white", unref(defaultTransition)]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-6 text-dark"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div><div class="${ssrRenderClass([unref(textClasses), "hidden ml-4 text-xl xl:block"])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "label", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "size-6 text-dark" }, [
                renderSlot(_ctx.$slots, "icon")
              ]),
              createVNode("div", {
                class: ["hidden ml-4 text-xl xl:block", unref(textClasses)]
              }, [
                renderSlot(_ctx.$slots, "label")
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar/Left/Tab.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "md"
    },
    liquid: {
      type: Boolean,
      default: false
    }
  },
  emits: ["onClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const paddingClasses = computed(() => {
      switch (props.size) {
        case "sm":
          return "px-3 py-1";
        case "lg":
          return "px-5 py-3";
        default:
          return "px-3 py-3";
      }
    });
    const textFontSize = computed(() => {
      switch (props.size) {
        case "sm":
          return "text-xs";
        case "lg":
          return "text-md";
        default:
          return "text-sm";
      }
    });
    const defaultWidth = computed(() => {
      switch (props.size) {
        default:
          return "w-min";
      }
    });
    const classes = computed(
      () => `${paddingClasses.value} ${props.liquid ? "w-full" : defaultWidth.value}`
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["flex justify-center text-white bg-blue-400 rounded-full hover:bg-blue-500 font-sm disabled:bg-blue-300 disabled:cursor-not-allowed", unref(classes)],
        disabled: props.disabled
      }, _attrs))}><span class="${ssrRenderClass(unref(textFontSize))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span></button>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Button.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ["onTweet", "onLogout"],
  setup(__props, { emit: __emit }) {
    const { defaultTransition } = useTailwindConfig();
    const emits = __emit;
    const props = __props;
    const tabs = [
      {
        icon: HomeIcon,
        label: "Home",
        active: true
      },
      {
        icon: HashtagIcon,
        label: "Explore",
        active: false
      },
      {
        icon: BellIcon,
        label: "Notifications",
        active: false
      },
      {
        icon: InboxIcon,
        label: "Messages",
        active: false
      },
      {
        icon: BookmarkIcon,
        label: "Bookmarks",
        active: false
      },
      {
        icon: DocumentTextIcon,
        label: "Lists",
        active: false
      },
      {
        icon: UserIcon,
        label: "Profile",
        active: false
      },
      {
        icon: EllipsisHorizontalCircleIcon,
        label: "More",
        active: false
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_nuxt_link = __nuxt_component_0$1;
      const _component_LogoTwitter = __nuxt_component_1$1;
      const _component_SidebarLeftTab = _sfc_main$k;
      const _component_UIButton = _sfc_main$j;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen flex flex-col" }, _attrs))}><div class="${ssrRenderClass([unref(defaultTransition), "p-2 m-2 hover:bg-blue-50 hover:rounded-full w-min dark:hover:bg-white/20"])}">`);
      _push(ssrRenderComponent(_component_nuxt_link, { to: "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_LogoTwitter, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "size-8" }, [
                createVNode(_component_LogoTwitter)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-2 space-y-3"><!--[-->`);
      ssrRenderList(tabs, (tab, index) => {
        _push(ssrRenderComponent(_component_SidebarLeftTab, {
          key: index,
          active: tab.active
        }, {
          icon: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(tab.icon), null, null), _parent2, _scopeId);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(tab.icon)))
              ];
            }
          }),
          label: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>${ssrInterpolate(tab.label)}</span>`);
            } else {
              return [
                createVNode("span", null, toDisplayString(tab.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><div class="hidden xl:block">`);
      _push(ssrRenderComponent(_component_UIButton, {
        liquid: "",
        size: "lg",
        onClick: ($event) => emits("onTweet")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-bold"${_scopeId}> Tweet </span>`);
          } else {
            return [
              createVNode("span", { class: "font-bold" }, " Tweet ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="block xl:hidden">`);
      _push(ssrRenderComponent(_component_UIButton, {
        onClick: ($event) => emits("onTweet")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-6 font-bold"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(PencilIcon), null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "size-6 font-bold" }, [
                createVNode(unref(PencilIcon))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="${ssrRenderClass([unref(defaultTransition), "flex flex-row items-center justify-center p-2 mx-auto mt-auto mb-5 rounded-full cursor-pointer w-14 xl:w-full hover:bg-gray-100 dark:bg-dim-800"])}"><div class="flex flex-row"><img${ssrRenderAttr("src", (_a = props.user) == null ? void 0 : _a.profileImage)} alt="avatar" class="size-10 rounded-full"><div class="flex-col hidden ml-2 xl:block"><h1 class="text-sm font-bold text-gray-800 dark:text-white">${ssrInterpolate(__props.user.name)}</h1><p class="text-sm text-gray-400">${ssrInterpolate(__props.user.handle)}</p></div></div><div class="hidden ml-auto xl:block"><div class="size-6">`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), null, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar/Left/index.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_3 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: slots.default ? h(Fragment, void 0, slots.default(routeProps)) : routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === (Component == null ? void 0 : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const _sfc_main$h = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const { twitterBorderColor, defaultTransition } = useTailwindConfig();
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["m-2 border rounded-2xl bg-gray-50 dark:bg-dim-700 overflow-hidden", unref(twitterBorderColor)]
      }, _attrs))}><h1 class="${ssrRenderClass([unref(twitterBorderColor), "p-3 text-xl font-extrabold text-gray-900 border-b dark:text-white"])}">${ssrInterpolate(props.title)}</h1>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="${ssrRenderClass([unref(defaultTransition), "p-3 text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300"])}"> Show more </div></div>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar/Right/PreviewCard/index.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: "item",
  __ssrInlineRender: true,
  setup(__props) {
    const { defaultTransition, twitterBorderColor } = useTailwindConfig();
    const wrapperClasses = computed(() => `${defaultTransition} ${twitterBorderColor}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["p-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300", unref(wrapperClasses)]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar/Right/PreviewCard/item.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const emitter = mitt();
function useEmitter() {
  return {
    $on: emitter.on,
    $emit: emitter.emit
  };
}
const _sfc_main$f = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    useEmitter();
    const handleSearch = () => {
      useRouter$1().push({
        path: "/search",
        query: {
          q: search.value
        }
      });
    };
    const whatHappeningItems = ref([
      { id: 1, title: "SpaceX", count: "18.8k Tweets" },
      { id: 2, title: "#NASA", count: "12.3k Tweets" },
      { id: 3, title: "#MarsRover", count: "9.7k Tweets" }
    ]);
    const whoToFollowItems = ref([
      {
        id: 1,
        name: "Elon Musk",
        username: "@elonmusk",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYP-PcIuOFKIyUG9iHiYYUUS9ujb5QPWtYqckLn15UySTHxuj_6smIOAvxcA_JwcOz74k&usqp=CAU"
      },
      {
        id: 2,
        name: "Jeff Bezos",
        username: "@jeffbezos",
        avatar: "https://cdn.openart.ai/stable_diffusion/58cb25ca0030271eda9ad5e65c01d68a37d61b64_2000x2000.webp"
      },
      {
        id: 3,
        name: "Bill Gates",
        username: "@billgates",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1c-EPZfO2LqPuUqrAkUK3zKS1TGRtooq6QQ&s"
      }
    ]);
    const footerLinks = ref([
      { text: "About", href: "/about" },
      { text: "Help Center", href: "/help" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Cookie Policy", href: "/cookies" },
      { text: "Ads info", href: "/ads" },
      { text: "Blog", href: "/blog" },
      { text: "Status", href: "/status" },
      { text: "Careers", href: "/careers" },
      { text: "Brand Resources", href: "/brand" },
      { text: "Advertising", href: "/advertising" },
      { text: "Marketing", href: "/marketing" },
      { text: "Twitter for Business", href: "/business" },
      { text: "Developers", href: "/developers" },
      { text: "Directory", href: "/directory" },
      { text: "Settings", href: "/settings" },
      { text: "Dark Mode", href: "#" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SidebarRightPreviewCard = _sfc_main$h;
      const _component_SidebarRightPreviewCardItem = _sfc_main$g;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}><div class="relative m-2"><div class="absolute flex items-center h-full pl-4 text-gray-600 cursor-pointer"><div class="size-6">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { onClick: handleSearch }, null, _parent));
      _push(`</div></div><input class="flex items-center w-full pl-12 text-sm font-normal text-gray-800 bg-gray-200 border border-gray-200 rounded-full shadow dark:text-gray-200 dark:bg-dim-400 dark:border-dim-400 focus:bg-gray-100 dark:focus:bg-dim-900 focus:outline-none focus:border-blue-200 h-9" placeholder="Search Twitter" type="text"${ssrRenderAttr("value", search.value)}></div>`);
      _push(ssrRenderComponent(_component_SidebarRightPreviewCard, { title: "What's happening" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(whatHappeningItems.value, (item) => {
              _push2(ssrRenderComponent(_component_SidebarRightPreviewCardItem, {
                key: item.id
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col"${_scopeId2}><h2 class="font-bold text-gray-800 text-md dark:text-white"${_scopeId2}>${ssrInterpolate(item.title)}</h2><p class="text-xs text-gray-400"${_scopeId2}>${ssrInterpolate(item.count)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col" }, [
                        createVNode("h2", { class: "font-bold text-gray-800 text-md dark:text-white" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(item.count), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(whatHappeningItems.value, (item) => {
                return openBlock(), createBlock(_component_SidebarRightPreviewCardItem, {
                  key: item.id
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col" }, [
                      createVNode("h2", { class: "font-bold text-gray-800 text-md dark:text-white" }, toDisplayString(item.title), 1),
                      createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(item.count), 1)
                    ])
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SidebarRightPreviewCard, { title: "Who to follow" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(whoToFollowItems.value, (item) => {
              _push2(ssrRenderComponent(_component_SidebarRightPreviewCardItem, {
                key: item.id
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-row justify-between p-2"${_scopeId2}><div class="flex flex-row"${_scopeId2}><img class="size-10 rounded-full"${ssrRenderAttr("src", item.avatar)}${ssrRenderAttr("alt", item.name)}${_scopeId2}><div class="flex flex-col ml-2"${_scopeId2}><h1 class="text-sm font-bold text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(item.name)}</h1><p class="text-xs text-gray-400"${_scopeId2}>${ssrInterpolate(item.username)}</p></div></div><div class="flex h-full"${_scopeId2}><button class="px-4 py-2 font-bold text-white rounded-full bg-black dark:bg-white dark:text-black"${_scopeId2}> Follow </button></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-row justify-between p-2" }, [
                        createVNode("div", { class: "flex flex-row" }, [
                          createVNode("img", {
                            class: "size-10 rounded-full",
                            src: item.avatar,
                            alt: item.name
                          }, null, 8, ["src", "alt"]),
                          createVNode("div", { class: "flex flex-col ml-2" }, [
                            createVNode("h1", { class: "text-sm font-bold text-gray-900 dark:text-white" }, toDisplayString(item.name), 1),
                            createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(item.username), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex h-full" }, [
                          createVNode("button", { class: "px-4 py-2 font-bold text-white rounded-full bg-black dark:bg-white dark:text-black" }, " Follow ")
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(whoToFollowItems.value, (item) => {
                return openBlock(), createBlock(_component_SidebarRightPreviewCardItem, {
                  key: item.id
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-row justify-between p-2" }, [
                      createVNode("div", { class: "flex flex-row" }, [
                        createVNode("img", {
                          class: "size-10 rounded-full",
                          src: item.avatar,
                          alt: item.name
                        }, null, 8, ["src", "alt"]),
                        createVNode("div", { class: "flex flex-col ml-2" }, [
                          createVNode("h1", { class: "text-sm font-bold text-gray-900 dark:text-white" }, toDisplayString(item.name), 1),
                          createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(item.username), 1)
                        ])
                      ]),
                      createVNode("div", { class: "flex h-full" }, [
                        createVNode("button", { class: "px-4 py-2 font-bold text-white rounded-full bg-black dark:bg-white dark:text-black" }, " Follow ")
                      ])
                    ])
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<footer><ul class="mx-2 my-4 text-xs text-gray-500"><!--[-->`);
      ssrRenderList(footerLinks.value, (link, index) => {
        _push(`<li class="inline-block mx-2"><a${ssrRenderAttr("href", link.href)} class="hover:underline">${ssrInterpolate(link.text)}</a></li>`);
      });
      _push(`<!--]--></ul></footer></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar/Right/index.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = {
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    label: {
      type: String,
      default: ""
    },
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    }
  },
  setup(__props) {
    const { label, modelValue, placeholder, type } = __props;
    const inputId = computed(() => `inputField-${type}`);
    const autocomplete = computed(() => type === "password" ? "current-password" : "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (label) {
        _push(`<label${ssrRenderAttr("for", inputId.value)} class="block pl-3 ml-px text-sm font-medium text-gray-700">${ssrInterpolate(label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-1"><input class="block px-4 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"${ssrRenderAttr("id", inputId.value)}${ssrRenderAttr("type", type)}${ssrRenderAttr("value", modelValue)} aria-label="Input field"${ssrRenderAttr("placeholder", placeholder)}${ssrRenderAttr("autocomplete", autocomplete.value)}></div></div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Input.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useFetchApi = (url, options = {}) => {
  const { useAuthToken } = useAuth();
  return $fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${useAuthToken().value}`
    }
  });
};
const useAuth = () => {
  const useAuthToken = () => useState("authToken");
  const useAuthUser = () => useState("authUser");
  const useAuthLoading = () => useState("authLoading", () => true);
  const setToken = (newToken) => {
    const authToken = useAuthToken();
    authToken.value = newToken;
  };
  const setUser = (newUser) => {
    const authUser = useAuthUser();
    authUser.value = newUser;
  };
  const setIsAuthLoading = (newLoading) => {
    const authLoading = useAuthLoading();
    authLoading.value = newLoading;
  };
  const login = ({ username, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch("/api/auth/login", {
          method: "POST",
          body: {
            username,
            password
          }
        });
        setToken(data.accessToken);
        setUser(data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const refreshToken = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await $fetch("/api/auth/refresh");
        if (response.error) {
          throw new Error(response.error);
        }
        setToken(response.accessToken);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const getUser = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi("/api/auth/user");
        if (response.error) {
          throw new Error(response.error);
        }
        setUser(response.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const reRefreshAccessToken = () => {
    const authToken = useAuthToken();
    if (!authToken.value) {
      return;
    }
    const jwt = jwtDecode(authToken.value);
    const newRefreshTime = jwt.exp - 6e4;
    setTimeout(() => {
      refreshToken();
      reRefreshAccessToken();
    }, newRefreshTime);
  };
  const initAuth = () => {
    return new Promise(async (resolve, reject) => {
      setIsAuthLoading(true);
      try {
        await refreshToken();
        await getUser();
        reRefreshAccessToken();
        resolve(true);
      } catch (error) {
        reject(error);
      } finally {
        setIsAuthLoading(false);
      }
    });
  };
  const logout = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await useFetchApi("/api/auth/logout", {
          method: "POST"
        });
        setToken(null);
        setUser(null);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  return {
    login,
    useAuthToken,
    useAuthUser,
    initAuth,
    useAuthLoading,
    logout
  };
};
const _sfc_main$d = {
  __name: "Form",
  __ssrInlineRender: true,
  setup(__props) {
    const data = reactive({
      username: "",
      password: "",
      loading: false,
      error: null
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIInput = _sfc_main$e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl hover:bg-blue-50" }, _attrs))}><div class="space-y-8">`);
      _push(ssrRenderComponent(_component_UIInput, {
        label: "Username",
        placeholder: "@username",
        type: "text",
        modelValue: unref(data).username,
        "onUpdate:modelValue": ($event) => unref(data).username = $event,
        class: "transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-blue-100"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UIInput, {
        label: "Password",
        placeholder: "*******",
        type: "password",
        modelValue: unref(data).password,
        "onUpdate:modelValue": ($event) => unref(data).password = $event,
        class: "transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-blue-100"
      }, null, _parent));
      _push(`<div><button${ssrIncludeBooleanAttr(unref(data).loading) ? " disabled" : ""} class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg transform transition duration-500 hover:scale-110 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">`);
      if (unref(data).loading) {
        _push(`<span>Loading...</span>`);
      } else {
        _push(`<span>Login</span>`);
      }
      _push(`</button></div></div></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/Form.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_AuthForm = _sfc_main$d;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen" }, _attrs))}><div class="relative flex-1 hidden w-0 lg:block"><img class="absolute inset-0 object-cover size-full" src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1908&amp;q=80" alt=""></div><div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"><div class="flex items-center size-full max-w-sm mx-auto px-14 lg:w-960"><form>`);
  _push(ssrRenderComponent(_component_AuthForm, null, null, _parent));
  _push(`</form></div></div></div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/Page.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$b = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ["onClose"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const closeModal = () => {
      emits("onClose");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TransitionRoot), mergeProps({
        appear: "",
        show: props.isOpen,
        as: "template"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Dialog), {
              as: "div",
              onClose: closeModal,
              class: "relative z-10"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-300 ease-out",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "duration-200 ease-in",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="fixed inset-0 bg-black/25"${_scopeId3}></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "fixed inset-0 bg-black/25" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="fixed inset-0 overflow-y-auto"${_scopeId2}><div class="flex min-h-full items-center justify-center p-4 text-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-300 ease-out",
                    "enter-from": "opacity-0 scale-95",
                    "enter-to": "opacity-100 scale-100",
                    leave: "duration-200 ease-in",
                    "leave-from": "opacity-100 scale-100",
                    "leave-to": "opacity-0 scale-95"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "default")
                              ];
                            }
                          }),
                          _: 3
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "default")
                            ]),
                            _: 3
                          })
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode(unref(TransitionChild), {
                      as: "template",
                      enter: "duration-300 ease-out",
                      "enter-from": "opacity-0",
                      "enter-to": "opacity-100",
                      leave: "duration-200 ease-in",
                      "leave-from": "opacity-100",
                      "leave-to": "opacity-0"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "fixed inset-0 bg-black/25" })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "fixed inset-0 overflow-y-auto" }, [
                      createVNode("div", { class: "flex min-h-full items-center justify-center p-4 text-center" }, [
                        createVNode(unref(TransitionChild), {
                          as: "template",
                          enter: "duration-300 ease-out",
                          "enter-from": "opacity-0 scale-95",
                          "enter-to": "opacity-100 scale-100",
                          leave: "duration-200 ease-in",
                          "leave-from": "opacity-100 scale-100",
                          "leave-to": "opacity-0 scale-95"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "default")
                              ]),
                              _: 3
                            })
                          ]),
                          _: 3
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Dialog), {
                as: "div",
                onClose: closeModal,
                class: "relative z-10"
              }, {
                default: withCtx(() => [
                  createVNode(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-300 ease-out",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "duration-200 ease-in",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "fixed inset-0 bg-black/25" })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "fixed inset-0 overflow-y-auto" }, [
                    createVNode("div", { class: "flex min-h-full items-center justify-center p-4 text-center" }, [
                      createVNode(unref(TransitionChild), {
                        as: "template",
                        enter: "duration-300 ease-out",
                        "enter-from": "opacity-0 scale-95",
                        "enter-to": "opacity-100 scale-100",
                        leave: "duration-200 ease-in",
                        "leave-from": "opacity-100 scale-100",
                        "leave-to": "opacity-0 scale-95"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "default")
                            ]),
                            _: 3
                          })
                        ]),
                        _: 3
                      })
                    ])
                  ])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Modal.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: "w-8 h-8 mr-3 -ml-1 text-blue-400 animate-spin",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, _attrs))}><circle class="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Spinner.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$9 = {
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    tweet: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const author = props.tweet.author;
    const replyToTweetUrl = computed(() => `/status/${props.tweet.replyTo.id}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 flex" }, _attrs))}><div class="flex items-center"><img${ssrRenderAttr("src", unref(author).profileImage)} alt="" class="size-10 rounded-full"></div><div class="flex ml-3 items-center"><span class="font-medium text-gray-800 dark:text-white">${ssrInterpolate(unref(author).name)}</span><span class="ml-3 text-sm font-medium text-gray-400">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(`${unref(author).handle}`)}`);
          } else {
            return [
              createTextVNode(toDisplayString(`${unref(author).handle}`), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` . ${ssrInterpolate(props.tweet.postedAtHuman)}</span>`);
      if (props.tweet.replyTo) {
        _push(`<p class="text-sm"><span class="text-gray-500"> Replying to </span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(replyToTweetUrl),
          class: "text-blue-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(props.tweet.replyTo.author.handle)}`);
            } else {
              return [
                createTextVNode(toDisplayString(props.tweet.replyTo.author.handle), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Item/Header.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    color: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 5
    }
  },
  emits: ["onClick"],
  setup(__props, { emit: __emit }) {
    const { defaultTransition } = useTailwindConfig();
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center text-gray-400 cursor-pointer group" }, _attrs))}><div class="${ssrRenderClass(`p-2 pr-auto group-hover:bg-${props.color}-100 group-hover:text-${props.color}-400 rounded-full dark:g roup-hover:bg-opacity-20 ${unref(defaultTransition)}`)}">`);
      ssrRenderSlot(_ctx.$slots, "icon", {
        classes: `size-${props.size}`
      }, null, _push, _parent);
      _push(`</div><span class="${ssrRenderClass(`ml-1 group-hover:text-${props.color}-400`)}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Item/Actions/Icon.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    tweet: {
      type: Object,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ["onCommentClick", "onRetweetClick", "onLikeClick", "onShareClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 100);
    };
    const icons = [
      { component: ChatBubbleOvalLeftEllipsisIcon, color: "blue" },
      { component: ArrowPathIcon, color: "green" },
      { component: HeartIcon, color: "red" },
      { component: ArrowUpOnSquareIcon, color: "blue" }
    ];
    const size = computed(() => props.compact ? 5 : 6);
    const showStats = computed(() => props.compact);
    const handleClick = (component) => {
      if (component === ChatBubbleOvalLeftEllipsisIcon) {
        emit("onCommentClick");
      } else if (component === ArrowPathIcon) {
        emit("onRetweetClick");
      } else if (component === HeartIcon) {
        emit("onLikeClick");
      } else if (component === ArrowUpOnSquareIcon) {
        emit("onShareClick");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TweetItemActionsIcon = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-evenly w-full" }, _attrs))}><!--[-->`);
      ssrRenderList(icons, (icon, index) => {
        _push(ssrRenderComponent(_component_TweetItemActionsIcon, {
          key: index,
          color: icon.color,
          size: unref(size),
          onOnClick: ($event) => handleClick(icon.component)
        }, createSlots({
          icon: withCtx(({ classes }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(icon.component), { class: classes }, null), _parent2, _scopeId);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(icon.component), { class: classes }, null, 8, ["class"]))
              ];
            }
          }),
          _: 2
        }, [
          unref(showStats) ? {
            name: "default",
            fn: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span${_scopeId}>${ssrInterpolate(icon.component === unref(ChatBubbleOvalLeftEllipsisIcon) ? props.tweet.repliesCount : generateRandomNumber())}</span>`);
              } else {
                return [
                  createVNode("span", null, toDisplayString(icon.component === unref(ChatBubbleOvalLeftEllipsisIcon) ? props.tweet.repliesCount : generateRandomNumber()), 1)
                ];
              }
            }),
            key: "0"
          } : void 0
        ]), _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Item/Actions/index.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    tweet: {
      type: Object,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    },
    hideActions: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const { twitterBorderColor } = useTailwindConfig();
    const props = __props;
    const emitter2 = useEmitter();
    const tweetBodyWrapper = computed(
      () => props.compact ? "ml-16" : "ml-2 mt-4"
    );
    const textSize = computed(() => props.compact ? "text-base" : "text-2xl");
    const handleCommentClick = () => {
      emitter2.$emit("replyTweet", props.tweet);
    };
    const handleRetweetClick = () => {
      console.log("retweet click");
    };
    const handleLikeClick = () => {
      console.log("like click");
    };
    const handleShareClick = () => {
      console.log("share click");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TweetItemHeader = _sfc_main$9;
      const _component_TweetItemActions = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_TweetItemHeader, {
        tweet: props.tweet
      }, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(tweetBodyWrapper))}"><p class="${ssrRenderClass([unref(textSize), "flex-shrink w-auto font-medium text-gray-800 dark:text-white"])}">${ssrInterpolate(props.tweet.text)}</p><!--[-->`);
      ssrRenderList(props.tweet.mediaFiles, (image) => {
        _push(`<div class="${ssrRenderClass([unref(twitterBorderColor), "flex my-3 border-2 rounded-2xl"])}"><img${ssrRenderAttr("src", image.url)} alt="" class="w-full rounded-2xl object-cover"></div>`);
      });
      _push(`<!--]--><div class="mt-2">`);
      if (!props.hideActions) {
        _push(ssrRenderComponent(_component_TweetItemActions, {
          tweet: props.tweet,
          compact: props.compact,
          onOnCommentClick: handleCommentClick,
          onOnRetweetClick: handleRetweetClick,
          onOnLikeClick: handleLikeClick,
          onOnShareClick: handleShareClick
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Item/index.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const icons = {
      image: {
        viewBox: "0 0 24 24",
        ariaLabel: "Add image",
        path: `<path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path><circle cx="8.868" cy="8.309" r="1.542"></circle>`
      },
      gif: {
        viewBox: "0 0 24 24",
        ariaLabel: "Add GIF",
        path: `<path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path><path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>`
      },
      chart: {
        viewBox: "0 0 24 24",
        ariaLabel: "Add chart",
        class: "w-5 h-5",
        fill: "currentColor",
        path: ` <path d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"></path>`
      },
      emoji: {
        viewBox: "0 0 24 24",
        ariaLabel: "Add emoji",
        class: "w-5 h-5",
        fill: "currentColor",
        path: `<path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path><path d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z"></path><circle cx="14.738" cy="9.458" r="1.478"></circle><circle cx="9.262" cy="9.458" r="1.478"></circle>`
      },
      calendar: {
        viewBox: "0 0 24 24",
        ariaLabel: "Add calendar",
        class: "w-5 h-5",
        fill: "currentColor",
        path: `<path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z"></path><path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"></path><path d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"></path> <path d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"></path>`
      }
    };
    const iconData = computed(() => icons[props.name] || {});
    const viewBox = computed(() => iconData.value.viewBox);
    const ariaLabel = computed(() => iconData.value.ariaLabel);
    const iconPath = computed(() => iconData.value.path);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        viewBox: viewBox.value,
        class: "w-5 h-5",
        fill: "currentColor",
        "aria-label": ariaLabel.value
      }, _attrs))}><g>${iconPath.value ?? ""}</g></svg>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Icon.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    user: {
      type: Object,
      required: true
    },
    placeholder: {
      type: String,
      default: "What's happening?"
    }
  },
  emits: ["onSubmit"],
  setup(__props, { emit: __emit }) {
    const { twitterBorderColor } = useTailwindConfig();
    const emits = __emit;
    const text = ref("");
    ref();
    const selectedFile = ref(null);
    const inputImageUrl = ref(null);
    const isDisabled = computed(() => text.value === "");
    const props = __props;
    const iconNames = ["image", "gif", "chart", "emoji", "calendar"];
    const handleFormSubmit = () => {
      emits("onSubmit", {
        text: text.value,
        mediaFile: [selectedFile.value]
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIButton = _sfc_main$j;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center flex-shrink-0 p-4 pb-0"><div class="flex w-12 place-items-start"><img class="inline-block size-10 rounded-full"${ssrRenderAttr("src", (_a = props == null ? void 0 : props.user) == null ? void 0 : _a.profileImage)} alt="User profile image"></div><div class="w-full p-2 pt-4"><textarea class="w-full h-10 text-lg text-gray-900 overflow-hidden placeholder:text-gray-400 bg-transparent border-0 dark:text-white focus:ring-0"${ssrRenderAttr("placeholder", props == null ? void 0 : props.placeholder)}>${ssrInterpolate(text.value)}</textarea></div></div><div class="p-4 pl-16">`);
      if (inputImageUrl.value) {
        _push(`<img${ssrRenderAttr("src", inputImageUrl.value)} alt="" class="${ssrRenderClass([unref(twitterBorderColor), "rounded-2xl border"])}" width="200" height="200">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input type="file" accept="image/*,video/*" name="" id="" aria-label="Upload file" hidden></div><div class="flex p-2 pl-14"><div class="flex w-full text-white"><!--[-->`);
      ssrRenderList(iconNames, (iconName) => {
        _push(`<div class="p-2 pt-3 text-blue-400 rounded-full cursor-pointer hover:bg-blue-50 dark:hover:bg-dim-800">`);
        _push(ssrRenderComponent(_sfc_main$5, { name: iconName }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><div class="ml-auto">`);
      _push(ssrRenderComponent(_component_UIButton, {
        disabled: unref(isDisabled),
        onClick: handleFormSubmit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<strong class="font-bold"${_scopeId}> Tweet </strong>`);
          } else {
            return [
              createVNode("strong", { class: "font-bold" }, " Tweet ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Form/Input.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const useTweet = () => {
  const usePostTweetModal = () => useState("post_tweet_modal", () => false);
  const useReplyTweet = () => useState("reply_tweet", () => null);
  const closePostTweetModal = () => {
    const postTweetModal = usePostTweetModal();
    postTweetModal.value = false;
  };
  const setReplyTweet = (tweet) => {
    const replyTweet = useReplyTweet();
    replyTweet.value = tweet;
  };
  const openPostTweetModal = (tweet = null) => {
    const postTweetModal = usePostTweetModal();
    postTweetModal.value = true;
    setReplyTweet(tweet);
  };
  const postTweet = (formData) => {
    const form = new FormData();
    form.append("text", formData.text);
    form.append("replyTo", formData.replyTo);
    formData.mediaFile.forEach((mediaFile, index) => {
      form.append("media_file_" + index, mediaFile);
    });
    return useFetchApi("/api/user/tweets", {
      method: "POST",
      body: form
    });
  };
  const getTweets = (params = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi("/api/tweets", {
          method: "GET",
          params
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };
  const getTweetById = (tweetId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi(`/api/tweets/${tweetId}`, {
          method: "GET"
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };
  return { postTweet, getTweets, getTweetById, closePostTweetModal, usePostTweetModal, openPostTweetModal, useReplyTweet };
};
const _sfc_main$3 = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    user: {
      type: Object,
      required: true
    },
    placeholder: {
      type: String,
      default: "What's happening?"
    },
    replyTo: {
      type: Object,
      default: null
    },
    showReply: {
      type: Boolean,
      default: false
    }
  },
  emits: ["onSuccess"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const { postTweet } = useTweet();
    const props = __props;
    const isLoading = ref(false);
    const handleFormSubmit = async (data) => {
      var _a;
      isLoading.value = true;
      try {
        const response = await postTweet({
          text: data.text,
          mediaFile: data.mediaFile,
          replyTo: (_a = props.replyTo) == null ? void 0 : _a.id
        });
        console.log(response);
        emits("onSuccess", response.tweet);
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UISpinner = __nuxt_component_0;
      const _component_TweetItem = _sfc_main$6;
      const _component_TweetFormInput = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(isLoading)) {
        _push(`<div class="flex justify-center items-center p-6">`);
        _push(ssrRenderComponent(_component_UISpinner, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div>`);
        if (props.showReply && props.replyTo) {
          _push(ssrRenderComponent(_component_TweetItem, {
            tweet: props.replyTo,
            hideActions: ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_TweetFormInput, {
          placeholder: props.placeholder,
          user: props.user,
          onOnSubmit: handleFormSubmit
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Form/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const darkMode = ref(false);
    const { useAuthUser, initAuth, useAuthLoading, logout } = useAuth();
    const isLoading = useAuthLoading();
    const {
      closePostTweetModal,
      usePostTweetModal,
      openPostTweetModal,
      useReplyTweet
    } = useTweet();
    const replyTweet = useReplyTweet();
    const emitter2 = useEmitter();
    emitter2.$on("replyTweet", (tweet) => {
      openPostTweetModal(tweet);
      replyTweet.value = tweet;
    });
    const postTweetModal = usePostTweetModal();
    const user = useAuthUser();
    emitter2.$on("toggleDarkMode", () => {
      darkMode.value = !darkMode.value;
    });
    const handleFormSuccess = (tweet) => {
      closePostTweetModal();
      navigateTo({
        path: `/status/${tweet.id}`
      });
    };
    const handleModalClose = () => {
      closePostTweetModal();
    };
    const handleOpenTweetModal = () => {
      openPostTweetModal(null);
    };
    const handleLogout = async () => {
      await logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_Loading = __nuxt_component_1;
      const _component_SidebarLeft = _sfc_main$i;
      const _component_NuxtPage = __nuxt_component_3;
      const _component_SidebarRight = _sfc_main$f;
      const _component_AuthPage = __nuxt_component_5;
      const _component_UIModal = _sfc_main$b;
      const _component_TweetForm = _sfc_main$3;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass({ dark: unref(darkMode) })}"${_scopeId}><div class="bg-white dark:bg-dim-900"${_scopeId}>`);
            if (unref(isLoading)) {
              _push2(ssrRenderComponent(_component_Loading, null, null, _parent2, _scopeId));
            } else if (unref(user)) {
              _push2(`<div class="min-h-full"${_scopeId}><div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5"${_scopeId}><div class="hidden md:block xs:col-span-1 xl:col-span-2"${_scopeId}><div class="sticky top-0"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SidebarLeft, {
                onOnTweet: handleOpenTweetModal,
                user: unref(user),
                onOnLogout: handleLogout
              }, null, _parent2, _scopeId));
              _push2(`</div></div><main class="col-span-12 mt-2 md:col-span-8 xl:col-span-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
              _push2(`</main><div class="hidden col-span-12 md:block xl:col-span-4 md:col-span-3"${_scopeId}><div class="sticky top-0"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SidebarRight, null, null, _parent2, _scopeId));
              _push2(`</div></div></div></div>`);
            } else {
              _push2(ssrRenderComponent(_component_AuthPage, null, null, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(_component_UIModal, {
              isOpen: unref(postTweetModal),
              onOnClose: handleModalClose
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TweetForm, {
                    replyTo: unref(replyTweet),
                    showReply: "",
                    user: unref(user),
                    onOnSuccess: handleFormSuccess
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_TweetForm, {
                      replyTo: unref(replyTweet),
                      showReply: "",
                      user: unref(user),
                      onOnSuccess: handleFormSuccess
                    }, null, 8, ["replyTo", "user"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: { dark: unref(darkMode) }
              }, [
                createVNode("div", { class: "bg-white dark:bg-dim-900" }, [
                  unref(isLoading) ? (openBlock(), createBlock(_component_Loading, { key: 0 })) : unref(user) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "min-h-full"
                  }, [
                    createVNode("div", { class: "grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5" }, [
                      createVNode("div", { class: "hidden md:block xs:col-span-1 xl:col-span-2" }, [
                        createVNode("div", { class: "sticky top-0" }, [
                          createVNode(_component_SidebarLeft, {
                            onOnTweet: handleOpenTweetModal,
                            user: unref(user),
                            onOnLogout: handleLogout
                          }, null, 8, ["user"])
                        ])
                      ]),
                      createVNode("main", { class: "col-span-12 mt-2 md:col-span-8 xl:col-span-6" }, [
                        createVNode(_component_NuxtPage)
                      ]),
                      createVNode("div", { class: "hidden col-span-12 md:block xl:col-span-4 md:col-span-3" }, [
                        createVNode("div", { class: "sticky top-0" }, [
                          createVNode(_component_SidebarRight)
                        ])
                      ])
                    ])
                  ])) : (openBlock(), createBlock(_component_AuthPage, { key: 2 })),
                  createVNode(_component_UIModal, {
                    isOpen: unref(postTweetModal),
                    onOnClose: handleModalClose
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_TweetForm, {
                        replyTo: unref(replyTweet),
                        showReply: "",
                        user: unref(user),
                        onOnSuccess: handleFormSuccess
                      }, null, 8, ["replyTo", "user"])
                    ]),
                    _: 1
                  }, 8, ["isOpen"])
                ])
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-De65Rvsc.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-M8BhgI-o.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, __nuxt_component_0$1 as a, useAuth as b, _sfc_main$3 as c, useRoute as d, entry$1 as default, useTweet as e, _sfc_main$6 as f, __nuxt_component_0 as g, injectHead as i, navigateTo as n, resolveUnrefHeadInput as r, useTailwindConfig as u };
//# sourceMappingURL=server.mjs.map
