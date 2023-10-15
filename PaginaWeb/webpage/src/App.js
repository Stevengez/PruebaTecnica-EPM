import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { saveAs } from 'file-saver';


const APIPORT = process.env.REACT_APP_API_PORT || 3000;
const apiURL = `http://localhost:${APIPORT}`;

function App() {

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState([]);

  const fetchFromAPI = async () => {
    if(fromDate === '' || toDate === ''){
      window.alert('Selecciona un rango de fechas valido');
      return;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if(endDate < startDate){
      window.alert('Fecha final no puede ser anterior a la fecha inicial');
      return;
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await fetch(`${apiURL}/date-range?start=${fromDate}&end=${toDate}`);
      const rows = await result.json();
      setData(rows);
      console.log("Result: ", rows);
    }catch(e){
      console.log("Error: ", e);
    }
  }

  const exportarJSON = () => {
    if(data.length === 0){
      window.alert('No hay resultados para exportar');
    }else{
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const nameAux = fromDate === toDate ? fromDate: `${fromDate} - ${toDate}`;
      saveAs(blob, `Reporte ${nameAux}.json`);
    }
  }

  return (
    <div>
      <h1>Consultar Informacion</h1>
      <div>
        Fecha Inicial:
        <input type='date' value={fromDate} onChange={(e) => {
          setFromDate(e.target.value);
          if(toDate === '') setToDate(e.target.value);
        }}/>
      </div>
      <div>
        Fecha Final:
        <input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>
      <br/>
      <button onClick={fetchFromAPI}>
        Consultar Informacion
      </button>
      <button onClick={exportarJSON}>
        Exportar json
      </button>
      <hr />
      <table>
        <thead>
          <tr>
            <td>Fecha</td>
            <td>Banda</td>
            <td>Costo</td>
            <td>POE</td>
            <td>Generacion</td>
            <td>Indicador</td>
            <td>Liquidacion POE</td>
            <td>Liquidacion CVG</td>
            <td>Agente A</td>
            <td>Agente B</td>
          </tr>
        </thead>
        <tbody>
        {
          data.map((row) => {
            return <tr key={row.fecha_hora}>
              <td>{new Date(row.fecha_hora).toLocaleString('en-ES', { timeZone: 'UTC' })}</td>
              <td>{row.banda}</td>
              <td>{row.costo.toFixed(2)}</td>
              <td>{row.poe.toFixed(2)}</td>
              <td>{row.generacion.toFixed(2)}</td>
              <td>{row.indicador}</td>
              <td>{row.liquidacion_poe.toFixed(2)}</td>
              <td>{row.liquidacion_cvg.toFixed(2)}</td>
              <td>{row.agente_a.toFixed(2)}</td>
              <td>{row.agente_b.toFixed(2)}</td>
            </tr>
          })
        }
        </tbody>
      </table>
    </div>
  );
}

export default App;
