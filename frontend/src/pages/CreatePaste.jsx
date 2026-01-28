import { useState } from "react";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("https://pastebin-lite-f3uh.onrender.com/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <h3 className="text-center mb-3">Create Paste</h3>

          <form onSubmit={submit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="5"
                placeholder="Enter your text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </form>

          {url && (
            <div className="alert alert-info mt-3 text-center">
              <a href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
