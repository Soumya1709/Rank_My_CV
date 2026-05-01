import React, { useState } from "react";
import "./Analysis.css";

const Analysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a PDF or DOCX file first.");
      return;
    }

    setLoading(true);
    setReport(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const mediaType = file.type;

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "document",
                    source: { type: "base64", media_type: mediaType, data: base64 },
                  },
                  {
                    type: "text",
                    text: `Job Description:\n${jobDescription}\n\nAnalyze this resume for ATS compatibility against the job description above. Return ONLY a valid JSON object with no markdown, no explanation. Use this exact structure:
{
  "atsScore": <number 0-100>,
  "alignment": "<Strong Alignment | Moderate Alignment | Weak Alignment>",
  "alignmentNote": "<one sentence>",
  "keywordsMatched": <number>,
  "keywordsTotal": <number>,
  "formattingDepth": "<Optimal | Moderate | Poor>",
  "formattingStatus": "<PASSED | NEEDS WORK | FAILED>",
  "softSkillsImpact": "<High | Medium | Low>",
  "criticalRedFlags": <number>,
  "criticalFeedback": [
    { "title": "<issue title>", "description": "<description>", "fix": "<example fix>" }
  ],
  "contentStrength": [
    { "label": "<Contact Information | Section Headings | Education Context | Work Experience | Skills>", "status": "<Full Scannability | Standardized | Matches Requirements | Needs Work | Missing>" }
  ]
}`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        const text = data.content?.map((c) => c.text || "").join("") || "";
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setReport(parsed);
      } catch (err) {
        setError("Failed to analyze resume. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "#6c3fc5";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const circumference = 2 * Math.PI * 45;

  return (
  <div className="analysis-page">
    {!report && !loading && (
      <div className="upload-section">
        <h1>Analysis Report</h1>
        <p>Upload your resume to get an ATS compatibility analysis.</p>
        <div className="upload-box">
          <div className="jd-section">
            <label className="jd-label">Paste the Job Description</label>
            <textarea
              className="jd-textarea"
              placeholder="Paste the job description here to get a tailored ATS analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
            />
          </div>
          <label className="upload-file-label">Upload Your Resume (PDF or DOCX)</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="upload-label">
            {file ? `📄 ${file.name}` : "📁 Click to upload PDF or DOCX"}
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="analyze-btn" onClick={handleAnalyze}>
            Submit
          </button>
        </div>
      </div>
      )}

      {loading && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Analyzing your resume...</p>
        </div>
      )}

      {report && (
        <div className="report-section">
          <h1>Analysis Report</h1>
          <p className="report-subtitle">
            Your resume was analyzed against industry-standard ATS benchmarks.
          </p>

          {/* Score Cards */}
          <div className="score-grid">
            {/* ATS Score Circle */}
            <div className="score-card main-score">
              <svg className="circle-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(report.atsScore)}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - report.atsScore / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="46" textAnchor="middle" className="score-text">
                  {report.atsScore}%
                </text>
                <text x="50" y="60" textAnchor="middle" className="score-label-svg">
                  ATS SCORE
                </text>
              </svg>
              <p className="alignment-title">{report.alignment}</p>
              <p className="alignment-note">{report.alignmentNote}</p>
            </div>

            {/* Keywords */}
            <div className="score-card">
              <div className="card-icon">🔑</div>
              <p className="card-label">Keywords Matched</p>
              <p className="card-value">
                {report.keywordsMatched}/{report.keywordsTotal}
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill blue"
                  style={{ width: `${(report.keywordsMatched / report.keywordsTotal) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Formatting */}
            <div className="score-card">
              <div className="card-icon">📋</div>
              <p className="card-label">Formatting Depth</p>
              <p className="card-value">{report.formattingDepth}</p>
              <span
                className={`badge ${
                  report.formattingStatus === "PASSED" ? "badge-green" : "badge-red"
                }`}
              >
                {report.formattingStatus}
              </span>
            </div>

            {/* Soft Skills */}
            <div className="score-card">
              <div className="card-icon">💡</div>
              <p className="card-label">Soft Skills Impact</p>
              <p className="card-value">{report.softSkillsImpact}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill orange"
                  style={{
                    width:
                      report.softSkillsImpact === "High"
                        ? "90%"
                        : report.softSkillsImpact === "Medium"
                        ? "55%"
                        : "25%",
                  }}
                ></div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="score-card">
              <div className="card-icon">⚠️</div>
              <p className="card-label">Critical Red Flags</p>
              <p className="card-value">{report.criticalRedFlags} Issues</p>
              {report.criticalRedFlags > 0 && (
                <span className="badge badge-red">ACTION REQUIRED</span>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-grid">
            {/* Critical Feedback */}
            <div className="feedback-section">
              <h2>Critical Feedback</h2>
              {report.criticalFeedback.map((item, i) => (
                <div className="feedback-card" key={i}>
                  <div className="feedback-header">
                    <span className="feedback-icon">❌</span>
                    <strong>{item.title}</strong>
                  </div>
                  <p className="feedback-desc">{item.description}</p>
                  {item.fix && (
                    <div className="fix-box">
                      <span className="fix-label">EXAMPLE FIX</span>
                      <p className="fix-text">{item.fix}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Content Strength */}
            <div className="strength-section">
              <h2>Content Strength</h2>
              <div className="strength-list">
                {report.contentStrength.map((item, i) => (
                  <div className="strength-item" key={i}>
                    <span className="strength-check">✅</span>
                    <span className="strength-label">{item.label}</span>
                    <span className="strength-status">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="reanalyze">
            <button
              className="analyze-btn"
              onClick={() => {
                setReport(null);
                setFile(null);
              }}
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;