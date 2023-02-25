import {
  CssBaseline, Box 
} from '@mui/material';
import React from 'react';
import Axios from 'axios';

function App() {

  const onChange = (e) => {
    let files = e.target.files;
    console.warn('data file', files);

    let reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = async (e) => {
      console.warn('img data', e.target.result);
      
      const parts = [
        new Blob(['you construct a file...'], {
          type: 'text/plain'
        }),
        ' Same way as you do with blob',
        new Uint16Array([33])
      ];
      const file = new File(parts, 'sample.txt', {
        lastModified: new Date(2020, 1, 1),
        type: "text/plain"
      });
      const fr = new FileReader();
      fr.onload = (evt) => {
        document.body.innerHTML = `
         <a href="${URL.createObjectURL(file)}" download="${file.name}">download</a>
          <p>file type: ${file.type}</p>
          <p>file last modified: ${new Date(file.lastModified)}</p>
        `
      }
      fr.readAsText(file);
    };
  };

  return (
    <>
      <CssBaseline/>
      <Box>
        <input type="file" name="file" onChange={e => onChange(e)}/>
      </Box>
    </>
  );
}

export default App;
