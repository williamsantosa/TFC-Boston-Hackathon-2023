import {
  CssBaseline, Box, Typography, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

function App() {

  const onChange = (e) => {
    let files = e.target.files;

    let reader = new FileReader();
    let readFile = files[0];
    reader.readAsText(readFile);

    reader.onload = async (e) => {
      const parts = [
        new Blob([e.target.result], {
          type: 'text/text'
        }),
        new Uint16Array([33])
      ];

      const fileName = readFile.name.substring(0, readFile.name.lastIndexOf("."));
      const file = new File(parts, `${fileName}_notes.txt`, {
        lastModified: new Date(),
        type: "text/text"
      });

      const fr = new FileReader();
      fr.onload = (evt) => {
        const link = URL.createObjectURL(file);
        document.body.innerHTML = `
        <a id="click" href="${link}" download="${file.name}">click here if the file does not download automatically...</a>
        `;
        document.getElementById("click").click(); 
      }
      fr.readAsText(file);
    };
  };

  return (
    <Box>
      <CssBaseline />
      <Box>
        <Typography variant='h2'
          style={{
            flexGrow: 1,
            textAlign: "center",
            marginTop: '18%'
          }}
        >
          NoteScript
        </Typography>
        <Box
          style={{
            flexGrow: 1,
            textAlign: "center",
            marginTop: "5%"
          }}
        >
        <label htmlFor="upload-photo">
          <input
            style={{ 
              display: 'none',
              flexGrow: 1,
              textAlign: "center"
            }}
            id="upload-photo"
            name="file"
            type="file"
            onChange={e => onChange(e)}
          />
          <Fab
            color="secondary"
            size="large"
            component="span"
            aria-label="add"
            variant="extended"
          > 
            <AddIcon /> UPLOAD TRANSCRIPT
          </Fab>
        </label>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
