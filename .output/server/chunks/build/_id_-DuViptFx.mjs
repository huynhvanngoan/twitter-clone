import { _ as _sfc_main$1$1, H as Head, T as Title, a as _sfc_main$2 } from './ListFeed-De5jOZ9y.mjs';
import { d as useRoute, e as useTweet, b as useAuth, n as navigateTo, f as _sfc_main$6, c as _sfc_main$3 } from './server.mjs';
import { ref, watch, unref, withCtx, createVNode, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main$1 = {
  __name: "Details",
  __ssrInlineRender: true,
  props: {
    tweet: {
      type: Object,
      required: false,
      default: null
    },
    user: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const replies = computed(() => {
      var _a;
      return ((_a = props.tweet) == null ? void 0 : _a.replies) || [];
    });
    const handleFormSuccess = (tweet) => {
      navigateTo({
        path: `/status/${tweet.id}`
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TweetItem = _sfc_main$6;
      const _component_TweetForm = _sfc_main$3;
      const _component_TweetListFeed = _sfc_main$2;
      if (__props.tweet) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_TweetItem, {
          tweet: props.tweet,
          user: props.user
        }, null, _parent));
        _push(ssrRenderComponent(_component_TweetForm, {
          placeholder: `Tweet your reply`,
          replyTo: props.tweet,
          user: props.user,
          onOnSuccess: handleFormSuccess
        }, null, _parent));
        _push(ssrRenderComponent(_component_TweetListFeed, { tweets: unref(replies) }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}><p>No tweet available.</p></div>`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tweet/Details.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { getTweetById } = useTweet();
    const loading = ref(false);
    const tweet = ref(null);
    const { useAuthUser } = useAuth();
    const user = useAuthUser();
    watch(() => useRoute().fullPath, () => getTweet());
    const getTweetIdFromRoute = () => {
      return useRoute().params.id;
    };
    const getTweet = async () => {
      loading.value = true;
      try {
        const response = await getTweetById(getTweetIdFromRoute());
        tweet.value = response.tweet;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainSection = _sfc_main$1$1;
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_TweetDetails = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_MainSection, {
        title: "Tweet",
        loading: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Head, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Title, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Title)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TweetDetails, {
              tweet: unref(tweet),
              user: unref(user)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Head, null, {
                default: withCtx(() => [
                  createVNode(_component_Title)
                ]),
                _: 1
              }),
              createVNode(_component_TweetDetails, {
                tweet: unref(tweet),
                user: unref(user)
              }, null, 8, ["tweet", "user"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/status/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DuViptFx.mjs.map
