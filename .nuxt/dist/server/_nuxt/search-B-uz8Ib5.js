import { _ as _sfc_main$1, H as Head, T as Title, a as _sfc_main$2 } from "./ListFeed-De5jOZ9y.js";
import { d as useRoute, e as useTweet } from "../server.mjs";
import { ref, watch, unref, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import "./index-BabADJUJ.js";
import "@unhead/shared";
import "hookable";
import "ofetch";
import "#internal/nuxt/paths";
import "unctx";
import "h3";
import "unhead";
import "vue-router";
import "radix3";
import "defu";
import "ufo";
import "devalue";
import "@heroicons/vue/24/solid";
import "@heroicons/vue/24/outline";
import "mitt";
import "jwt-decode";
import "@headlessui/vue";
const _sfc_main = {
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    const { getTweets: getTweetsComposable } = useTweet();
    const loading = ref(false);
    const searchTweets = ref([]);
    const searchQuery = useRoute().query.q;
    watch(
      () => useRoute().fullPath,
      () => getTweets()
    );
    const getTweets = async () => {
      loading.value = true;
      try {
        const { tweets } = await getTweetsComposable({
          query: searchQuery.value
        });
        searchTweets.value = tweets;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainSection = _sfc_main$1;
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_TweetListFeed = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_MainSection, {
        title: "Search",
        loading: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Head, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Title, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Search`);
                      } else {
                        return [
                          createTextVNode("Search")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Title, null, {
                      default: withCtx(() => [
                        createTextVNode("Search")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TweetListFeed, { tweets: unref(searchTweets) }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Head, null, {
                default: withCtx(() => [
                  createVNode(_component_Title, null, {
                    default: withCtx(() => [
                      createTextVNode("Search")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_TweetListFeed, { tweets: unref(searchTweets) }, null, 8, ["tweets"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=search-B-uz8Ib5.js.map
