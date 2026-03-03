import json
import re
from pypdf import PdfReader

def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def parse_profile(text):
    data = {
        "name": "",
        "headline": "",
        "location": "",
        "email": "",
        "links": {
            "linkedin": "",
            "instagram": "",
            "topmate": "",
            "github": ""
        },
        "about": "",
        "skills": [],
        "experience": [],
        "projects": [],
        "education": [],
        "certifications": []
    }
    
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Locate Sections
    indices = {}
    keywords = ["Contact", "Top Skills", "Experience", "Education", "Certifications", "Summary", "Honors-Awards", "Publications"]
    
    for i, line in enumerate(lines):
        if line in keywords:
            indices[line] = i
    
    # 1. Contact Info & Links
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        data["email"] = email_match.group(0)

    # Link extraction loop (handling multiline split)
    for i, line in enumerate(lines):
        link_type = None
        if "linkedin.com" in line: link_type = "linkedin"
        elif "github.com" in line: link_type = "github"
        elif "topmate.io" in line: link_type = "topmate"
        elif "instagram.com" in line: link_type = "instagram"
        
        if link_type:
            # Extract URL (simple split by space or paren)
            url_part = line.split("(")[0].strip()
            
            # Check for hyphenation split
            if url_part.endswith("-") and i+1 < len(lines):
                next_part = lines[i+1].split("(")[0].strip()
                url = url_part + next_part
            else:
                url = url_part
                
            # Clean trailing dot
            url = url.rstrip(".")
            data["links"][link_type] = url

    # 2. Main Header (Name, Headline, Location)
    end_header_idx = -1
    
    if "Experience" in indices:
        end_header_idx = indices["Experience"]
    elif "Education" in indices:
        end_header_idx = indices["Education"]
    
    if end_header_idx != -1:
        # Heuristic: 
        # Line -1: Location
        # Lines above: Headline
        # Line above Headline: Name
        # Validation: Check against Email username or "Top Skills" boundary
        
        curr = end_header_idx - 1
        if curr >= 0:
            data["location"] = lines[curr]
            curr -= 1
            
            # Walk backwards to find Name
            # Name is likely the line that matches email or is capitalized and short?
            # Or just assume the "Top Skills" + 1 is start of skills, and Name is after skills.
            # Let's count backwards. 
            # We assume Headline is usually 1-3 lines. Name is 1 line.
            
            # Try to find Name by email match
            found_name_idx = -1
            if "email" in data and data["email"]:
                user_id = data["email"].split("@")[0]
                user_id_clean = re.sub(r'\d+', '', user_id).lower()
                
                # Look at lines between Top Skills (or 0) and current
                search_start = indices.get("Top Skills", -1) + 1
                
                for k in range(search_start, curr + 1):
                    # Check if line matches fuzzy name
                    line_clean = re.sub(r'\s+', '', lines[k]).lower()
                    if len(line_clean) > 3 and (user_id_clean in line_clean or line_clean in user_id_clean):
                        found_name_idx = k
                        data["name"] = lines[k]
                        break
            
            if found_name_idx != -1:
                 # Headline is between Name and Location
                hl_lines = lines[found_name_idx+1 : end_header_idx-1]
                data["headline"] = " ".join(hl_lines)
                
                # Skills are between "Top Skills" and Name
                if "Top Skills" in indices:
                    skill_lines = lines[indices["Top Skills"]+1 : found_name_idx]
                    data["skills"] = [s for s in skill_lines if s]

    # Fix Headline Hyphenation
    if data["headline"]:
        data["headline"] = data["headline"].replace("- ", "-")

    # 3. Experience
    if "Experience" in indices:
        start = indices["Experience"] + 1
        end = indices.get("Education", len(lines))
        # Also check other keywords to stop
        for k, v in indices.items():
            if v > indices["Experience"] and v < end:
                end = v
                
        chunk = []
        for i in range(start, end):
            line = lines[i]
            if "Page" in line: continue
            chunk.append(line)
            # End of job detection
            if re.search(r'\d{4}.*(\d{4}|Present)', line) or "month" in line.lower() or "year" in line.lower():
                if len(chunk) >= 3:
                     data["experience"].append({
                        "company": chunk[0],
                        "title": chunk[1],
                        "dates": chunk[-1],
                        "bullets": chunk[2:-1]
                    })
                elif len(chunk) == 2:
                    data["experience"].append({
                        "company": chunk[0],
                        "title": "", 
                        "dates": chunk[1],
                        "bullets": []
                    })
                chunk = []

    # 4. Education
    if "Education" in indices:
        start = indices["Education"] + 1
        end = len(lines)
        for k, v in indices.items():
            if v > indices["Education"] and v < end:
                end = v
                
        edu_chunk = lines[start:end]
        edu_chunk = [l for l in edu_chunk if "Page" not in l]
        if edu_chunk:
             data["education"].append(" ".join(edu_chunk))

    return data

def main():
    pdf_path = "Profile.pdf"
    try:
        text = extract_text(pdf_path)
        profile_data = parse_profile(text)
        
        with open("profile.json", "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=4)
            
        with open("used_pdf.txt", "w", encoding="utf-8") as f:
            f.write(pdf_path)
            
        print("Done.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
