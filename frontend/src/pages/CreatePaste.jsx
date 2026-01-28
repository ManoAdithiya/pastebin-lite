import { useState } from "react";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:3000/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setUrl(data.url);
  };

  return (
    <>
      <div className="container mt-5">
        <textarea
          className="text-center text-primary"
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-success" onClick={submit}>
          Create
        </button>
        {url && <a href={url}>{url}</a>}
      </div>
    </>
  );
}
