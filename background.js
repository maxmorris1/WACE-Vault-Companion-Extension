chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.contextMenus.create({ id: 'study-resource', title: 'Study this resource with AI', contexts: ['link'], documentUrlPatterns: ['https://wacevault.com/*', 'https://www.wacevault.com/*'] });
  chrome.contextMenus.create({ id: 'explain-selection', title: 'Explain selection with AI', contexts: ['selection'], documentUrlPatterns: ['https://wacevault.com/*', 'https://www.wacevault.com/*'] });
});
chrome.runtime.onStartup.addListener(() => chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }));
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;
  const pending = info.menuItemId === 'study-resource'
    ? { type: 'link', url: info.linkUrl, at: Date.now() }
    : { type: 'selection', text: info.selectionText, at: Date.now() };
  await chrome.storage.session.set({ pending });
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Update detection only. Chrome forbids unpacked extensions from silently replacing
// their own files; actual distribution updates must go through Chrome Web Store.
function repoParts(value) {
  try { const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='github.com')return null;
    const parts=u.pathname.split('/').filter(Boolean);if(parts.length!==2||!parts.every(x=>/^[A-Za-z0-9_.-]+$/.test(x)))return null;
    return parts;
  } catch {return null}
}
function newer(remote,local){const a=String(remote).replace(/^v/i,'').split('.').map(Number),b=String(local).split('.').map(Number);if(a.some(Number.isNaN))return false;for(let i=0;i<3;i++){if((a[i]||0)>(b[i]||0))return true;if((a[i]||0)<(b[i]||0))return false}return false}
async function checkUpdates(){
  const {githubRepo}=await chrome.storage.local.get('githubRepo');const parts=repoParts(githubRepo);
  if(!parts){await chrome.storage.local.remove('updateInfo');return {error:'Enter a GitHub repository URL in Settings first.'}}
  const [owner,repo]=parts;const local=chrome.runtime.getManifest().version;
  try {
    let version,url;
    const release=await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`,{headers:{Accept:'application/vnd.github+json'}});
    if(release.ok){const data=await release.json();version=data.tag_name;url=data.html_url}
    else {const raw=await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/manifest.json`,{cache:'no-store'});if(!raw.ok)throw new Error('No public release or main-branch manifest found. Is the repo public and uploaded?');version=(await raw.json()).version;url=`https://github.com/${owner}/${repo}`}
    const info={available:newer(version,local),version,local,url,checkedAt:Date.now()};await chrome.storage.local.set({updateInfo:info});return info;
  }catch(e){return {error:e.message}}
}
chrome.alarms.get('check-updates').then(alarm=>{if(!alarm)chrome.alarms.create('check-updates',{periodInMinutes:1440})});
chrome.alarms.onAlarm.addListener(alarm=>{if(alarm.name==='check-updates')checkUpdates()});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{if(msg?.type==='CHECK_UPDATES'){checkUpdates().then(sendResponse);return true}});
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.githubRepo)checkUpdates()});
