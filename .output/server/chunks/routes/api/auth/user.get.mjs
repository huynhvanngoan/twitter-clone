import { d as defineEventHandler } from '../../../runtime.mjs';
import { u as userTransformer } from '../../../_/user.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';

const user_get = defineEventHandler(async (event) => {
  var _a;
  return {
    user: userTransformer((_a = event.context.auth) == null ? void 0 : _a.user)
  };
});

export { user_get as default };
//# sourceMappingURL=user.get.mjs.map
