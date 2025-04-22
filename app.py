from flask import Flask, request, render_template, jsonify
import os
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-description', methods=['POST'])
def generate_description():
    data = request.get_json()
    
    # Extract form data
    recruiter_type = data.get('recruiterType', '')
    company_name = data.get('companyName', '')
    post_for = data.get('postFor', '')
    work_type = data.get('workType', '')
    eligibility = data.get('eligibility', [])
    location_type = data.get('locationType', '')
    address = data.get('address', '')
    title = data.get('title', '')
    package = data.get('package', '')
    last_date = data.get('lastDate', '')
    vacancies = data.get('vacancies', '')
    skills = data.get('skills', [])
    keywords = data.get('keywords', [])
    
    # Generate a professional job description based on the provided information
    description = generate_professional_description(
        recruiter_type, company_name, post_for, work_type, 
        eligibility, location_type, address, title, 
        package, last_date, vacancies, skills, keywords
    )
    
    return jsonify({'description': description})

def generate_professional_description(
    recruiter_type, company_name, post_for, work_type, 
    eligibility, location_type, address, title, 
    package, last_date, vacancies, skills, keywords
):
    # Create a highly professional and detailed job description based on the input data
    
    # Start with a compelling header
    description = f"<h1>{title}</h1>\n\n"
    
    # Company introduction
    if company_name:
        if recruiter_type == "Adept":
            description += f"<p><strong>{company_name}</strong> is an industry-leading organization seeking "
        elif recruiter_type == "Entrepreneur":
            description += f"<p><strong>{company_name}</strong> is an innovative and dynamic startup seeking "
        else:
            description += f"<p><strong>{company_name}</strong> is seeking "
            
        if work_type == "Internship":
            description += f"motivated and talented interns"
        elif work_type == "Full-Time":
            description += f"dedicated full-time professionals"
        elif work_type == "Part-Time":
            description += f"qualified part-time specialists"
        else:
            description += f"qualified professionals"
            
        description += f" for the position of <strong>{title}</strong>.</p>\n\n"
    
    # Add location and work arrangement information
    if location_type == "Onsite":
        description += f"<p><strong>Location:</strong> This is an on-site position at our {address} location.</p>\n\n"
    else:
        description += "<p><strong>Location:</strong> This is a fully remote position offering flexibility and work-life balance.</p>\n\n"
    
    # Add key details section
    description += "<h2>Position Overview</h2>\n"
    description += "<p>We are looking for a talented individual to join our team. The ideal candidate will bring fresh perspectives, technical expertise, and a collaborative mindset to help us achieve our goals.</p>\n\n"
    
    # Create a structured details section
    description += "<h2>Key Details</h2>\n"
    description += "<ul>\n"
    
    # Type of position
    description += f"<li><strong>Position Type:</strong> {work_type}</li>\n"
    
    # Package/compensation
    if package:
        description += f"<li><strong>Compensation:</strong> {package}</li>\n"
    
    # Number of openings
    if vacancies and vacancies != "1":
        description += f"<li><strong>Openings:</strong> {vacancies} positions available</li>\n"
    elif vacancies == "1":
        description += "<li><strong>Openings:</strong> 1 position available</li>\n"
    
    # Application deadline
    if last_date:
        description += f"<li><strong>Application Deadline:</strong> {last_date}</li>\n"
    
    # Experience level based on eligibility
    if "Freshers" in eligibility and "Experienced" in eligibility:
        description += "<li><strong>Experience Level:</strong> Open to both freshers and experienced professionals</li>\n"
    elif "Freshers" in eligibility:
        description += "<li><strong>Experience Level:</strong> Entry-level, perfect for freshers</li>\n"
    elif "Experienced" in eligibility:
        description += "<li><strong>Experience Level:</strong> Previous relevant experience required</li>\n"
    
    description += "</ul>\n\n"
    
    # Role-specific description based on job type
    if work_type == "Internship":
        description += "<h2>About the Internship</h2>\n"
        description += "<p>This internship offers an exceptional opportunity to gain practical, real-world experience in a dynamic professional environment. Working alongside industry experts, you will develop valuable skills, build your professional network, and contribute to meaningful projects that make a difference.</p>\n\n"
        
        description += "<h2>What You'll Learn</h2>\n"
        description += "<ul>\n"
        description += "<li>Hands-on experience with industry-standard tools and technologies</li>\n"
        description += "<li>Professional workflows and best practices</li>\n"
        description += "<li>Problem-solving in real business scenarios</li>\n"
        description += "<li>Team collaboration and communication skills</li>\n"
        description += "</ul>\n\n"
        
    elif work_type in ["Full-Time", "Part-Time"]:
        description += "<h2>Role Description</h2>\n"
        description += f"<p>As a {title}, you will be responsible for collaborating with diverse teams, contributing to project development, and delivering high-quality results that align with organizational goals. This {work_type.lower()} position offers a challenging yet rewarding opportunity to grow professionally while making significant contributions to our company's success.</p>\n\n"
        
        description += "<h2>Key Responsibilities</h2>\n"
        description += "<ul>\n"
        description += "<li>Design, develop, and implement solutions aligned with business requirements</li>\n"
        description += "<li>Collaborate with cross-functional teams to achieve project objectives</li>\n"
        description += "<li>Ensure adherence to quality standards and best practices</li>\n"
        description += "<li>Contribute to strategic planning and process improvements</li>\n"
        description += "</ul>\n\n"
        
    elif work_type in ["Contract", "Project"]:
        description += "<h2>Project Overview</h2>\n"
        description += f"<p>This {work_type.lower()} engagement involves working on targeted deliverables within defined timeframes. The ideal candidate will be self-motivated, results-oriented, and capable of working independently while maintaining alignment with project objectives.</p>\n\n"
        
        description += "<h2>Deliverables & Expectations</h2>\n"
        description += "<ul>\n"
        description += "<li>Meet project milestones and deadlines with high-quality deliverables</li>\n"
        description += "<li>Provide regular progress updates and documentation</li>\n"
        description += "<li>Collaborate effectively with stakeholders and team members</li>\n"
        description += "<li>Adapt to changing requirements while maintaining focus on core objectives</li>\n"
        description += "</ul>\n\n"
    
    # Required skills section
    if skills and len(skills) > 0:
        description += "<h2>Required Skills</h2>\n"
        description += "<ul>\n"
        for skill in skills:
            description += f"<li>{skill}</li>\n"
        description += "</ul>\n\n"
    
    # Add qualifications section
    description += "<h2>Qualifications</h2>\n"
    description += "<ul>\n"
    
    if "Freshers" in eligibility and "Experienced" in eligibility:
        description += "<li>Educational background in a relevant field</li>\n"
        description += "<li>Strong analytical and problem-solving abilities</li>\n"
        description += "<li>Excellent communication and interpersonal skills</li>\n"
        description += "<li>Ability to work both independently and as part of a team</li>\n"
        description += "<li>Demonstrated passion for continuous learning and growth</li>\n"
    elif "Freshers" in eligibility:
        description += "<li>Recent graduate or final-year student in a relevant field</li>\n"
        description += "<li>Strong analytical and problem-solving abilities</li>\n"
        description += "<li>Excellent communication and interpersonal skills</li>\n"
        description += "<li>Eagerness to learn and adapt quickly</li>\n"
        description += "<li>Portfolio or projects demonstrating relevant skills (if applicable)</li>\n"
    elif "Experienced" in eligibility:
        description += "<li>Proven experience in a similar role</li>\n"
        description += "<li>Strong track record of delivering results</li>\n"
        description += "<li>Excellent problem-solving and decision-making abilities</li>\n"
        description += "<li>Strong communication and leadership skills</li>\n"
        description += "<li>Ability to mentor and guide team members</li>\n"
    else:
        description += "<li>Educational background in a relevant field</li>\n"
        description += "<li>Strong analytical and problem-solving abilities</li>\n"
        description += "<li>Excellent communication and interpersonal skills</li>\n"
    
    description += "</ul>\n\n"
    
    # Benefits section
    description += "<h2>What We Offer</h2>\n"
    description += "<ul>\n"
    
    if work_type in ["Full-Time", "Part-Time"]:
        description += "<li>Competitive compensation package</li>\n"
        description += "<li>Professional development opportunities</li>\n"
        description += "<li>Collaborative and innovative work environment</li>\n"
        description += "<li>Work-life balance</li>\n"
    elif work_type == "Internship":
        description += "<li>Hands-on learning experience</li>\n"
        description += "<li>Mentorship from industry professionals</li>\n"
        description += "<li>Opportunity to work on real projects</li>\n"
        description += "<li>Potential for future employment opportunities</li>\n"
    else:
        description += "<li>Competitive rates</li>\n"
        description += "<li>Flexible working arrangements</li>\n"
        description += "<li>Opportunity to work on cutting-edge projects</li>\n"
        description += "<li>Professional networking opportunities</li>\n"
    
    description += "</ul>\n\n"
    
    # Application process
    description += "<h2>Application Process</h2>\n"
    description += f"<p>Qualified candidates are encouraged to submit their applications before <strong>{last_date}</strong>. Please include your updated resume and a brief cover letter outlining your suitability for this position.</p>\n\n"
    
    # Company values based on recruiter type
    if recruiter_type == "Adept":
        description += "<h2>Our Values</h2>\n"
        description += "<p>We believe in fostering an inclusive environment where diverse perspectives drive innovation. Our team is committed to excellence, integrity, and continuous improvement in everything we do.</p>\n\n"
    elif recruiter_type == "Entrepreneur":
        description += "<h2>Our Vision</h2>\n"
        description += "<p>As a forward-thinking company, we're passionate about innovation and disrupting the status quo. We value creativity, agility, and a bold approach to solving complex problems.</p>\n\n"
    
    # Add equal opportunity statement
    description += "<h2>Equal Opportunity</h2>\n"
    description += f"<p>{company_name} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.</p>\n\n"
    
    # Add keywords as tags if provided
    if keywords and len(keywords) > 0:
        description += "<p><strong>Keywords:</strong> " + ", ".join(keywords) + "</p>\n"
    
    return description

if __name__ == '__main__':
    app.run(debug=True)
