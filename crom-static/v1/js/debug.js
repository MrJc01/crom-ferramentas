// Crom Tools Debugger
(function () {
    console.log('%c🔧 Crom Tools Debugger Active', 'background: #222; color: #bada55; font-size: 14px; padding: 4px; border-radius: 4px;');

    function logInteraction(type, target, details = {}) {
        const path = getDomPath(target);
        console.groupCollapsed(`%c${type}%c @ ${target.tagName || 'WINDOW'}`, 'color: #4f46e5; font-weight: bold;', 'color: #888;');
        console.log('Target:', target);
        console.log('Path:', path);
        if (Object.keys(details).length) console.log('Details:', details);
        console.trace('Stack Trace');
        console.groupEnd();
    }

    function getDomPath(el) {
        if (!el) return '';
        var stack = [];
        var isShadow = false;
        while (el.parentNode != null) {
            var sibCount = 0;
            var sibIndex = 0;
            // warning: parentNode.childNodes is dynamic
            for (var i = 0; i < el.parentNode.childNodes.length; i++) {
                var sib = el.parentNode.childNodes[i];
                if (sib.nodeName == el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            if (el.hasAttribute('id') && el.id != '') {
                stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            } else if (sibCount > 1) {
                stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
            } else {
                stack.unshift(el.nodeName.toLowerCase());
            }
            el = el.parentNode;
        }
        return stack.slice(1).join(' > ');
    }

    // Global Event Listeners
    window.addEventListener('click', (e) => logInteraction('CLICK', e.target), true);
    window.addEventListener('change', (e) => logInteraction('CHANGE', e.target, { value: e.target.value }), true);
    window.addEventListener('submit', (e) => logInteraction('SUBMIT', e.target), true);
    window.addEventListener('error', (e) => {
        console.error('%c🔥 ERROR CAUGHT', 'font-size: 12px; font-weight: bold; color: red;', e.message);
    });

    // Network Monitoring Proxy
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        console.log('%c📡 FETCH START', 'color: #0ea5e9;', args[0]);
        try {
            const response = await originalFetch(...args);
            console.log(`%c📡 FETCH ${response.status}`, response.ok ? 'color: #10b981;' : 'color: #ef4444;', args[0]);
            return response;
        } catch (err) {
            console.log('%c📡 FETCH ERROR', 'color: #ef4444;', args[0], err);
            throw err;
        }
    };

})();
