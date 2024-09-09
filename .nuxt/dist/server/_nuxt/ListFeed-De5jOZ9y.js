import { u as useTailwindConfig, g as __nuxt_component_0, f as _sfc_main$2 } from "../server.mjs";
import { mergeProps, unref, useSSRContext, defineComponent, computed } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrRenderList } from "vue/server-renderer";
import { u as useHead } from "./index-BabADJUJ.js";
import "hookable";
const _sfc_main$1 = {
  __name: "MainSection",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  setup(__props) {
    const { twitterBorderColor } = useTailwindConfig();
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UISpinner = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["border-x", unref(twitterBorderColor)]
      }, _attrs))}><div class="sticky top-0 px-4 bg-white/80 backdrop-blur-md dark:bg-dim-900/80"><h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">${ssrInterpolate(props.title)}</h2></div>`);
      if (__props.loading) {
        _push(`<div class="${ssrRenderClass([unref(twitterBorderColor), "flex items-center justify-center p-4 border-b"])}">`);
        _push(ssrRenderComponent(_component_UISpinner, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MainSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const removeUndefinedProps = (props) => {
  const filteredProps = /* @__PURE__ */ Object.create(null);
  for (const key in props) {
    const value = props[key];
    if (value !== void 0) {
      filteredProps[key] = value;
    }
  }
  return filteredProps;
};
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a;
    const noscript = { ...props };
    const slotVnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
    const textContent = slotVnodes ? slotVnodes.filter(({ children }) => children).map(({ children }) => children).join("") : "";
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    return {
      title: ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null
    };
  })
});
defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    /** @deprecated **/
    scoped: {
      type: Boolean,
      default: void 0
    },
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = { ...props };
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const _sfc_main = {
  __name: "ListFeed",
  __ssrInlineRender: true,
  props: {
    tweets: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const { tweetBorderColor, defaultTransition } = useTailwindConfig();
    const props = __props;
    const isEmptyArray = computed(() => props.tweets.length === 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TweetItem = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(isEmptyArray)) {
        _push(`<div class=""><p class="text-gray-500 text-center p-4">No tweets found</p></div>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(props.tweets, (tweet) => {
          _push(`<div class="${ssrRenderClass([[unref(tweetBorderColor), unref(defaultTransition)], "pb-4 border-b hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300"])}">`);
          _push(ssrRenderComponent(_component_TweetItem, {
            tweet,
            compact: ""
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/ListFeed.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  Head as H,
  Title as T,
  _sfc_main$1 as _,
  _sfc_main as a
};
//# sourceMappingURL=ListFeed-De5jOZ9y.js.map
