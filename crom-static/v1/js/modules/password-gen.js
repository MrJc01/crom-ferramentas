// --- PASSWORD GENERATOR TOOL ---
window.CromApp.registerTool({
    id: 'pwd-gen',
    title: 'Gerador de Senha',
    desc: 'Crie senhas fortes localmente. Nenhuma dado sai do seu dispositivo.',
    icon: 'lock',
    color: 'bg-rose-500',
    category: 'Segurança',
    tags: ['senha', 'segurança', 'privacidade', 'gerador'],
    render: () => `
        <div class="max-w-md mx-auto py-8">
            <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl mb-6 flex items-center justify-between">
                <span id="pwdDisplay" class="font-mono text-lg tracking-wider select-all break-all overflow-hidden line-clamp-3">Mude algo para Gerar</span>
                <button onclick="navigator.clipboard.writeText(document.getElementById('pwdDisplay').innerText)" class="ml-4 p-2 shrink-0 bg-white shadow whitespace-nowrap dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-rose-500 transition-colors"><i data-lucide="copy" class="w-5 h-5"></i></button>
            </div>
            
            <div class="mb-6 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-2xl space-y-5">
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-bold text-slate-600 dark:text-slate-300">Tamanho da Senha</label>
                        <span id="pwdLengthDisplay" class="text-rose-500 font-black text-xl">20</span>
                    </div>
                    <input type="range" id="pwdLength" min="8" max="128" value="20" oninput="window.updatePwdLength(this.value)" class="w-full accent-rose-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer">
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdUpper" checked onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Maiúsculas (A-Z)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdLower" checked onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Minúsculas (a-z)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdNumbers" checked onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Números (0-9)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdSymbols" checked onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Símbolos (!@#)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdReadable" onchange="window.handlePwdExclusive('readable')" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[11px] font-medium text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">Pronúncia Fácil</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdHex" onchange="window.handlePwdExclusive('hex')" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[11px] font-medium text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">Apenas Hex</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdNoAmbiguous" onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[11px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Sem Ambíguos (0,O,I,l)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="pwdUnique" onchange="window.generatePassword()" class="w-4 h-4 text-rose-500 bg-slate-100 border-slate-300 rounded focus:ring-rose-500 dark:focus:ring-rose-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[11px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Apenas Únicos (Sem Repetição)</span>
                    </label>
                </div>
            </div>

            <button onclick="window.generatePassword()" class="w-full bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2">
                <i data-lucide="refresh-cw" class="w-5 h-5"></i> Gerar Nova Senha
            </button>
        </div>
    `,
    onOpen: () => {
        setTimeout(() => {
            window.generatePassword();
        }, 150);
    }
});

// Helper Functions
window.updatePwdLength = (val) => {
    const display = document.getElementById('pwdLengthDisplay');
    if (display) display.innerText = val;
    window.generatePassword();
};

window.handlePwdExclusive = (mode) => {
    // These modes override basic rules
    const upperEl = document.getElementById('pwdUpper');
    const lowerEl = document.getElementById('pwdLower');
    const numbersEl = document.getElementById('pwdNumbers');
    const symbolsEl = document.getElementById('pwdSymbols');
    const readableEl = document.getElementById('pwdReadable');
    const hexEl = document.getElementById('pwdHex');

    if (mode === 'hex' && hexEl.checked) {
        readableEl.checked = false;
        upperEl.checked = true;
        numbersEl.checked = true;
        lowerEl.checked = false;
        symbolsEl.checked = false;
    }
    else if (mode === 'readable' && readableEl.checked) {
        hexEl.checked = false;
        upperEl.checked = true;
        lowerEl.checked = true;
        numbersEl.checked = false;
        symbolsEl.checked = false;
    }
    window.generatePassword();
};

window.generatePassword = () => {
    const lengthEl = document.getElementById('pwdLength');
    const upperEl = document.getElementById('pwdUpper');
    const lowerEl = document.getElementById('pwdLower');
    const numbersEl = document.getElementById('pwdNumbers');
    const symbolsEl = document.getElementById('pwdSymbols');
    const readableEl = document.getElementById('pwdReadable');
    const hexEl = document.getElementById('pwdHex');
    const display = document.getElementById('pwdDisplay');

    // Prevent errors if DOM isn't ready
    if (!lengthEl || !display) return;

    const length = parseInt(lengthEl.value);
    const useUpper = upperEl.checked;
    const useLower = lowerEl.checked;
    const useNumbers = numbersEl.checked;
    const useSymbols = symbolsEl.checked;
    const useReadable = readableEl?.checked;
    const useHex = hexEl?.checked;
    const useNoAmbi = document.getElementById('pwdNoAmbiguous')?.checked;
    const useUnique = document.getElementById('pwdUnique')?.checked;

    let chars = '';

    // Exclusive overrides
    if (useHex) {
        chars = '0123456789ABCDEF';
    }
    else if (useReadable) {
        const readableUpper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O
        const readableLower = 'abcdefghijkmnopqrstuvwxyz'; // Removed l
        if (useUpper) chars += readableUpper;
        if (useLower) chars += readableLower;
        // fallback
        if (!useUpper && !useLower) chars = readableUpper + readableLower;
    }
    else {
        // Normal generation
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (useUpper) chars += upper;
        if (useLower) chars += lower;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        if (useNoAmbi) {
            chars = chars.replace(/[Il1O0]/g, '');
        }
    }

    if (chars === '') {
        display.innerText = 'Selecione no mínimo 1 opção!';
        return;
    }

    let password = '';
    let availableChars = chars;

    // Crypto Generator com suporte a Uniqueness
    for (let i = 0; i < length; i++) {
        if (useUnique && availableChars.length === 0) {
            // Se pedir 128 chars unicos mas só marcamos numeros (10 chars), o array esgota. Precisamos parar.
            break;
        }

        const sourceChars = useUnique ? availableChars : chars;
        let randomIndex = 0;

        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            randomIndex = array[0] % sourceChars.length;
        } else {
            randomIndex = Math.floor(Math.random() * sourceChars.length);
        }

        const pickedChar = sourceChars[randomIndex];
        password += pickedChar;

        if (useUnique) {
            availableChars = availableChars.slice(0, randomIndex) + availableChars.slice(randomIndex + 1);
        }
    }

    // Optional formatting for readability logic
    if (useReadable) {
        // Inject a hyphen every 5 chars for pronoucing 
        const chunks = password.match(/.{1,5}/g);
        if (chunks) password = chunks.join('-');
    }

    display.innerText = password;
};
