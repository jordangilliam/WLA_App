export default function Media(){
  return (
    <section className="section">
      <h1>Media Cheat Sheet</h1>
      <div className="row">
        <div className="card section">
          <h3>Exposure Triangle</h3>
          <ul><li>Aperture (f-stop)</li><li>Shutter speed</li><li>ISO</li></ul>
        </div>
        <div className="card section">
          <h3>Shot Types</h3>
          <ul><li>ECU, CU, MS, WS, Establishing</li><li>Use an establishing shot to widen connection</li><li>Collect B-roll</li></ul>
        </div>
      </div>
      <div className="row">
        <div className="card section"><h3>Shot List</h3><pre>{`# Scene / Location
- Shot: type, lens, action
- Audio: nat sound / VO
- Notes:`}</pre></div>
        <div className="card section"><h3>Video Treatment</h3><pre>{`Title:
Logline:
Audience:
Look & Feel:
Beats:`}</pre></div>
        <div className="card section"><h3>Storyboard</h3><pre>{`Panel 1: sketch / notes
Panel 2: sketch / notes
Panel 3: sketch / notes`}</pre></div>
      </div>
    </section>
  );
}
