// --- CSV TO JSON ---
window.CromApp.registerTool({
    id: 'csv-json',
    title: 'CSV <-> JSON',
    category: 'Utilitários',
    desc: 'Converta planilhas para JSON e vice-versa.',
    icon: 'sheet',
    color: 'bg-green-500',
    tags: ['csv', 'json', 'converter', 'dados', 'excel'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">CSV</span>
                <textarea id="csvInput" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs whitespace-pre" placeholder="id,name\n1,Teste"></textarea>
                <button onclick="csvToJson()" class="bg-green-600 text-white py-2 rounded-lg font-bold">CSV para JSON →</button>
            </div>
            
             <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">JSON</span>
                <textarea id="jsonInput" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs" placeholder='[{"id":1, "name":"Teste"}]'></textarea>
                <button onclick="jsonToCsv()" class="bg-indigo-600 text-white py-2 rounded-lg font-bold">← JSON para CSV</button>
            </div>
        </div>
    `
});

window.csvToJson = () => {
    const csv = document.getElementById('csvInput').value.trim();
    if (!csv) return;

    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj = {};
        const currentline = lines[i].split(','); // Simple split, improper handling of quotes but ok for simple usage

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j] ? currentline[j].trim() : '';
        }
        result.push(obj);
    }

    document.getElementById('jsonInput').value = JSON.stringify(result, null, 2);
};

window.jsonToCsv = () => {
    const jsonStr = document.getElementById('jsonInput').value.trim();
    if (!jsonStr) return;

    try {
        const json = JSON.parse(jsonStr);
        if (!Array.isArray(json)) throw new Error("JSON must be an array of objects");

        const headers = Object.keys(json[0]);
        const csv = [
            headers.join(','),
            ...json.map(row => headers.map(fieldName => {
                let val = row[fieldName] ? row[fieldName].toString() : '';
                // Escape quotes
                if (val.includes(',') || val.includes('"')) val = `"${val.replace(/"/g, '""')}"`;
                return val;
            }).join(','))
        ].join('\n');

        document.getElementById('csvInput').value = csv;

    } catch (e) {
        alert("JSON Inválido: " + e.message);
    }
};
