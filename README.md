Antigravity-Driven Resume Data Extractor

A Python-based resume analysis tool that extracts clean, structured information from PDF resumes.
This project creatively uses Python’s antigravity module as a symbolic touch — representing how the tool “lifts the weight” off resume screening.
Why Antigravity?
The project imports Python’s fun antigravity module represent:
automating resume review so it feels lighter, faster, and effortless.
While the module doesn’t affect functionality, it adds a unique identity to the project.

Features
Extracts text from any PDF resume
Detects key information:
Name
Email
Phone
Location
Headline
Skills
Experience
Projects
Education
Certifications
Social links (LinkedIn, GitHub, Instagram, etc.)
Converts extracted data into a structured JSON profile
Runs locally with zero setup complexity
Fast, light, fully Python-based

Tech Stack

Python 3
pypdf / PyPDF2
Regex-based parsing
JSON
HTML/CSS/JS (optional UI)
antigravity 

Project Structure
/antigravity-resume-analyzer
 ├── profile_extractor.py   # Core logic: extract + parse text
 ├── index.html             # Optional frontend (upload UI)
 ├── script.js              # JS for PDF upload & display
 ├── styles.css             # Optional styling
 ├── profile.json           # Output JSON file
 ├── sample_resume.pdf      # PDF for testing
 ├── used_pdf.txt           # Extracted raw text (optional)
 ├── test_report.md         # Test logs or analysis
 └── README.md              # Documentation
 
 
How It Works
1. Import antigravity (symbolic visual theme)
import antigravity
2. Extract PDF Text
from pypdf import PdfReader
reader = PdfReader("resume.pdf")
text = "".join(page.extract_text() for page in reader.pages)
3. Parse Sections Using Regex
data = parse_profile(text)
4. Output CLEAN Structured JSON
with open("profile.json", "w") as f:
    json.dump(data, f, indent=4)
📌 Example Output (profile.json)
{
    "name": "Purva Popli",
    "headline": "Vellore Institute of Technology | Intern at FOSSEE-IIT BOMBAY | E-Cell VIT.",
    "location": "Amravati, Maharashtra, India",
    "email": "purvapopli1@gmail.com",
    "links": {
        "linkedin": "www.linkedin.com/in/purva-popli-444b3533b"
    }
    
}
▶️ How to Run
Install dependencies
pip install pypdf
Run the script
python profile_extractor.py
Result

Generated profile is saved as:
profile.json

Use Cases
Resume parsing for HR
ATS pre-processing
Data extraction pipelines
Auto-filling portfolios
Creating candidate databases
College/placement automation tools


Why This Project Stands Out
Combines practical automation + a creative “antigravity” theme
Clean JSON output makes it integrable with any backend
Strong demonstration of:Python scripting
PDF processing
Data cleaning
A perfect project to showcase in portfolios, GitHub, resumes, and applications.

🤝 Contributions

Issues and pull requests are welcome!
