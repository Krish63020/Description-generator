from flask import Flask, request, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_description', methods=['POST'])
def generate_description():
    data = request.json
    
    # Extract form data
    recruiter_type = data.get('recruiterType', '')
    company_name = data.get('companyName', '')
    post_for = data.get('postFor', '')
    work_type = data.get('workType', '')
    eligibility = data.get('eligibility', '')
    location = data.get('location', '')
    address = data.get('address', '')
    title = data.get('title', '')
    package = data.get('package', '')
    submission_date = data.get('submissionDate', '')
    vacancies = data.get('vacancies', '')
    skills = data.get('skills', [])
    keywords = data.get('keywords', [])
    
    # Generate description based on the form data
    description = generate_job_description(
        recruiter_type, company_name, post_for, work_type, eligibility,
        location, address, title, package, submission_date, vacancies,
        skills, keywords
    )
    
    return jsonify({'description': description})

def generate_job_description(recruiter_type, company_name, post_for, work_type, eligibility,
                            location, address, title, package, submission_date, vacancies,
                            skills, keywords):
    # Default description parts
    intro_templates = [
        f"We are looking for a talented {title} to join our team.",
        f"Exciting opportunity for a {title} role at {company_name}.",
        f"Join our team as a {title} and be part of an innovative environment."
    ]
    
    responsibility_templates = [
        "Key responsibilities include:",
        "What you'll be doing:",
        "Your role will involve:"
    ]
    
    responsibility_items = [
        "Collaborating with cross-functional teams",
        "Developing and implementing strategies",
        "Contributing to project goals",
        "Participating in team meetings",
        "Providing regular progress updates"
    ]
    
    qualification_templates = [
        "Qualifications:",
        "Requirements:",
        "What we're looking for:"
    ]
    
    # Customize based on work type
    work_type_desc = ""
    if work_type == "Internship":
        work_type_desc = f"This is a {work_type} position perfect for candidates looking to gain valuable industry experience."
    elif work_type == "Full-Time":
        work_type_desc = f"This is a {work_type} position with comprehensive benefits and growth opportunities."
    elif work_type == "Part-Time":
        work_type_desc = f"This is a flexible {work_type} position ideal for those seeking work-life balance."
    elif work_type == "Contract":
        work_type_desc = f"This is a {work_type} position with an initial term and possibility of extension."
    elif work_type == "Project":
        work_type_desc = f"This is a {work_type}-based position focused on specific deliverables."
    
    # Location info
    location_info = f"Location: {location} at {address}" if address else f"Location: {location}"
    
    # Package info
    package_info = f"Compensation: {package}" if package else ""
    
    # Skills section
    skills_text = ""
    if skills:
        skills_text = "Required skills:\n• " + "\n• ".join(skills)
    
    # Generate the description
    intro = random.choice(intro_templates)
    responsibilities = random.choice(responsibility_templates)
    qualifications = random.choice(qualification_templates)
    
    # Select random responsibility items based on title and skills
    selected_responsibilities = random.sample(responsibility_items, min(3, len(responsibility_items)))
    resp_text = responsibilities + "\n• " + "\n• ".join(selected_responsibilities)
    
    # Deadline info
    deadline_info = f"Application deadline: {submission_date}" if submission_date else ""
    
    # Vacancies info
    vacancies_info = f"Number of positions: {vacancies}" if vacancies else ""
    
    # Full description
    full_description = f"""
{intro}

{work_type_desc}

{resp_text}

{qualifications}
• Experience with: {', '.join(skills) if skills else 'relevant technologies'}
• Strong communication and teamwork skills
• Ability to work in a fast-paced environment

{location_info}
{package_info}
{vacancies_info}
{deadline_info}

To apply, please submit your resume and cover letter by the application deadline.
{company_name} is an equal opportunity employer.
"""
    
    return full_description

if __name__ == '__main__':
    app.run(debug=True)