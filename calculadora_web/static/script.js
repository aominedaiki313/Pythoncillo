document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const expressionDisplay = document.getElementById('expressionDisplay');
    const resultDisplay = document.getElementById('resultDisplay');
    const memoryIndicator = document.getElementById('memoryIndicator');
    const modeIndicator = document.getElementById('modeIndicator');
    const scientificPanel = document.getElementById('scientificPanel');
    const toggleScientificBtn = document.getElementById('toggleScientificBtn');
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyDrawer = document.getElementById('historyDrawer');
    const historyList = document.getElementById('historyList');

    // Calculator State
    let currentExpression = '';
    let currentResult = '0';
    let isEvaluated = false;
    let memoryValue = 0;

    // --- Helper Functions ---
    function updateDisplay() {
        expressionDisplay.textContent = currentExpression;
        resultDisplay.textContent = currentResult || '0';

        // Auto-scale font size if result is too long
        if (currentResult.length > 12) {
            resultDisplay.style.fontSize = '1.4rem';
        } else if (currentResult.length > 8) {
            resultDisplay.style.fontSize = '1.8rem';
        } else {
            resultDisplay.style.fontSize = '2.2rem';
        }
    }

    function appendToExpression(val) {
        if (isEvaluated) {
            // If the user types an operator right after evaluation, chain with previous result
            if (['+', '-', '×', '÷', '%', '^'].includes(val)) {
                currentExpression = currentResult + ' ' + val + ' ';
            } else {
                currentExpression = val;
            }
            isEvaluated = false;
        } else {
            if (['+', '-', '×', '÷', '%', '^'].includes(val)) {
                currentExpression += ' ' + val + ' ';
            } else {
                currentExpression += val;
            }
        }
        updateDisplay();
    }

    function clearAll() {
        currentExpression = '';
        currentResult = '0';
        isEvaluated = false;
        updateDisplay();
    }

    function clearEntry() {
        if (isEvaluated) {
            clearAll();
            return;
        }
        // Remove last token or character
        currentExpression = currentExpression.trimEnd();
        if (currentExpression.endsWith('+') || currentExpression.endsWith('-') ||
            currentExpression.endsWith('×') || currentExpression.endsWith('÷') ||
            currentExpression.endsWith('%') || currentExpression.endsWith('^')) {
            currentExpression = currentExpression.slice(0, -1).trimEnd();
        } else {
            currentExpression = currentExpression.slice(0, -1);
        }
        updateDisplay();
    }

    function backspace() {
        if (isEvaluated) {
            clearAll();
            return;
        }
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }

    function toggleSign() {
        if (!currentExpression && currentResult !== '0') {
            currentResult = (parseFloat(currentResult) * -1).toString();
            updateDisplay();
            return;
        }
        if (currentExpression.startsWith('-')) {
            currentExpression = currentExpression.slice(1);
        } else {
            currentExpression = '-' + currentExpression;
        }
        updateDisplay();
    }

    // --- API Calls ---
    async function calculateResult() {
        if (!currentExpression && !isEvaluated) return;

        const exprToSend = isEvaluated ? currentResult : currentExpression;
        if (!exprToSend.trim()) return;

        resultDisplay.textContent = '...';

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression: exprToSend })
            });

            const data = await response.json();

            if (data.success) {
                currentResult = String(data.result);
                expressionDisplay.textContent = data.expression + ' =';
                isEvaluated = true;
                currentExpression = '';
                fetchHistory(); // Refresh history drawer if open
            } else {
                currentResult = 'Error';
                expressionDisplay.textContent = data.error || 'Error de sintaxis';
                isEvaluated = true;
            }
        } catch (err) {
            currentResult = 'Error';
            expressionDisplay.textContent = 'Error de conexión con el servidor';
            isEvaluated = true;
        }
        updateDisplay();
    }

    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            if (data.success) {
                renderHistory(data.history);
            }
        } catch (err) {
            console.error('Error al cargar historial:', err);
        }
    }

    async function clearHistory() {
        try {
            const response = await fetch('/api/history', { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                renderHistory([]);
            }
        } catch (err) {
            console.error('Error al limpiar historial:', err);
        }
    }

    function renderHistory(items) {
        historyList.innerHTML = '';
        if (!items || items.length === 0) {
            historyList.innerHTML = '<p class="empty-msg">No hay cálculos aún</p>';
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="hist-expr">${escapeHtml(item.expression)}</div>
                <div class="hist-res">${escapeHtml(String(item.result))}</div>
            `;
            div.addEventListener('click', () => {
                currentExpression = item.expression;
                currentResult = String(item.result);
                isEvaluated = true;
                updateDisplay();
            });
            historyList.appendChild(div);
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // --- Memory Operations ---
    function handleMemory(action) {
        const currentVal = parseFloat(currentResult) || 0;
        switch (action) {
            case 'mc':
                memoryValue = 0;
                memoryIndicator.classList.add('hidden');
                break;
            case 'mr':
                currentExpression += memoryValue.toString();
                isEvaluated = false;
                updateDisplay();
                break;
            case 'm-add':
                memoryValue += currentVal;
                memoryIndicator.classList.remove('hidden');
                break;
            case 'm-sub':
                memoryValue -= currentVal;
                memoryIndicator.classList.remove('hidden');
                break;
        }
    }

    // --- Event Listeners ---

    // Keypad Buttons Click
    document.querySelectorAll('.keypad .btn, .scientific-panel .sci-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            const action = btn.getAttribute('data-action');

            if (val !== null) {
                appendToExpression(val);
            } else if (action !== null) {
                switch (action) {
                    case 'clear-all': clearAll(); break;
                    case 'clear-entry': clearEntry(); break;
                    case 'backspace': backspace(); break;
                    case 'toggle-sign': toggleSign(); break;
                    case 'calculate': calculateResult(); break;
                }
            }
        });
    });

    // Memory Buttons
    document.querySelectorAll('.mem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleMemory(btn.getAttribute('data-action'));
        });
    });

    // Toggle Scientific Panel
    toggleScientificBtn.addEventListener('click', () => {
        scientificPanel.classList.toggle('hidden');
        const isSci = !scientificPanel.classList.contains('hidden');
        modeIndicator.textContent = isSci ? 'Científico' : 'Estándar';
        toggleScientificBtn.style.color = isSci ? '#c084fc' : 'var(--text-secondary)';
    });

    // Toggle History Drawer
    toggleHistoryBtn.addEventListener('click', () => {
        historyDrawer.classList.toggle('hidden');
        if (!historyDrawer.classList.contains('hidden')) {
            fetchHistory();
        }
    });

    closeHistoryBtn.addEventListener('click', () => {
        historyDrawer.classList.add('hidden');
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key >= '0' && e.key <= '9') {
            appendToExpression(e.key);
        } else if (e.key === '.') {
            appendToExpression('.');
        } else if (e.key === '+') {
            appendToExpression('+');
        } else if (e.key === '-') {
            appendToExpression('-');
        } else if (e.key === '*') {
            appendToExpression('×');
        } else if (e.key === '/') {
            e.preventDefault();
            appendToExpression('÷');
        } else if (e.key === '%') {
            appendToExpression('%');
        } else if (e.key === '^') {
            appendToExpression('^');
        } else if (e.key === '(' || e.key === ')') {
            appendToExpression(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculateResult();
        } else if (e.key === 'Backspace') {
            backspace();
        } else if (e.key === 'Escape') {
            clearAll();
        }
    });
});
