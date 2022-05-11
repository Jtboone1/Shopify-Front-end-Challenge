import * as React from "react";
import { useState, useEffect } from "react";
import * as CSS from "./App.module.css";
import axios from 'axios';

// Submission for the Shopify Front-End Intern Challenge (Fall 2022)
// Name: Jarrod Boone
//
// This is just a simple interface where you can interact with OPENAI (https://openai.com/).
// It takes in the user input, and then calls the OPENAI API to return the engines response.
//
// For the added features, I included an option to select which different type of engine you could use,
// as well as adding local storage so that the prompts stay even after reloading the page.

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [promptList, setPromptList] = useState([]);
  const [engine, setEngine] = useState("text-curie-001");

  useEffect(() => {
    let savedPromptObjects = localStorage.getItem('list');
    
    if (!savedPromptObjects)
      localStorage.setItem("list", "[]"); 
    else {
      const savedPromptList = [];
      savedPromptObjects = JSON.parse(savedPromptObjects);
      savedPromptObjects.forEach((item, index) => {
  
        savedPromptList.push(
          <div className={CSS.prompt} key={index}>
            <b className={CSS.clientInput}>{item.prompt}</b>
            <b className={CSS.response}>{item.responseText}</b>
          </div>
        )
      });
    
      setPromptList(savedPromptList);
    }
  }, []);

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
      url: `https://api.openai.com/v1/engines/${engine}/completions`,
      method: "post",
      headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
      },
      data: JSON.stringify(data)
    });

    const responseText = response.data.choices[0].text;

    // Add the new prompt div to the bigging of the list, followed by the rest
    // using the spread operator.

    const newList = [
      <div className={CSS.prompt} key={promptList.length + 1}>
        <b className={CSS.clientInput}>{prompt}</b>
        <b className={CSS.response}>{responseText}</b>
      </div>,
      ...promptList
    ]
    
    setPromptList(newList);

    // Update local storage:
    let listObjects = JSON.parse(localStorage.getItem('list'));
    if(!listObjects)
      listObjects = [];
    
    listObjects = [{
        prompt,
        responseText
      },
      ...listObjects
    ]
    
    localStorage.setItem('list', JSON.stringify(listObjects));
  };

  const clearPrompts = () => {
    localStorage.removeItem('list')
    setPromptList([]);
  }

  return (
    <main>
      <div className={CSS.shopMain}>
        <div>
          <b className={CSS.header}>Enter any prompt!</b>
        </div>
        <div>
          <textarea 
            className={CSS.textbox}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
        </div>
        <div>
          <div className={CSS.options}>

            {/* Buttons */}
            <button className={CSS.submitButton} onClick={getPrompt}>Submit</button>
            <button className={CSS.submitButton} onClick={clearPrompts}>Clear</button>
            <select className={CSS.submitButton} onChange={(e) => setEngine(e.target.value)}>
              <option value="text-curie-001">Engine</option>
              <option value="text-curie-001">Curie</option>
              <option value="text-davinci-002">Davinci</option>
              <option value="text-babbage-001">Babbage</option>
              <option value="text-ada-001">Ada</option>
            </select>
            
          </div>  
        </div>

        {/* Prompt list is just an array of divs in a flexbox */}
        {promptList}
        
      </div>
    </main>
  );
};

export default App;
