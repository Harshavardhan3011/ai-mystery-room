import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp,
  Clock3, Fingerprint, Lightbulb, LoaderCircle, LockKeyhole, Search,
  ShieldCheck, Sparkles, Star, Target, WandSparkles, X,
} from "lucide-react";
import api, { getApiError } from "./api.js";

const DIFFICULTIES = [
  { id: "easy", label: "Easy", suspects: 3, clues: 5, hints: 2, detail: "A quick case to warm up" },
  { id: "medium", label: "Medium", suspects: 4, clues: 7, hints: 3, detail: "Read between the lines" },
  { id: "hard", label: "Hard", suspects: 5, clues: 9, hints: 3, detail: "Every detail matters" },
];

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Casefile home">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <Fingerprint size={22} />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-[.18em]">CASEFILE</div>
              <div className="text-[10px] uppercase tracking-[.28em] text-paper/45">AI Mystery Room</div>
            </div>
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-paper/55 sm:flex">
            <ShieldCheck size={14} className="text-emerald-300" /> Every clue has a purpose
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">{children}</main>
      <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-paper/35">
        Follow the evidence. Question everything. © Casefile
      </footer>
    </div>
  );
}

function Eyebrow({ children }) {
  return <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.25em] text-accent">{children}</div>;
}

function Home() {
  return (
    <Shell>
      <section className="grid items-center gap-12 py-6 lg:grid-cols-[1.1fr_.9fr] lg:py-16">
        <div>
          <Eyebrow><span className="h-px w-8 bg-accent" /> Your next case awaits</Eyebrow>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            The truth is<br /><span className="text-accent">never obvious.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-paper/60 sm:text-lg">
            Build a mystery from a single idea. Study the suspects, uncover hidden evidence, and decide who did it before the case goes cold.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/create" className="btn-primary">Open a new case <ArrowRight size={17} /></Link>
            <a href="#how-it-works" className="btn-secondary">How it works <ChevronRight size={16} /></a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-paper/45">
            <span className="flex items-center gap-2"><Sparkles size={14} className="text-accent" /> AI-generated mysteries</span>
            <span className="flex items-center gap-2"><Search size={14} className="text-accent" /> Evidence-driven gameplay</span>
            <span className="flex items-center gap-2"><Target size={14} className="text-accent" /> Score your deduction</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative rotate-1 rounded-2xl border border-white/10 bg-panel p-5 shadow-glow sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><div className="text-[10px] uppercase tracking-[.25em] text-paper/40">Case No. 0081</div><div className="mt-1 font-display text-xl">The Last Train</div></div>
              <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[10px] uppercase tracking-wider text-amber-100">Unsolved</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="evidence-card"><Fingerprint className="text-accent" size={21}/><div className="mt-4 text-sm font-semibold">4 suspects</div><div className="mt-1 text-xs text-paper/45">Everyone has a story</div></div>
              <div className="evidence-card"><Search className="text-accent" size={21}/><div className="mt-4 text-sm font-semibold">7 clues</div><div className="mt-1 text-xs text-paper/45">Not every detail is useful</div></div>
              <div className="col-span-2 rounded-xl border border-dashed border-accent/25 bg-accent/[.04] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-accent"><LockKeyhole size={14}/> Confidential evidence</div>
                <p className="mt-3 text-sm leading-6 text-paper/65">The culprit stays hidden until you make your accusation. No shortcuts. Just deduction.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-paper/40"><span>Investigation status</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300"/> Ready to investigate</span></div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="mt-12 border-t border-white/10 pt-10">
        <Eyebrow><BookOpen size={14}/> The investigator's method</Eyebrow>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["01", "Create the case", "Choose a premise and a difficulty. Your mystery is generated around the idea."],
            ["02", "Follow the evidence", "Investigate suspects, reveal clues, and spend hints only when you need them."],
            ["03", "Make the call", "Accuse one suspect. The final verdict and score reveal how well you reasoned."],
          ].map(([n, title, desc]) => <div key={n} className="rounded-2xl border border-white/10 bg-panel/60 p-6"><div className="font-display text-3xl text-accent/70">{n}</div><h2 className="mt-5 font-display text-xl">{title}</h2><p className="mt-3 text-sm leading-6 text-paper/55">{desc}</p></div>)}
        </div>
      </section>
    </Shell>
  );
}

