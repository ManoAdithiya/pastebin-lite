import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewPaste() {
  const { id } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/pastes/${id}`)
      .then(r => r.json())
      .then(d => setContent(d.content));
  }, []);

  return <pre>{content}</pre>;
}
