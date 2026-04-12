import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function accountsPath() {
  return path.resolve(__dirname, 'public', 'account.json');
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function loadAccounts(res) {
  const filePath = accountsPath();
  let list;
  try {
    list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    sendJson(res, 500, { error: 'Không đọc được account.json' });
    return null;
  }
  if (!Array.isArray(list)) {
    sendJson(res, 500, { error: 'account.json không hợp lệ' });
    return null;
  }
  return { filePath, list };
}

function saveAccounts(res, filePath, list) {
  try {
    fs.writeFileSync(filePath, `${JSON.stringify(list, null, 2)}\n`, 'utf8');
    return true;
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: 'Không ghi được account.json' });
    return false;
  }
}

function handleRegister(req, res) {
  (async () => {
    try {
      const body = await readJsonBody(req);
      const user = String(body.user ?? '').trim();
      const pass = String(body.pass ?? '').trim();

      if (!user || !pass) {
        sendJson(res, 400, { error: 'Thiếu tên đăng nhập hoặc mật khẩu' });
        return;
      }
      if (pass.length < 3) {
        sendJson(res, 400, { error: 'Mật khẩu tối thiểu 3 ký tự' });
        return;
      }

      const loaded = loadAccounts(res);
      if (!loaded) return;
      const { filePath, list } = loaded;

      const normalized = user.toLowerCase();
      const exists = list.some(
        (acc) => String(acc.user || '').trim().toLowerCase() === normalized
      );
      if (exists) {
        sendJson(res, 409, { error: 'Tên đăng nhập đã được sử dụng' });
        return;
      }

      const nextId = list.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0) + 1;
      const newAccount = {
        id: nextId,
        user,
        pass,
        role: 'customer',
      };
      list.push(newAccount);
      if (!saveAccounts(res, filePath, list)) return;

      sendJson(res, 201, {
        ok: true,
        account: {
          id: newAccount.id,
          user: newAccount.user,
          role: newAccount.role,
        },
      });
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendJson(res, 400, { error: 'Body JSON không hợp lệ' });
        return;
      }
      console.error(err);
      sendJson(res, 500, { error: 'Lỗi server' });
    }
  })();
}

function findAccountIndexById(list, id) {
  const n = Number(id);
  if (Number.isNaN(n)) return -1;
  return list.findIndex((acc) => Number(acc.id) === n);
}

function handleChangePassword(req, res) {
  (async () => {
    try {
      const body = await readJsonBody(req);
      const id = body.id;
      const currentPass = String(body.currentPass ?? '').trim();
      const newPass = String(body.newPass ?? '').trim();

      if (id == null || !currentPass || !newPass) {
        sendJson(res, 400, { error: 'Thiếu thông tin đổi mật khẩu' });
        return;
      }
      if (newPass.length < 3) {
        sendJson(res, 400, { error: 'Mật khẩu mới tối thiểu 3 ký tự' });
        return;
      }

      const loaded = loadAccounts(res);
      if (!loaded) return;
      const { filePath, list } = loaded;

      const idx = findAccountIndexById(list, id);
      if (idx === -1) {
        sendJson(res, 404, { error: 'Không tìm thấy tài khoản' });
        return;
      }

      const acc = list[idx];
      const storedPass = String(acc.pass ?? '').trim();
      if (storedPass !== currentPass) {
        sendJson(res, 403, { error: 'Mật khẩu hiện tại không đúng' });
        return;
      }

      list[idx] = { ...acc, pass: newPass };
      if (!saveAccounts(res, filePath, list)) return;

      sendJson(res, 200, { ok: true, message: 'Đã đổi mật khẩu' });
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendJson(res, 400, { error: 'Body JSON không hợp lệ' });
        return;
      }
      console.error(err);
      sendJson(res, 500, { error: 'Lỗi server' });
    }
  })();
}

function handleDeleteAccount(req, res) {
  (async () => {
    try {
      const body = await readJsonBody(req);
      const id = body.id;
      const password = String(body.password ?? '').trim();

      if (id == null || !password) {
        sendJson(res, 400, { error: 'Thiếu mã tài khoản hoặc mật khẩu' });
        return;
      }

      const loaded = loadAccounts(res);
      if (!loaded) return;
      const { filePath, list } = loaded;

      const idx = findAccountIndexById(list, id);
      if (idx === -1) {
        sendJson(res, 404, { error: 'Không tìm thấy tài khoản' });
        return;
      }

      const acc = list[idx];
      const storedPass = String(acc.pass ?? '').trim();
      if (storedPass !== password) {
        sendJson(res, 403, { error: 'Mật khẩu không đúng' });
        return;
      }

      list.splice(idx, 1);
      if (!saveAccounts(res, filePath, list)) return;

      sendJson(res, 200, { ok: true, message: 'Đã xóa tài khoản' });
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendJson(res, 400, { error: 'Body JSON không hợp lệ' });
        return;
      }
      console.error(err);
      sendJson(res, 500, { error: 'Lỗi server' });
    }
  })();
}

function handleResetPassword(req, res) {
  (async () => {
    try {
      const body = await readJsonBody(req);
      const user = String(body.user ?? '').trim();
      const newPass = String(body.newPass ?? '').trim();

      if (!user || !newPass) {
        sendJson(res, 400, { error: 'Thiếu tên đăng nhập hoặc mật khẩu mới' });
        return;
      }
      if (newPass.length < 3) {
        sendJson(res, 400, { error: 'Mật khẩu mới tối thiểu 3 ký tự' });
        return;
      }

      const loaded = loadAccounts(res);
      if (!loaded) return;
      const { filePath, list } = loaded;

      const normalized = user.toLowerCase();
      const idx = list.findIndex(
        (acc) => String(acc.user || '').trim().toLowerCase() === normalized
      );
      if (idx === -1) {
        sendJson(res, 404, { error: 'Không tìm thấy tài khoản' });
        return;
      }

      list[idx] = { ...list[idx], pass: newPass };
      if (!saveAccounts(res, filePath, list)) return;

      sendJson(res, 200, { ok: true, message: 'Đã cập nhật mật khẩu' });
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendJson(res, 400, { error: 'Body JSON không hợp lệ' });
        return;
      }
      console.error(err);
      sendJson(res, 500, { error: 'Lỗi server' });
    }
  })();
}

function accountsApiMiddleware(req, res, next) {
  const pathname = (req.url || '').split('?')[0];
  if (pathname === '/api/register' && req.method === 'POST') {
    handleRegister(req, res);
    return;
  }
  if (pathname === '/api/reset-password' && req.method === 'POST') {
    handleResetPassword(req, res);
    return;
  }
  if (pathname === '/api/change-password' && req.method === 'POST') {
    handleChangePassword(req, res);
    return;
  }
  if (pathname === '/api/delete-account' && req.method === 'POST') {
    handleDeleteAccount(req, res);
    return;
  }
  next();
}

/** Vite plugin: API ghi public/account.json (dev + preview). */
export function registerAccountApiPlugin() {
  return {
    name: 'register-account-api',
    configureServer(server) {
      server.middlewares.use(accountsApiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(accountsApiMiddleware);
    },
  };
}