function CreateMystery() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/cases", { premise: premise.trim(), difficulty });
      navigate(`/case/${data.case.id}`);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <Link to="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link>
      <div className="mx-auto mt-8 max-w-3xl">
        <Eyebrow><WandSparkles size={14}/> Start an investigation</Eyebrow>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">What happened?</h1>
        <p className="mt-4 max-w-2xl leading-7 text-paper/55">Give the case a starting point. It could be a locked-room theft, a suspicious disappearance, or a secret hidden in plain sight.</p>
        <form onSubmit={submit} className="mt-9 space-y-8">
          <div className="rounded-2xl border border-white/10 bg-panel p-5 sm:p-7">
            <label htmlFor="premise" className="field-label">Your mystery premise</label>
            <textarea id="premise" value={premise} onChange={(e) => setPremise(e.target.value)} minLength={8} maxLength={500} required rows={5} placeholder="Example: A rare diamond vanishes from a locked museum room during a thunderstorm..." className="field-input resize-y"/>
            <div className="mt-2 flex justify-between gap-4 text-xs text-paper/35"><span>Be specific enough to spark a story.</span><span>{premise.length}/500</span></div>
          </div>
          <div>
            <div className="field-label mb-3">Choose difficulty</div>
            <div className="grid gap-3 md:grid-cols-3">
              {DIFFICULTIES.map((item) => <button type="button" key={item.id} onClick={() => setDifficulty(item.id)} className={`difficulty-card text-left ${difficulty === item.id ? "difficulty-selected" : ""}`}>
                <div className="flex items-center justify-between"><span className="font-display text-xl">{item.label}</span>{difficulty === item.id && <Check size={17} className="text-accent"/>}</div>
                <p className="mt-2 text-xs text-paper/50">{item.detail}</p>
                <div className="mt-5 space-y-1 text-xs text-paper/60"><div>{item.suspects} suspects</div><div>{item.clues} clues</div><div>{item.hints} hints</div></div>
              </button>)}
            </div>
          </div>
          {error && <ErrorMessage message={error}/>}
          <button className="btn-primary w-full sm:w-auto" disabled={busy || premise.trim().length < 8}>
            {busy ? <><LoaderCircle size={17} className="animate-spin"/> Building your case...</> : <><Sparkles size={17}/> Generate mystery <ArrowRight size={17}/></>}
          </button>
          <p className="text-xs text-paper/35">Generation may take a few seconds. The hidden solution is stored on the server.</p>
        </form>
      </div>
    </Shell>
  );
}

function ErrorMessage({ message }) {
  return <div role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{message}</div>;
}

function CaseRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hint, setHint] = useState(null);

  async function loadCase() {
    try {
      const { data } = await api.get(`/api/cases/${id}`);
      setCaseData(data.case);
      if (data.case.status === "completed") navigate(`/case/${id}/results`, { replace: true });
    } catch (e) { setError(getApiError(e)); }
  }

  useEffect(() => { loadCase(); }, [id]);

  async function discover(clueId) {
    setBusy(true); setError(""); setNotice("");
    try {
      const { data } = await api.post(`/api/cases/${id}/clues/${clueId}/discover`);
      setNotice(`Evidence secured: ${data.clue.title}`);
      await loadCase();
    } catch (e) { setError(getApiError(e)); }
    finally { setBusy(false); }
  }

  async function requestHint() {
    setBusy(true); setError(""); setNotice(""); setHint(null);
    try {
      const { data } = await api.post(`/api/cases/${id}/hints`);
      setHint(data.hint);
      await loadCase();
    } catch (e) { setError(getApiError(e)); }
    finally { setBusy(false); }
  }

  async function accuse(event) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true); setError("");
    try {
      await api.post(`/api/cases/${id}/accuse`, { suspectId: selected });
      navigate(`/case/${id}/results`);
    } catch (e) { setError(getApiError(e)); }
    finally { setBusy(false); }
  }

  if (!caseData && !error) return <Shell><LoadingState text="Opening the case file..."/></Shell>;
  if (!caseData) return <Shell><ErrorMessage message={error}/><Link className="btn-secondary mt-5 inline-flex" to="/create">Create a new case</Link></Shell>;

  const progress = caseData.progress;
  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div><Link to="/" className="back-link"><ArrowLeft size={15}/> Case files</Link><Eyebrow><span className="mt-5 h-px w-8 bg-accent"/> Active investigation</Eyebrow><h1 className="font-display text-3xl font-semibold sm:text-5xl">{caseData.title}</h1><p className="mt-3 max-w-3xl leading-7 text-paper/55">{caseData.story}</p></div>
        <div className="rounded-xl border border-white/10 bg-panel px-4 py-3"><div className="text-[10px] uppercase tracking-[.2em] text-paper/40">Difficulty</div><div className="mt-1 font-semibold capitalize">{caseData.difficulty}</div></div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<Fingerprint size={17}/>} label="Suspects" value={caseData.suspects.length}/>
        <Stat icon={<Search size={17}/>} label="Clues found" value={`${progress.cluesDiscovered}/${caseData.clues.length}`}/>
        <Stat icon={<Lightbulb size={17}/>} label="Hints left" value={progress.hintsRemaining}/>
      </div>

      {error && <div className="mt-6"><ErrorMessage message={error}/></div>}
      {notice && <div role="status" className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{notice}</div>}

      <section className="mt-10">
        <SectionTitle icon={<Fingerprint size={18}/>} title="Persons of interest" subtitle="Every suspect has a story. Find the inconsistencies."/>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {caseData.suspects.map((s, i) => <article key={s.id} className="rounded-2xl border border-white/10 bg-panel p-5">
            <div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 font-display text-lg text-accent">{String(i + 1).padStart(2, "0")}</div><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-paper/45">Suspect</span></div>
            <h3 className="mt-4 font-display text-xl">{s.name}</h3><p className="mt-2 text-sm leading-6 text-paper/55">{s.description}</p>
            <div className="mt-4 border-t border-white/10 pt-4"><div className="text-[10px] uppercase tracking-[.2em] text-accent">Possible motive</div><p className="mt-1 text-sm leading-6 text-paper/65">{s.motive}</p><div className="mt-3 text-[10px] uppercase tracking-[.2em] text-paper/40">Alibi</div><p className="mt-1 text-sm leading-6 text-paper/65">{s.alibi}</p></div>
          </article>)}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle icon={<Search size={18}/>} title="Evidence locker" subtitle="Discover evidence to add it to your investigation record."/>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {caseData.clues.map((clue, i) => <article key={clue.id} className="rounded-xl border border-white/10 bg-panel/70 p-4">
            <div className="flex items-start gap-3">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${clue.discovered ? "bg-emerald-300/10 text-emerald-200" : "bg-white/5 text-paper/40"}`}>{clue.discovered ? <Check size={17}/> : <LockKeyhole size={16}/>}</div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{clue.title}</h3><span className="text-[10px] uppercase tracking-wider text-paper/40">{clue.discovered ? "Discovered · +5" : "Undiscovered"}</span></div>
                {clue.discovered ? <><p className="mt-2 text-sm leading-6 text-paper/65">{clue.description}</p><p className="mt-2 border-l-2 border-accent/50 pl-3 text-sm italic leading-6 text-paper/50">{clue.evidence}</p></> : <button disabled={busy} onClick={() => discover(clue.id)} className="mt-3 text-sm font-semibold text-accent hover:text-amber-200 disabled:opacity-50">Examine evidence <ArrowRight size={14} className="ml-1 inline"/></button>}
              </div>
            </div>
          </article>)}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-2xl border border-accent/20 bg-accent/[.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-accent"><Lightbulb size={18}/><h2 className="font-display text-xl">Ask for a hint</h2></div>
          <p className="mt-3 text-sm leading-6 text-paper/55">Hints can nudge you in the right direction, but each one costs 10 points.</p>
          <button disabled={busy || progress.hintsRemaining <= 0} onClick={requestHint} className="btn-secondary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40">{busy ? <LoaderCircle size={16} className="animate-spin"/> : <CircleHelp size={16}/>} Request hint ({progress.hintsRemaining} left)</button>
          {hint && <div className="mt-4 rounded-xl border border-accent/20 bg-ink/50 p-4"><div className="text-[10px] uppercase tracking-[.2em] text-accent">Investigator's note</div><p className="mt-2 text-sm leading-6">{hint.text}</p></div>}
        </div>
        <form onSubmit={accuse} className="rounded-2xl border border-white/10 bg-panel p-5 sm:p-6">
          <div className="flex items-center gap-2 text-accent"><Target size={18}/><h2 className="font-display text-xl">Make your accusation</h2></div>
          <p className="mt-3 text-sm leading-6 text-paper/55">Choose carefully. This is your final accusation for this case.</p>
          <div className="mt-4 space-y-2">
            {caseData.suspects.map((s) => <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${selected === s.id ? "border-accent/60 bg-accent/[.08]" : "border-white/10 hover:border-white/25"}`}>
              <input type="radio" name="suspect" value={s.id} checked={selected === s.id} onChange={() => setSelected(s.id)} className="accent-amber-400"/>
              <span className="flex-1 text-sm font-medium">{s.name}</span>{selected === s.id && <Check size={16} className="text-accent"/>}
            </label>)}
          </div>
          <button disabled={busy || !selected} className="btn-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40">{busy ? <LoaderCircle size={16} className="animate-spin"/> : <Target size={16}/>} Submit accusation</button>
          <p className="mt-3 text-center text-xs text-paper/35">The verdict reveals the solution.</p>
        </form>
      </section>
    </Shell>
  );
}

