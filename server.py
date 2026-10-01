# Dev server: static files + the harness bus (/__bus__), /__copy__, /__trash__.
import http.server, json, threading, time, sys
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8010
LOG, COND = [], threading.Condition()

def queue(fn, entry):
    try: q = json.load(open(fn))
    except Exception: q = []
    q.append(entry); json.dump(q, open(fn, 'w'), indent=2); return len(q)

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
    def _json(self, o):
        b = json.dumps(o).encode(); self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0))
        try: e = json.loads(self.rfile.read(n) or b'{}')
        except Exception: e = {}
        r = self.path.split('?')[0]
        if r == '/__bus__':
            with COND: LOG.append(e); COND.notify_all()
            self._json({'ok': True})
        elif r == '/__copy__': self._json({'ok': True, 'queued': queue('_debug-copy.json', e)})
        elif r == '/__trash__': self._json({'ok': True, 'queued': queue('_debug-trash.json', e)})
        else: self.send_error(404)
    def do_GET(self):
        if self.path.startswith('/__bus__'):
            since = -1
            for p in (self.path.split('?', 1) + [''])[1].split('&'):
                if p.startswith('since='):
                    try: since = int(p[6:])
                    except ValueError: pass
            with COND:
                if since < 0: return self._json({'n': len(LOG), 'msgs': []})
                if since > len(LOG): since = len(LOG)
                end = time.time() + 25
                while len(LOG) <= since and time.time() < end: COND.wait(end - time.time())
                return self._json({'n': len(LOG), 'msgs': LOG[since:]})
        return self._range_get() if self.headers.get('Range') else super().do_GET()
    def _range_get(self):
        # byte-range replies so <video> can seek (SimpleHTTPRequestHandler ignores Range)
        import os, re
        path = self.translate_path(self.path.split('?')[0])
        if not os.path.isfile(path): return super().do_GET()
        size = os.path.getsize(path)
        m = re.match(r'bytes=(\d*)-(\d*)$', self.headers['Range'])
        if not m: return super().do_GET()
        a, b = m.groups()
        start = int(a) if a else max(0, size - int(b)); end = int(b) if (a and b) else size - 1
        end = min(end, size - 1)
        if start > end or start >= size:
            self.send_response(416); self.send_header('Content-Range', f'bytes */{size}'); self.end_headers(); return
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1)); self.end_headers()
        with open(path, 'rb') as f:
            f.seek(start); left = end - start + 1
            while left > 0:
                chunk = f.read(min(65536, left))
                if not chunk: break
                try: self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError): return
                left -= len(chunk)

s = http.server.ThreadingHTTPServer(('', PORT), H)
print(f'http://localhost:{PORT}', flush=True); s.serve_forever()
