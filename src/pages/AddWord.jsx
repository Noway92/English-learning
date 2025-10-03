import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddWord() {
  const [english, setEnglish] = useState("");
  const [french, setFrench] = useState("");
  const [understanding, setUnderstanding] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("vocabulary")
      .insert([{ english, french, understanding }]);
    if (error) console.error(error);
    else {
      setEnglish("");
      setFrench("");
      setUnderstanding("medium");
      alert("Mot ajouté !");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Ajouter un mot</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="Mot en anglais"
          className="border p-2 rounded"
        />
        <input
          value={french}
          onChange={(e) => setFrench(e.target.value)}
          placeholder="Traduction française"
          className="border p-2 rounded"
        />
        <select
          value={understanding}
          onChange={(e) => setUnderstanding(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="perfect">Perfect</option>
          <option value="medium">Medium</option>
          <option value="bad">Bad</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white rounded p-2">
          Ajouter
        </button>
      </form>
    </div>
  );
}
