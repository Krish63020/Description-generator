document.addEventListener('DOMContentLoaded', function() {
    // Tag input handling for skills
    const skillsInput = document.getElementById('skills-input');
    const skillsTagsContainer = document.getElementById('skills-tags');
    const skills = [];

    skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && skillsInput.value.trim() !== '') {
            e.preventDefault();
            addSkill(skillsInput.value.trim());
            skillsInput.value = '';
        }
    });

    function addSkill(skill) {
        if (!skills.includes(skill)) {
            skills.push(skill);
            
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `${skill} <span class="tag-close">&times;</span>`;
            
            const closeBtn = tagElement.querySelector('.tag-close');
            closeBtn.addEventListener('click', function() {
                const index = skills.indexOf(skill);
                if (index !== -1) {
                    skills.splice(index, 1);
                }
                tagElement.remove();
            });
            
            skillsTagsContainer.appendChild(tagElement);
        }
    }

    // Tag input handling for keywords
    const keywordsInput = document.getElementById('keywords-input');
    const keywordsTagsContainer = document.getElementById('keywords-tags');
    const keywords = [];

    keywordsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && keywordsInput.value.trim() !== '') {
            e.preventDefault();
            addKeyword(keywordsInput.value.trim());
            keywordsInput.value = '';
        }
    });

    function addKeyword(keyword) {
        if (!keywords.includes(keyword)) {
            keywords.push(keyword);
            
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `${keyword} <span class="tag-close">&times;</span>`;
            
            const closeBtn = tagElement.querySelector('.tag-close');
            closeBtn.addEventListener('click', function() {
                const index = keywords.indexOf(keyword);
                if (index !== -1) {
                    keywords.splice(index, 1);
                }
                tagElement.remove();
            });
            
            keywordsTagsContainer.appendChild(tagElement);
        }
    }

    // Number input increment/decrement
    const vacanciesInput = document.getElementById('vacancies');
    const incrementBtn = document.querySelector('.increment');
    const decrementBtn = document.querySelector('.decrement');

    incrementBtn.addEventListener('click', function() {
        vacanciesInput.value = parseInt(vacanciesInput.value) + 1;
    });

    decrementBtn.addEventListener('click', function() {
        if (parseInt(vacanciesInput.value) > 1) {
            vacanciesInput.value = parseInt(vacanciesInput.value) - 1;
        }
    });

    // Rich text editor functionality
    const editorButtons = document.querySelectorAll('.toolbar-btn');
    const formatSelect = document.getElementById('format-select');
    const editor = document.getElementById('description');

    editorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            
            if (command === 'increaseFontSize' || command === 'decreaseFontSize') {
                const selection = window.getSelection();
                if (selection.rangeCount) {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    
                    // Get the current font size or set a default
                    const currentElement = range.commonAncestorContainer;
                    let currentSize = window.getComputedStyle(currentElement.parentNode).fontSize;
                    currentSize = parseInt(currentSize);
                    
                    // Increase or decrease by 2px
                    const newSize = command === 'increaseFontSize' ? currentSize + 2 : currentSize - 2;
                    span.style.fontSize = `${newSize}px`;
                    
                    range.surroundContents(span);
                }
            } else {
                document.execCommand(command, false, null);
            }
            
            editor.focus();
        });
    });

    formatSelect.addEventListener('change', function() {
        const format = this.value;
        let command = 'formatBlock';
        let value = format === 'normal' ? 'p' : format;
        
        document.execCommand(command, false, `<${value}>`);
        editor.focus();
    });

    // Generate button functionality
    const generateBtn = document.getElementById('generate-btn');
    
    generateBtn.addEventListener('click', function() {
        // Collect form data
        const recruiterType = document.getElementById('recruiter-type').value;
        const companyName = document.getElementById('company-name').value;
        const postFor = document.querySelector('input[name="post-for"]:checked').value;
        const workType = document.getElementById('work-type').value;
        const eligibility = document.querySelector('input[name="eligibility"]:checked').value;
        const location = document.querySelector('input[name="location"]:checked').value;
        const address = document.getElementById('address').value;
        const title = document.getElementById('title').value;
        const package = document.getElementById('package').value;
        const submissionDate = document.getElementById('submission-date').value;
        const vacancies = document.getElementById('vacancies').value;
        
        // Check if required fields are filled
        if (!recruiterType || !companyName || !workType || !address || !title || !submissionDate) {
            alert('Please fill in all required fields before generating description.');
            return;
        }
        
        // Prepare data for API call
        const data = {
            recruiterType,
            companyName,
            postFor,
            workType,
            eligibility,
            location,
            address,
            title,
            package,
            submissionDate,
            vacancies,
            skills,
            keywords
        };
        
        // Call the API to generate description
        fetch('/generate_description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Insert generated description into the editor
            editor.innerHTML = data.description;
        })
        .catch(error => {
            console.error('Error generating description:', error);
            alert('Error generating description. Please try again.');
        });
    });

    // Download button functionality
    const downloadBtn = document.getElementById('download-btn');
    
    downloadBtn.addEventListener('click', function() {
        const content = editor.innerHTML;
        
        if (content.trim() === '') {
            alert('Please generate a description first.');
            return;
        }
        
        const title = document.getElementById('title').value || 'job_description';
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_description.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Reset button functionality
    const resetBtn = document.getElementById('reset-btn');
    
    resetBtn.addEventListener('click', function() {
        editor.innerHTML = '';
    });

    // Create Post button functionality
    const createPostBtn = document.getElementById('create-post-btn');
    
    createPostBtn.addEventListener('click', function() {
        const content = editor.innerHTML;
        
        if (content.trim() === '') {
            alert('Please generate a description first.');
            return;
        }
        
        // Here you would typically submit the form data to your backend
        // For demo purposes, we'll just show an alert
        alert('Post created successfully!');
    });

    // Add placeholder functionality to contenteditable
    editor.addEventListener('focus', function() {
        if (this.innerHTML.trim() === '') {
            this.innerHTML = '';
        }
    });

    editor.addEventListener('blur', function() {
        if (this.innerHTML.trim() === '') {
            this.innerHTML = '';
        }
    });
});