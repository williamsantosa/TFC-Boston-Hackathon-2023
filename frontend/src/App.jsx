import {
  CssBaseline, Box, Typography, Fab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
      const file = new File(parts, `${fileName}_notes.md`, {
        lastModified: new Date(),
        type: "text/markdown"
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
      <CssBaseline />
      <Box>
        <Typography variant='h1'
          style={{
            flexGrow: 1,
            textAlign: "center",
            marginTop: '5%'
          }}
        >
          NoteScript
        </Typography>
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
            style={{
              flexGrow: 1,
              textAlign: "center",
              marginLeft: "43%",
              marginTop: "5%"
            }}
          > 
            <AddIcon /> UPLOAD TRANSCRIPT
          </Fab>
        </label>
      </Box>
    </>
  );
}

export default App;
