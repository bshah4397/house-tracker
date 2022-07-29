import { Grommet, Box, Button, Calendar, Notification, PageHeader, Spinner } from 'grommet';
import { Checkmark, Clear } from 'grommet-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';



const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  const [visible, setVisible] = useState();
  const [data, setData] = useState();
  const [refresh, triggerRefresh] = useState();

  const getData = async () => {
    const attendance = {
      method: 'GET',
      url: 'https://36inbxlw08.execute-api.us-east-2.amazonaws.com/getattendance',
      headers: {Accept: 'application/json'}
    };
  
    const res = await axios.request(attendance);
    const recievedData = res.data;
    console.log(recievedData);
    setData(recievedData);
    console.log(recievedData.filter((_) => _.present).map((_)=> _.date));
  }

  useEffect(() => {
    getData();  
  },[])
  
  useEffect(() => {
    getData();  
  },[refresh])

  const onSubmit = (present) => {
    const options = {
      method: 'POST',
      url: 'https://6po6gv4040.execute-api.us-east-2.amazonaws.com/set-attendance',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      data: {
        date: new Date(),
        present: present
      }
    };
    
    axios.request(options).then(function (response) {
        setVisible(true);
        console.log(response.data);
        triggerRefresh(response.data);
    }).catch(function (error) {
        console.error(error);
    });
  }

  const ActionButtons = (props) => (
    <Box
      direction="row"
      margin="medium"
      gap='medium'
    >
      <Button icon={<Checkmark/>} primary onClick={() => onSubmit(true)} />
      <Button icon={<Clear/>} primary color={"status-error"} onClick={() => onSubmit(false)}/>
    </Box>
  );
  return (
      <Grommet theme={theme} themeMode="dark">
        { data ? ( 
          <>
            <Box align="center" background="graph-2" pad="medium">
              <Calendar
                size="medium"
                // date={(new Date()).toISOString()}
                dates={data.filter((_) => _.present).map((_)=> _.date)}
                onSelect={(date) => {}}
              />
              <PageHeader
                title="Temp. Roomie"
                subtitle="Have you seen Paarth around ? 🧐 🙂"
                actions={<ActionButtons/>}
              />
            </Box>
          
            {visible && <Notification
              toast={{position:'bottom'}}
              title="Response submitted"
              message="Thanks for keeping our house safe! 😇"
              onClose={() => setVisible(false)}
              status={"normal"}
            />}

          </>
          ) : ( <Box align='center' pad={'xlarge'}><Spinner size='xlarge'/></Box> ) }
      </Grommet>
  );
}

export default App;
