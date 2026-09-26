// This file runs ONLY inside the manifest-declared sandbox page. It has no Chrome APIs,
// opaque origin and a CSP that blocks network requests and external resources.
window.addEventListener('message', event => {
  if(event.source !== window.parent || !event.data || event.data.type !== 'WACE_STUDY_MODULE') return;
  const html = event.data.html;
  if(typeof html !== 'string' || html.length > 16000) return;
  const root = document.getElementById('module-root');
  try {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    // Only inline scripts are allowed. Block nested frames, form submissions and external assets.
    const scripts = [...parsed.querySelectorAll('script:not([src])')].map(node => node.textContent);
    parsed.querySelectorAll('script,iframe,frame,object,embed,base,meta[http-equiv],link,form').forEach(node => node.remove());
    root.replaceChildren(...[...parsed.body.childNodes].map(node => document.importNode(node, true)));
    for(const style of parsed.head.querySelectorAll('style')) document.head.append(document.importNode(style,true));
    for(const code of scripts) new Function(code)();
  } catch(err) {root.textContent = `This activity could not run: ${err.message}`}
}, false);
