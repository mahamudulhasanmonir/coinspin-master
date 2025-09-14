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
            const extraOptionsContainer = document.getElementById('extra-options');
            
            // Variables
            let isTossing = false;
            let history = [];
            let optionInputs = [];
            
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
            
            // Create option input fields based on selection
            function createOptionInputs() {
                const numOptions = parseInt(optionsSelect.value);
                extraOptionsContainer.innerHTML = '';
                optionInputs = [];
                
                // Only create additional inputs if more than 2 options
                if (numOptions > 2) {
                    for (let i = 3; i <= numOptions; i++) {
                        const inputGroup = document.createElement('div');
                        inputGroup.className = 'input-group';
                        
                        const label = document.createElement('label');
                        label.textContent = `Option ${i}:`;
                        label.htmlFor = `option-${i}`;
                        
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.id = `option-${i}`;
                        input.placeholder = `Option ${i}`;
                        input.maxLength = 10;
                        
                        inputGroup.appendChild(label);
                        inputGroup.appendChild(input);
                        extraOptionsContainer.appendChild(inputGroup);
                        
                        optionInputs.push(input);
                    }
                }
            }
            
            // Get all option values
            function getAllOptionValues() {
                const numOptions = parseInt(optionsSelect.value);
                const headLabel = headLabelInput.value || 'Head';
                const tailLabel = tailLabelInput.value || 'Tail';
                
                const options = [headLabel, tailLabel];
                
                // Add additional options if available
                if (numOptions > 2) {
                    for (let i = 0; i < optionInputs.length; i++) {
                        const value = optionInputs[i].value || `Option ${i + 3}`;
                        options.push(value);
                    }
                }
                
                return options.slice(0, numOptions);
            }
            
            // Toss function
            function tossCoin() {
                if (isTossing) return;
                
                isTossing = true;
                const numOptions = parseInt(optionsSelect.value);
                const options = getAllOptionValues();
                
                // Reset and start animation
                coinInner.classList.remove('tossing');
                void coinInner.offsetWidth; // Trigger reflow
                coinInner.classList.add('tossing');
                
                // Generate random result
                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * numOptions);
                    const result = options[randomIndex];
                    const resultText = `Selected: ${result}!`;
                    
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
            optionsSelect.addEventListener('change', createOptionInputs);
            
            // Initialize
            updateCoinLabels();
            createOptionInputs();
        });