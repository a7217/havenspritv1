"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

const STATE_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Tirupati", "Rajahmundry", "Kadapa", "Anantapur", "Eluru", "Ongole", "Vizianagaram", "Srikakulam", "Chittoor"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Namsai", "Bomdila", "Ziro", "Aalo", "Tezu", "Khonsa"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "North Lakhimpur", "Karimganj", "Sivasagar", "Goalpara"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Araria", "Kishanganj", "Sitamarhi", "Nalanda", "Vaishali", "Samastipur", "Begusarai", "Chapra", "Motihari", "Hajipur", "Munger", "Saharsa", "Madhepura", "Supaul", "Katihar", "Purnia", "Bettiah", "Siwan", "Aurangabad", "Nawada", "Jamui", "Banka", "Sheikhpura", "Lakhisarai", "Khagaria", "Madhubani", "Gopalganj", "Rohtas", "Buxar", "Jehanabad", "Arwal", "Saran", "Bhojpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Dhamtari"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Nadiad", "Morbi", "Mehsana", "Bharuch", "Navsari", "Valsad"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Rewari", "Kaithal"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamsala", "Palampur", "Baddi", "Nahan", "Kullu", "Chamba", "Una", "Hamirpur", "Bilaspur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribag", "Giridih", "Ramgarh", "Medininagar", "Chaibasa", "Dumka"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Vijayapura", "Davanagere", "Ballari", "Tumkur", "Shivamogga", "Hassan", "Udupi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod", "Kottayam", "Idukki", "Pathanamthitta", "Wayanad"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Chhindwara", "Mandsaur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Kalyan", "Vasai-Virar", "Navi Mumbai", "Kolhapur", "Amravati", "Nanded", "Sangli", "Jalgaon", "Akola"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Senapati", "Tamenglong", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Koraput"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sri Ganganagar", "Sikar", "Pali", "Barmer", "Tonk", "Churu"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Jorethang"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukkudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad", "Meerut", "Prayagraj", "Noida", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Jhansi", "Mathura", "Firozabad", "Muzaffarnagar", "Rampur", "Ayodhya", "Shahjahanpur", "Azamgarh", "Bahraich", "Mau", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Unnao", "Gonda", "Lakhimpur Kheri"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Almora", "Nainital", "Mussoorie"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Bardhaman", "Malda", "Baharampur", "Hugli-Chinsura", "Raiganj", "Jalpaiguri", "Kharagpur", "Shantipur", "Darjeeling"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Janakpuri", "Laxmi Nagar", "Preet Vihar", "Saket", "Vasant Kunj", "Pitampura", "Shahdara", "Narela", "Mehrauli"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Rajouri", "Pulwama", "Kupwara"],
  "Ladakh": ["Leh", "Kargil", "Diskit", "Padum"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Andaman & Nicobar Islands": ["Port Blair", "Diglipur", "Rangat", "Car Nicobar"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott"],
  "Dadra & Nagar Haveli": ["Silvassa", "Amli", "Khanvel"],
  "Daman & Diu": ["Daman", "Diu"],
};

const STEPS = ["Personal Info", "Qualifications", "Documents"];
const DRAFT_KEY = "applyFormDraft";

type FileState = { file: File | null; dragging: boolean };
type JobInfo   = { _id: string; title: string; project: string; department?: string; location?: string };

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return "Only PDF, JPG and PNG files are allowed.";
  if (file.size > MAX_FILE_SIZE) return `File "${file.name}" exceeds the 5 MB limit.`;
  return null;
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res  = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "File upload failed.");
  return data.url;
}

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

