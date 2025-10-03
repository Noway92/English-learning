import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Vocabulary() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setWords(data);
    };
    fetchWords();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mon vocabulaire</h1>
      <ul className="space-y-2">
        {words.map((w) => (
          <li key={w.id} className="border rounded p-2 flex justify-between">
            <span>
              <span className="font-semibold">{w.english}</span> → {w.french}
            </span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                w.understanding === "perfect"
                  ? "bg-green-200 text-green-800"
                  : w.understanding === "medium"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {w.understanding}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
