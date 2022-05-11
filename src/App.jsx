import React from 'react';
import './App.css';
import axios from 'axios';


const App = () => {
  const getPrompt = async () => {
    const data = {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const response = await axios({
      url: "https://api.openai.com/v1/engines/text-curie-001/completions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GATSBY_OPENAI_TOKEN}`,
      },
      data: JSON.stringify(data)
    });

    console.log(response.data.choices[0].text)
  };
  
  
  return (
    <main>
      Hello
      <button 
        name="Hello"
        style={{
          color: "red",
          width: "100px",
          height: "30px"
        }}
        onClick={getPrompt}
      >
        Test
      </button>
    </main>
  );
}

export default App;