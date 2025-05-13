import React, { useState } from 'react';

export default function HtmlInputRenderer() {
  const [input, setInput] = useState('');
  const [storedHtml, setStoredHtml] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStoredHtml(input); 
    console.log(setStoredHtml)
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter HTML like <b>Hai</b>"
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Rendered Output:</h3>
      <div dangerouslySetInnerHTML={{ __html: storedHtml }} />
    </div>
  );
}
