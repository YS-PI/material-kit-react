import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [extension, setExtension] = useState([]);
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState(false);

  const getData = async () => {
    setLoading(true);
    const header = {
      'Content-Type': 'application/json',
    };
    await axios(`${process.env.REACT_APP_URL}/get_data/total/`, {
      method: 'POST',
      headers: header,
      data: JSON.stringify({
        semestre: '',
      }),
    })
      .then(({ data }) => {
        setData(data?.lstextensiones);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setHandleError(true);
      });
  };

  const getExtension = async () => {
    const header = {
      'Content-Type': 'application/json',
    };
    await axios(`${process.env.REACT_APP_URL}/get_data/extensiones/`, {
      method: 'POST',
      headers: header,
      data: JSON.stringify({
        semestre: '',
      }),
    })
      .then(({ data }) => {
        setExtension(data?.lstextensiones);
      })
      .catch((err) => {
        setHandleError(true);
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    getExtension();
  }, []);

  return <ApiContext.Provider value={{ data, extension, loading, handleError }}>{children}</ApiContext.Provider>;
};

export { ApiProvider };
export default ApiContext;
