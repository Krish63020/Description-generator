// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const createPostBtn = document.getElementById('createPostBtn');
const previewBtn = document.getElementById('previewBtn');
const jobDescriptionEditor = document.getElementById('jobDescription');
const previewModal = document.getElementById('previewModal');
const previewContent = document.getElementById('previewContent');
const closeButton = document.querySelector('.close-button');

// Tags Management
const skillsInput = document.getElementById('skills-input');
const skillsTags = document.getElementById('skills-tags');
const keywordsInput = document.getElementById('keywords-input');
const keywordsTags = document.getElementById('keywords-tags');

let skills = [];
let keywords = [];

// Handle Skills Tags
skillsInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        e.preventDefault();
        addTag(this.value.trim(), 'skills');
        this.value = '';
    }
});

// Handle Keywords Tags
keywordsInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        e.preventDefault();
        addTag(this.value.trim(), 'keywords');
        this.value = '';
    }
});

// Add a tag to the respective container
function addTag(value, type) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = value;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'tag-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        if (type === 'skills') {
            skills = skills.filter(skill => skill !== value);
        } else {
            keywords = keywords.filter(keyword => keyword !== value);
        }
        tag.remove();
    });
    
    tag.appendChild(closeBtn);
    
    if (type === 'skills') {
        skills.push(value);
        skillsTags.appendChild(tag);
    } else {
        keywords.push(value);
        keywordsTags.appendChild(tag);
    }
}

// Date picker functionality
const dateInput = document.getElementById('lastDate');
const dateIcon = document.querySelector('.date-icon');

// Initialize datepicker functionality
dateIcon.addEventListener('click', function() {
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.style.display = 'none';
    document.body.appendChild(datePicker);
    
    datePicker.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const formattedDate = formatDate(selectedDate);
        dateInput.value = formattedDate;
        document.body.removeChild(this);
    });
    
    datePicker.click();
});

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Vacancies input functionality
function incrementVacancies() {
    const vacanciesInput = document.getElementById('vacancies');
    vacanciesInput.value = parseInt(vacanciesInput.value) + 1;
}

function decrementVacancies() {
    const vacanciesInput = document.getElementById('vacancies');
    const currentValue = parseInt(vacanciesInput.value);
    if (currentValue > 1) {
        vacanciesInput.value = currentValue - 1;
    }
}

// Editor formatting functionality
function applyFormatting(command) {
    if (command === 'bold') {
        document.execCommand('bold', false, null);
    } else if (command === 'italic') {
        document.execCommand('italic', false, null);
    } else if (command === 'underline') {
        document.execCommand('underline', false, null);
    } else if (command === 'strikethrough') {
        document.execCommand('strikeThrough', false, null);
    } else if (command === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
    } else if (command === 'ol') {
        document.execCommand('insertOrderedList', false, null);
    } else if (command === 'align-left') {
        document.execCommand('justifyLeft', false, null);
    } else if (command === 'align-center') {
        document.execCommand('justifyCenter', false, null);
    } else if (command === 'align-right') {
        document.execCommand('justifyRight', false, null);
    } else if (command === 'text-height') {
        const size = prompt('Enter font size (1-7):', '3');
        if (size !== null) {
            document.execCommand('fontSize', false, size);
        }
    } else if (command === 'font') {
        const font = prompt('Enter font name:', 'Arial');
        if (font !== null) {
            document.execCommand('fontName', false, font);
        }
    } else if (command === 'eraser') {
        document.execCommand('removeFormat', false, null);
    }
    
    jobDescriptionEditor.focus();
}

document.getElementById('formatting-select').addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === 'normal') {
        document.execCommand('formatBlock', false, 'p');
    } else {
        document.execCommand('formatBlock', false, selectedValue);
    }
    this.value = 'normal';
    jobDescriptionEditor.focus();
});

