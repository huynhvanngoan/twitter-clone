import { _ as _sfc_main$1, H as Head, T as Title, a as _sfc_main$2 } from './ListFeed-De5jOZ9y.mjs';
import { u as useTailwindConfig, b as useAuth, n as navigateTo, c as _sfc_main$3 } from './server.mjs';
import { ref, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import './index-BabADJUJ.mjs';
import '@unhead/shared';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import 'vue-router';
import '@heroicons/vue/24/solid';
import '@heroicons/vue/24/outline';
import 'mitt';
import 'jwt-decode';
import '@headlessui/vue';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { twitterBorderColor } = useTailwindConfig();
    const loading = ref(false);
    const homeTweets = ref([]);
    const { useAuthUser } = useAuth();
    const user = useAuthUser();
    const handleFormSuccess = (tweet) => {
      navigateTo({
        path: `/status/${tweet.id}`
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainSection = _sfc_main$1;
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_TweetForm = _sfc_main$3;
      const _component_TweetListFeed = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_MainSection, {
        title: "Home",
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
                        _push4(`Home / Twitter`);
                      } else {
                        return [
                          createTextVNode("Home / Twitter")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Title, null, {
                      default: withCtx(() => [
                        createTextVNode("Home / Twitter")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="${ssrRenderClass([unref(twitterBorderColor), "border-b"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_TweetForm, {
              user: unref(user),
              onOnSuccess: handleFormSuccess
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_TweetListFeed, { tweets: unref(homeTweets) }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Head, null, {
                default: withCtx(() => [
                  createVNode(_component_Title, null, {
                    default: withCtx(() => [
                      createTextVNode("Home / Twitter")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode("div", {
                class: ["border-b", unref(twitterBorderColor)]
              }, [
                createVNode(_component_TweetForm, {
                  user: unref(user),
                  onOnSuccess: handleFormSuccess
                }, null, 8, ["user"])
              ], 2),
              createVNode(_component_TweetListFeed, { tweets: unref(homeTweets) }, null, 8, ["tweets"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CbjC2mS_.mjs.map