export default function ApplyPage() {
  const params  = useParams();
  const router  = useRouter();
  const rawId   = params.id as string;

  const [job, setJob] = useState<JobInfo | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/jobs/public/${rawId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setJob({
            _id:        d.data._id,
            title:      d.data.title,
            project:    d.data.project    || "",
            department: d.data.department || "",
            location:   d.data.location   || "",
          });
        } else {
          setJob(null);
        }
      })
      .catch(() => setJob(null));
  }, [rawId]);

  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting,setSubmitting]= useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stepError,   setStepError]   = useState("");
  const [draftSaved,  setDraftSaved]  = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<"idle"|"loading"|"found"|"error">("idle");

  const emptyForm = {
    fullName: "", fatherName: "", mobile: "", email: "",
    dob: "", aadhaar: "", address: "", state: "",
    city: "", pinCode: "", qualification: "", experience: "0", employer: "",
    additionalCertificate: "", preferredDistrict: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [preferredBlocks, setPreferredBlocks] = useState(["", "", "", "", ""]);

  const [resume,  setResume]  = useState<FileState>({ file: null, dragging: false });
  const [idProof, setIdProof] = useState<FileState>({ file: null, dragging: false });
  const [photo,   setPhoto]   = useState<FileState>({ file: null, dragging: false });

  const resumeRef = useRef<HTMLInputElement>(null);
  const idRef     = useRef<HTMLInputElement>(null);
  const photoRef  = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleStateChange = (state: string) => {
    setForm((f) => ({ ...f, state, city: "" }));
  };

  const handlePincodeChange = async (value: string) => {
    const digits = value.replace(/\D/g, "");
    setForm((f) => ({ ...f, pinCode: digits }));
    if (digits.length !== 6) {
      setPincodeStatus("idle");
      return;
    }
    setPincodeStatus("loading");
    try {
      const res  = await fetch(`https://api.postalpincode.in/pincode/${digits}`);
      const data = await res.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po        = data[0].PostOffice[0];
        const apiState  = po.State  as string;
        const apiCity   = po.District as string;
        const matchedState = Object.keys(STATE_CITIES).find(
          (s) => s.toLowerCase() === apiState.toLowerCase()
        ) || apiState;
        setForm((f) => ({ ...f, state: matchedState, city: apiCity }));
        setPincodeStatus("found");
      } else {
        setPincodeStatus("error");
      }
    } catch {
      setPincodeStatus("error");
    }
  };

  const isEducation = !!(job && job.department?.toLowerCase().includes("education"));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY + "_" + rawId);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.preferredBlocks) setPreferredBlocks(parsed.preferredBlocks);
      }
    } catch { /* ignore */ }
  }, [rawId]);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY + "_" + rawId, JSON.stringify({ form, preferredBlocks }));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch { /* ignore */ }
  }, [form, preferredBlocks, rawId]);

  const handleDrop = (e: React.DragEvent, setter: React.Dispatch<React.SetStateAction<FileState>>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setStepError(err); return; }
    setter({ file, dragging: false });
  };

  const validateStep = (): boolean => {
    setStepError("");
    if (step === 0) {
      if (!form.fullName.trim()) { setStepError("Full Name is required."); return false; }
      if (!form.email || !EMAIL_RE.test(form.email)) { setStepError("Enter a valid email address."); return false; }
      if (!form.mobile || !MOBILE_RE.test(form.mobile)) { setStepError("Enter a valid 10-digit mobile number starting with 6-9."); return false; }
      if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) { setStepError("Aadhaar must be exactly 12 digits."); return false; }
      if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) { setStepError("PIN code must be exactly 6 digits."); return false; }
    }
    if (step === 1) {
      if (!form.qualification) { setStepError("Please select your highest qualification."); return false; }
      if (isEducation) {
        if (!form.experience || form.experience === "0") { setStepError("Please select your experience."); return false; }
        if (!form.preferredDistrict.trim()) { setStepError("Preferred Job Location (District Name) is required."); return false; }
        if (!preferredBlocks[0].trim()) { setStepError("At least one Preferred Block Name is required."); return false; }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStepError("");
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!job) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      let resumeUrl  = "";
      let idProofUrl = "";
      let photoUrl   = "";

      if (resume.file)  resumeUrl  = await uploadFile(resume.file);
      if (idProof.file) idProofUrl = await uploadFile(idProof.file);
      if (photo.file)   photoUrl   = await uploadFile(photo.file);

      const tender = job.project?.trim() || job.department || "General";

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId:    job._id,
          jobTitle: job.title,
          tender,
          ...form,
          experience: Math.max(0, Number(form.experience) || 0),
          resumeUrl,
          idProofUrl,
          photoUrl,
          additionalCertificate: form.additionalCertificate || "",
          preferredDistrict:     form.preferredDistrict     || "",
          preferredBlocks:       preferredBlocks.filter((b) => b.trim()),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed.");

      localStorage.removeItem(DRAFT_KEY + "_" + rawId);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const DropZone = ({
    label, state, setter, inputRef, accept,
  }: {
    label: string;
    state: FileState;
    setter: React.Dispatch<React.SetStateAction<FileState>>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    accept: string;
  }) => (
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-700 mb-1 leading-tight">{label}</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setter((s) => ({ ...s, dragging: true })); }}
        onDragLeave={() => setter((s) => ({ ...s, dragging: false }))}
        onDrop={(e) => handleDrop(e, setter)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-2 sm:p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors min-h-[100px] ${
          state.dragging ? "border-[#f59e0b] bg-amber-50" : "border-gray-300 bg-gray-50 hover:border-[#1a2744]"
        }`}
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" fill="none" viewBox="0 0 48 48">
          <rect x="8" y="4" width="32" height="40" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <path d="M16 28l8-8 8 8M24 20v14" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {state.file ? (
          <p className="text-[10px] text-green-600 font-medium text-center break-all line-clamp-2">{state.file.name}</p>
        ) : (
          <>
            <p className="text-[10px] text-gray-500 text-center">Tap to upload</p>
            <p className="text-[9px] text-gray-400 text-center">PDF / JPG / PNG &bull; Max 5 MB</p>
          </>
        )}
        <div className="w-full bg-gray-200 rounded-full h-0.5">
          <div className={`bg-[#f59e0b] h-0.5 rounded-full transition-all ${state.file ? "w-full" : "w-0"}`} />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const err = validateFile(f);
          if (err) { setStepError(err); e.target.value = ""; return; }
          setter({ file: f, dragging: false });
        }}
      />
    </div>
  );

  if (job === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#f59e0b] rounded-full animate-spin" />
      </div>
    );
  }
  if (job === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-500 text-lg mb-4">Job not found or no longer available.</p>
          <button onClick={() => router.push("/jobs")} className="bg-[#1a2744] text-white px-6 py-3 rounded font-semibold">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar activePage="jobs" />
        <div className="max-w-lg mx-auto mt-12 sm:mt-16 text-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your application for <span className="font-semibold text-[#1a2744]">{job.title}</span> has been submitted successfully. We will contact you soon.
            </p>
            <button
              onClick={() => router.push("/jobs")}
              className="bg-[#1a2744] hover:bg-[#243560] text-white font-semibold px-6 py-3 rounded transition-colors min-h-[44px] w-full sm:w-auto"
            >
              Back to Job Listings
            </button>
          </div>
        </div>
        <ContactFooter />
      </div>
    );
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-3 text-gray-700 outline-none focus:border-[#1a2744] focus:ring-1 focus:ring-[#1a2744] bg-white transition-colors";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="jobs" />

      <div className="max-w-3xl mx-auto px-4 py-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Application Progress</p>

        <div className="flex mb-5">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 relative" style={{ zIndex: STEPS.length - i }}>
              <div
                className={`w-full py-3 px-2 text-center font-semibold transition-colors ${
                  i === step ? "bg-[#f59e0b] text-white" : i < step ? "bg-[#1a2744] text-white" : "bg-gray-200 text-gray-500"
                }`}
                style={{
                  clipPath:
                    i < STEPS.length - 1
                      ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)",
                  marginLeft: i === 0 ? 0 : "-8px",
                }}
              >
                <span className="text-[10px] sm:text-xs font-semibold">
                  Step {i + 1}: {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase mb-5 leading-snug">
            Application: <span className="text-[#1a2744]">{job.title}</span>
          </h3>

          {step === 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-[#1a2744] mb-4 text-sm pb-2 border-b-2 border-[#f59e0b]">
                Section 1: Personal Details
              </h4>
              <div>
                <label className={labelCls}>Full Name *</label>
                <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Full Name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Father / Guardian Name</label>
                <input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} placeholder="Father / Guardian Name" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <div className="flex">
                    <span className="border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 bg-gray-50 text-gray-600 text-sm flex items-center">+91</span>
                    <input
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      className="flex-1 min-w-0 border border-gray-300 rounded-r-lg px-3 py-3 text-gray-700 outline-none focus:border-[#1a2744] bg-white"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email Address" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Card Number</label>
                  <input
                    value={form.aadhaar}
                    onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))}
                    placeholder="12-digit Aadhaar"
                    className={inputCls}
                    maxLength={12}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>PIN Code</label>
                <div className="relative">
                  <input
                    value={form.pinCode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="Enter 6-digit PIN code to auto-fill city & state"
                    className={`${inputCls} pr-28`}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium pointer-events-none">
                    {pincodeStatus === "loading" && (
                      <span className="text-gray-400 flex items-center gap-1">
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Searching…
                      </span>
                    )}
                    {pincodeStatus === "found" && <span className="text-green-600">✓ Auto-filled</span>}
                    {pincodeStatus === "error" && <span className="text-red-500">Not found</span>}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>State</label>
                  <select value={form.state} onChange={(e) => handleStateChange(e.target.value)} className={inputCls}>
                    <option value="">Select State</option>
                    {Object.keys(STATE_CITIES).sort().map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>City / District</label>
                  {form.state && STATE_CITIES[form.state] ? (
                    <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
                      <option value="">Select City / District</option>
                      {STATE_CITIES[form.state].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder={form.state ? "Type city name" : "Select state first"}
                      className={inputCls}
                      disabled={!form.state}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>{isEducation ? "Full Address" : "Residential Address"}</label>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={3}
                  placeholder={isEducation ? "Village/Town, Post Office, PIN Code..." : "Full residential address"}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-[#1a2744] mb-4 text-sm pb-2 border-b-2 border-[#f59e0b]">
                Section 2: Qualification &amp; Experience
              </h4>
              <div>
                <label className={labelCls}>Highest Qualification *</label>
                <select value={form.qualification} onChange={(e) => set("qualification", e.target.value)} className={inputCls}>
                  <option value="">Select Qualification</option>
                  {["10th", "12th", "ITI", "Diploma", "B.Tech / B.E.", "M.Tech / M.E.", "B.Sc", "M.Sc", "MBA", "MCA", "PhD", "Other"].map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </div>

              {isEducation ? (
                <div>
                  <label className={labelCls}>Additional Certificate (if any)</label>
                  <input
                    value={form.additionalCertificate}
                    onChange={(e) => set("additionalCertificate", e.target.value)}
                    placeholder="e.g. CCC, DCA, Tally, etc."
                    className={inputCls}
                  />
                </div>
              ) : null}

              <div>
                {isEducation ? (
                  <>
                    <label className={labelCls}>Experience *</label>
                    <select
                      value={form.experience}
                      onChange={(e) => set("experience", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">-- Select --</option>
                      <option value="0">Fresher (No Experience)</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                      <option value="5">5 Years</option>
                      <option value="6">6–8 Years</option>
                      <option value="9">9–10 Years</option>
                      <option value="11">More than 10 Years</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label className={labelCls}>Total Experience (Years)</label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={form.experience}
                      onChange={(e) => set("experience", e.target.value)}
                      className={inputCls}
                    />
                  </>
                )}
              </div>

              {isEducation ? (
                <>
                  <div>
                    <label className={labelCls}>Preferred Job Location (District Name) *</label>
                    <input
                      value={form.preferredDistrict}
                      onChange={(e) => set("preferredDistrict", e.target.value)}
                      placeholder="Enter your preferred district name e.g. Patna"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      Preferred Block Names{" "}
                      <span className="font-normal text-gray-500">(Minimum 1, Maximum 5) *</span>
                    </label>
                    <div className="space-y-2">
                      {preferredBlocks.map((val, idx) => (
                        <input
                          key={idx}
                          value={val}
                          onChange={(e) => {
                            const updated = [...preferredBlocks];
                            updated[idx] = e.target.value;
                            setPreferredBlocks(updated);
                          }}
                          placeholder={idx === 0 ? "Block 1 *" : `Block ${idx + 1} (optional)`}
                          className={inputCls}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Enter the block names where you want to work.</p>
                  </div>
                </>
              ) : (
                <div>
                  <label className={labelCls}>Current / Last Employer</label>
                  <input value={form.employer} onChange={(e) => set("employer", e.target.value)} placeholder="Company / Organisation Name" className={inputCls} />
                </div>
              )}

              {isEducation && (
                <div>
                  <label className={labelCls}>Current / Last Employer</label>
                  <input value={form.employer} onChange={(e) => set("employer", e.target.value)} placeholder="Company / Organisation Name" className={inputCls} />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="font-bold text-[#1a2744] mb-3 text-sm pb-2 border-b-2 border-[#f59e0b]">
                Section 3: Document Upload{" "}
                <span className="text-gray-400 font-normal text-xs">(PDF, JPG, PNG · Max 5 MB each)</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <DropZone label="Resume / CV"    state={resume}  setter={setResume}  inputRef={resumeRef} accept=".pdf,.jpg,.jpeg,.png" />
                <DropZone label="ID Proof"       state={idProof} setter={setIdProof} inputRef={idRef}     accept=".pdf,.jpg,.jpeg,.png" />
                <DropZone label="Passport Photo" state={photo}   setter={setPhoto}   inputRef={photoRef}  accept=".jpg,.jpeg,.png" />
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs font-medium">{submitError}</p>
                </div>
              )}
            </div>
          )}

          {stepError && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-xs font-medium">{stepError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={handleBack}
                disabled={submitting}
                className="sm:flex-none bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 font-semibold px-5 py-3.5 rounded-lg transition-colors text-sm min-h-[48px] disabled:opacity-60"
              >
                ← Back
              </button>
            )}
            <button
              onClick={saveDraft}
              disabled={submitting}
              className="sm:flex-none bg-white border-2 border-[#1a2744] hover:bg-[#1a2744] hover:text-white text-[#1a2744] font-semibold px-5 py-3.5 rounded-lg transition-colors text-sm min-h-[48px] disabled:opacity-60"
            >
              {draftSaved ? "✓ Draft Saved" : "Save Draft"}
            </button>
            <div className="flex-1" />
            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold uppercase px-6 py-3.5 rounded-lg transition-colors text-sm min-h-[48px]"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase px-6 py-3.5 rounded-lg transition-colors text-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
