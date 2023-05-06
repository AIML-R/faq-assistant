import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await axios.post('/chatbot', { message });
    setAnswer(response.data.answer);
    setMessage('');
  }

  return (
    <div>
      <h1>FAQ Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-input">Enter your message:</label><br />
        <input type="text" id="message-input" name="message" value={message} onChange={(event) => setMessage(event.target.value)} /><br /><br />
        <button type="submit">Submit</button>
      </form>
      {answer && <div>{answer}</div>}
    </div>
  );
}

export default App;
