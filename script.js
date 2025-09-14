document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const coin = document.getElementById('coin');
    const coinInner = document.querySelector('.coin-inner');
    const tossBtn = document.getElementById('toss-btn');
    const resultDiv = document.getElementById('result');
    const historyList = document.getElementById('history-list');
    const headLabelInput = document.getElementById('head-label');
    const tailLabelInput = document.getElementById('tail-label');
    const optionsSelect = document.getElementById('options');
    const themeSwitch = document.getElementById('theme-switch');
    
    // Variables
    let isTossing = false;
    let history = [];
    
    // Theme Management
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Update coin labels
    function updateCoinLabels() {
        const headLabel = headLabelInput.value || 'Head';
        const tailLabel = tailLabelInput.value || 'Tail';
        
        document.querySelector('.coin-front').textContent = headLabel.charAt(0).toUpperCase();
        document.querySelector('.coin-back').textContent = tailLabel.charAt(0).toUpperCase();
    }
    
    headLabelInput.addEventListener('input', updateCoinLabels);
    tailLabelInput.addEventListener('input', updateCoinLabels);
    
    // Toss function
    function tossCoin() {
        if (isTossing) return;
        
        isTossing = true;
        const numOptions = parseInt(optionsSelect.value);
        const headLabel = headLabelInput.value || 'Head';
        const tailLabel = tailLabelInput.value || 'Tail';
        
        // Reset and start animation
        coinInner.classList.remove('tossing');
        void coinInner.offsetWidth; // Trigger reflow
        coinInner.classList.add('tossing');
        
        // Generate random result
        setTimeout(() => {
            let result;
            let resultText;
            
            if (numOptions === 2) {
                // Standard head/tail toss
                result = Math.random() < 0.5 ? headLabel : tailLabel;
                resultText = `It's ${result}!`;
            } else {
                // Multiple options - randomly select one
                const options = [];
                for (let i = 1; i <= numOptions; i++) {
                    options.push(`Option ${i}`);
                }
                
                // Use head and tail labels for first two options if available
                if (headLabel !== 'Head') options[0] = headLabel;
                if (tailLabel !== 'Tail' && numOptions > 1) options[1] = tailLabel;
                
                const randomIndex = Math.floor(Math.random() * numOptions);
                result = options[randomIndex];
                resultText = `Selected: ${result}!`;
            }
            
            // Display result
            resultDiv.innerHTML = `<h3 class="win">${resultText}</h3>`;
            
            // Add to history
            const historyItem = {
                result,
                time: new Date().toLocaleTimeString(),
                type: numOptions > 2 ? `${numOptions}-option` : 'coin toss'
            };
            
            history.unshift(historyItem);
            updateHistory();
            
            isTossing = false;
        }, 1500);
    }
    
    // Update history display
    function updateHistory() {
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.result}</span>
                <span>${item.time} (${item.type})</span>
            `;
            historyList.appendChild(li);
        });
    }
    
    // Event listeners
    tossBtn.addEventListener('click', tossCoin);
    
    // Initialize
    updateCoinLabels();
});