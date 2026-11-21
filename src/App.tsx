import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

type ProgramKind = 'prayer' | 'hymn' | 'sacrament' | 'speaker' | 'music'

type MeetingDetails = {
  date: string
  time: string
  location: string
  presiding: string
  conducting: string
  openingPrayer: string
  closingPrayer: string
}

type ProgramItem = {
  id: string
  kind: ProgramKind
  label: string
  person?: string
  detail?: string
}

type PlannerState = {
  meeting: MeetingDetails
  program: ProgramItem[]
}

type IconName =
  | 'calendar'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'copy'
  | 'grip'
  | 'layers'
  | 'map-pin'
  | 'minus'
  | 'more'
  | 'music'
  | 'pen'
  | 'plus'
  | 'printer'
  | 'refresh'
  | 'search'
  | 'sparkle'
  | 'users'
  | 'x'

const STORAGE_KEY = 'mutungo-sacrament-planner-v1'

const initialPlanner: PlannerState = {
  meeting: {
    date: '2026-11-22',
    time: '10:00',
    location: 'Mutungo Ward Meetinghouse',
    presiding: 'Elder David Kato',
    conducting: 'Sister Sarah Namirembe',
    openingPrayer: 'Joshua Ssenyonga',
    closingPrayer: 'Grace Nansubuga',
  },
  program: [
    { id: 'opening-hymn', kind: 'hymn', label: 'Opening Hymn', detail: 'How Great Thou Art · Hymn 86' },
    { id: 'opening-prayer', kind: 'prayer', label: 'Opening Prayer', person: 'Joshua Ssenyonga' },
    { id: 'sacrament', kind: 'sacrament', label: 'Administration of the Sacrament', detail: 'While the sacrament is passed, the congregation may sing quietly.' },
    { id: 'speaker-1', kind: 'speaker', label: 'Speaker', person: 'Miriam Nakitto', detail: 'Finding peace in Jesus Christ' },
    { id: 'music-1', kind: 'music', label: 'Musical Number', person: 'Mutungo Ward Choir', detail: 'I Need Thee Every Hour' },
    { id: 'speaker-2', kind: 'speaker', label: 'Speaker', person: 'Brother Isaac Okello', detail: 'Covenant belonging and service' },
    { id: 'speaker-3', kind: 'speaker', label: 'Speaker', person: 'Sister Ruth Achieng', detail: 'The Savior is our constant guide' },
    { id: 'closing-hymn', kind: 'hymn', label: 'Closing Hymn', detail: 'Come, Come, Ye Saints · Hymn 30' },
    { id: 'closing-prayer', kind: 'prayer', label: 'Closing Prayer', person: 'Grace Nansubuga' },
  ],
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function loadPlanner(): PlannerState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialPlanner
    const parsed = JSON.parse(saved) as PlannerState
    if (!parsed.meeting || !Array.isArray(parsed.program)) return initialPlanner
    return parsed
  } catch {
    return initialPlanner
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function formatTime(time: string) {
  const [hourString, minute] = time.split(':')
  const hour = Number(hourString)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute} ${suffix}`
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const paths: Record<IconName, ReactNode> = {
    calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></>,
    'chevron-down': <path d="m6 9 6 6 6-6" />,
    'chevron-left': <path d="m15 18-6-6 6-6" />,
    'chevron-right': <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    grip: <><circle cx="8" cy="7" r=".7" fill="currentColor" /><circle cx="16" cy="7" r=".7" fill="currentColor" /><circle cx="8" cy="12" r=".7" fill="currentColor" /><circle cx="16" cy="12" r=".7" fill="currentColor" /><circle cx="8" cy="17" r=".7" fill="currentColor" /><circle cx="16" cy="17" r=".7" fill="currentColor" /></>,
    layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" /></>,
    'map-pin': <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>,
    minus: <path d="M5 12h14" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    pen: <><path d="m4 20 4.2-1 10.6-10.6a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20Z" /><path d="m14.5 6.5 3 3" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    printer: <><path d="M6 9V4h12v5M6 17H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2" /><path d="M6 14h12v6H6z" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14-4L4 9" /><path d="M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2" /><path d="M20 20v-5h-5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    sparkle: <><path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3ZM19 16l.5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14.5a4.5 4.5 0 0 1 3.5 4.4" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Field({ label, value, onChange, type = 'text', icon }: { label: string; value: string; onChange: (value: string) => void; type?: string; icon?: IconName }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-input-wrap">
        {icon && <span className="field-icon"><Icon name={icon} size={16} /></span>}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  )
}

function KindPill({ kind }: { kind: ProgramKind }) {
  const labels: Record<ProgramKind, string> = {
    prayer: 'Prayer',
    hymn: 'Hymn',
    sacrament: 'Ordinance',
    speaker: 'Speaking',
    music: 'Music',
  }
  return <span className={`kind-pill kind-${kind}`}>{labels[kind]}</span>
}

function ProgramRow({ item, index, total, onMove, onDelete, onChange }: { item: ProgramItem; index: number; total: number; onMove: (direction: -1 | 1) => void; onDelete: () => void; onChange: (patch: Partial<ProgramItem>) => void }) {
  const isPeopleItem = item.kind === 'speaker' || item.kind === 'music'
  return (
    <article className={`program-row ${item.kind === 'sacrament' ? 'program-row-emphasis' : ''}`}>
      <div className="drag-handle" aria-hidden="true"><Icon name="grip" size={17} /></div>
      <div className="program-number">{String(index + 1).padStart(2, '0')}</div>
      <div className="program-row-content">
        <div className="program-row-heading">
          <div className="program-title-line">
            <KindPill kind={item.kind} />
            <h3>{item.label}</h3>
          </div>
          <div className="row-actions">
            <button className="icon-button" type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move item up"><Icon name="chevron-left" size={16} /></button>
            <button className="icon-button" type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move item down"><Icon name="chevron-right" size={16} /></button>
            <button className="icon-button danger-on-hover" type="button" onClick={onDelete} aria-label={`Remove ${item.label}`}><Icon name="more" size={17} /></button>
          </div>
        </div>
        {item.kind === 'speaker' && (
          <div className="row-fields">
            <label><span>Name</span><input value={item.person ?? ''} onChange={(event) => onChange({ person: event.target.value })} /></label>
            <label><span>Topic or remarks</span><input value={item.detail ?? ''} onChange={(event) => onChange({ detail: event.target.value })} /></label>
          </div>
        )}
        {item.kind === 'music' && (
          <div className="row-fields">
            <label><span>Performers</span><input value={item.person ?? ''} onChange={(event) => onChange({ person: event.target.value })} /></label>
            <label><span>Title</span><input value={item.detail ?? ''} onChange={(event) => onChange({ detail: event.target.value })} /></label>
          </div>
        )}
        {item.kind === 'prayer' && (
          <label className="single-row-field"><span>Offered by</span><input value={item.person ?? ''} onChange={(event) => onChange({ person: event.target.value })} /></label>
        )}
        {item.kind === 'hymn' && (
          <label className="single-row-field"><span>Selection</span><input value={item.detail ?? ''} onChange={(event) => onChange({ detail: event.target.value })} /></label>
        )}
        {item.kind === 'sacrament' && <p className="row-helper">A quiet moment for the congregation to worship and reflect.</p>}
        {isPeopleItem && <span className="edit-hint"><Icon name="pen" size={13} /> Inline editing enabled</span>}
      </div>
    </article>
  )
}

function AddMenu({ type, onClose, onAdd }: { type: 'speaker' | 'music'; onClose: () => void; onAdd: (person: string, detail: string) => void }) {
  const [person, setPerson] = useState('')
  const [detail, setDetail] = useState('')
  const isSpeaker = type === 'speaker'
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!person.trim() || !detail.trim()) return
    onAdd(person.trim(), detail.trim())
  }
  return (
    <form className="add-menu" onSubmit={submit}>
      <div className="add-menu-header"><div><strong>{isSpeaker ? 'Add a speaker' : 'Add a musical number'}</strong><p>{isSpeaker ? 'Keep the topic visible for the conducting leader.' : 'Add the performers and selection title.'}</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button></div>
      <label><span>{isSpeaker ? 'Speaker name' : 'Performers'}</span><input autoFocus value={person} onChange={(event) => setPerson(event.target.value)} placeholder={isSpeaker ? 'e.g. Sister Anna Namuli' : 'e.g. Relief Society choir'} /></label>
      <label><span>{isSpeaker ? 'Topic or remarks' : 'Selection title'}</span><input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder={isSpeaker ? 'e.g. Faith in the Savior' : 'e.g. I Know That My Redeemer Lives'} /></label>
      <div className="add-menu-actions"><button type="button" className="button button-ghost button-small" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary button-small" disabled={!person.trim() || !detail.trim()}><Icon name="plus" size={15} /> Add to program</button></div>
    </form>
  )
}

function PreviewRow({ item }: { item: ProgramItem }) {
  return (
    <div className="preview-row">
      <div className="preview-row-label">{item.label}</div>
      <div className="preview-row-detail">
        {item.kind === 'speaker' && <><strong>{item.person || 'Speaker to be confirmed'}</strong><span>{item.detail || 'Topic to be confirmed'}</span></>}
        {item.kind === 'music' && <><strong>{item.detail || 'Selection to be confirmed'}</strong><span>{item.person || 'Performers to be confirmed'}</span></>}
        {item.kind === 'prayer' && <strong>{item.person || 'To be confirmed'}</strong>}
        {item.kind === 'hymn' && <strong>{item.detail || 'Hymn selection to be confirmed'}</strong>}
        {item.kind === 'sacrament' && <span>{item.detail}</span>}
      </div>
    </div>
  )
}

function Preview({ planner, onBack, onPrint, onCopy }: { planner: PlannerState; onBack: () => void; onPrint: () => void; onCopy: () => void }) {
  return (
    <div className="preview-view">
      <div className="preview-toolbar">
        <div><span className="eyebrow">PRINT PREVIEW</span><h1>Sunday program</h1><p>Review the congregation-facing version before you print.</p></div>
        <div className="preview-toolbar-actions"><button className="button button-ghost" type="button" onClick={onBack}><Icon name="chevron-left" size={16} /> Back to planner</button><button className="button button-ghost" type="button" onClick={onCopy}><Icon name="copy" size={16} /> Copy summary</button><button className="button button-primary" type="button" onClick={onPrint}><Icon name="printer" size={16} /> Print program</button></div>
      </div>
      <div className="paper-wrap">
        <article className="program-paper">
          <div className="paper-accent" />
          <header className="paper-header">
            <div className="paper-mark">MW</div>
            <div><p className="paper-overline">The Church of Jesus Christ of Latter-day Saints</p><h2>Mutungo Ward</h2><p className="paper-subtitle">Sacrament Meeting</p></div>
          </header>
          <div className="paper-rule" />
          <div className="paper-meta">
            <div><span>Date</span><strong>{formatDate(planner.meeting.date)}</strong></div>
            <div><span>Time</span><strong>{formatTime(planner.meeting.time)}</strong></div>
            <div><span>Location</span><strong>{planner.meeting.location}</strong></div>
          </div>
          <div className="paper-leaders"><div><span>Presiding</span><strong>{planner.meeting.presiding}</strong></div><div><span>Conducting</span><strong>{planner.meeting.conducting}</strong></div></div>
          <div className="paper-section-title"><span>Order of service</span><span>{planner.program.length} items</span></div>
          <div className="preview-program">{planner.program.map((item) => <PreviewRow item={item} key={item.id} />)}</div>
          <footer className="paper-footer"><span>Thank you for worshipping with us.</span><span>Mutungo Ward · Kampala Uganda</span></footer>
        </article>
      </div>
    </div>
  )
}

function App() {
  const [planner, setPlanner] = useState<PlannerState>(loadPlanner)
  const [isPreview, setIsPreview] = useState(false)
  const [addMenu, setAddMenu] = useState<'speaker' | 'music' | null>(null)
  const [lastSaved, setLastSaved] = useState('Ready to save')
  const [toast, setToast] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(planner))
    setLastSaved('Saved just now')
  }, [planner])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const orderedSpeakers = useMemo(() => planner.program.filter((item) => item.kind === 'speaker').length, [planner.program])
  const musicCount = useMemo(() => planner.program.filter((item) => item.kind === 'music').length, [planner.program])

  const updateMeeting = (key: keyof MeetingDetails, value: string) => {
    setPlanner((current) => {
      const next: PlannerState = { ...current, meeting: { ...current.meeting, [key]: value } }
      if (key === 'openingPrayer') next.program = current.program.map((item) => item.id === 'opening-prayer' ? { ...item, person: value } : item)
      if (key === 'closingPrayer') next.program = current.program.map((item) => item.id === 'closing-prayer' ? { ...item, person: value } : item)
      return next
    })
  }

  const updateProgramItem = (id: string, patch: Partial<ProgramItem>) => {
    setPlanner((current) => {
      const changed = current.program.find((item) => item.id === id)
      const nextProgram = current.program.map((item) => item.id === id ? { ...item, ...patch } : item)
      const nextMeeting = { ...current.meeting }
      if (changed?.id === 'opening-prayer' && patch.person !== undefined) nextMeeting.openingPrayer = patch.person
      if (changed?.id === 'closing-prayer' && patch.person !== undefined) nextMeeting.closingPrayer = patch.person
      return { meeting: nextMeeting, program: nextProgram }
    })
  }

  const moveItem = (id: string, direction: -1 | 1) => {
    setPlanner((current) => {
      const index = current.program.findIndex((item) => item.id === id)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= current.program.length) return current
      const nextProgram = [...current.program]
      const [moved] = nextProgram.splice(index, 1)
      nextProgram.splice(nextIndex, 0, moved)
      return { ...current, program: nextProgram }
    })
  }

  const removeItem = (id: string) => {
    setPlanner((current) => ({ ...current, program: current.program.filter((item) => item.id !== id) }))
  }

  const addItem = (kind: 'speaker' | 'music', person: string, detail: string) => {
    const item: ProgramItem = kind === 'speaker'
      ? { id: makeId('speaker'), kind, label: 'Speaker', person, detail }
      : { id: makeId('music'), kind, label: 'Musical Number', person, detail }
    setPlanner((current) => ({ ...current, program: [...current.program, item] }))
    setAddMenu(null)
    setToast(`${kind === 'speaker' ? 'Speaker' : 'Musical number'} added to the program.`)
  }

  const handlePrint = () => {
    setIsPreview(true)
    window.setTimeout(() => window.print(), 80)
  }

  const copySummary = async () => {
    const summary = `${formatDate(planner.meeting.date)} · ${formatTime(planner.meeting.time)}\n${planner.meeting.location}\nPresiding: ${planner.meeting.presiding}\nConducting: ${planner.meeting.conducting}\n\n${planner.program.map((item, index) => `${index + 1}. ${item.label} — ${item.person || item.detail || ''}`).join('\n')}`
    try {
      await navigator.clipboard.writeText(summary)
      setToast('Program summary copied to your clipboard.')
    } catch {
      setToast('Copy is unavailable in this browser. You can still print the program.')
    }
  }

  const resetPlanner = () => {
    if (!window.confirm('Reset the planner to the Mutungo Ward sample program?')) return
    setPlanner(initialPlanner)
    setToast('Sample program restored.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark">MW</div><div><span>Mutungo Ward</span><strong>Sacrament planner</strong></div></div>
        <div className="topbar-actions"><span className="save-status"><span className="save-dot" />{lastSaved}</span><button className="button button-primary button-top" type="button" onClick={() => setIsPreview(true)}><Icon name="layers" size={16} /> Preview program</button><button className="avatar" type="button" aria-label="Ward planner profile">PD</button></div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-nav"><span className="sidebar-label">Workspace</span><button className={`nav-item ${!isPreview ? 'active' : ''}`} type="button" onClick={() => setIsPreview(false)}><Icon name="pen" size={17} /><span>Planner</span><span className="nav-badge">{planner.program.length}</span></button><button className={`nav-item ${isPreview ? 'active' : ''}`} type="button" onClick={() => setIsPreview(true)}><Icon name="layers" size={17} /><span>Program preview</span></button></div>
          <div className="sidebar-divider" />
          <div className="sidebar-meeting"><span className="sidebar-label">This Sunday</span><div className="mini-date"><strong>{new Date(`${planner.meeting.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${planner.meeting.date}T12:00:00`))}</span></div><strong className="mini-title">{formatDate(planner.meeting.date).split(',')[0]}</strong><span className="mini-meta"><Icon name="clock" size={14} /> {formatTime(planner.meeting.time)}</span><span className="mini-meta"><Icon name="map-pin" size={14} /> {planner.meeting.location}</span></div>
          <div className="sidebar-footer"><div className="sidebar-tip"><Icon name="sparkle" size={16} /><p><strong>Keep it clear</strong><span>A simple order helps the congregation worship with less distraction.</span></p></div><button className="reset-button" type="button" onClick={resetPlanner}><Icon name="refresh" size={14} /> Restore sample</button></div>
        </aside>
        <main className="main-content">{isPreview ? <Preview planner={planner} onBack={() => setIsPreview(false)} onPrint={handlePrint} onCopy={copySummary} /> : <>
          <div className="page-intro"><div><span className="eyebrow">WARD PROGRAM <span className="eyebrow-slash">/</span> SUNDAY PLAN</span><h1>Prepare a meaningful meeting.</h1><p>Set the details, shape the order, and leave with a program you can trust.</p></div><div className="intro-actions"><span className="plan-progress"><span className="progress-ring"><span>{planner.program.length}</span></span><span><strong>{orderedSpeakers} speakers</strong><small>{musicCount} musical number{musicCount === 1 ? '' : 's'}</small></span></span><button className="button button-ghost" type="button" onClick={handlePrint}><Icon name="printer" size={16} /> Print</button></div></div>
          <div className="editor-grid">
            <div className="editor-column">
              <section className="section-card details-card"><div className="section-heading"><div><span className="section-kicker">01 · Foundations</span><h2>Meeting details</h2><p>Start with the information that anchors the program.</p></div><span className="section-icon"><Icon name="calendar" size={19} /></span></div><div className="field-grid"><Field label="Date" value={planner.meeting.date} onChange={(value) => updateMeeting('date', value)} type="date" icon="calendar" /><Field label="Start time" value={planner.meeting.time} onChange={(value) => updateMeeting('time', value)} type="time" icon="clock" /><Field label="Location" value={planner.meeting.location} onChange={(value) => updateMeeting('location', value)} icon="map-pin" /><Field label="Presiding leader" value={planner.meeting.presiding} onChange={(value) => updateMeeting('presiding', value)} icon="users" /><Field label="Conducting leader" value={planner.meeting.conducting} onChange={(value) => updateMeeting('conducting', value)} icon="users" /></div><div className="prayer-strip"><div className="prayer-strip-title"><span className="mini-icon"><Icon name="sparkle" size={15} /></span><span><strong>Prayers</strong><small>Assign the opening and closing prayers.</small></span></div><div className="prayer-fields"><label><span>Opening</span><input value={planner.meeting.openingPrayer} onChange={(event) => updateMeeting('openingPrayer', event.target.value)} /></label><span className="prayer-arrow">→</span><label><span>Closing</span><input value={planner.meeting.closingPrayer} onChange={(event) => updateMeeting('closingPrayer', event.target.value)} /></label></div></div></section>
              <section className="section-card program-card"><div className="section-heading program-heading"><div><span className="section-kicker">02 · Flow</span><h2>Order of service</h2><p>Move items to shape a calm, easy-to-follow meeting.</p></div><div className="program-heading-meta"><span>{planner.program.length} items</span><Icon name="more" size={17} /></div></div><div className="program-list">{planner.program.map((item, index) => <ProgramRow key={item.id} item={item} index={index} total={planner.program.length} onMove={(direction) => moveItem(item.id, direction)} onDelete={() => removeItem(item.id)} onChange={(patch) => updateProgramItem(item.id, patch)} />)}</div><div className="add-item-area"><div className="add-item-rule" /><div className="add-item-buttons"><button className="button button-outline" type="button" onClick={() => setAddMenu(addMenu === 'speaker' ? null : 'speaker')}><Icon name="plus" size={16} /> Add speaker</button><button className="button button-outline" type="button" onClick={() => setAddMenu(addMenu === 'music' ? null : 'music')}><Icon name="music" size={16} /> Add musical number</button></div>{addMenu && <AddMenu type={addMenu} onClose={() => setAddMenu(null)} onAdd={(person, detail) => addItem(addMenu, person, detail)} />}</div></section>
            </div>
            <aside className="right-column"><section className="side-card side-card-dark"><div className="side-card-top"><span className="side-label">Ready when you are</span><Icon name="sparkle" size={17} /></div><h3>Give the program a final read.</h3><p>Your preview is already formatted for a clean, single-page handout.</p><button className="button button-light" type="button" onClick={() => setIsPreview(true)}>Open preview <Icon name="chevron-right" size={15} /></button></section><section className="side-card"><div className="side-card-heading"><span className="side-label">At a glance</span><Icon name="search" size={16} /></div><div className="glance-row"><span>Meeting length</span><strong>~ 70 min</strong></div><div className="glance-row"><span>Program items</span><strong>{planner.program.length}</strong></div><div className="glance-row"><span>Speakers</span><strong>{orderedSpeakers}</strong></div><div className="glance-row"><span>Music moments</span><strong>{musicCount + 2}</strong></div><div className="side-note"><span className="note-line" /><p>Tip: place a musical number between speakers to create a natural breath in the meeting.</p></div></section><section className="side-card side-card-note"><div className="note-badge">MW</div><div><strong>Mutungo Ward</strong><p>Sunday worship · Kampala Uganda</p></div></section></aside>
          </div>
        </>}</main>
      </div>
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}

export default App
