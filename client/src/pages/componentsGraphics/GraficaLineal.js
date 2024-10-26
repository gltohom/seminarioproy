import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement, // Asegúrate de importar PointElement
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function GraficaLineal (){

    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
                const response = await fetch("http://localhost:3001/api/graficaLineal", {
                    headers: {
                        "Authorization": token // Agregar el token al encabezado
                    }
                });
    
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
    
                const result = await response.json();
                const labels = result.map(item => item.tipo);
                const totals = result.map(item => item.total);
    
                setData({
                    labels: labels,
                    datasets: [{
                        label: 'Total de Resultados por Tipo',
                        data: totals,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    }],
                });
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, []);
    
    

    return (
        <Line data={data} />
    );
};

export default GraficaLineal;
