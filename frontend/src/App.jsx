import {
  CssBaseline, Box, Typography, Fab,
  Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const onChange = (e) => {
    let files = e.target.files;

    let reader = new FileReader();
    let readFile = files[0];
    reader.readAsText(readFile);

    reader.onload = async (e) => {

      // console.log(reader.result)
      // let formData = new FormData();
      // formData.append("prompt", reader.result);
      // formData.append("prompt", "hello world");
      await axios({
        // Endpoint to send files
        url: "http://localhost:5000",
        method: "POST",
        headers: {
          // Add any auth token here
          // authorization: "your token comes here",
        },
          // Attaching the form data
        data: {
          "prompt": e.target.result // reader.result
        },
      })
    
        // Handle the response from backend here
        .then((res) => {
          let ans = (res.data.split("<div class=\"result\">")[1]).split("</div>")[0];
          // console.log(typeof (res.response))
          const parts = [
            new Blob([ans], {
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
         })
        // Catch errors if any
        .catch((err) => { });

      
    };
  };

  return (
    <div className='area'>
      <Box>
        <CssBaseline />
        <Box>
          <Toolbar/>
          <Typography variant='h2'
            style={{
              flexGrow: 1,
              textAlign: "center",
              marginTop: '8%',
              color: 'black',
              zIndex: 1700
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
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </Box>
      </Box>
    </div>
  );
}

export default App;
