import { useState, useEffect } from "react";
import { submitApplication } from "../../services/careerService";

const ApplicationModal = ({ roles, preselectedRoleId, onClose }) => {
  const [selectedRoleId, setSelectedRoleId] = useState(preselectedRoleId || "");
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const selectedRole = roles.find((r) => r._id === selectedRoleId);
  const questions = selectedRole
    ? [...(selectedRole.questions || [])].sort((a, b) => a.questionOrder - b.questionOrder)
    : [];

  useEffect(() => {
    setAnswers({});
    setFiles({});
  }, [selectedRoleId]);

  const handleTextChange = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const handleFileChange = (label, file) => {
    setFiles((prev) => ({ ...prev, [label]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) {
      setError("Please select a role.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("roleId", selectedRoleId);

      const answerPayload = questions.map((q) => ({
        label: q.label,
        fieldType: q.fieldType,
        value: q.fieldType === "file" ? "" : (answers[q.label] || ""),
      }));
      formData.append("answers", JSON.stringify(answerPayload));

      questions.forEach((q) => {
        if (q.fieldType === "file" && files[q.label]) {
          formData.append(q.label, files[q.label]);
        }
      });

      await submitApplication(formData);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-xl max-w-xl w-full border border-gray-700 shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Apply Now</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: "75vh" }}>
          {submitted ? (
            <div className="text-center py-10">
              <p className="text-[#86BA3A] text-lg font-medium">Application submitted successfully!</p>
              <p className="text-gray-400 mt-2 text-sm">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">


              {questions.map((q) => (
                <div key={q.label}>
                  <label className="block text-sm text-gray-300 mb-1">
                    {q.label} {q.required && "*"}
                  </label>
                  {q.helpText && <p className="text-xs text-gray-500 mb-1">{q.helpText}</p>}
                  {q.fieldType === "textarea" ? (
                    <textarea
                      required={q.required}
                      value={answers[q.label] || ""}
                      onChange={(e) => handleTextChange(q.label, e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-[#86BA3A] focus:outline-none"
                    />
                  ) : q.fieldType === "file" ? (
                    <input
                      type="file"
                      accept="application/pdf"
                      required={q.required}
                      onChange={(e) => handleFileChange(q.label, e.target.files[0])}
                      className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#86BA3A]/20 file:text-[#86BA3A]"
                    />
                  ) : q.fieldType === "select" ? (
                    <select
                      required={q.required}
                      value={answers[q.label] || ""}
                      onChange={(e) => handleTextChange(q.label, e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-[#86BA3A] focus:outline-none"
                    >
                      <option value="">Select an option</option>
                      {(q.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={q.fieldType === "email" ? "email" : q.fieldType === "phone" ? "tel" : q.fieldType === "url" ? "url" : "text"}
                      required={q.required}
                      value={answers[q.label] || ""}
                      onChange={(e) => handleTextChange(q.label, e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-[#86BA3A] focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#86BA3A] text-white py-2.5 rounded-lg font-medium hover:bg-[#75a32f] transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