function Stat({ icon, label, value }) {
  return <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-panel/70 p-4"><div className="text-accent">{icon}</div><div><div className="text-xs text-paper/45">{label}</div><div className="mt-1 font-display text-2xl">{value}</div></div></div>;
}

function SectionTitle({ icon, title, subtitle }) {
  return <div className="flex items-start gap-3"><div className="mt-1 text-accent">{icon}</div><div><h2 className="font-display text-2xl">{title}</h2><p className="mt-1 text-sm text-paper/45">{subtitle}</p></div></div>;
}

function LoadingState({ text }) {
  return <div className="grid min-h-[40vh] place-items-center"><div className="text-center"><LoaderCircle size={32} className="mx-auto animate-spin text-accent"/><p className="mt-4 text-sm text-paper/55">{text}</p></div></div>;
}

function Results() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get(`/api/cases/${id}/result`).then(({ data }) => setResult(data.result)).catch((e) => setError(getApiError(e)));
  }, [id]);

  if (!result && !error) return <Shell><LoadingState text="Reconstructing the final timeline..."/></Shell>;
  return (
    <Shell>
      <div className="mx-auto max-w-3xl py-5 text-center sm:py-12">
        {error ? <><ErrorMessage message={error}/><Link to={`/case/${id}`} className="btn-secondary mt-6 inline-flex">Return to investigation</Link></> : <>
          <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full border ${result.isCorrect ? "border-emerald-200/30 bg-emerald-200/10 text-emerald-200" : "border-rose-200/30 bg-rose-200/10 text-rose-200"}`}>{result.isCorrect ? <Check size={34}/> : <X size={34}/>}</div>
          <Eyebrow><span className="h-px w-8 bg-accent"/> Case closed</Eyebrow>
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">{result.isCorrect ? "Sharp deduction." : "The trail went cold."}</h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-paper/55">{result.isCorrect ? "You identified the culprit. The evidence held up." : "Your accusation was incorrect. Review the evidence and learn what you missed."}</p>
          <div className="mt-9 rounded-2xl border border-white/10 bg-panel p-6 text-left sm:p-8">
            <div className="text-[10px] uppercase tracking-[.25em] text-paper/40">The culprit was</div>
            <h2 className="mt-2 font-display text-3xl text-accent">{result.culpritName}</h2>
            <p className="mt-5 leading-7 text-paper/70">{result.explanation}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <ScoreItem label="Base points" value={`+${result.score.basePoints}`}/>
              <ScoreItem label="Clue points" value={`+${result.score.cluePoints}`}/>
              <ScoreItem label="Hint deductions" value={`−${result.score.hintPenalty}`}/>
              <div className="rounded-xl border border-accent/25 bg-accent/[.08] p-4"><div className="text-xs text-paper/50">Final score</div><div className="mt-1 font-display text-3xl text-accent">{result.score.finalScore}</div></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/create" className="btn-primary">Solve another case <ArrowRight size={16}/></Link><Link to="/" className="btn-secondary">Back home</Link></div>
        </>}
      </div>
    </Shell>
  );
}

function ScoreItem({ label, value }) {
  return <div className="rounded-xl border border-white/10 p-4"><div className="text-xs text-paper/45">{label}</div><div className="mt-1 font-display text-2xl">{value}</div></div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/create" element={<CreateMystery/>}/>
    <Route path="/case/:id" element={<CaseRoom/>}/>
    <Route path="/case/:id/results" element={<Results/>}/>
    <Route path="*" element={<Shell><div className="py-20 text-center"><h1 className="font-display text-4xl">Case not found</h1><Link to="/" className="btn-primary mt-6 inline-flex">Return home</Link></div></Shell>}/>
  </Routes>;
}
