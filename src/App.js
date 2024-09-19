import './MemeGenerator.css';
import React, { useRef, useState } from 'react';

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('ackbar'); // Default meme on load
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef(null); // canvas

  // Function for building memes image based url
  const memeImageUrl = selectedTemplate
    ? `https://api.memegen.link/images/${selectedTemplate}/${encodeURIComponent(
        topText || '_',
      )}/${encodeURIComponent(bottomText || '_')}.png`
    : 'https://api.memegen.link/images/ackbar/_/_.png'; // Default ackbar meme

  // Download meme function
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Added for loading images from external domains
    img.src = memeImageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png'); // This is to convert canvas content to an image URL
      link.click(); // Here I trigger download
    };
  };

  // Start rendering the components
  return (
    <div className="meme-generator">
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="memeTemplate">Meme template</label>
          <input
            id="memeTemplate"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="topText">Top text</label>
          <input
            id="topText"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bottomText">Bottom text</label>
          <input
            id="bottomText"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </div>

        <button onClick={downloadMeme} className="download-button">
          Download
        </button>
      </div>

      <div className="meme-preview">
        <div className="meme">
          <img
            src={memeImageUrl}
            alt="Meme Preview"
            data-test-id="meme-image"
            onError={(e) => {
              e.target.src = 'https://api.memegen.link/images/ackbar/_/_.png'; // Image if url errors occur
            }}
          />
        </div>
      </div>

      {/* HTML5 canvas to render the meme for downloading */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default MemeGenerator;