// Collect form data
function collectFormData() {
    const recruiterType = document.getElementById('recruiterType').value;
    const companyName = document.getElementById('companyName').value;
    const postFor = document.querySelector('input[name="postFor"]:checked').value;
    const workType = document.getElementById('workType').value;
    
    const eligibilityCheckboxes = document.querySelectorAll('input[name="eligibility"]:checked');
    const eligibility = Array.from(eligibilityCheckboxes).map(checkbox => checkbox.value);
    
    const locationType = document.querySelector('input[name="locationType"]:checked').value;
    const address = document.getElementById('address').value;
    const title = document.getElementById('title').value;
    const package = document.getElementById('package').value;
    const lastDate = document.getElementById('lastDate').value;
    const vacancies = document.getElementById('vacancies').value;
    
    return {
        recruiterType,
        companyName,
        postFor,
        workType,
        eligibility,
        locationType,
        address,
        title,
        package,
        lastDate,
        vacancies,
        skills,
        keywords
    };
}

// Generate description with AI
generateBtn.addEventListener('click', async function() {
    try {
        const formData = collectFormData();
        
        // Validate required fields
        const requiredFields = [
            { name: 'recruiterType', label: 'Recruiter Type' },
            { name: 'companyName', label: 'Company Name' },
            { name: 'workType', label: 'Work Type' },
            { name: 'title', label: 'Title' }
        ];
        
        for (const field of requiredFields) {
            if (!formData[field.name]) {
                alert(`Please fill in the ${field.label} field.`);
                return;
            }
        }
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        // Send data to backend for AI-generated description
        const response = await fetch('/generate-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate description');
        }
        
        const data = await response.json();
        
        // Set the generated description in the editor
        jobDescriptionEditor.innerHTML = data.description;
        
        // Restore button state
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-robot"></i> Generate with AI';
        
    } catch (error) {
        console.error('Error generating description:', error);
        alert('Failed to generate description. Please try again.');
        
        // Restore button state
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-robot"></i> Generate with AI';
    }
});

// Download description
downloadBtn.addEventListener('click', function() {
    const content = jobDescriptionEditor.innerHTML;
    
    if (!content || content.trim() === '') {
        alert('Please generate or write a description first.');
        return;
    }
    
    // Create a blob with the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the blob
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job_description.html';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
});

// Reset description
resetBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the description?')) {
        jobDescriptionEditor.innerHTML = '';
    }
});

// Create post (placeholder functionality)
createPostBtn.addEventListener('click', function() {
    const content = jobDescriptionEditor.innerHTML;
    
    if (!content || content.trim() === '') {
        alert('Please generate or write a description first.');
        return;
    }
    
    // Here you would implement the actual post creation logic
    // For now, just show a success message
    alert('Post created successfully!');
});

// Preview functionality
previewBtn.addEventListener('click', function() {
    const content = jobDescriptionEditor.innerHTML;
    
    if (!content || content.trim() === '') {
        alert('Please generate or write a description first.');
        return;
    }
    
    // Display content in the preview modal
    previewContent.innerHTML = content;
    previewModal.style.display = 'block';
});

// Close modal when clicking the close button
closeButton.addEventListener('click', function() {
    previewModal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target === previewModal) {
        previewModal.style.display = 'none';
    }
});

// Add placeholder behavior to the editor
jobDescriptionEditor.addEventListener('focus', function() {
    if (this.innerHTML === '') {
        this.classList.remove('empty');
    }
});

jobDescriptionEditor.addEventListener('blur', function() {
    if (this.innerHTML === '') {
        this.classList.add('empty');
    }
});

// Initialize placeholder state
if (jobDescriptionEditor.innerHTML === '') {
    jobDescriptionEditor.classList.add('empty');
}

// Prevent form submission when pressing Enter in inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && input.id !== 'skills-input' && input.id !== 'keywords-input') {
            e.preventDefault();
        }
    });
});

// Mobile responsiveness adjustments
function adjustForMobile() {
    if (window.innerWidth <= 768) {
        // Adjust editor toolbar for mobile
        const toolbarButtons = document.querySelectorAll('.formatting-option');
        toolbarButtons.forEach(button => {
            button.style.padding = '8px';
        });
    }
}

// Run on page load and window resize
adjustForMobile();
window.addEventListener('resize', adjustForMobile);
