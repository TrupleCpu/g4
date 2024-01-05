import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [file, setFile] = useState<string>(null);
  
  const handleFileChange = (event): void => {
    setFile(event.target.files[0]);
  }

  const handleUpload = async () => {
     if(!file){
      alert("File not found!");
      return;
     }
     try {
      const formdata = new FormData();
      formdata.append('document', file);

      const response = await axios.post('http://localhost:5000/convertDoc', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer'
      });

      const blob = new Blob([response.data], {type: 'application/pdf'});
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'converted-document.pdf';
      link.click();

      window.URL.revokeObjectURL(link.href)
     } catch(err){
      console.error(`Error in converting the doucument: ${err}`);
     }
  }
  return (
    <>
    <input type='file' onChange={handleFileChange} />
    <button onClick={handleUpload}>Convert</button>
    </>
  )
}

export default App
