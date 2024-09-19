import './MemeGenerator.css'; // Importing CSS file
import React, { useEffect, useState } from 'react';

const MemeGenerator = () => {
  const [memeTemplates, setMemeTemplates] = useState([]); // Holds the meme templates
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  // Fetch meme templates from the API when the component loads
  useEffect(() => {
    fetch('https://api.memegen.link/templates')
      .then((response) => response.json())
      .then((data) => {
        // Filter templates that allow 2 lines of input (top and bottom)
        const filteredTemplates = data.filter((template) =>
          template.blank.includes('/{top}/{bottom}'),
        );
        setMemeTemplates(filteredTemplates);

        // Select a random template initially
        const randomTemplate =
          filteredTemplates[
            Math.floor(Math.random() * filteredTemplates.length)
          ];
        setSelectedTemplate(randomTemplate.id); // Set random template as selected
      })
      .catch((error) => console.error('Error fetching meme templates:', error));
  }, []);

  // Build the meme URL with top and bottom text, fallback to "_" if text is empty
  const memeImageUrl = selectedTemplate
    ? `https://api.memegen.link/images/${selectedTemplate}/${encodeURIComponent(topText || '_')}/${encodeURIComponent(bottomText || '_')}.png`
    : '';

  return (
    <div className="meme-generator">
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="memeTemplate">Meme template</label>
          <input
            type="text"
            id="memeTemplate"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="topText">Top text</label>
          <input
            type="text"
            id="topText"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bottomText">Bottom text</label>
          <input
            type="text"
            id="bottomText"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </div>
      </div>

      <div className="meme-preview">
        {selectedTemplate ? (
          <div className="meme">
            <img
              src={memeImageUrl}
              alt="Meme Preview"
              data-test-id="meme-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400'; // Fallback image if the URL is invalid
              }}
            />
          </div>
        ) : (
          <p />
        )}
      </div>
    </div>
  );
};

export default MemeGenerator;
